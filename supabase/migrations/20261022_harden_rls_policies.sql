-- ============================================================
-- Migration: 20261022_harden_rls_policies.sql
-- Fixes SEC-01: Removes insecure 'OR auth.uid() IS NULL' bypass
-- Enforces strict per-user data isolation and parent-child ownership
-- ============================================================

-- 1. Domains Table
DROP POLICY IF EXISTS "Users can manage own domains" ON public.domains;
CREATE POLICY "Users can manage own domains" ON public.domains 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 2. Goals Table
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals" ON public.goals 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 3. Skills Table
DROP POLICY IF EXISTS "Users can manage own skills" ON public.skills;
CREATE POLICY "Users can manage own skills" ON public.skills 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 4. Learning Resources
DROP POLICY IF EXISTS "Users can manage own resources" ON public.learning_resources;
CREATE POLICY "Users can manage own resources" ON public.learning_resources 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 5. Book Details (Child of learning_resources)
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

-- 6. Reading Sessions
DROP POLICY IF EXISTS "Users can manage own reading sessions" ON public.reading_sessions;
CREATE POLICY "Users can manage own reading sessions" ON public.reading_sessions 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 7. Course Details (Child of learning_resources)
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

-- 8. Skill Resources (M:N junction between skills and resources)
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

-- 9. Skill Evidence
DROP POLICY IF EXISTS "Users can manage own skill evidence" ON public.skill_evidence;
CREATE POLICY "Users can manage own skill evidence" ON public.skill_evidence 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 10. University Subjects
DROP POLICY IF EXISTS "Users can manage own subjects" ON public.university_subjects;
CREATE POLICY "Users can manage own subjects" ON public.university_subjects 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 11. Study Sessions (Child of university_subjects)
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

-- 12. Tasks
DROP POLICY IF EXISTS "Users can manage own tasks" ON public.tasks;
CREATE POLICY "Users can manage own tasks" ON public.tasks 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 13. Task Postponements (Child of tasks)
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

-- 14. Habits
DROP POLICY IF EXISTS "Users can manage own habits" ON public.habits;
CREATE POLICY "Users can manage own habits" ON public.habits 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 15. Habit Logs (Child of habits)
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

-- 16. XP Transactions Ledger
DROP POLICY IF EXISTS "Users can manage own xp" ON public.xp_transactions;
CREATE POLICY "Users can manage own xp" ON public.xp_transactions 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 17. Journal Entries (Private Personal Data)
DROP POLICY IF EXISTS "Users can manage own journal" ON public.journal_entries;
CREATE POLICY "Users can manage own journal" ON public.journal_entries 
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- New Tables for Connected Goal & Learning Graph
-- ============================================================

-- 18. Categories
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

-- 19. Goal Milestones
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

-- 20. Goal Links
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

-- 21. Academic Tables (Ahmed's Curriculum)
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
