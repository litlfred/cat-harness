---
$schema: folio-fsh-guts/v1
title: "smart-base as staged in folio-assistant — separated into its own repository"
kind: separated-instance
movedOn: 2026-10-06
movedFrom: "smart-base/ and smart-base.config.json"
repository: litlfred/smart-base
matchesCommit: 9452bc629feb9aec54646acb7c08d368cd7592fe
bean: folio-assistant-hupw
summary: >-
  Retired by the SMART separation cutover (kg-separation stage 13): the content already lives in its own repository. Owner, 2026-10-06, confirmed twice: "cutover dirs should go to
  fsh-guts", then "All three now". 3918 tracked files, frozen as they stood
  at folio-assistant 9452bc629fe.
---

# smart-base, as staged in folio-assistant

`smart-base/` beside this note is the directory exactly as it stood at
folio-assistant commit `9452bc629feb9aec54646acb7c08d368cd7592fe`, moved here with a plain `mv` (3918 tracked
files). The live copy is the fork litlfred/smart-base (branch `claude/seed-smart-base`, at 8e16a06d22 when this was moved), which publishes its own site.

The root instantiation file `smart-base.config.json` that declared it instantiated in folio-assistant moved with it, into `smart-base/` here.

This copy is **frozen**: it is never refreshed and never rendered
([`sub-kg-lifecycle`](../../cat-harness/skills/kg/graph-management/sub-kg-lifecycle.md)
stage 13). Do not move it back into place, and do not edit it here — change
the live repository instead. Its history is folio-assistant's history up to
that commit.
