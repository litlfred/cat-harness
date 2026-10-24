---
# folio-assistant-w1gy
title: 'Separation stage 5: QA both new repositories from fresh sibling clones'
status: todo
type: task
created_at: 2026-10-01T06:58:02Z
updated_at: 2026-10-24T08:12:00Z
parent: folio-assistant-iirv
---

Stage 5 of the split plan: QA from scratch. Fresh clones of bootstrap, bootstrap-tools, cat-harness, cat-harness-tools as siblings in an empty directory: `bun install --frozen-lockfile`, `tsc`, `bun test`, closure, the rehearsal, every `:check` in `cat-harness-tools/package.json`; link audit (0 broken, 0 leaving except declared URLs); names-outside audit (every remaining mention of folio-assistant or a higher instance intentional); licence files. Fixes found go to the new repositories, not back into the staged copies.

Plans (session scratchpad, 2026-10-01; to be committed with stage 0): `cat-harness-split-plan.md` (stages 0–6, decisions D1–D6, "Owner rulings, 2026-10-01") and `placement-proposal.md` (PR0–PR9, §6 "Owner rulings, 2026-09-30").

## Done when
- [ ] `QA-cat-harness.md` and `QA-cat-harness-tools.md` written in the `QA-bootstrap{,-tools}.md` format, both passing
- [ ] every fix QA found is a commit in the new repository, listed in the QA report

_2026-10-15T16:49Z_ — Block lifted: `iai8` is completed (cutover PR #2517 merged 2026-10-08). The edge was the work plan's "Block never lifted" finding (owner, 2026-10-15). Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.

_2026-10-16T06:30:00Z_ — The note above is mirrored from the folio-assistant store (commit 0b8d249), where this edge was lifted on 2026-10-15; lifted here too (Owner ruling 2026-10-16, item 9). Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.

## 2026-10-24 — re-measured (separation drain, session https://claude.ai/code/session_01X14WfP6kHutkCyB8dpmj4e)

Re-checked the 2026-10-20 findings against cat-harness main `e4238567`: F3 (dead `check:adversarial-review` script), F8 (two wrong-direction comments) and F13 (`url-space.ts` @graphNode) are fixed. Still open: F1 (bun.lock nested bootstrap-tools workspace), F5 (`test/README.md` still has 81 links to moved e2e files), F10 (NOTICE still headed folio-assistant and lists sci's claude-scientific-skills; package.json has no `license`). Also found: folio-assistant-sci has no LICENSE or NOTICE although it carries those MIT skills; asked the owner.

## OWNER, 2026-10-24 08:06Z (structured question in the separation drain thread, session https://claude.ai/code/session_01X14WfP6kHutkCyB8dpmj4e)

On folio-assistant-sci having no LICENSE or NOTICE while it carries the MIT claude-scientific-skills packages: **give sci the same Apache-2.0 LICENSE, CC BY content licence and a NOTICE, and move the MIT entry there; open the PR for owner review, do not auto-merge.**
