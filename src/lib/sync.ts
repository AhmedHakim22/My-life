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

// Table mapping configuration
const TABLE_MAPPINGS = [
  { dexie: 'domains', remote: 'domains', pk: 'id' },
  { dexie: 'goals', remote: 'goals', pk: 'id' },
  { dexie: 'skills', remote: 'skills', pk: 'id' },
  { dexie: 'learningResources', remote: 'learning_resources', pk: 'id' },
  { dexie: 'bookDetails', remote: 'book_details', pk: 'resource_id' },
  { dexie: 'readingSessions', remote: 'reading_sessions', pk: 'id' },
  { dexie: 'courseDetails', remote: 'course_details', pk: 'resource_id' },
  { dexie: 'universitySubjects', remote: 'university_subjects', pk: 'id' },
  { dexie: 'studySessions', remote: 'study_sessions', pk: 'id' },
  { dexie: 'tasks', remote: 'tasks', pk: 'id' },
  { dexie: 'taskPostponements', remote: 'task_postponements', pk: 'id' },
  { dexie: 'habits', remote: 'habits', pk: 'id' },
  { dexie: 'habitLogs', remote: 'habit_logs', pk: 'id' },
  { dexie: 'xpTransactions', remote: 'xp_transactions', pk: 'id' },
  { dexie: 'journalEntries', remote: 'journal_entries', pk: 'id' }
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

/**
 * Push all local Dexie records to Supabase.
 */
export async function pushAllToSupabase(): Promise<{ success: boolean; syncedCount: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, syncedCount: 0, error: 'سوبا بيز مش متصل' };
  }

  let totalSynced = 0;

  try {
    for (const mapping of TABLE_MAPPINGS) {
      // @ts-ignore
      const localRecords = await db[mapping.dexie].toArray();
      if (!localRecords || localRecords.length === 0) continue;

      const remotePayloads = localRecords.map(toSnakeCase);

      const { error } = await supabase
        .from(mapping.remote)
        .upsert(remotePayloads, { onConflict: mapping.pk });

      if (error) {
        console.warn(`Sync warning on ${mapping.remote}:`, error.message);
      } else {
        totalSynced += localRecords.length;
      }
    }

    return { success: true, syncedCount: totalSynced };
  } catch (err: any) {
    console.error('Push sync failed:', err);
    return { success: false, syncedCount: totalSynced, error: err.message };
  }
}

/**
 * Pull all records from Supabase into Dexie (reconciliation).
 */
export async function pullAllFromSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, error: 'سوبا بيز مش متصل' };
  }

  let totalPulled = 0;

  try {
    for (const mapping of TABLE_MAPPINGS) {
      const { data, error } = await supabase.from(mapping.remote).select('*');
      if (error) {
        console.warn(`Error pulling ${mapping.remote}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        const localRecords = data.map(toCamelCase);
        // @ts-ignore
        await db[mapping.dexie].bulkPut(localRecords);
        totalPulled += data.length;
      }
    }

    return { success: true, count: totalPulled };
  } catch (err: any) {
    console.error('Pull sync failed:', err);
    return { success: false, count: totalPulled, error: err.message };
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
