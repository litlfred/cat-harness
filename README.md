# cat/cat-harness/todos — the `todos` subgraph of cat-harness

Orphan branch, never merged into `main`. One special branch per **named
subgraph**, `cat/<harness>/<subgraph>`. Owner, 2026-10-02: *"go with
cat/cat-harness/todos and cat/cat-harness/beans as their own named sub-graph
branches"*. Siblings: `cat/cat-harness/fsh-guts`, `cat/cat-harness/qa-reports`.
Arc `fs43` (issue #1850). Proposal: `cat-harness/docs/proposals/state-branch-2026-10-02.md`.

**Status: SEED, not authoritative.** Copied from `main@128b2ec4408a`. Until fs43
migrates every reader and writer, `main` is the source of truth, and edits
made here are read by nothing. See `manifest.json`.

Paths mirror the checkout exactly: `todos/…` here is `todos/…` on `main`.
Writes splice onto the tip and never force-push.
