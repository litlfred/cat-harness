# cat/cat-harness/merge-reviews

The adversarial review verdict on each pull request's head, one
`merge-review/v1` file per head sha under `merge-reviews/`. A named-subgraph
state branch, one per subgraph (owner, 2026-10-03, bean `laqs`), declared
`scope: "repository"` with `source.kind: "branch"` in litlfred/cat-harness's
`cat-harness.json`.

- **Why its own branch:** owner, 2026-10-20 ("State branch", bean `w8jq`). A
  verdict committed INTO the pull request moves the head it names, so
  `check:adversarial-review` could only ever find it stale.
- **Layout:** paths mirror the checkout (`merge-reviews/**`); the root
  `manifest.json` (`state-manifest/v1`, `keyedBy: tip`) makes it a state branch.
- **Writes:** `bun run cat state:push`, spliced onto the tip, never
  force-pushed, never merged into `main`.
