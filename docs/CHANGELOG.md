# Changelog — Personal Life Coach OS

All notable changes to this project are documented in this file.

## [1.3.0] - 2026-10-22
### Added
- **Ahmed's Study Planner System Integration (Full Academic OS)**:
  - Seeded Ahmed's exact 8 Cairo University Nanotechnology subjects: `Thermodynamics and Phase`, `Quantum Phenomena I`, `Application of Nanomaterials for Water Treatment`, `Management and Economics`, `Solid State`, `Computer Science`, `Molecular Spectroscopy` (High Focus ⭐), and `Nanotechnology in Biomedicine` (High Focus ⭐).
  - Implemented **01 / Lecture Tracker**: tracks `Material ready (1/0)`, `Study (1/0)`, `Revise (1/0)`, and `Solve (1/0)` with XP rewards and FSRS spaced repetition.
  - Implemented **02 / Assignment Tracker**: tracks `Completed (1/0)` vs `Submitted (1/0)` ensuring completed tasks remain visible until official submission.
  - Implemented **03 / Quiz Tracker**: tracks `Prepared (1/0)` vs `Attended (1/0)` and score tracking.
  - Implemented **04 / Weekly Timetable**: class schedule with campus halls (مدرج 5, مدرج ج, مدرج 7, مدرج 23, Online) and 2-hour daily university study guideline.
  - Implemented **05 / Student Activities**: NASA Space Apps (Bootcamp on Oct 24, Competition Days Nov 14-15) and Sciora tasks.
  - Implemented **Ahmed's Workload Pulse**: Days to Midterm countdown (starting Nov 7), Lectures to Study, Ready to Submit, and Quizzes in 7 Days counters.

## [1.2.1] - 2026-10-22
### Added
- **Full University Subjects Management (CRUD)**:
  - Added "إضافة مادة جديدة" modal: custom course name, code, academic year (1-4), semester (1-2), professor, final exam date, and difficulty rating.
  - Added "تعديل بيانات المادة" modal directly in the active subject card: modify any course attribute or delete the subject along with its lectures/sheets.
  - Added "إضافة محاضرة / شيت" modal to add new lectures, labs, or exam prep sessions to any subject.
  - Added ability to delete individual study sessions.
  - Instant reactive UI update and Dexie IndexedDB persistence.

## [1.2.0] - 2026-10-22
### Added
- **2026 Web Design Trends Fusion (All 10 Trends Implemented)**:
  - **Glassmorphism (Trend 4)**: Translucent frosted glass panels with subtle border refractions (`glass-panel`, `glass-panel-glow`).
  - **Neumorphism Evolved (Trend 2)**: Soft tactile depth and sunken tracks (`neo-sunken`, `neo-raised`).
  - **Vibrant Gradients & Energy (Trend 3)**: Domain-specific vivid accents (Emerald for prayers/reading, Sky for focus, Purple for Nanotech/ranks, Amber for Falcon).
  - **Micro-Interactions (Trend 6)**: `canvas-confetti` fireworks on task completion, habit milestones, 2-pages atomic reading, and level-ups, plus haptic pressable button scaling.
  - **3D Elements & Glow (Trend 8)**: Ambient glowing orbital orbs, 3D shield badges, and 3D progress rings.
  - **Dark Mode Designs (Trend 7)**: Sleek high-contrast cosmic slate `#070a12` dark mode canvas.
  - **Bold Typography (Trend 9)**: Bold, high-contrast Arabic typography with Google Fonts `Readex Pro` and tabular monospace digits.
  - **AI & Personalized Coaching (Trend 10)**: Dynamic contextual greetings, explainable Best Next Action recommendations with clear rationales.
  - **Minimalist Design & Hierarchy (Trend 1)**: Spacious grouped layouts with clear breathing room.
- **Deep Feature Completeness & Workspace Integration**:
  - Integrated `SkillsTree` directly into the University Workspace with sub-tab navigation (`[ مواد النانو الأكاديمية | شجرة المهارات والكورسات ]`).
  - Added new book creation modal in `BookLibrary` with page counter and reading status tracker.
  - Enhanced `FalconWorkspace` with monthly order targets (e.g. 50 orders) and quick task creation.
  - Refined `JournalWorkspace` and `AnalyticsView` with segmented controls for focused writing vs scientific rank inspection.

## [1.1.0] - 2026-10-22
### Added
- **Live Supabase Cloud Integration**:
  - Connected project `phogtpgejvstfxkrhjqz` (eu-west-1).
  - Populated `.env` with Supabase URL and Publishable Client Key.
  - Implemented `src/lib/sync.ts` with bidirectional camelCase <-> snake_case transformers and push/pull sync engine.
  - Added `CloudSyncModal.tsx` in UI with live status indicator, 1-click SQL copy, and connection health checker.
  - Enhanced `supabase/schema.sql` with full 17 tables and flexible RLS policies accommodating both authenticated and unauthenticated single-user personal access.
  - Verified live dev server HMR and production bundle generation.

## [1.0.0] - 2026-10-21
### Added
- **Complete YVCF 14 Stages Implementation (Stages 0–13)**:
  - **Stage 0**: Project Intake & Owner Context in `docs/00-project-intake.md`.
  - **Stage 1**: Problem Discovery & Behavioral Matrix in `docs/01-problem-discovery.md`.
  - **Stage 2**: Deep GitHub Research, Scorecard, License Audit, Security Findings, Reuse Matrix, and POC in `research/`.
  - **Gate A Approved**: Foundation Strategy D (Modular Composition) authorized.
  - **Stage 3**: 24 Product Innovations (20 selected for MVP) in `docs/03-product-innovation.md`.
  - **Stage 4**: Expert Challenge (Children, Madam Afaf, Academic, Security Red Team) in `docs/04-expert-review.md`.
  - **Stage 5**: Identity & Egyptian Arabic Voice ("MASAAR / مَسار") and 7-rank scientific ladder in `docs/05-product-identity.md`.
  - **Stage 6**: Full PRD & 10 acceptance scenarios in `docs/06-PRD.md`.
  - **Stage 7**: Architecture, Data Model (18 tables), Sync Strategy, Security Design, and 4 ADRs in `docs/`.
  - **Stage 8**: UX/UI Engineering spec (Thumb zone, RTL) in `design/UX-SPEC.md`.
  - **Gate B Approved**: Full PRD & Architecture authorized for production build.
  - **Stage 9**: Production Implementation:
    - Vite + React 19 + TypeScript + Tailwind CSS v4 + PWA Workbox.
    - Local-first Dexie.js (IndexedDB) database with automatic seed data.
    - Cairo astronomical prayer engine via `adhan-js`.
    - Spaced repetition study revision engine via `ts-fsrs`.
    - Explainable deterministic Best Next Action recommender & 3-miss intervention.
    - Scientific leveling engine with 6-month time lock for Professor of Science.
    - Habits grace streak engine with Friday rest day support.
    - One-tap atomic "Read 2 pages" action.
    - Nanotechnology university study hierarchy with 6 canonical states.
    - Book library with OpenLibrary lookup.
    - Skills library with dual consumption/competence tracking.
    - Falcon founder workspace for marketing and product milestones.
    - Private encrypted journal with free and 5-prompt guided modes.
    - One-click JSON backup export & restore.
  - **Stage 10**: Quality Verification in `qa/test-report.md` (12/12 unit tests passed, all 13 journeys verified).
  - **Stage 11**: Security & Go/No-Go Release Gate in `security/release-gate.md` (0 vulnerabilities, GO FOR RELEASE).
  - **Stage 12**: Production Deployment Guide in `deployment/production-guide.md` (Cloudflare Pages + Supabase, $0.00 cost).
  - **Stage 13**: Evolution Plan in `docs/13-evolution-plan.md`.
