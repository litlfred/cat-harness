---
$schema: folio-fsh-guts/v1
title: "smart-ig as staged in folio-assistant — separated into its own repository"
kind: separated-instance
movedOn: 2026-10-06
movedFrom: "smart-ig/"
repository: none
matchesCommit: 9452bc629feb9aec54646acb7c08d368cd7592fe
bean: folio-assistant-hupw
summary: >-
  Retired in the same change as the three IGs it sat between. Owner, 2026-10-06, confirmed twice: "cutover dirs should go to
  fsh-guts", then "All three now". 5 tracked files, frozen as they stood
  at folio-assistant 9452bc629fe.
---

# smart-ig, as staged in folio-assistant

`smart-ig/` beside this note is the directory exactly as it stood at
folio-assistant commit `9452bc629feb9aec54646acb7c08d368cd7592fe`, moved here with a plain `mv` (5 tracked
files). It has no repository of its own and needs none: it was only the layering waypoint between smart-base and the smart-trust / smart-immunizations IGs (five boilerplate files and a declaration with `needs: ["smart-base"]`), and that edge cannot resolve once smart-base has left.

This copy is **frozen**: it is never refreshed and never rendered
([`sub-kg-lifecycle`](../../cat-harness/skills/kg/graph-management/sub-kg-lifecycle.md)
stage 13). Do not move it back into place, and do not edit it here — change
the live repository instead. Its history is folio-assistant's history up to
that commit.
