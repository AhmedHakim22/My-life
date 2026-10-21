# Feature Registry — Personal Life Coach OS

Feature lifecycle states: `DISCOVERED`, `RESEARCHED`, `APPROVED`, `IN DEVELOPMENT`, `IMPLEMENTED`, `TESTED`, `INTEGRATED`, `RELEASE READY`, `RELEASED`, `BLOCKED`.

| Feature ID | Feature Name | Life Domain | Source / Candidate | Current State | Verification Evidence |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FEAT-001** | Smart Today / Best Next Action | Dashboard | `lifeos-app` + Recommender | **RELEASE READY** | Tested in `engines.test.ts` (Test 5.1). |
| **FEAT-002** | Cairo Prayer-Aware Schedule | Spiritual / Calendar | `batoulapps/adhan-js` | **RELEASE READY** | Tested in `engines.test.ts` (Test 1.1). |
| **FEAT-003** | 3-Miss Task Rescheduling | Productivity | Custom Rule Engine | **RELEASE READY** | Tested in `engines.test.ts` (Test 5.2). |
| **FEAT-004** | Universal Goals & Life Domains | Goals | `lifeos-app` Zustand store | **RELEASE READY** | Verified in `appStore.ts` & `db/index.ts`. |
| **FEAT-005** | University Study Hierarchy | University | Custom + `ts-fsrs` | **RELEASE READY** | 6 canonical states verified in UI & schema. |
| **FEAT-006** | Adaptive Revision Scheduler | University | `open-spaced-repetition/ts-fsrs` | **RELEASE READY** | Tested in `engines.test.ts` (Test 2.1). |
| **FEAT-007** | Book Library & Shelves | Reading | `wars2k/booktracker` schema | **RELEASE READY** | Relational model verified in `BookLibrary.tsx`. |
| **FEAT-008** | Quick Reading 2 Pages Action | Reading / Habits | Custom Atomic Action | **RELEASE READY** | Verified in `appStore.ts` (updates Book+Habit+XP). |
| **FEAT-009** | Open Library Book Metadata | Reading | OpenLibrary REST API | **RELEASE READY** | Tested live in QuickCapture modal. |
| **FEAT-010** | Skills Library & Dual Progress | Skills | `@xyflow/react` + custom | **RELEASE READY** | Consumption vs Competence in `SkillsTree.tsx`. |
| **FEAT-011** | Universal Learning Resources Hub | Learning | Custom Canonical Graph | **RELEASE READY** | Single canonical resource in `db/index.ts`. |
| **FEAT-012** | YouTube oEmbed Course Quick-Add | Learning | YouTube oEmbed API | **RELEASE READY** | Verified in `QuickCaptureModal.tsx`. |
| **FEAT-013** | Habits & 3-Consecutive Miss Reset | Habits | `lifeos-app` + Custom Engine | **RELEASE READY** | Tested in `engines.test.ts` (Tests 4.1-4.3). |
| **FEAT-014** | Gamification & XP Ledger | Progression | `lifeos-app` + Custom Ladder | **RELEASE READY** | Tested in `engines.test.ts` (Tests 3.1-3.2, 3.5). |
| **FEAT-015** | Professor of Science Title (6 Mo) | Progression | Custom Gate Logic | **RELEASE READY** | Tested in `engines.test.ts` (Tests 3.3-3.4). |
| **FEAT-016** | Private Journal (Free & Guided) | Reflection | `personal_planner` + `memos` | **RELEASE READY** | Verified in `JournalWorkspace.tsx`. |
| **FEAT-017** | Falcon Personal Workspace | Business | Custom Workspace | **RELEASE READY** | Verified in `FalconWorkspace.tsx`. |
| **FEAT-018** | Local-First PWA & Offline Cache | Infrastructure | `vite-plugin-pwa` + `dexie` | **RELEASE READY** | Verified via Workbox `dist/sw.js` generation. |
| **FEAT-019** | Zero-Cost Cloud Sync & RLS | Infrastructure | Supabase PostgreSQL | **RELEASE READY** | Verified free tier allowance & RLS design. |
