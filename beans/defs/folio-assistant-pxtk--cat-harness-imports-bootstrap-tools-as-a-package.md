---
# folio-assistant-pxtk
title: 'cat-harness imports bootstrap-tools as a package (@litlfred/bootstrap-tools), not by ../../'
status: todo
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-09T15:29:13Z
parent: folio-assistant-f6gq
---

First layer of f6gq: bootstrap-tools has no climbs of its own, so it is the bottom.

## Done when
- [ ] cat-harness depends on @litlfred/bootstrap-tools at the SAME commit its index.config.json mounts, and a check fails when the two pins differ (one version, two delivery routes)
- [ ] the 40 imports of ../../bootstrap-tools/ become @litlfred/bootstrap-tools/
- [ ] cat-harness's tests: no new failure against main
