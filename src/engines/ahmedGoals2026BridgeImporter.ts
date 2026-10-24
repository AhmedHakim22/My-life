import { db, takePreMigrationSnapshot } from '../db';
import {
  AHMED_2026_BRIDGE_CONFIG,
  AHMED_2026_BRIDGE_GOALS_DATA,
  type Ahmed2026GoalDef,
  type Ahmed2026TaskDef
} from '../db/ahmedGoals2026BridgeData';
import { DOMAIN_MAPPING, HORIZON_MAPPING } from './ahmedGoalsImporter';
import type { Goal, Horizon, Task, TaskPriority } from '../types';

export interface Bridge2026ImportReport {
  dryRun: boolean;
  planId: string;
  planTitle: string;
  status: string;
  totalGoalsInPlan: number;
  totalTasksInPlan: number;
  existingGoalsBefore: number;
  existingTasksBefore: number;
  goalsAdded: number;
  goalsPreservedOrMatched: number;
  tasksAdded: number;
  tasksPreservedOrMatched: number;
  goalsCountsByHorizon: {
    annual: number;
    quarterly: number;
    monthly: number;
  };
  linkedVisionsVerified: number;
  linked2027GoalsVerified: number;
  details: Array<{
    refId: string;
    title: string;
    horizon: Horizon;
    parentId: string | null;
    action: 'CREATE' | 'MATCH_EXISTING' | 'SKIP_ALREADY_EXISTS';
  }>;
}

/**
 * Idempotent importer for Ahmed's November & December 2026 Bridge Plan to 2027 Goals.
 * - Imports 32 bridge goals (8 annual, 8 quarterly, 16 monthly) and 64 tasks.
 * - Links to existing 2031 Vision goals (parent_id) and 2027 goals (relatedExisting2027GoalIds).
 * - Leaves 2027 goals completely untouched (zero additions/modifications).
 * - Strictly 0 XP baseline: no automatic achievements, uncompleted tasks (status: TODO).
 * - Full dryRun support for testing and verification without database modification.
 */
export async function importAhmed2026BridgeGoalsPlan(options: { dryRun?: boolean } = {}): Promise<Bridge2026ImportReport> {
  const dryRun = options.dryRun ?? false;
  const now = new Date().toISOString();

  // 1. Fetch current database state
  const existingGoals = await db.goals.toArray();
  const existingTasks = await db.tasks.toArray();

  const goalIdMap = new Map<string, string>(); // refId -> actual db goal ID
  const taskIdSet = new Set<string>(); // set of existing task IDs / refIds

  // 2. Map existing 2031 visions and 2027 goals
  for (const g of existingGoals) {
    if (g.refId) {
      goalIdMap.set(g.refId, g.id);
    }
    goalIdMap.set(g.id, g.id);
  }

  // Handle special "قراءة 75" vision match for V-READ if refId was not set
  if (!goalIdMap.has('V-READ')) {
    const readingGoal = existingGoals.find(g =>
      g.id === 'V-READ' ||
      g.refId === 'V-READ' ||
      g.title.includes('قراءة 75') ||
      (g.title.includes('75') && g.targetDate === '2030-01-01')
    );
    if (readingGoal) {
      goalIdMap.set('V-READ', readingGoal.id);
    }
  }

  // Track existing tasks
  for (const t of existingTasks) {
    taskIdSet.add(t.id);
    if (t.refId) {
      taskIdSet.add(t.refId);
    }
  }

  // Count total tasks in plan
  let totalTasksInPlan = 0;
  for (const g of AHMED_2026_BRIDGE_GOALS_DATA) {
    if (g.tasks && g.tasks.length > 0) {
      totalTasksInPlan += g.tasks.length;
    }
  }

  const report: Bridge2026ImportReport = {
    dryRun,
    planId: AHMED_2026_BRIDGE_CONFIG.planId,
    planTitle: AHMED_2026_BRIDGE_CONFIG.planTitle,
    status: AHMED_2026_BRIDGE_CONFIG.status,
    totalGoalsInPlan: AHMED_2026_BRIDGE_GOALS_DATA.length,
    totalTasksInPlan,
    existingGoalsBefore: existingGoals.length,
    existingTasksBefore: existingTasks.length,
    goalsAdded: 0,
    goalsPreservedOrMatched: 0,
    tasksAdded: 0,
    tasksPreservedOrMatched: 0,
    goalsCountsByHorizon: {
      annual: 0,
      quarterly: 0,
      monthly: 0
    },
    linkedVisionsVerified: 0,
    linked2027GoalsVerified: 0,
    details: []
  };

  // Verify referenced 2031 Visions
  const verifiedVisions = new Set<string>();
  const verified2027Goals = new Set<string>();

  // Process goals in hierarchical sequence: annual -> quarterly -> monthly
  const orderOfHorizons: Array<Ahmed2026GoalDef['horizon']> = [
    'annual',
    'quarterly',
    'monthly'
  ];

  const goalsToPut: Goal[] = [];
  const tasksToPut: Task[] = [];

  for (const horizonType of orderOfHorizons) {
    const items = AHMED_2026_BRIDGE_GOALS_DATA.filter(item => item.horizon === horizonType);

    for (const item of items) {
      report.goalsCountsByHorizon[item.horizon]++;
      const mappedHorizon: Horizon = HORIZON_MAPPING[item.horizon];

      // Track verified 2027 connections
      if (item.relatedExisting2027GoalIds) {
        for (const relId of item.relatedExisting2027GoalIds) {
          if (goalIdMap.has(relId)) {
            verified2027Goals.add(relId);
          }
        }
      }

      // Check if goal already exists in DB
      const existingDbGoal = existingGoals.find(g => g.id === item.id || g.refId === item.id);
      if (existingDbGoal) {
        goalIdMap.set(item.id, existingDbGoal.id);
        report.goalsPreservedOrMatched++;
        report.details.push({
          refId: item.id,
          title: item.title,
          horizon: mappedHorizon,
          parentId: existingDbGoal.parentGoalId || null,
          action: 'SKIP_ALREADY_EXISTS'
        });
      } else {
        // Resolve parent ID
        let resolvedParentId: string | undefined = undefined;
        if (item.parentId) {
          resolvedParentId = goalIdMap.get(item.parentId) || item.parentId;
          if (item.parentId.startsWith('V-')) {
            verifiedVisions.add(item.parentId);
          }
        }

        const domainInfo = DOMAIN_MAPPING[item.lifeArea];
        const newGoal: Goal = {
          id: item.id,
          domainId: domainInfo?.id,
          parentGoalId: resolvedParentId,
          title: item.title,
          whyItMatters: item.why,
          horizon: mappedHorizon,
          startDate: item.startDate,
          targetDate: item.targetDate,
          status: 'IN_PROGRESS',
          progressPercentage: 0,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
          planId: AHMED_2026_BRIDGE_CONFIG.planId,
          refId: item.id,
          previousGoalId: item.previousGoalId || undefined,
          lifeArea: item.lifeArea,
          blessedIntentionSuggestion: item.blessedIntentionSuggestion || undefined,
          successCriteria: item.successCriteria || undefined,
          relatedExisting2027GoalIds: item.relatedExisting2027GoalIds,
          bridge2026: true,
          priority: item.priority || undefined,
          metadata: {
            planTitle: AHMED_2026_BRIDGE_CONFIG.planTitle,
            planStatus: AHMED_2026_BRIDGE_CONFIG.status,
            year: AHMED_2026_BRIDGE_CONFIG.year,
            examPeriod: AHMED_2026_BRIDGE_CONFIG.examPeriod
          }
        };

        goalsToPut.push(newGoal);
        goalIdMap.set(item.id, item.id);
        report.goalsAdded++;

        report.details.push({
          refId: item.id,
          title: item.title,
          horizon: mappedHorizon,
          parentId: resolvedParentId || null,
          action: 'CREATE'
        });
      }

      // Process tasks under this goal (mainly for monthly goals)
      if (item.tasks && item.tasks.length > 0) {
        for (const taskDef of item.tasks) {
          if (taskIdSet.has(taskDef.id)) {
            report.tasksPreservedOrMatched++;
          } else {
            // Priority logic: protected priority or falls into exam window (Nov 7-21) -> P1_URGENT_IMPORTANT
            const isExamWindow = taskDef.dueDate >= AHMED_2026_BRIDGE_CONFIG.examPeriod.start &&
                                 taskDef.dueDate <= AHMED_2026_BRIDGE_CONFIG.examPeriod.end;
            const isProtected = item.priority === 'protected' || isExamWindow;
            const priority: TaskPriority = isProtected ? 'P1_URGENT_IMPORTANT' : 'P2_IMPORTANT';

            const newTask: Task = {
              id: taskDef.id,
              title: taskDef.title,
              priority,
              status: 'TODO',
              dueDate: taskDef.dueDate,
              estimatedMinutes: taskDef.estimatedMinutes || 30,
              isLocked: isProtected,
              postponementCount: 0,
              goalId: item.id,
              planId: AHMED_2026_BRIDGE_CONFIG.planId,
              refId: taskDef.id,
              createdAt: now,
              updatedAt: now
            };

            tasksToPut.push(newTask);
            taskIdSet.add(taskDef.id);
            report.tasksAdded++;
          }
        }
      }
    }
  }

  report.linkedVisionsVerified = verifiedVisions.size;
  report.linked2027GoalsVerified = verified2027Goals.size;

  // 3. Persist atomically if not dryRun
  if (!dryRun) {
    await takePreMigrationSnapshot();

    await db.transaction('rw', [
      db.goals,
      db.tasks,
      db.appMeta
    ], async () => {
      if (goalsToPut.length > 0) {
        await db.goals.bulkPut(goalsToPut);
      }
      if (tasksToPut.length > 0) {
        await db.tasks.bulkPut(tasksToPut);
      }

      // Record migration marker in appMeta
      await db.appMeta.put({
        id: 'ahmed-goals-2026-bridge-approved-v1',
        appliedAt: now,
        planId: AHMED_2026_BRIDGE_CONFIG.planId,
        status: AHMED_2026_BRIDGE_CONFIG.status,
        goalsCount: goalsToPut.length,
        tasksCount: tasksToPut.length
      });
    });
  }

  return report;
}

/**
 * Automatically seeds Ahmed's 2026 Bridge Goals (Nov/Dec 2026) once per device/profile.
 * Respects previous runs, existing goals, and preserves all user progress.
 */
export async function seedAhmed2026BridgeGoalsIfNeeded(): Promise<void> {
  const marker = await db.appMeta.get('ahmed-goals-2026-bridge-approved-v1');
  if (marker) return;

  await importAhmed2026BridgeGoalsPlan({ dryRun: false });
}
