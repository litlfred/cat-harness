---
$schema: folio-fsh-guts/v1
title: "special-branches.test.ts"
kind: script
movedOn: 2026-10-05
movedFrom: "cat-harness/scripts/tests/special-branches.test.ts"
issue: 2191
bean: folio-assistant-rva2
summary: >-
  The test that held every copy of a special-branch name to special-branches.json, checked the table's own shape, and cross-checked its writer list against the workflows. Retired with the table (owner, 2026-10-05). Its one job still worth doing — the cache scripts' built-in fallback names agreeing with each other — is cache-family-fallbacks.test.ts.
---

# `special-branches.test.ts`

Retired with [`special-branches.json`](special-branches.md), which it read on
every line. Kept beside it here because it records what the table promised:
new-name-first resolution, whole-token matching (`lake-cache` is a substring of
both newer names), and the writers-versus-workflows cross-check.

`fsh-guts/**` is in `bunfig.toml`'s `pathIgnorePatterns`, so this file is not
run from here.
