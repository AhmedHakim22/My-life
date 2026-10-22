import { supabase, isSupabaseConfigured } from './supabase';
import { db } from '../db';

/**
 * Transforms an object's keys from camelCase to snake_case for PostgreSQL.
 */
export function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

/**
 * Transforms an object's keys from snake_case to camelCase for TypeScript/Dexie.
 */
export function toCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export interface SyncStatus {
  isConfigured: boolean;
  isConnected: boolean;
  lastSyncedAt: string | null;
  pendingQueueCount: number;
  syncInProgress: boolean;
  errorMessage: string | null;
}

// Table mapping configuration (Canonical 26 Tables)
const TABLE_MAPPINGS = [
  { dexie: 'domains', remote: 'domains', pk: 'id' },
  { dexie: 'goals', remote: 'goals', pk: 'id' },
  { dexie: 'goalMilestones', remote: 'goal_milestones', pk: 'id' },
  { dexie: 'goalLinks', remote: 'goal_links', pk: 'id' },
  { dexie: 'categories', remote: 'categories', pk: 'id' },
  { dexie: 'skills', remote: 'skills', pk: 'id' },
  { dexie: 'learningResources', remote: 'learning_resources', pk: 'id' },
  { dexie: 'bookDetails', remote: 'book_details', pk: 'resource_id' },
  { dexie: 'readingSessions', remote: 'reading_sessions', pk: 'id' },
  { dexie: 'courseDetails', remote: 'course_details', pk: 'resource_id' },
  { dexie: 'courseModules', remote: 'course_modules', pk: 'id' },
  { dexie: 'courseLessons', remote: 'course_lessons', pk: 'id' },
  { dexie: 'skillResources', remote: 'skill_resources', pk: 'skill_id,resource_id' },
  { dexie: 'skillEvidence', remote: 'skill_evidence', pk: 'id' },
  { dexie: 'universitySubjects', remote: 'university_subjects', pk: 'id' },
  { dexie: 'studySessions', remote: 'study_sessions', pk: 'id' },
  { dexie: 'timetableSlots', remote: 'timetable_slots', pk: 'id' },
  { dexie: 'academicQuizzes', remote: 'academic_quizzes', pk: 'id' },
  { dexie: 'academicAssignments', remote: 'academic_assignments', pk: 'id' },
  { dexie: 'studentActivities', remote: 'student_activities', pk: 'id' },
  { dexie: 'tasks', remote: 'tasks', pk: 'id' },
  { dexie: 'taskPostponements', remote: 'task_postponements', pk: 'id' },
  { dexie: 'habits', remote: 'habits', pk: 'id' },
  { dexie: 'habitLogs', remote: 'habit_logs', pk: 'id' },
  { dexie: 'xpTransactions', remote: 'xp_transactions', pk: 'id' },
  { dexie: 'journalEntries', remote: 'journal_entries', pk: 'id' },
  { dexie: 'intentions', remote: 'intentions', pk: 'id' },
  { dexie: 'goalIntentions', remote: 'goal_intentions', pk: 'id' },
  { dexie: 'worshipLogs', remote: 'worship_logs', pk: 'id' },
  { dexie: 'quranLogs', remote: 'quran_logs', pk: 'id' },
  { dexie: 'qiyamSessions', remote: 'qiyam_sessions', pk: 'id' },
  { dexie: 'movementLogs', remote: 'movement_logs', pk: 'id' },
  { dexie: 'workoutLogs', remote: 'workout_logs', pk: 'id' },
  { dexie: 'availabilityRules', remote: 'availability_rules', pk: 'id' },
  { dexie: 'scheduleBlocks', remote: 'schedule_blocks', pk: 'id' },
  { dexie: 'schedulePlans', remote: 'schedule_plans', pk: 'id' },
  { dexie: 'challenges', remote: 'challenges', pk: 'id' },
  { dexie: 'challengeLogs', remote: 'challenge_logs', pk: 'id' }
] as const;

/**
 * Check if remote Supabase database has the schema created and is responding.
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; tablesFound: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { connected: false, tablesFound: false, error: 'Supabase credentials missing' };
  }

  try {
    const { error } = await supabase.from('tasks').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('schema cache') || error.message.includes('not find')) {
        return { connected: true, tablesFound: false, error: 'Database connected, but schema.sql needs to be executed' };
      }
      return { connected: false, tablesFound: false, error: error.message };
    }
    return { connected: true, tablesFound: true };
  } catch (err: any) {
    return { connected: false, tablesFound: false, error: err.message || 'Network error' };
  }
}

export interface SyncPushResult {
  success: boolean;
  syncedCount: number;
  failedTables: { table: string; error: string }[];
  error?: string;
}

export interface SyncPullResult {
  success: boolean;
  count: number;
  failedTables: { table: string; error: string }[];
  error?: string;
}

/**
 * Push all local Dexie records to Supabase.
 * Truthful reporting: Returns success: false if ANY table fails!
 */
export async function pushAllToSupabase(): Promise<SyncPushResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, syncedCount: 0, failedTables: [], error: 'سوبا بيز مش متصل' };
  }

  let totalSynced = 0;
  const failedTables: { table: string; error: string }[] = [];

  try {
    for (const mapping of TABLE_MAPPINGS) {
      // @ts-ignore
      if (!db[mapping.dexie]) continue;
      // @ts-ignore
      const localRecords = await db[mapping.dexie].toArray();
      if (!localRecords || localRecords.length === 0) continue;

      const remotePayloads = localRecords.map(toSnakeCase);

      const conflictTarget = mapping.pk.includes(',') ? undefined : mapping.pk;
      const { error } = await supabase
        .from(mapping.remote)
        .upsert(remotePayloads, conflictTarget ? { onConflict: conflictTarget } : undefined);

      if (error) {
        console.warn(`Sync failed on table ${mapping.remote}:`, error.message);
        failedTables.push({ table: mapping.remote, error: error.message });
      } else {
        totalSynced += localRecords.length;
      }
    }

    const allSuccessful = failedTables.length === 0;
    return {
      success: allSuccessful,
      syncedCount: totalSynced,
      failedTables,
      error: allSuccessful ? undefined : `فشلت مزامنة ${failedTables.length} جدول في السحابة (${failedTables.map(f => f.table).join(', ')})`
    };
  } catch (err: any) {
    console.error('Push sync failed:', err);
    return {
      success: false,
      syncedCount: totalSynced,
      failedTables,
      error: err.message || 'خطأ غير متوقع أثناء الرفع'
    };
  }
}

/**
 * Pull all records from Supabase into Dexie (reconciliation).
 * Truthful reporting: Returns success: false if tables fail.
 */
export async function pullAllFromSupabase(): Promise<SyncPullResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, failedTables: [], error: 'سوبا بيز مش متصل' };
  }

  let totalPulled = 0;
  const failedTables: { table: string; error: string }[] = [];

  try {
    for (const mapping of TABLE_MAPPINGS) {
      // @ts-ignore
      if (!db[mapping.dexie]) continue;

      const { data, error } = await supabase.from(mapping.remote).select('*');
      if (error) {
        console.warn(`Error pulling ${mapping.remote}:`, error.message);
        failedTables.push({ table: mapping.remote, error: error.message });
        continue;
      }

      if (data && data.length > 0) {
        const localRecords = data.map(toCamelCase);
        // @ts-ignore
        await db[mapping.dexie].bulkPut(localRecords);
        totalPulled += data.length;
      }
    }

    const allSuccessful = failedTables.length === 0;
    return {
      success: allSuccessful,
      count: totalPulled,
      failedTables,
      error: allSuccessful ? undefined : `فشل سحب بيانات ${failedTables.length} جدول من السحابة`
    };
  } catch (err: any) {
    console.error('Pull sync failed:', err);
    return {
      success: false,
      count: totalPulled,
      failedTables,
      error: err.message || 'خطأ غير متوقع أثناء السحب'
    };
  }
}

/**
 * Process offline sync queue.
 */
export async function processSyncQueue(): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !navigator.onLine) return;

  const queue = await db.syncQueue.toArray();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      const remoteTable = item.tableName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      if (item.operation === 'INSERT' || item.operation === 'UPDATE') {
        const payload = toSnakeCase(item.payload);
        const { error } = await supabase.from(remoteTable).upsert(payload);
        if (!error && item.id) {
          await db.syncQueue.delete(item.id);
        }
      } else if (item.operation === 'DELETE') {
        const { error } = await supabase.from(remoteTable).delete().eq('id', item.recordId);
        if (!error && item.id) {
          await db.syncQueue.delete(item.id);
        }
      }
    } catch (e) {
      console.warn('Sync queue item retry deferred:', e);
    }
  }
}
