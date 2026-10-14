---
# folio-assistant-pxtk
title: 'cat-harness imports bootstrap-tools as a package (@litlfred/bootstrap-tools), not by ../../'
status: todo
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-14T15:45:00Z
parent: folio-assistant-f6gq
---

First layer of f6gq: bootstrap-tools has no climbs of its own, so it is the bottom.

## Done when
- [x] cat-harness depends on @litlfred/bootstrap-tools at the SAME commit its index.config.json mounts, and a check fails when the two pins differ (one version, two delivery routes) — settled by the owner ruling: there is one route, the mount, and `mount:remote:check` fails when the tree differs from the lock
- [ ] the 40 imports of ../../bootstrap-tools/ become @litlfred/bootstrap-tools/
- [ ] cat-harness's tests: no new failure against main

## Pin ruling

Owner ruling 2026-10-14 (session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs): **the mount pin IS the pin.** A layer is fetched at the exact commit `index.lock.json` pins, and `mount:remote:check` holds it to that locked tree digest, so no separate package-version pin or comparison check is needed.
