-- ============================================================
-- MASAAR Life OS (مَسار) — Supabase PostgreSQL Schema & RLS Policies
-- Complete Production Schema with Hardened RLS Policies (SEC-01 Resolved)
-- Execute in Supabase SQL Editor (All-in-One Setup Script)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Domains Table
CREATE TABLE IF NOT EXISTS public.domains (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Layers',
    color TEXT DEFAULT '#38bdf8',
    sort_order INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own domains" ON public.domains;
CREATE POLICY "Users can manage own domains" ON public.domains 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 2. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    domain_id TEXT REFERENCES public.domains(id) ON DELETE SET NULL,
    parent_goal_id TEXT REFERENCES public.goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    why_it_matters TEXT,
    horizon TEXT DEFAULT 'MONTHLY',
    target_date DATE,
    status TEXT DEFAULT 'IN_PROGRESS',
    progress_percentage INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals" ON public.goals 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 3. Goal Milestones
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE,
    status TEXT DEFAULT 'PENDING',
    sort_order INTEGER DEFAULT 0,
    weight INTEGER DEFAULT 25,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own goal milestones" ON public.goal_milestones;
CREATE POLICY "Users can manage own goal milestones" ON public.goal_milestones 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.goals g 
        WHERE g.id = goal_milestones.goal_id AND g.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals g 
        WHERE g.id = goal_milestones.goal_id AND g.user_id = auth.uid()
    ));

-- 4. Goal Links
CREATE TABLE IF NOT EXISTS public.goal_links (
    id TEXT PRIMARY KEY,
    goal_id TEXT REFERENCES public.goals(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    relationship TEXT DEFAULT 'PRIMARY',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.goal_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own goal links" ON public.goal_links;
CREATE POLICY "Users can manage own goal links" ON public.goal_links 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.goals g 
        WHERE g.id = goal_links.goal_id AND g.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.goals g 
        WHERE g.id = goal_links.goal_id AND g.user_id = auth.uid()
    ));

-- 5. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'GENERAL',
    color TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own categories" ON public.categories;
CREATE POLICY "Users can manage own categories" ON public.categories 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    parent_skill_id TEXT REFERENCES public.skills(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'تقني',
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    baseline_level INTEGER DEFAULT 1,
    target_level INTEGER DEFAULT 5,
    content_progress INTEGER DEFAULT 0,
    demonstrated_competence INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own skills" ON public.skills;
CREATE POLICY "Users can manage own skills" ON public.skills 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 7. Learning Resources (Canonical Hub)
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    provider TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own resources" ON public.learning_resources;
CREATE POLICY "Users can manage own resources" ON public.learning_resources 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 8. Book Details (Child of learning_resources)
CREATE TABLE IF NOT EXISTS public.book_details (
    resource_id TEXT PRIMARY KEY REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    author TEXT,
    isbn TEXT,
    cover_url TEXT,
    total_pages INTEGER DEFAULT 200,
    current_page INTEGER DEFAULT 0,
    shelf TEXT DEFAULT 'Reading',
    rating INTEGER
);
ALTER TABLE public.book_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own book details" ON public.book_details;
CREATE POLICY "Users can manage own book details" ON public.book_details 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_resources r 
        WHERE r.id = book_details.resource_id AND r.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_resources r 
        WHERE r.id = book_details.resource_id AND r.user_id = auth.uid()
    ));

-- 9. Reading Sessions
CREATE TABLE IF NOT EXISTS public.reading_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    book_resource_id TEXT REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    pages_read INTEGER NOT NULL,
    start_page INTEGER,
    end_page INTEGER,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own reading sessions" ON public.reading_sessions;
CREATE POLICY "Users can manage own reading sessions" ON public.reading_sessions 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 10. Course Details (Child of learning_resources)
CREATE TABLE IF NOT EXISTS public.course_details (
    resource_id TEXT PRIMARY KEY REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    instructor TEXT,
    total_lessons INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    thumbnail_url TEXT
);
ALTER TABLE public.course_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own course details" ON public.course_details;
CREATE POLICY "Users can manage own course details" ON public.course_details 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_resources r 
        WHERE r.id = course_details.resource_id AND r.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_resources r 
        WHERE r.id = course_details.resource_id AND r.user_id = auth.uid()
    ));

-- 11. Skill Resources (Many-to-Many Skill <-> Resource)
CREATE TABLE IF NOT EXISTS public.skill_resources (
    skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, resource_id)
);
ALTER TABLE public.skill_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own skill resources" ON public.skill_resources;
CREATE POLICY "Users can manage own skill resources" ON public.skill_resources 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.skills s 
        WHERE s.id = skill_resources.skill_id AND s.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.skills s 
        WHERE s.id = skill_resources.skill_id AND s.user_id = auth.uid()
    ));

-- 12. Skill Evidence
CREATE TABLE IF NOT EXISTS public.skill_evidence (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    verification_date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own skill evidence" ON public.skill_evidence;
CREATE POLICY "Users can manage own skill evidence" ON public.skill_evidence 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 13. University Subjects
CREATE TABLE IF NOT EXISTS public.university_subjects (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    academic_year INTEGER DEFAULT 3,
    semester INTEGER DEFAULT 1,
    professor TEXT,
    exam_date DATE,
    mid_exam_date DATE,
    focus TEXT DEFAULT 'Normal',
    hall TEXT,
    schedule_description TEXT,
    difficulty TEXT DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.university_subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own subjects" ON public.university_subjects;
CREATE POLICY "Users can manage own subjects" ON public.university_subjects 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 14. Study Sessions & FSRS (Child of university_subjects)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.university_subjects(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'LECTURE',
    title TEXT NOT NULL,
    lecture_number INTEGER,
    status TEXT DEFAULT 'STUDIED',
    material_ready BOOLEAN DEFAULT FALSE,
    study_done BOOLEAN DEFAULT FALSE,
    revise_done BOOLEAN DEFAULT FALSE,
    solve_done BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'Normal',
    notes TEXT,
    submitted_date TIMESTAMPTZ,
    fsrs_stability DOUBLE PRECISION DEFAULT 0.0,
    fsrs_difficulty DOUBLE PRECISION DEFAULT 0.0,
    fsrs_last_review TIMESTAMPTZ,
    fsrs_next_review TIMESTAMPTZ
);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own study sessions" ON public.study_sessions;
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.university_subjects s 
        WHERE s.id = study_sessions.subject_id AND s.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.university_subjects s 
        WHERE s.id = study_sessions.subject_id AND s.user_id = auth.uid()
    ));

-- 15. Timetable Slots
CREATE TABLE IF NOT EXISTS public.timetable_slots (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    subject_code TEXT,
    format TEXT DEFAULT 'Campus',
    hall TEXT,
    notes TEXT
);
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own timetable slots" ON public.timetable_slots;
CREATE POLICY "Users can manage own timetable slots" ON public.timetable_slots 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 16. Academic Quizzes
CREATE TABLE IF NOT EXISTS public.academic_quizzes (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    topic TEXT NOT NULL,
    subject_id TEXT REFERENCES public.university_subjects(id) ON DELETE CASCADE,
    subject_name TEXT,
    quiz_date DATE NOT NULL,
    syllabus_scope TEXT,
    prepared BOOLEAN DEFAULT FALSE,
    attended BOOLEAN DEFAULT FALSE,
    my_score DOUBLE PRECISION,
    out_of DOUBLE PRECISION
);
ALTER TABLE public.academic_quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own quizzes" ON public.academic_quizzes;
CREATE POLICY "Users can manage own quizzes" ON public.academic_quizzes 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 17. Academic Assignments
CREATE TABLE IF NOT EXISTS public.academic_assignments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    task_name TEXT NOT NULL,
    subject_id TEXT REFERENCES public.university_subjects(id) ON DELETE CASCADE,
    subject_name TEXT,
    deadline DATE NOT NULL,
    lecture TEXT,
    completed BOOLEAN DEFAULT FALSE,
    submitted BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    score DOUBLE PRECISION
);
ALTER TABLE public.academic_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own assignments" ON public.academic_assignments;
CREATE POLICY "Users can manage own assignments" ON public.academic_assignments 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 18. Student Activities
CREATE TABLE IF NOT EXISTS public.student_activities (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    activity_name TEXT NOT NULL,
    task_name TEXT NOT NULL,
    deadline DATE,
    done BOOLEAN DEFAULT FALSE,
    delegated BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    notes TEXT
);
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own student activities" ON public.student_activities;
CREATE POLICY "Users can manage own student activities" ON public.student_activities 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 19. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    priority TEXT DEFAULT 'P2_IMPORTANT',
    status TEXT DEFAULT 'TODO',
    due_date DATE,
    estimated_minutes INTEGER DEFAULT 30,
    is_locked BOOLEAN DEFAULT FALSE,
    postponement_count INTEGER DEFAULT 0,
    goal_id TEXT REFERENCES public.goals(id) ON DELETE SET NULL,
    skill_id TEXT REFERENCES public.skills(id) ON DELETE SET NULL,
    study_session_id TEXT REFERENCES public.study_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own tasks" ON public.tasks;
CREATE POLICY "Users can manage own tasks" ON public.tasks 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 20. Task Postponements (Child of tasks)
CREATE TABLE IF NOT EXISTS public.task_postponements (
    id TEXT PRIMARY KEY,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    postponed_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT,
    new_due_date DATE
);
ALTER TABLE public.task_postponements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own task postponements" ON public.task_postponements;
CREATE POLICY "Users can manage own task postponements" ON public.task_postponements 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.tasks t 
        WHERE t.id = task_postponements.task_id AND t.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tasks t 
        WHERE t.id = task_postponements.task_id AND t.user_id = auth.uid()
    ));

-- 21. Habits
CREATE TABLE IF NOT EXISTS public.habits (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    target_type TEXT DEFAULT 'BOOLEAN',
    target_value INTEGER DEFAULT 1,
    streak_count INTEGER DEFAULT 0,
    consecutive_misses INTEGER DEFAULT 0,
    rest_days INTEGER[] DEFAULT '{}',
    last_completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own habits" ON public.habits;
CREATE POLICY "Users can manage own habits" ON public.habits 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 22. Habit Logs (Child of habits)
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id TEXT PRIMARY KEY,
    habit_id TEXT REFERENCES public.habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    value_recorded INTEGER DEFAULT 1,
    trigger_source TEXT
);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own habit logs" ON public.habit_logs;
CREATE POLICY "Users can manage own habit logs" ON public.habit_logs 
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.habits h 
        WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.habits h 
        WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()
    ));

-- 23. XP Transactions Ledger
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    idempotency_key TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own xp" ON public.xp_transactions;
CREATE POLICY "Users can manage own xp" ON public.xp_transactions 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 24. Journal Entries (Private Personal Data)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    date DATE NOT NULL,
    mode TEXT DEFAULT 'GUIDED_5_PROMPTS',
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own journal" ON public.journal_entries;
CREATE POLICY "Users can manage own journal" ON public.journal_entries 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Realtime publication for reactive cloud sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks, public.habits, public.goals, public.xp_transactions, public.university_subjects, public.study_sessions;
