---
# folio-assistant-lthi
title: 'S4-c: cat-harness items owed to core, who-iris, smart-base, fhir-harness or the root (~45 rows)'
status: completed
type: task
priority: normal
created_at: 2026-10-01T12:16:24Z
updated_at: 2026-10-23T13:45:00Z
parent: folio-assistant-7x5n
---

Story S4 (rfuq). Rows: cat-harness/docs/proposals/placement-audit-2026-10-01.json (PR #1778) — instance=cat-harness, pr 'unplanned', target folio-assistant-core (SPLIT 14, MOVE 1), who-iris (SPLIT 8), smart-base (SPLIT 6, MOVE 6), fhir-harness (SPLIT 4), root (SPLIT 4); plus fhir-harness->smart-base SPLIT 7, core->sci SPLIT 3. SPLIT here mostly means keep the generic item and invert the upward reference.
## Done when
- [ ] every listed row resolved; gates green; merged

## 2026-10-12 — the recorded blocker is gone; the rows are re-measured (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)
- **`blocked_by: hx65` no longer blocks.** hx65 (S0 main green) has been `completed` since 2026-10-01T15:09Z. Nothing else is recorded against this bean. The parent `rfuq` carries the same stale `blocked_by` and its rule "placement PRs run ONE AT A TIME". The field is left as is, because only an owner or the arc's coordinator should restart S4.
- **The rows were written against the pre-separation monorepo.** Re-measured against cat-harness main `16b79f6c` using `docs/proposals/placement-audit-2026-10-01.json` (still present). Rows with `pr: unplanned`, verdict SPLIT/MOVE, instance cat-harness:
  - Target folio-assistant-core 15 rows: 7 still name core, 6 present but no longer name it, 2 paths gone.
  - Target who-iris 8 rows: 6 still name who-iris, 1 present without the name (`skills/ui/ui-core/incremental-render.md`), 1 path gone (`skills/ui/ui-core/docs-auto.md`).
  - Target smart-base 12 rows: 2 still name it, 3 present without, 7 gone (the six `grade-*` code lists moved).
  - Target fhir-harness 4 rows: 2 still name it, 1 present without, 1 gone.
  - Target root 4 rows: 2 still name it, 2 present without.
  - The 38 cat-harness rows that target folio-assistant-sci (24 paths still present) belong to S5 (Q1/Q3/Q4), not to this bean.
- **The 6 live who-iris rows are mostly worked examples and verbatim owner quotes**, for example `schema-management.md:215,300`, which are quoted owner rulings. A SPLIT here therefore takes an editorial judgement: which example stays generic, and which passage moves into who-iris's own docs. It is not a mechanical inversion. Not started.
- **What would unblock it, in practice:** (1) a fresh audit of the separated repos to replace the monorepo-era rows; (2) the owner or S4 coordinator restarting S4, or clearing the stale `blocked_by` on lthi and rfuq.
- Status stays **todo**. Its box is unticked: no row was resolved.

_2026-10-16T07:00:00Z_ — Block lifted (owner ruling 2026-10-16, items 1 and 9): `hx65` has been completed since 2026-10-01, and the folio-assistant copy lifted this edge on 2026-10-09. Session https://claude.ai/code/session_01K9Xi9QSxCNYju8QNu7EuHg.

_2026-10-23T13:45:00Z_ — Status synced from `todo` to `completed` to match the folio-assistant copy of this bean, which is newer and records the work as done there. Only the status changed; the body here is kept as it was. Owner OK in thread "FHIR beans and WHO migration" (https://claude.ai/code/session_01Bye99WLJxQpyCxh2eMgW19).
