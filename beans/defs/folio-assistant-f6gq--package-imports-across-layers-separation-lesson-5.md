---
# folio-assistant-f6gq
title: 'PACKAGE IMPORTS ACROSS LAYERS: replace ../ climbs between repositories with package imports, bottom-up (separation lesson 5)'
status: todo
type: epic
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-09T15:29:13Z
---

Owner, 2026-10-09: "go with option 1 and option 2 now" — option 1 (who-iris resolves core through its in-checkout mount, who-iris PR 18) now, option 2 (package imports) as the target, built bottom-up.

Why: kg-separation lesson 5 says every cross-repository import MUST be a package import, never a `../` climb; nothing tracked it. Measured 2026-10-09, imports that climb into another repository: bootstrap-tools 0; cat-harness 42 (36 files, 40 into bootstrap-tools); folio-assistant-core 228 (75 files); cat-harness-tools ~740 (286 files); who-iris 6 (platform.ts only). The release workflows (`bun pm pack` + npm publish) would today publish packages whose own `../../` imports cannot resolve.

The platform has three definitions of a standalone checkout in force — aggregate monorepo, sibling clones (seed-ready / check:standalone), remote mounts inside the checkout (index.config / mount:remote) — and package imports are the one shape that works in all three. The ruling settling which layout is canonical is still the owner's.

## Done when
- [ ] every child below is completed or scrapped with reasons
- [ ] a check fails a new cross-repository `../` import in any layer (ratchet: may only fall)
