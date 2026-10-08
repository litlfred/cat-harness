# cat/cat-harness/beans — the `beans` subgraph of cat-harness

Orphan branch, never merged into `main`. One special branch per **named
subgraph**, `cat/<harness>/<subgraph>`. Owner, 2026-10-02: *"go with
cat/cat-harness/todos and cat/cat-harness/beans as their own named sub-graph
branches"*. Siblings: `cat/cat-harness/fsh-guts`, `cat/cat-harness/qa-reports`.
Arc `fs43` (issue #1850). Proposal: `cat-harness/docs/proposals/state-branch-2026-10-02.md`.

**Status: AUTHORITATIVE.** Cutover 2026-10-08 from `main@3d4caf6e0f1c`.
The branch is now the authoritative store for beans. See `manifest.json`.

Paths mirror the checkout exactly: `beans/…` here is `beans/…` on `main`.
Writes splice onto the tip and never force-push.
