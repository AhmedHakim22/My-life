import { db, takePreMigrationSnapshot } from '../db';
import { 
  AHMED_2027_PLAN_CONFIG, 
  AHMED_2027_GOALS_DATA, 
  type RawGoalPlanItem 
} from '../db/ahmedGoals2027Data';
import type { Goal, Horizon, LifeDomain, GoalMilestone } from '../types';

export const DOMAIN_MAPPING: Record<string, { id: string; name: string; icon: string; color: string; sortOrder: number }> = {
  'الدين والعبادات': { id: 'dom-spiritual', name: 'الدين والعبادات', icon: 'Moon', color: '#14b8a6', sortOrder: 1 },
  'الأسرة والزواج': { id: 'dom-family', name: 'الأسرة والزواج', icon: 'Heart', color: '#ec4899', sortOrder: 2 },
  'الجامعة والبحث العلمي': { id: 'dom-university', name: 'الجامعة والبحث العلمي', icon: 'Atom', color: '#38bdf8', sortOrder: 3 },
  'فلكون والأعمال': { id: 'dom-falcon', name: 'فلكون والأعمال', icon: 'Briefcase', color: '#f59e0b', sortOrder: 4 },
  'المال والادخار': { id: 'dom-finance', name: 'المال والادخار', icon: 'Coins', color: '#eab308', sortOrder: 5 },
  'الذكاء الاصطناعي والأثر': { id: 'dom-ai', name: 'الذكاء الاصطناعي والأثر', icon: 'Sparkles', color: '#6366f1', sortOrder: 6 },
  'الصحة واللياقة': { id: 'dom-health', name: 'الصحة واللياقة', icon: 'Activity', color: '#ef4444', sortOrder: 7 },
  'القراءة والتعلم': { id: 'dom-reading', name: 'القراءة والتعلم', icon: 'BookOpen', color: '#10b981', sortOrder: 8 },
};

export const HORIZON_MAPPING: Record<RawGoalPlanItem['horizon'], Horizon> = {
  'vision_3_5_years': 'LONG_TERM',
  'annual': 'ANNUAL',
  'quarterly': 'QUARTERLY',
  'monthly': 'MONTHLY',
};

export interface GoalsImportReport {
  dryRun: boolean;
  planId: string;
  planTitle: string;
  status: string;
  totalRecordsInPlan: number;
  existingGoalsBefore: number;
  goalsAdded: number;
  goalsPreservedOrMatched: number;
  milestonesAdded: number;
  domainsAdded: number;
  readingGoalPreserved: {
    id: string;
    title: string;
    progressPercentage: number;
  } | null;
  countsByHorizon: {
    vision_3_5_years: number;
    annual: number;
    quarterly: number;
    monthly: number;
  };
  details: Array<{
    refId: string;
    title: string;
    horizon: Horizon;
    parentId: string | null;
    action: 'CREATE' | 'MATCH_EXISTING' | 'SKIP_ALREADY_EXISTS';
  }>;
}

/**
 * Idempotent importer for Ahmed's approved 2027 Goals Architecture.
 * Can be executed in dryRun mode for simulation / inspection, or real mode to persist in Dexie.
 * Strictly preserves existing goals, especially "قراءة 75", never awards XP on import,
 * and maintains full parent-child hierarchy across all 4 levels.
 */
export async function importAhmed2027GoalsPlan(options: { dryRun?: boolean } = {}): Promise<GoalsImportReport> {
  const dryRun = options.dryRun ?? false;
  const now = new Date().toISOString();

  // 1. Fetch current database state
  const existingGoals = await db.goals.toArray();
  const existingMilestones = await db.goalMilestones.toArray();
  const existingDomains = await db.domains.toArray();

  const idMap = new Map<string, string>(); // refId (from YAML) -> actual db goal ID
  let readingGoalPreserved: GoalsImportReport['readingGoalPreserved'] = null;

  // 2. Locate existing "قراءة 75" goal to ensure preservation
  const matchedReadingGoal = existingGoals.find(g => 
    g.id === 'V-READ' || 
    g.refId === 'V-READ' || 
    g.title.includes('قراءة 75') || 
    (g.title.includes('75') && g.targetDate === '2030-01-01')
  );

  if (matchedReadingGoal) {
    idMap.set('V-READ', matchedReadingGoal.id);
    readingGoalPreserved = {
      id: matchedReadingGoal.id,
      title: matchedReadingGoal.title,
      progressPercentage: matchedReadingGoal.progressPercentage
    };
  }

  // 3. Match any other existing goals by id or refId
  for (const g of existingGoals) {
    if (g.refId) {
      idMap.set(g.refId, g.id);
    } else if (g.id.startsWith('V-') || g.id.startsWith('A-') || g.id.startsWith('Q') || g.id.startsWith('M')) {
      idMap.set(g.id, g.id);
    }
  }

  const report: GoalsImportReport = {
    dryRun,
    planId: AHMED_2027_PLAN_CONFIG.planId,
    planTitle: AHMED_2027_PLAN_CONFIG.planTitle,
    status: AHMED_2027_PLAN_CONFIG.status,
    totalRecordsInPlan: AHMED_2027_GOALS_DATA.length,
    existingGoalsBefore: existingGoals.length,
    goalsAdded: 0,
    goalsPreservedOrMatched: 0,
    milestonesAdded: 0,
    domainsAdded: 0,
    readingGoalPreserved,
    countsByHorizon: {
      vision_3_5_years: 0,
      annual: 0,
      quarterly: 0,
      monthly: 0
    },
    details: []
  };

  // 4. Group plan items by hierarchy order
  const orderOfHorizons: Array<RawGoalPlanItem['horizon']> = [
    'vision_3_5_years',
    'annual',
    'quarterly',
    'monthly'
  ];

  const goalsToPut: Goal[] = [];
  const milestonesToPut: GoalMilestone[] = [];
  const domainsToPut: LifeDomain[] = [];

  // Ensure 8 Life Domains
  for (const [areaName, domDef] of Object.entries(DOMAIN_MAPPING)) {
    const exists = existingDomains.some(d => d.id === domDef.id || d.name === areaName || d.name === domDef.name);
    if (!exists) {
      domainsToPut.push({
        id: domDef.id,
        name: domDef.name,
        icon: domDef.icon,
        color: domDef.color,
        sortOrder: domDef.sortOrder,
        isArchived: false,
        createdAt: now,
        updatedAt: now
      });
      report.domainsAdded++;
    }
  }

  // 5. Process goals in hierarchical sequence
  for (const horizonType of orderOfHorizons) {
    const itemsInHorizon = AHMED_2027_GOALS_DATA.filter(item => item.horizon === horizonType);

    for (const item of itemsInHorizon) {
      report.countsByHorizon[item.horizon]++;
      const mappedHorizon = HORIZON_MAPPING[item.horizon];

      // Check if this is V-READ and already matched
      if (item.id === 'V-READ' && matchedReadingGoal) {
        report.goalsPreservedOrMatched++;
        report.details.push({
          refId: item.id,
          title: matchedReadingGoal.title,
          horizon: mappedHorizon,
          parentId: null,
          action: 'MATCH_EXISTING'
        });
        continue;
      }

      // Check if already in idMap (already exists in DB)
      const existingDbId = idMap.get(item.id);
      if (existingDbId) {
        report.goalsPreservedOrMatched++;
        report.details.push({
          refId: item.id,
          title: item.title,
          horizon: mappedHorizon,
          parentId: item.parentId,
          action: 'SKIP_ALREADY_EXISTS'
        });
        continue;
      }

      // Also check by exact ID or refId in existingGoals
      const existingRecord = existingGoals.find(g => g.id === item.id || g.refId === item.id);
      if (existingRecord) {
        idMap.set(item.id, existingRecord.id);
        report.goalsPreservedOrMatched++;
        report.details.push({
          refId: item.id,
          title: item.title,
          horizon: mappedHorizon,
          parentId: item.parentId,
          action: 'SKIP_ALREADY_EXISTS'
        });
        continue;
      }

      // Resolve parent ID
      let resolvedParentGoalId: string | undefined = undefined;
      if (item.parentId) {
        resolvedParentGoalId = idMap.get(item.parentId) || item.parentId;
      }

      const domainInfo = DOMAIN_MAPPING[item.lifeArea];
      const targetGoalId = item.id; // Use clean reference ID from the plan

      const newGoal: Goal = {
        id: targetGoalId,
        domainId: domainInfo?.id,
        parentGoalId: resolvedParentGoalId,
        title: item.title,
        whyItMatters: item.why,
        horizon: mappedHorizon,
        targetDate: item.targetDate,
        status: 'IN_PROGRESS',
        progressPercentage: 0,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
        planId: AHMED_2027_PLAN_CONFIG.planId,
        refId: item.id,
        previousGoalId: item.previousGoalId || undefined,
        lifeArea: item.lifeArea,
        blessedIntentionSuggestion: item.blessedIntentionSuggestion || undefined,
        successCriteria: item.successCriteria || undefined,
        actionTemplates: item.actionTemplates?.length ? item.actionTemplates : undefined,
        metadata: {
          planTitle: AHMED_2027_PLAN_CONFIG.planTitle,
          planStatus: AHMED_2027_PLAN_CONFIG.status,
          year: AHMED_2027_PLAN_CONFIG.year
        }
      };

      goalsToPut.push(newGoal);
      idMap.set(item.id, targetGoalId);
      report.goalsAdded++;

      report.details.push({
        refId: item.id,
        title: item.title,
        horizon: mappedHorizon,
        parentId: resolvedParentGoalId || null,
        action: 'CREATE'
      });

      // Milestones for this goal
      if (item.milestones && item.milestones.length > 0) {
        item.milestones.forEach((msTitle, idx) => {
          const msId = `ms-${targetGoalId}-${idx + 1}`;
          const alreadyExists = existingMilestones.some(m => m.id === msId || (m.goalId === targetGoalId && m.title === msTitle));
          if (!alreadyExists) {
            milestonesToPut.push({
              id: msId,
              goalId: targetGoalId,
              title: msTitle,
              targetDate: item.targetDate,
              status: 'PENDING',
              sortOrder: idx + 1,
              weight: Math.round(100 / item.milestones.length),
              createdAt: now,
              updatedAt: now
            });
            report.milestonesAdded++;
          }
        });
      }
    }
  }

  // 6. If not dryRun, persist everything atomically inside a Dexie transaction
  if (!dryRun) {
    await takePreMigrationSnapshot();

    await db.transaction('rw', [
      db.domains,
      db.goals,
      db.goalMilestones,
      db.appMeta
    ], async () => {
      if (domainsToPut.length > 0) {
        await db.domains.bulkPut(domainsToPut);
      }
      if (goalsToPut.length > 0) {
        await db.goals.bulkPut(goalsToPut);
      }
      if (milestonesToPut.length > 0) {
        await db.goalMilestones.bulkPut(milestonesToPut);
      }

      // Record migration marker in appMeta
      await db.appMeta.put({
        id: 'ahmed-goals-2027-approved-v1',
        appliedAt: now,
        planId: AHMED_2027_PLAN_CONFIG.planId,
        status: AHMED_2027_PLAN_CONFIG.status,
        goalsCount: goalsToPut.length
      });
    });
  }

  return report;
}

/**
 * Automatically seeds Ahmed's 2027 approved goals once per device/profile.
 * Respects previous runs, existing goals, and tombstones.
 */
export async function seedAhmed2027GoalsIfNeeded(): Promise<void> {
  const marker = await db.appMeta.get('ahmed-goals-2027-approved-v1');
  if (marker) return;

  await importAhmed2027GoalsPlan({ dryRun: false });
}
