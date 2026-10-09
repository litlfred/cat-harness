---
# folio-assistant-7pvn
title: 'folio-assistant-core imports cat-harness (and cat-harness-tools) as packages, not by ../../'
status: todo
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-09T15:29:13Z
parent: folio-assistant-f6gq
---

Second layer of f6gq; needs pxtk. cat-harness needs `exports` (or deep-import-safe layout) and a pin agreeing with core's index.config.json.

## Done when
- [ ] core's 228 cross-repository imports become package imports
- [ ] the pin check, as in pxtk
- [ ] core's tests: no new failure
