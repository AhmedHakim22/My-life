-- =========================================================================
-- MASAAR Life OS — Cross-Device Auto-Sync Migration Script (v2)
-- Paste this script into your Supabase SQL Editor and click "RUN"
-- Link: https://supabase.com/dashboard/project/phogtpgejvstfxkrhjqz/sql/new
-- =========================================================================

-- 1. Upgrade existing tables with newly added columns
ALTER TABLE public.university_subjects ADD COLUMN IF NOT EXISTS focus TEXT DEFAULT 'Normal';
ALTER TABLE public.university_subjects ADD COLUMN IF NOT EXISTS hall TEXT;
ALTER TABLE public.university_subjects ADD COLUMN IF NOT EXISTS schedule_description TEXT;
ALTER TABLE public.university_subjects ADD COLUMN IF NOT EXISTS mid_exam_date DATE;

-- 2. Create Missing Tables (Safe with IF NOT EXISTS)

-- Goal Milestones
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    goal_id TEXT REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE,
    status TEXT DEFAULT 'PENDING',
    sort_order INTEGER DEFAULT 1,
    weight INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal Links
CREATE TABLE IF NOT EXISTS public.goal_links (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    goal_id TEXT REFERENCES public.goals(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_goal_link UNIQUE (goal_id, entity_id)
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#38bdf8',
    icon TEXT,
    type TEXT DEFAULT 'CUSTOM',
    sort_order INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Modules & Lessons
CREATE TABLE IF NOT EXISTS public.course_modules (
    id TEXT PRIMARY KEY,
    course_resource_id TEXT REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.course_modules(id) ON DELETE CASCADE,
    course_resource_id TEXT REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'UNWATCHED',
    video_url TEXT,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timetable Slots
CREATE TABLE IF NOT EXISTS public.timetable_slots (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    subject_name TEXT NOT NULL,
    subject_code TEXT,
    format TEXT DEFAULT 'Campus',
    hall TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Academic Quizzes & Assignments
CREATE TABLE IF NOT EXISTS public.academic_quizzes (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    subject_id TEXT REFERENCES public.university_subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    quiz_date DATE NOT NULL,
    weight INTEGER DEFAULT 5,
    prepared BOOLEAN DEFAULT FALSE,
    attended BOOLEAN DEFAULT FALSE,
    score NUMERIC,
    max_score NUMERIC DEFAULT 10,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academic_assignments (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    subject_id TEXT REFERENCES public.university_subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    submitted BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_activities (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    activity_name TEXT NOT NULL,
    role TEXT,
    task_description TEXT NOT NULL,
    deadline DATE,
    done BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intentions
CREATE TABLE IF NOT EXISTS public.intentions (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'GENERAL',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.goal_intentions (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    goal_id TEXT REFERENCES public.goals(id) ON DELETE CASCADE,
    intention_id TEXT REFERENCES public.intentions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_goal_intention UNIQUE (goal_id, intention_id)
);

-- Worship & Spiritual Logs
CREATE TABLE IF NOT EXISTS public.worship_logs (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    date DATE NOT NULL,
    prayer_name TEXT NOT NULL,
    status TEXT NOT NULL,
    sunnah_done BOOLEAN DEFAULT FALSE,
    azkar_done BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quran_logs (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    date DATE NOT NULL,
    pages_read INTEGER NOT NULL DEFAULT 0,
    surah_from TEXT,
    surah_to TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.qiyam_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    rakahs INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fitness & Availability
CREATE TABLE IF NOT EXISTS public.movement_logs (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    date DATE NOT NULL,
    activity_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    meets20_min_baseline BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_logs (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    date DATE NOT NULL,
    activity_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    perceived_exertion INTEGER DEFAULT 5,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.availability_rules (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    day_of_week INTEGER NOT NULL,
    type TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.schedule_blocks (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    task_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.schedule_plans (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    week_start_date DATE NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    total_study_capacity_minutes INTEGER DEFAULT 0,
    total_allocated_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges Engine
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER DEFAULT 90,
    current_day INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE',
    tasks JSONB DEFAULT '[]'::jsonb,
    start_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_logs (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    completed_task_ids JSONB DEFAULT '[]'::jsonb,
    is_freeze_used BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security Policies (Allow Anon & Authenticated Access)
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'domains', 'goals', 'goal_milestones', 'goal_links', 'categories', 'skills',
        'learning_resources', 'book_details', 'reading_sessions', 'course_details',
        'course_modules', 'course_lessons', 'skill_resources', 'skill_evidence',
        'university_subjects', 'study_sessions', 'timetable_slots', 'academic_quizzes',
        'academic_assignments', 'student_activities', 'tasks', 'task_postponements',
        'habits', 'habit_logs', 'xp_transactions', 'journal_entries', 'intentions',
        'goal_intentions', 'worship_logs', 'quran_logs', 'qiyam_sessions', 'movement_logs',
        'workout_logs', 'availability_rules', 'schedule_blocks', 'schedule_plans',
        'challenges', 'challenge_logs'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Public access policy" ON public.%I;', tbl);
            EXECUTE format('CREATE POLICY "Public access policy" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if table does not exist
        END;
    END LOOP;
END $$;

-- 4. Enable Supabase Realtime for Automatic Instant Sync
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
        public.tasks, 
        public.habits, 
        public.habit_logs, 
        public.goals, 
        public.skills, 
        public.university_subjects,
        public.timetable_slots, 
        public.worship_logs, 
        public.challenges, 
        public.challenge_logs,
        public.xp_transactions, 
        public.journal_entries;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if already added to publication
END $$;
