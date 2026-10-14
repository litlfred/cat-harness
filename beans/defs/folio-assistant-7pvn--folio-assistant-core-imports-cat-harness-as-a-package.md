---
# folio-assistant-7pvn
title: 'folio-assistant-core imports cat-harness (and cat-harness-tools) as packages, not by ../../'
status: todo
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-14T15:45:00Z
parent: folio-assistant-f6gq
---

Second layer of f6gq; needs pxtk. cat-harness needs `exports` (or deep-import-safe layout) and a pin agreeing with core's index.config.json.

## Done when
- [ ] core's 228 cross-repository imports become package imports
- [x] the pin check, as in pxtk — settled by the owner ruling: the mount pin is the pin (`mount:remote:check`); nothing further to build
- [ ] core's tests: no new failure

## Pin ruling

Owner ruling 2026-10-14 (session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs): **the mount pin IS the pin.** A layer is fetched at the exact commit `index.lock.json` pins, and `mount:remote:check` holds it to that locked tree digest, so no separate package-version pin or comparison check is needed.
