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

// Table mapping configuration (Canonical Dexie to Supabase tables)
export const TABLE_MAPPINGS = [
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
        return { connected: true, tablesFound: false, error: 'Database connected, but schema needs to be executed' };
      }
      return { connected: false, tablesFound: false, error: error.message };
    }
    return { connected: true, tablesFound: true };
  } catch (err: any) {
    return { connected: false, tablesFound: false, error: err.message || 'Network error' };
  }
}

/**
 * Auto-healing upsert that dynamically retries if remote schema is missing a column
 * (e.g. newly added columns like focus or hall in university_subjects),
 * and detects if the table itself is not yet created in PostgreSQL.
 */
async function upsertWithAutoHealing(
  table: string,
  records: Record<string, any>[],
  pk?: string
): Promise<{ success: boolean; isMissingTable?: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  let payloads = [...records];
  const conflictTarget = pk && !pk.includes(',') ? pk : undefined;

  for (let attempt = 0; attempt < 8; attempt++) {
    const { error } = await supabase
      .from(table)
      .upsert(payloads, conflictTarget ? { onConflict: conflictTarget } : undefined);

    if (!error) return { success: true };

    // 1. Table missing on remote
    if (
      error.code === '42P01' || 
      error.code === 'PGRST205' || 
      error.message.includes('schema cache') || 
      error.message.includes('Could not find the table')
    ) {
      return { success: false, isMissingTable: true, error: error.message };
    }

    // 2. Column missing on remote table (PGRST204) - auto-peel and retry!
    if (error.code === 'PGRST204' || error.message.includes('Could not find the')) {
      const match = error.message.match(/Could not find the '([^']+)' column/);
      if (match && match[1]) {
        const missingCol = match[1];
        payloads = payloads.map(p => {
          const clone = { ...p };
          delete clone[missingCol];
          return clone;
        });
        continue;
      }
    }

    return { success: false, error: error.message };
  }

  return { success: false, error: 'Max retry attempts reached' };
}

export interface SyncPushResult {
  success: boolean;
  syncedCount: number;
  failedTables: { table: string; error: string }[];
  missingTables: string[];
  error?: string;
}

export interface SyncPullResult {
  success: boolean;
  count: number;
  failedTables: { table: string; error: string }[];
  error?: string;
}

export const SHADOW_SYNC_COLLECTIONS = [
  'worshipLogs',
  'quranLogs',
  'qiyamSessions',
  'timetableSlots',
  'academicQuizzes',
  'academicAssignments',
  'studentActivities',
  'challenges',
  'challengeLogs',
  'movementLogs',
  'workoutLogs',
  'availabilityRules',
  'scheduleBlocks',
  'schedulePlans',
  'intentions',
  'goalIntentions',
  'domains',
  'categories',
  'goalMilestones',
  'goalLinks',
  'courseModules',
  'courseLessons'
] as const;

export const SHADOW_STATE_ROW_ID = 'sys-shadow-state-sync';

/**
 * Unpacks the compressed shadow state payload into local Dexie tables.
 * Guarantees instant two-way synchronization for unmigrated tables.
 */
export async function unpackShadowState(rawPayload: string | Record<string, any>): Promise<boolean> {
  try {
    const parsed = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
    if (!parsed || !parsed.data) return false;

    for (const col of SHADOW_SYNC_COLLECTIONS) {
      const records = parsed.data[col];
      if (Array.isArray(records) && (db as any)[col]) {
        const table = (db as any)[col];
        await table.clear();
        if (records.length > 0) {
          await table.bulkPut(records);
        }
      }
    }
    return true;
  } catch (e) {
    console.warn('Failed to unpack shadow state:', e);
    return false;
  }
}

/**
 * Push all local Dexie records to Supabase with auto-healing, shadow state resilience,
 * and zero-configuration cross-device parity.
 */
export async function pushAllToSupabase(): Promise<SyncPushResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, syncedCount: 0, failedTables: [], missingTables: [], error: 'سوبا بيز مش متصل' };
  }

  let totalSynced = 0;
  const failedTables: { table: string; error: string }[] = [];
  const missingTables: string[] = [];

  try {
    // 1. Push standard mapped tables to remote PostgreSQL
    for (const mapping of TABLE_MAPPINGS) {
      if (!(db as any)[mapping.dexie]) continue;
      let localRecords = await (db as any)[mapping.dexie].toArray();
      if (!localRecords || localRecords.length === 0) continue;

      if (mapping.dexie === 'journalEntries') {
        localRecords = localRecords.filter((r: any) => !r.id.startsWith('sys-'));
        if (localRecords.length === 0) continue;
      }

      const remotePayloads = localRecords.map(toSnakeCase);
      const res = await upsertWithAutoHealing(mapping.remote, remotePayloads, mapping.pk);

      if (res.isMissingTable) {
        missingTables.push(mapping.remote);
      } else if (!res.success) {
        console.warn(`Sync failed on table ${mapping.remote}:`, res.error);
        failedTables.push({ table: mapping.remote, error: res.error || 'Unknown error' });
      } else {
        totalSynced += localRecords.length;
      }
    }

    // 2. Push Shadow State for unmigrated entities (Prayers, Quran, Timetable, Challenges, etc.)
    try {
      const shadowData: Record<string, any[]> = {};
      let unmigratedCount = 0;
      for (const col of SHADOW_SYNC_COLLECTIONS) {
        if ((db as any)[col]) {
          const records = await (db as any)[col].toArray();
          shadowData[col] = records;
          unmigratedCount += records.length;
        }
      }

      const shadowTimestamp = new Date().toISOString();
      const shadowPayload = {
        version: 1,
        updatedAt: shadowTimestamp,
        data: shadowData
      };

      const { error: shadowErr } = await supabase
        .from('journal_entries')
        .upsert({
          id: SHADOW_STATE_ROW_ID,
          date: '2099-12-31',
          mode: 'SHADOW_STATE_SYNC',
          content: JSON.stringify(shadowPayload),
          tags: ['system', 'sync']
        }, { onConflict: 'id' });

      if (!shadowErr) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('masaar_last_shadow_push', shadowTimestamp);
        }
        totalSynced += unmigratedCount;
      } else {
        console.warn('Shadow sync push warning:', shadowErr.message);
      }
    } catch (shadowErr) {
      console.warn('Shadow sync exception:', shadowErr);
    }

    // If failedTables (network or auth errors) is 0, existing tables succeeded!
    const isSuccess = failedTables.length === 0;

    return {
      success: isSuccess,
      syncedCount: totalSynced,
      failedTables,
      missingTables,
      error: !isSuccess ? `فشلت مزامنة ${failedTables.length} جدول: ${failedTables.map(f => f.table).join(', ')}` : undefined
    };
  } catch (err: any) {
    console.error('Push sync exception:', err);
    return {
      success: false,
      syncedCount: totalSynced,
      failedTables,
      missingTables,
      error: err.message || 'خطأ غير متوقع أثناء الرفع'
    };
  }
}

/**
 * Pull all records from Supabase into Dexie (reconciliation across devices).
 */
export async function pullAllFromSupabase(): Promise<SyncPullResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, failedTables: [], error: 'سوبا بيز مش متصل' };
  }

  let totalPulled = 0;
  const failedTables: { table: string; error: string }[] = [];

  try {
    for (const mapping of TABLE_MAPPINGS) {
      if (!(db as any)[mapping.dexie]) continue;

      const { data, error } = await supabase.from(mapping.remote).select('*');
      if (error) {
        // Skip missing unmigrated tables gracefully without failing the entire pull
        if (
          error.code === '42P01' || 
          error.code === 'PGRST205' || 
          error.message.includes('schema cache') || 
          error.message.includes('Could not find the table')
        ) {
          continue;
        }
        console.warn(`Error pulling ${mapping.remote}:`, error.message);
        failedTables.push({ table: mapping.remote, error: error.message });
        continue;
      }

      if (data && data.length > 0) {
        if (mapping.dexie === 'journalEntries') {
          // Check for shadow state row
          const shadowRow = data.find((row: any) => row.id === SHADOW_STATE_ROW_ID);
          if (shadowRow && shadowRow.content) {
            await unpackShadowState(shadowRow.content);
            totalPulled += 1;
          }
          // Filter out system shadow row before putting into Dexie journalEntries
          const normalEntries = data
            .filter((row: any) => !row.id.startsWith('sys-'))
            .map(toCamelCase);
          if (normalEntries.length > 0) {
            await db.journalEntries.bulkPut(normalEntries as any);
            totalPulled += normalEntries.length;
          }
        } else {
          const localRecords = data.map(toCamelCase);
          await (db as any)[mapping.dexie].bulkPut(localRecords);
          totalPulled += data.length;
        }
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
    console.error('Pull sync exception:', err);
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

/* ============================================================
   Realtime Cross-Device Synchronization Engine
   ============================================================ */

let realtimeChannel: any = null;
let onRemoteChangeCallback: (() => void) | null = null;
let autoPushTimer: any = null;

/**
 * Registers callback invoked whenever another device pushes changes.
 */
export function registerRemoteChangeHandler(callback: () => void): void {
  onRemoteChangeCallback = callback;
}

/**
 * Connects to Supabase Realtime WebSocket to listen for instant changes
 * made on other devices (Phone <-> Laptop).
 */
export function subscribeToRealtimeSync(): void {
  if (!isSupabaseConfigured || !supabase || realtimeChannel) return;

  try {
    realtimeChannel = supabase
      .channel('masaar-cross-device-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
        console.log('⚡ Realtime update from another device:', payload.table, payload.eventType);

        // 1. Intercept Shadow State Updates (Prayers, Quran, Timetable, Challenges, etc.)
        if (payload.table === 'journal_entries') {
          const newRecord = payload.new as any;
          if (newRecord?.id === SHADOW_STATE_ROW_ID && newRecord?.content) {
            const success = await unpackShadowState(newRecord.content);
            if (success && onRemoteChangeCallback) {
              onRemoteChangeCallback();
            }
            return;
          }
        }

        // 2. Intercept Standard Mapped Tables
        const mapping = TABLE_MAPPINGS.find(m => m.remote === payload.table);
        if (mapping && (db as any)[mapping.dexie]) {
          const dexieTable = (db as any)[mapping.dexie];
          try {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const localRecord = toCamelCase(payload.new as Record<string, any>);
              if (localRecord.id && !localRecord.id.startsWith('sys-')) {
                await dexieTable.put(localRecord);
              }
            } else if (payload.eventType === 'DELETE') {
              const oldRecord = payload.old as Record<string, any>;
              const pkField = mapping.pk.includes(',') ? 'id' : mapping.pk;
              const pkVal = oldRecord[pkField] || oldRecord.id;
              if (pkVal) {
                await dexieTable.delete(pkVal);
              }
            }
          } catch (dexErr) {
            console.debug('Realtime dexie put warning:', dexErr);
          }
        }

        // Notify app to re-read and render fresh data immediately
        if (onRemoteChangeCallback) {
          onRemoteChangeCallback();
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime cross-device sync active');
        }
      });
  } catch (err) {
    console.warn('Realtime subscription error:', err);
  }
}

/**
 * Schedule a debounced background push whenever local data is edited.
 * Keeps Laptop and Phone synchronized automatically without manual clicking!
 */
export function scheduleAutoPush(delayMs = 1500): void {
  if (!isSupabaseConfigured || !supabase || (typeof navigator !== 'undefined' && !navigator.onLine)) return;

  if (autoPushTimer) clearTimeout(autoPushTimer);

  autoPushTimer = setTimeout(async () => {
    try {
      await pushAllToSupabase();
      await processSyncQueue();
    } catch (err) {
      console.debug('Background auto-push quiet error:', err);
    }
  }, delayMs);
}
