-- ============================================================
-- Rollback Migration: 20261022_rollback_rls.sql
-- Restores permissive policies if needed during migration testing
-- ============================================================

DROP POLICY IF EXISTS "Users can manage own domains" ON public.domains;
CREATE POLICY "Users can manage own domains" ON public.domains FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own skills" ON public.skills;
CREATE POLICY "Users can manage own skills" ON public.skills FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own resources" ON public.learning_resources;
CREATE POLICY "Users can manage own resources" ON public.learning_resources FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own book details" ON public.book_details;
CREATE POLICY "Users can manage own book details" ON public.book_details FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own course details" ON public.course_details;
CREATE POLICY "Users can manage own course details" ON public.course_details FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own skill resources" ON public.skill_resources;
CREATE POLICY "Users can manage own skill resources" ON public.skill_resources FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own study sessions" ON public.study_sessions;
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own tasks" ON public.tasks;
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR user_id IS NULL);
