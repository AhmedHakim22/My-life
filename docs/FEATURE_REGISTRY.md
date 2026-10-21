# Feature Registry — Personal Life Coach OS

Feature lifecycle states: `DISCOVERED`, `RESEARCHED`, `APPROVED`, `IN DEVELOPMENT`, `IMPLEMENTED`, `TESTED`, `INTEGRATED`, `RELEASE READY`, `RELEASED`, `BLOCKED`.

| Feature ID | Feature Name | Life Domain | Source / Candidate | Current State | Verification Evidence |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **FEAT-001** | Smart Today / Best Next Action | Dashboard | `lifeos-app` + Recommender | **PARTIAL** | Engine tested in `engines.test.ts`; goal weighting in progress. |
| **FEAT-002** | Cairo Prayer-Aware Schedule | Spiritual / Calendar | `batoulapps/adhan-js` | **VERIFIED** | Tested in `engines.test.ts` (Test 1.1) & `date-utils.test.ts`. |
| **FEAT-003** | 3-Miss Task Rescheduling | Productivity | Custom Rule Engine | **PARTIAL** | Detection tested in `engines.test.ts` (Test 5.2); interactive modal in Slice 3.3. |
| **FEAT-004** | Universal Goals & Life Domains | Goals | Dexie v3 + Custom Store | **IN DEVELOPMENT** | Schema v3 & Store CRUD tested in `goal-engine.test.ts`; UI in Slice 3.1. |
| **FEAT-005** | University Study Hierarchy | University | Custom + `ts-fsrs` | **VERIFIED** | Ahmed's real 8 Nanotech subjects & 6 states in `UniversityWorkspace.tsx`. |
| **FEAT-006** | Adaptive Revision Scheduler | University | `open-spaced-repetition/ts-fsrs` | **VERIFIED** | Tested in `engines.test.ts` (Test 2.1). |
| **FEAT-007** | Book Library & Shelves | Reading | `wars2k/booktracker` schema | **PARTIAL** | Shelf model verified; custom categories & collections in Slice 3.2. |
| **FEAT-008** | Quick Reading 2 Pages Action | Reading / Habits | Custom Atomic Action | **VERIFIED** | Atomic transaction & zero-page guard tested in `atomic-read.test.ts`. |
| **FEAT-009** | Open Library Book Metadata | Reading | OpenLibrary REST API | **VERIFIED** | Live fetch verified in `QuickCaptureModal.tsx`. |
| **FEAT-010** | Skills Library & Dual Progress | Skills | `@xyflow/react` + custom | **IN DEVELOPMENT** | Dual progress model ready; interactive node graph in Slice 3.2. |
| **FEAT-011** | Universal Learning Resources Hub | Learning | Custom Canonical Graph | **IN DEVELOPMENT** | Canonical tables & M:N schema verified in `backup-roundtrip.test.ts`. |
| **FEAT-012** | YouTube oEmbed Course Quick-Add | Learning | YouTube oEmbed API | **VERIFIED** | Verified in `QuickCaptureModal.tsx`. |
| **FEAT-013** | Habits & 3-Consecutive Miss Reset | Habits | `lifeos-app` + Custom Engine | **VERIFIED** | Tested in `engines.test.ts` (Tests 4.1-4.3). |
| **FEAT-014** | Gamification & XP Ledger | Progression | `lifeos-app` + Custom Ladder | **VERIFIED** | Tested in `engines.test.ts` (Tests 3.1-3.2, 3.5). |
| **FEAT-015** | Professor of Science Title (6 Mo) | Progression | Custom Gate Logic | **VERIFIED** | Tested in `engines.test.ts` (Tests 3.3-3.4). |
| **FEAT-016** | Private Journal (Free & Guided) | Reflection | `personal_planner` + `memos` | **VERIFIED** | Verified in `JournalWorkspace.tsx`. |
| **FEAT-017** | Falcon Personal Workspace | Business | Custom Workspace | **VERIFIED** | Verified in `FalconWorkspace.tsx`. |
| **FEAT-018** | Local-First PWA & Offline Cache | Infrastructure | `vite-plugin-pwa` + `dexie` | **VERIFIED** | PWA icons created in `public/`; `dist/sw.js` precaches 13 entries. |
| **FEAT-019** | Zero-Cost Cloud Sync & RLS | Infrastructure | Supabase PostgreSQL | **PARTIAL** | Hardened RLS authored in `20261022_harden_rls_policies.sql`; multi-device test pending. |
