# cat/cat-harness/issue-marks

How far an agent has read each issue: `lastCommentId`, `lastUpdatedAt` and
`checkedAt`, one file per issue under `issue-marks/`. A named-subgraph state
branch, one per subgraph (owner, 2026-10-03, bean `laqs`: "Keep per-graph
branches"), declared `scope: "repository"` with `source.kind: "branch"` in
litlfred/cat-harness's `cat-harness.json`.

- **Seeded** 2026-10-09 from the retired shared `cat/cat-harness/state` branch,
  whose manifest recorded `issue-marks` as having no per-graph branch yet.
  `main` dropped `issue-marks/` on 2026-10-08 (archived at
  `fsh-guts/separated/issue-marks.{md,tar.gz}`), so this branch is now its
  only live store. Owner, 2026-10-09: "Mount them like beans".
- **Layout:** paths mirror the checkout (`issue-marks/**`); the root
  `manifest.json` (`state-manifest/v1`, `keyedBy: tip`) makes it a state branch.
- **Writes:** spliced onto the tip through `scripts/branch-store.ts`, never
  force-pushed, never merged into `main`.
