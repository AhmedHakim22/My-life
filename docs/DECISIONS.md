# Approved Decisions Log — Personal Life Coach OS
**Last Updated:** 2026-10-21  

---

## 1. Product & UX Decisions (Pre-Approved from Master Prompt)
- **DEC-001 [Philosophy B - Personal Coach]:** The system advises with explainable rationale; the user maintains sovereign control.
- **DEC-002 [Smart Today Screen]:** One recommended "Best Next Action" with concise rationale, top-3 daily priorities, and Cairo prayer countdown. Orientation in < 30 seconds on mobile.
- **DEC-003 [3-Miss Rescheduling Rule]:** Tasks missed 3 consecutive times trigger an intervention proposing task decomposition, scope reduction, or schedule reassessment.
- **DEC-004 [3-Miss Habit Streak Policy]:** Habits reset only after 3 consecutive missed eligible days, excluding planned rest days and approved exceptions.
- **DEC-005 [Separation of Content vs. Competence]:** Course progress percentage (e.g. 60% watched) is isolated from demonstrated skill mastery (which requires practice projects/assessments).
- **DEC-006 [Professor of Science Gamification Gate]:** The highest rank "Professor of Science" requires >= 6 calendar months of verified engagement and sustained activity.
- **DEC-007 [Zero Ongoing Cost]:** Target zero monthly cost for personal use via permanent free tiers (Cloudflare Pages, Supabase, OpenLibrary, YouTube oEmbed).
- **DEC-008 [Privacy by Design]:** No private journal entries or personal notes are transmitted to external AI APIs without explicit user consent.

---

## 2. Technical Foundation Decisions (Proposed at Gate A)
- **DEC-009 [Strategy D - Modular Composition]:** Rejected single-repo forks (Strategy A/B/C) to eliminate technical debt; selected unified Vite + React 19 + TypeScript + Tailwind + IndexedDB + Supabase stack.
- **DEC-010 [Local-First Architecture]:** Dexie.js (IndexedDB) for instant offline reads/writes; background sync queue to Supabase Postgres with RLS.
- **DEC-011 [Open-Source License Safety]:** Restrict all dependencies to MIT, Apache 2.0, BSD, or SIL OFL. Prohibit copyleft GPL/AGPL code integration.
- **DEC-020 [Ahmed 2027 Strategic Goals Architecture]:** Integrated the approved 2027 Goals Plan (`Ahmed_LifeOS_2027_Goals.md`) with 195 structured goals across 4 hierarchical tiers (8 Grand Visions 2031, 11 Annual 2027, 44 Quarterly Q1-Q4, 132 Monthly 11/mo). Strict preservation of existing goals (especially "قراءة 75" with zero progress loss), 0 XP awards on import, mobile-first current month switcher (11 goals/mo), breadcrumbs `رؤية ← سنوي ← ربع سنوي ← شهري`, and interactive visual tree explorer.
