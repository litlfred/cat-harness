---
# folio-assistant-r3ei
title: 'f017 follow-up: review the remaining input sites that block ~57 checks from the input-hash skip'
status: completed
type: task
created_at: 2026-10-06T22:53:13Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-xpcu
---

PR #2327 (bean f017) audits every skippable check's import closure. `bun run cat input-hash:coverage --blockers` lists the unannotated sites that keep the remaining ~57 declared tasks running every time.

The biggest blockers:
- kind-validator.ts:196: a computed import of validator modules.
- staging-stamp.ts:61 and :81: environment reads.
- kg-export.ts: spawn, clock, env and host.

Each site needs reading, then one of: an annotation with the right verdict, a `traced` hook, or a small refactor that moves the impure read to its one caller (as `freshness()` did).

## Done when
- [ ] each listed blocker is annotated, traced or refactored, with its reason
- [ ] the coverage report's blocked count is re-measured and recorded here

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `completed` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: completed, cat-harness: todo). Evidence: closed in the folio-assistant store copy (2026-10-09); commit dfeb31e6 is on cat-harness main. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
