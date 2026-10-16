---
# folio-assistant-8mlt
title: 'CREDENTIALS (iv): rename BOOTSTRAP_PAGES_TOKEN -> PUBLISH_SITE_BOOTSTRAP (bootstrap-tools) and MERGE_MAIN_TOKEN -> PUSH_BRANCH_TRIGGERING_CI (merge-main.yml)'
status: in-progress
type: task
created_at: 2026-10-02T06:31:23Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-5a3l
blocked_by:
    - folio-assistant-vobp
---

From the proposal cat-harness/docs/proposals/credentials-needs-and-supply.md §4.3 (D2=A). Edit the secret references and the error and help messages in bootstrap-tools/.github/workflows/publish-bootstrap.yml and .github/workflows/merge-main.yml. With the App (D1=A), add the create-github-app-token mint step and expose the job variable under the capability name. Both secrets are unset, so the rename breaks nothing. An agent creates no secret; the owner does that through the secrets skill.

## Done when
- [ ] neither old name appears in any workflow
- [ ] the owner has created the App or the secret, and publish-bootstrap.yml runs green once

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `in-progress` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: in-progress, cat-harness: todo). Evidence: folio-assistant#2532 and bootstrap-tools#17 opened, cat-harness-tools#93 merged; the App step is still the owner's. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
