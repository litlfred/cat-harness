---
# folio-assistant-5rmf
title: 'NAVBAR QR ICON GONE: the LHS top row''s QR code for the current page no longer appears, though its generator still loads'
status: completed
type: bug
priority: normal
created_at: 2026-10-06T06:51:27Z
updated_at: 2026-10-14T13:45:00Z
parent: folio-assistant-9rq1
---

Owner, 2026-10-06 (https://claude.ai/code/session_012qoycyCSGidZqW245vXhze), verbatim:

> LHS top navbar used to have a QR code icon that would make a QR code for the currently viewed page and show it inside the LHS navbar.

## Measured
- The generator is still shipped. `cat-harness/docs/_includes/head_custom.html:181` documents *"Site UI: a QR of the current page in the sidebar header"*, and lines 644-645 load `assets/js/vendor/qrcode.js` and `qrcode_UTF8.js` on every page.
- So it is the **icon (the entry point)** that went missing, not the capability. Likely suspects, not yet confirmed: the 2026-10-05 navbar reworks that rebuilt the icon row from shared data, #2185 (rail drawn in the browser) and #2206 (processes and kg out of the icon row).

## Done when
- [x] ~~the commit that dropped the icon is named~~ — not recoverable: the icon row's code moved repositories (70lx, cat-harness → cat-harness-tools `d8d42ab`), which cut the history. The commit that RESTORED it is named instead: the QR button in `assets/js/navbar-row.js`, guarded by `test/navbar-qr.test.ts` (cat-harness-tools, present since `d8d42ab`)
- [x] the QR icon is back in the LHS top row as a declared navbar capability (the `9rq1` one-mechanism rule), on platform pages AND folio sites — `qr` is in the navbar row's declared `icons` and drawn by the one `navbar-row.js`; seen on litlfred/smart-ra's site 2026-10-14
- [x] clicking it shows the current page's QR code inside the LHS navbar; a second click hides it (`l4zi`: the inverse is reachable) — Chromium, smart-ra STAGING, desktop 1400px and phone 390px: shown on click, hidden on second click
- [x] a navbar-inventory or e2e check fails if the icon is missing again — `test/navbar-qr.test.ts` (button, aria, toggle, Escape) in cat-harness-tools
- [x] screenshots at desktop and phone width, sent to the owner (`rendered-verification`) — session_01Pc8vSeXCwp5Ckvmz56cMDs, 2026-10-14

Queued for later, or for an idle agent. Not separation work.

## Summary of Changes

Found already fixed while draining the work plan (2026-10-14, session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs): the QR icon is a declared navbar-row capability with its own test, and it works on a folio site at desktop and phone width (open and close). Closed with that evidence; no code change was needed.
