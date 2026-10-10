---
# folio-assistant-cruz
title: 'who-iris imports folio-assistant-core as a package — platform.ts switches from the mount path in one edit'
status: in-progress
type: feature
priority: normal
created_at: 2026-10-09T15:29:13Z
updated_at: 2026-10-10T12:00:00Z
parent: folio-assistant-f6gq
---

Top layer of f6gq; needs 7pvn. who-iris PR 18 (2026-10-09) re-pointed platform.ts to ./folio-assistant-core, the remote mount, as the interim; this replaces those six imports with @litlfred/folio-assistant-core.

## Done when
- [ ] platform.ts imports @litlfred/folio-assistant-core, pinned at the commit index.config.json mounts, with the pin check
- [ ] who-iris's gates and tests pass from a fresh clone, and inside folio-assistant's aggregate checkout

## 2026-10-10 — progress

- **Box 1 is met in substance.** `platform.ts` imports `@litlfred/folio-assistant-core/...` (who-iris #23). `package.json` `workspaces: ["folio-assistant-cor[e]"]` (who-iris #25) resolves the package to the remote mount. That mount sits at the commit `index.lock.json` pins, and `mount:remote:check` holds it to the locked tree digest. There is no separate package-version pin; the mount pin IS the pin. I've left it unchecked for the owner to accept that reading.
- **Box 2, fresh clone.** It was shown from an empty directory once the `qump` fix was applied: the five gates exit 0 and 97/97 tests pass. It holds from a clean clone at the lock once who-iris is repinned to cat-harness ≥ b27a4da and cat-harness-tools ≥ c6dd270.
- **Box 2, "inside folio-assistant's aggregate checkout".** That checkout no longer exists after the separation, so this half cannot be measured as written.

**Update (who-iris #28).** The repin landed, so the fresh-clone half of box 2 now holds at the lock: gates 0, 97/97 tests.
