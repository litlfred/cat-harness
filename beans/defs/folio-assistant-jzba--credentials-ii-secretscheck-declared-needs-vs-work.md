---
# folio-assistant-jzba
title: 'CREDENTIALS (ii): secrets:check — declared needs vs workflow usage vs secret names vs expiry registry'
status: in-progress
type: task
created_at: 2026-10-02T06:31:22Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-5a3l
blocked_by:
    - folio-assistant-vobp
---

From the proposal cat-harness/docs/proposals/credentials-needs-and-supply.md §6.2. Code in cat-harness-tools. Names only, never values. Findings per §6.2, including could-not-determine, which outranks clean (exit 2). Warns at 30 and 7 days before expiry. Feeds bun run health. Has the MCP and CLI parity of axis 6. Declares its own need, list-secret-names, supplied by the App. Not built yet.

## Done when
- [ ] it runs over folio-assistant and bootstrap-tools and reports BOOTSTRAP_PAGES_TOKEN / PUBLISH_SITE_BOOTSTRAP as declared-not-present (or present)
- [ ] it is wired into bun run health with the basis for each threshold

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `in-progress` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: in-progress, cat-harness: todo). Evidence: assigned to lane B 2026-10-10; cat-harness-tools#97 merged, MCP parity outstanding. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
