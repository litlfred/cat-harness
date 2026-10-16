---
# folio-assistant-ec2a
title: 'LSI over blocks and Lean declarations: extend lsi-indexing with folio and lean-decl graph kinds and a cross-graph query'
status: in-progress
type: feature
priority: normal
created_at: 2026-10-04T15:10:08Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-zzmr
---

Recorded from the qou work-plan analysis, 2026-10-04 (session https://claude.ai/code/session_01NdDGeP1SyShmoUssLuRZ91). Not started: recorded so the gap has an owner. lsi-indexing covers library, skills, beans, docs only. qou's 141 duplicate groups are mostly the same Lean declaration filed twice; a cross-graph index would let lsi:near say 'this bean is about block Y / declaration Z'. Block indexer belongs in folio-assistant-core, lean-decl in folio-assistant-sci.

_2026-10-16T06:30:00Z_ — Store reconciliation: status `todo` → `in-progress` (Owner ruling 2026-10-16, item 9: "based on semantic content"; the copies said folio-assistant: in-progress, cat-harness: todo). Evidence: owner ruling 2026-10-10; folio-assistant-core#66 and folio-assistant-sci#18 merged; step 3 (cross-graph lsi:near) open. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
