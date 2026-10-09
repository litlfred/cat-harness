---
# folio-assistant-qump
title: 'REMOTE MOUNT BOOTSTRAP: mount:remote cannot read a declaration whose kinds come from the closure it is about to mount'
status: todo
type: bug
priority: high
created_at: 2026-10-09T19:00:00Z
updated_at: 2026-10-09T19:00:00Z
parent: folio-assistant-iirv
---

Found 2026-10-09 while building who-iris's site in an isolated tree (who-iris
clone + cat-harness at its lock ref + bootstrap-tools as a sibling, nothing else).

## What happens

`bun run <cat-harness>/scripts/remote-mount.ts` from a fresh who-iris clone:

> 🛑 could-not-determine — who-iris.json: directory "who-iris-catalogue" declares
> unknown graph typology "catalogue" … A kind contributed by a dependency must be
> registered before the declaration is read.

`catalogue` is folio-assistant-core's kind, and core is one of the instances this
very mount would lay down. Reading the declaration needs the closure; mounting the
closure needs the declaration. It worked in this container only because `/home/user`
happened to hold a folio-assistant-core checkout beside who-iris, which the registry
scanned — so the publish Routine (`trig_01XYFY6eELcR6tucz9UnjdaT`, step 2) has never
been shown to work from a clean container, and would stop at its first step there.

## The shape of the fix (not decided)

Mount reads only what mounting needs — `name`, `needs`, `remoteMounts`/the lock,
`index.config.json` — with a reader that does not validate kinds; full validation
runs AFTER the closure is on disk, when every kind's owner is registered. The
lock already records each instance's declaration digest, so the second read can be
checked against the first.

## Done when
- [ ] from an EMPTY directory: clone who-iris, clone cat-harness at the lock ref, run
      `remote-mount.ts` — it mounts, with no sibling checkout anywhere above it
- [ ] a test with a fixture whose root declaration uses a kind only a mounted layer registers
