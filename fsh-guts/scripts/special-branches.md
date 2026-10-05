---
$schema: folio-fsh-guts/v1
title: "special-branches.json"
kind: script
movedOn: 2026-10-05
movedFrom: "cat-harness/scripts/special-branches.json"
issue: 2191
bean: folio-assistant-rva2
summary: >-
  The central table of special-branch names, legacy names, writers, budgets and the files that copied them. Retired at the owner's word ("dont use /get rid of", then "mv to fsh-guts", 2026-10-05): a branch's name is now the declaring directory's `storage`, each cache script keeps its names only as a built-in fallback, and the five size budgets moved to cat-harness/test/health/branch-budgets.json, a file the health check owns (owner's choice 3 of 3).
---

# `special-branches.json`

**Superseded by the declarations.** It described itself as *"the ONE
declaration of the names"* and as INTERIM in the same breath; the owner ruled
on 2026-10-03 that there is no central table — *"each harness declares it,
(and each instance can also declare), why centralize?"* — and on 2026-10-05
asked for it to go.

What replaced each part:

| part | now |
|---|---|
| a branch's NAME | the declaring directory's `storage.branch` / `storage.branchPrefix` (or `source`) |
| legacy names | each script's built-in fallback list, kept in step by `cache-family-fallbacks.test.ts` |
| the folio's own family | read first by every cache script (`lake-cache.sh`, `lake-cache-fetch.sh`, the two Python mirrors, `reseed-lean-cache.sh`, `ig-cache.sh`) — bean rva2, #2192 |
| size budgets | `cat-harness/test/health/branch-budgets.json`, owned by the `special-branch-size` check, rows copied verbatim |
| `mirrors` | gone: there is no table left for a copy to agree with |
| `writers` | gone; the writer list was only ever cross-checked against workflows by the test beside this record |

Moved here rather than deleted, per the `fsh-guts` skill: delete means
relocate, and relocate is reversible. The test that checked every copy against
it (`special-branches.test.ts`) is beside it.
