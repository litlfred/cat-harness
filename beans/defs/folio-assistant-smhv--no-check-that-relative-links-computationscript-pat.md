---
# folio-assistant-smhv
title: No check that relative links, computation.script paths and {{...}} templates resolve against declared directories
status: completed
type: feature
priority: normal
created_at: 2026-10-04T15:52:14Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-zzmr
---

Recorded from the qou orphaned-content census, 2026-10-04 (ORPH report; session https://claude.ai/code/session_01NdDGeP1SyShmoUssLuRZ91, issue #2106). qou: 12 absent computation.script files behind 12 blocks (including chi closed-form proofs), 30 dangling lean.refs, and macros used in prose but defined only in main.tex. Proposed: a resolution check over block links, computation.script and {{ }} templates, resolving against the instance's declared directories rather than hard-coded paths. Report-only, with an undetermined state.

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `completed` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: completed, cat-harness: todo). Evidence: closed in the folio-assistant store copy (2026-10-09); commit 3438be17 is on cat-harness main. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
