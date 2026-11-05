---
name: cache-first-ci
description: >
  Every CI step is a pure function of its inputs: derive the inputs, hash them
  into a key, restore on a hit, run and save on a miss. Read before adding a
  cache to a workflow, before writing a cache key, before trusting a restored
  output or a skipped verdict, and before pushing a change that moves a cached
  step's key. Covers the one primitive (`cached-step` + `cache:key`), the trust
  classes, what a committer publishes, the 10 GB budget, and the hit-rate report.
adapters: [document, paper, dak]
profiles: [document, paper]
---

# Cache-first CI — a step is a pure function of its inputs

**The principle.** Derive a step's inputs, hash them into a key. On a hit,
restore the output (or the verdict) and skip the step. On a miss, run the
step, then save. The full set still runs on the default branch and nightly,
and that is what catches a key that missed an input.

## One primitive, not one cache per author

A checkout's CI has ONE cache primitive. In folio-assistant it is the composite
action `.github/actions/cached-step` (its README is the operational detail).
A new cache goes through it, and an old bespoke one is ported onto it by its
owner. Then every cache has the same key shape (`cs1-<step>-<key>`), the same
trust policy, the same `hit | warm | miss — why` line in the job summary, and
a row in the daily hit-rate report. A cache that bypasses it is one nobody can
audit.

## The key is DERIVED, never hand-declared

Owner ruling, bean `4rbc`: *"derived is BEST"*; *"DERIVED = no drift, no extra
data fields"*. A key comes from one of these:

- `bun run cat cache:key <script>` (cat-harness-tools `scripts/cache-key.ts`).
  This is the `f017` fingerprint of the script: its import closure, audited for
  every environment, network, clock and git read (`input-sites.ts`); the tool
  versions; `bun.lock`; and its `task-io` declaration, where `{tracked}` means
  the whole tree.
- A lock's digest, when the lock pins every input. `index.lock.json` pins every
  mounted tree. `cache:key --hash-files` prints what the runner's
  `hashFiles()` prints.
- A digest script that hashes the tree and the exact tool versions
  (`bundle-cache.sh digest`).

**Never narrow a key by hand to get more hits.** A hand-picked list of input
globs is a claim nothing checks. When the key does not hit often enough, the
fix is to derive the inputs more finely (the cone, `ci-cone.ts`). Hand-listing
is not the fix.

**Could-not-determine is never a hit.** An undetermined key runs the step and
saves nothing.

## The trust classes (owner, 2026-11-05)

Committers, both people and agents, produce cache entries locally where CI can
verify them cheaply, so CI only verifies.

| class | what | who produces it | how CI accepts it |
|---|---|---|---|
| **(a) exactly verifiable** (`trust: exact`) | output that can be checked against its inputs without re-running the producer: the mounts and the layers ref against the lock's digests; a bundle against its manifest **when its producer is deterministic** | main, a PR into its own scope, **or a committer** with `cache:publish` | a hit only after `verify` passes; a prefix restore is a warm start, never a hit |
| **(b) verdicts** (`trust: verdict`) | "this gate passed on these inputs" | CI (main, or a PR into its own scope); a committer's local gate record goes through #2957/#2958 | exact key only; reported **SKIPPED, not passed**, naming the run that recorded it; committers' records are re-verified deferred or sampled |
| **(c) everything else** (`trust: main-only`) | outputs neither checkable nor deterministic | main only | exact key only |

The Actions cache scopes an entry by ref. A PR's save is readable only by
that PR's own runs, so a PR cannot poison what main or another PR reads.
`pull_request_target` never saves.

A manifest proves the bytes are the ones the committer built. It does not
prove the build was right. What closes that gap is the determinism of the
producer, measured by the determinism audit (`determinism-audit.sh`: build
twice in one tree, diff the bytes), together with the full run on main and
nightly. A producer the audit has not cleared stays in class (c).

## What a committer runs before pushing

For each `exact` step that the change moves the key of, and that the
determinism audit lists as DETERMINISTIC, run:

```
bun run cat cache:publish <step>
```

This builds nothing. It publishes what you already built to
`refs/cache/cs1-<step>-<key>`. Today that is `cat-mount` when the change edits
`index.lock.json`. More steps join as the audit clears their producers.

## The budget

GitHub keeps **10 GB of Actions cache per repository**. It evicts the
least-recently-used entries beyond that, and any entry left unread for 7 days.

- **Big bundles** go to GHCR or to git refs, never to the Actions cache. The
  prepared image, the QA working copy and the publish-time pages are all big
  bundles, and any one of them can evict every small entry.
- **Small outputs and verdicts** go to the Actions cache, namespaced by step.
- **Pruning** deletes only what no run can read any more: entries scoped to a
  closed PR's merge ref.

## The hit-rate report

Every restore writes `hit | warm | miss` and why to the job summary. The daily
report (folio-assistant `cache-report.sh`, run from `sweeps.yml`) gives the hit
rate per step, the cache usage and the size of each namespace. When you claim
a speed-up, report the hit rate and runner-minutes before and after, with run
ids. A claim without run ids is a guess.

## Related

- [`prepare-merge`](prepare-merge.md): the local checks before a push include
  the `cache:publish` above.
- [`ci-health`](ci-health.md): a cached SKIPPED is not a pass. Read verdicts
  as that skill says.
- [`platform-gates`](platform-gates.md): which gates run where.
