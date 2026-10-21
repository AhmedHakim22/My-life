# Known Issues & Integration Friction Log

| ID | Component / Source | Description | Severity | Mitigation / Resolution | Status |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **ISS-001** | `super-productivity` (Windows Path) | Long directory names exceed Windows `MAX_PATH` (260 chars) on clone. | Low | Resolved in research sandbox via `git config core.longpaths true`. Affirmed decision NOT to use super-productivity as codebase foundation. | RESOLVED |
| **ISS-002** | `HabitRPG/habitica` (License & Assets) | Code is GPLv3 and artwork is CC-BY-NC-SA 3.0; fantasy RPG theme clashes with scientific titles. | Critical | Excluded from direct code or asset reuse. Prohibited by hard blocker rule. | RESOLVED (BLOCKED) |
| **ISS-003** | Cairo Daylight Saving Transitions | Scheduling across Egypt DST changes may shift prayer buffers if local timezone math is naive. | Medium | Use UTC timestamps with `Intl.DateTimeFormat` and `adhan-js` date objects to calculate astronomical times dynamically per date. | ADDRESSED IN DESIGN |
| **ISS-004** | Offline XP Duplication Risk | Retrying network requests after offline reconnect could trigger duplicate XP grants. | High | Enforce immutable XP ledger with unique composite idempotency keys (`sha256(event_type + entity_id + date)`). | ADDRESSED IN DESIGN |
