---
# folio-assistant-cruz
title: 'who-iris imports folio-assistant-core as a package — platform.ts switches from the mount path in one edit'
status: todo
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-09T15:29:13Z
parent: folio-assistant-f6gq
---

Top layer of f6gq; needs 7pvn. who-iris PR 18 (2026-10-09) re-pointed platform.ts to ./folio-assistant-core, the remote mount, as the interim; this replaces those six imports with @litlfred/folio-assistant-core.

## Done when
- [ ] platform.ts imports @litlfred/folio-assistant-core, pinned at the commit index.config.json mounts, with the pin check
- [ ] who-iris's gates and tests pass from a fresh clone, and inside folio-assistant's aggregate checkout
