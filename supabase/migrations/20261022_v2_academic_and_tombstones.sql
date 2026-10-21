-- ==============================================================================
-- MASAAR V2 — Academic Nullable End Time & Deletion Tombstones Migration
-- ==============================================================================

-- 1. Make timetable_slots.end_time nullable for unknown class endings
ALTER TABLE public.timetable_slots ALTER COLUMN end_time DROP NOT NULL;

-- 2. Deletion Tombstones table
CREATE TABLE IF NOT EXISTS public.tombstones (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);
ALTER TABLE public.tombstones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own tombstones" ON public.tombstones;
CREATE POLICY "Users can manage own tombstones" ON public.tombstones 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 3. XP Reset Events Ledger
CREATE TABLE IF NOT EXISTS public.xp_reset_events (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    reset_at TIMESTAMPTZ DEFAULT NOW(),
    previous_total_xp INTEGER NOT NULL,
    transactions_archived_count INTEGER NOT NULL,
    backup_key TEXT,
    reason TEXT
);
ALTER TABLE public.xp_reset_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own xp reset events" ON public.xp_reset_events;
CREATE POLICY "Users can manage own xp reset events" ON public.xp_reset_events 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
