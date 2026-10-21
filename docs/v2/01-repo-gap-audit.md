# MASAAR V2 — Repository Gap Audit (Code-Level Analysis)
**Project:** MASAAR / مَسار (Personal Life Coach OS V2)  
**Date:** 2026-10-22T02:22:00+03:00  
**Baseline HEAD Commit:** `4a3bbfd`  
**Inspected Assets:** `Ahmed_Study_Planner_Simple_Smart_v4.xlsx`, `My-life_Auto_University_Seed_Patch.zip`, `MASAAR_V2_LIFE_OS_DEEP_UPGRADE_PROMPT.md`

---

## 1. Summary of Audit Findings

The application currently possesses solid foundations (Dexie v3 IndexedDB with 26 tables, local-first offline architecture, React 19 + TypeScript, 21 passing Vitest tests, hardened Supabase RLS, and connected Goal and Learning Centers).

However, comparing against the **MASAAR V2 Master Specification**, significant gaps and risks exist across 7 core areas:
1. **Academic Initialization:** `seedAhmedStudyPlannerIfNeeded` currently contains invented exam dates (`2026-11-18`, etc.), an invented Monday class end time (`21:00`), lacks an automatic execution path in `loadAllData()` when domains/habits exist, and has no tombstone mechanism to prevent resurrected subjects upon user deletion.
2. **Faith & Intentions:** No dedicated private workspace, no Quran reading tracker (target 3 pages/day, actual pages logged), no Qiyam al-Layl session logger (cross-midnight support), no prayer scheduling buffers, and no intention entity linked to goals.
3. **Health & Fitness:** No fitness workspace, no 20-minute daily movement tracking baseline, no workout logging (gym/cardio/strength with sets/reps/weights), and no comparison against personal minimum vs WHO 150-min benchmark.
4. **Weekly Auto-Scheduler:** No realistic constraint-based scheduler; task recommender currently only ranks tasks by score (+30 for goals) but does not compute available hours, wakeful time, prayer buffers, fixed classes, travel, or output overload warnings (`unscheduledMinutes`).
5. **Universal Content Management:** `BookLibrary.tsx` lacks Edit, Archive, and Delete functionality. Categories deletion does not offer an option to keep books uncategorized. No soft-delete/Trash/Tombstone architecture to prevent resurrecting deleted items on sync or re-seed.
6. **XP Baseline & Honesty:** No formal 0 XP baseline ledger or controlled reset action; existing XP is calculated directly from `xpTransactions` without a safe baseline migration or undo protection.
7. **Mobile-First UX:** While responsive layouts were added, the home screen above the fold still lacks a consolidated 5-point layout (Top action + Why, Next commitment + Prayer, Remaining usable time & overload, Domain pulse, Quick add), and bottom navigation lacks deep routing to Faith, Fitness, and Weekly Schedule.

---

## 2. File-by-File Gap Matrix

| File Path | Current Behavior | Required Behavior (V2) | Risk Level | Reusable Logic / GitHub Pattern | Test Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/db/index.ts` | Dexie v3. `seedAhmedStudyPlannerIfNeeded` has invented exam dates, Monday 21:00 end, and is only called inside `seedInitialDataIfNeeded`. | Upgrade to Dexie v4 with `appMeta`, `intentions`, `worshipLogs`, `quranLogs`, `qiyamSessions`, `workoutLogs`, `availabilityRules`, `schedulePlans`, `tombstones`. Idempotent auto-seed without button. | **HIGH (Data Integrity)** | Clean Dexie v4 migration; `ahmedCurriculum.ts` fixture. | `curriculum-autoseed.test.ts` (fresh profile + existing profile + delete tombstone). |
| `src/db/ahmedCurriculum.ts` | Missing in current HEAD (provided in narrow patch zip). | Add versioned canonical curriculum fixture strictly matching `Ahmed_Study_Planner_Simple_Smart_v4.xlsx` (8 subjects, 8 slots, Monday `endTime: null`). | **LOW** | Direct TS object fixture. | Unit test verifying exact codes, lecturers, and halls. |
| `src/types/index.ts` | `TimetableSlot.endTime` is `string`. Missing Intention, Worship, Fitness, Scheduler, and Tombstone types. | Update `TimetableSlot.endTime: string \| null`. Add `Intention`, `GoalIntention`, `WorshipLog`, `QuranReadingLog`, `QiyamSession`, `WorkoutLog`, `ExerciseSet`, `AvailabilityRule`, `ScheduleBlock`, `Tombstone`. | **MEDIUM (Type Safety)** | Strict TypeScript interfaces with optional deletedAt and provenance. | `tsc --noEmit` validation. |
| `src/stores/appStore.ts` | `loadAllData()` does not run academic seed if domains exist. No delete book/resource actions, no faith/fitness/scheduler actions, no controlled XP reset. | Execute `seedAhmedStudyPlannerIfNeeded()` on every load. Add full CRUD + Soft-Delete + Restore for books, resources, categories, goals, intentions, workouts, and worship. Implement controlled 0 XP reset with backup. | **HIGH (State & Storage)** | Zustand slice architecture + transactional Dexie updates. | `backup-roundtrip.test.ts`, `universal-delete.test.ts`, `xp-reset.test.ts`. |
| `src/components/UniversityWorkspace.tsx` | Displays `slot.startTime – slot.endTime` blindly; displays previously seeded exam dates. | Display `وقت الانتهاء غير محدد` if `endTime` is null. Display exam dates only when confirmed by owner. Preserve lectures/assignments/quizzes. | **LOW (UI Precision)** | Existing Tailwind + Lucide components. | Visual check at 360px & unit test for null end time. |
| `src/components/BookLibrary.tsx` | Only provides "إضافة كتاب" and "قراءة صفحتين" and page progress update. No edit, archive, or delete buttons! | Add action menu per book: Edit (title, author, totalPages), Archive, Move Shelf, Delete (with confirmation and tombstone). | **MEDIUM (User Experience)** | Modal dialogs with confirm state. | Acceptance test 5: delete book, reload, verify not resurrected. |
| `src/components/FaithWorkspace.tsx` | **MISSING**. | Implement Faith & Intentions workspace: 5 prayer times with buffer, Quran reading tracker (3 pages/day target + actual pages), Qiyam al-Layl logger (cross-midnight), Intentions library. | **MEDIUM (New Feature)** | Adhan library (already present) + custom local logger. | Acceptance tests 10, 11, 12. |
| `src/components/FitnessWorkspace.tsx` | **MISSING**. | Implement Health & Fitness workspace: 20-min daily movement tracker, activity logger (gym, walking, cycling, etc.), sets/reps/weights, weekly progress vs WHO 150m. | **MEDIUM (New Feature)** | Responsive card list with weekly bar overview. | Acceptance tests 13, 14. |
| `src/engines/scheduler.ts` | **MISSING**. Recommender only does priority scoring. | Implement weekly scheduling engine: compute `availableMinutes` using interval union, subtract fixed classes, prayer buffers, sleep, commute; output overload warnings. | **HIGH (Algorithm)** | Interval union algorithm + transparent constraint heuristics. | Acceptance tests 15, 16, 17, 18, 19. |
| `src/components/WeeklyScheduleWorkspace.tsx` | **MISSING**. | Weekly calendar view: visualize fixed university slots, prayer windows, work blocks, scheduled tasks, free buffer time, and overload alert banner. | **HIGH (User Value)** | Touch-friendly weekly timeline grid. | Phone view 360px + tablet view. |
| `src/components/SmartToday.tsx` | Shows greeting, prayers, best next action, and 3 tasks. Lacks integrated capacity warning, domain pulse, and compact top-of-fold layout. | Redesign mobile-first: 1. Top action + Why, 2. Next fixed commitment + prayer, 3. Remaining usable time & overload, 4. Domain pulse, 5. Quick add. | **MEDIUM (UX Polish)** | Existing Glassmorphism & Readex Pro styles. | Acceptance test 21 (360px verification). |
| `supabase/schema.sql` | `timetable_slots.end_time` is `NOT NULL`. Missing V2 tables (intentions, worship, workouts, schedules, tombstones). | Add `ALTER TABLE public.timetable_slots ALTER COLUMN end_time DROP NOT NULL;` and additive tables with strict RLS policies. | **HIGH (Cloud Integrity)** | Supabase PostgreSQL schema with RLS `TO authenticated`. | SQL migration execution & rollback verification. |

---

## 3. Security, Privacy & Data Loss Risks

1. **Risk of Resurrecting User-Deleted Content:**
   - *Cause:* When app initializes or syncs, if an entity exists in bundled code or remote database, naive code re-inserts it.
   - *Mitigation:* Implement `tombstones` table (storing `entityType`, `entityId`, `deletedAt`). All seeding and syncing logic MUST check tombstones before inserting or updating.
2. **Risk of Destroying Real Academic Edits:**
   - *Cause:* Hardcoded seeding could overwrite subjects or sessions renamed or customized by Ahmed.
   - *Mitigation:* Upsert missing entities only by matching normalized code + academicYear + semester. Never overwrite modified attributes.
3. **Risk of Overwriting Unconfirmed Exam Dates:**
   - *Cause:* Removing previously seeded exam dates could wipe user-entered dates.
   - *Mitigation:* Check fingerprint: only clear exam dates if `createdAt === updatedAt` AND `examDate === '2026-11-18'` (the exact untouched seed date).
4. **Privacy of Faith & Worship Records:**
   - *Cause:* Religious records are deeply personal and sensitive.
   - *Mitigation:* Stored locally in IndexedDB by default. Excluded from any third-party AI processing. Never scored with game XP.
5. **XP Reset Integrity:**
   - *Cause:* Blindly zeroing `currentXP` without clearing or versioning `xpTransactions` would cause old transactions to recalculate or sync back from cloud.
   - *Mitigation:* Controlled reset saves an immutable verified backup first, records an `xpResetEvents` ledger record, archives prior transactions, and sets the baseline strictly at 0 XP.
