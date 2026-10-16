---
# folio-assistant-k3ml
title: 'CREDENTIALS (i): secrets skill — add/rotate/revoke per mechanism, GitHub App walkthrough for a personal account'
status: in-progress
type: task
created_at: 2026-10-02T06:31:22Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-5a3l
blocked_by:
    - folio-assistant-vobp
---

From the proposal cat-harness/docs/proposals/credentials-needs-and-supply.md §6.3 (D1=A, the App). Write skills/sdlc/sdlc-core/secrets.md with the human steps per mechanism and the UI paths. Lead with the GitHub App setup on a personal account: register the App, generate its private key, install it on selected repositories, store HARNESS_BOT_ID as a variable and HARNESS_BOT_PRIVATE_KEY as a secret, add the mint step. Agents never handle values (§6.1). Register with skill:register. Not built yet.

## Done when
- [ ] the skill exists and is registered; skill:register:check is green
- [ ] the App walkthrough has been followed once by the owner without a question

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `in-progress` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: in-progress, cat-harness: todo). Evidence: cat-harness#113 merged (3b59170); the owner walkthrough box is open. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
