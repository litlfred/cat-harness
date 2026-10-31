# cat/cat-harness/subscribed-harnesses

The state of each harness this instance instantiates from a KG subscription,
written by `bun run cat kg:instantiate` and by the subscribed harness's own
processes. A named-subgraph state branch, one per subgraph (owner, 2026-10-03,
bean `laqs`: "Keep per-graph branches"), declared with `source.kind: "branch"`
in litlfred/cat-harness's `cat-harness.json`.

- **Seeded** 2026-10-31 from `main`, which dropped `subscribed-harnesses/` in
  the same change that declared this source. The directory's graph typology
  `holds: "state"` (owner, 2026-10-30, bean `w1gy` finding 1, option C), and
  `check:state-on-main` refuses new state on `main` (fa#2781).
- **Layout:** paths mirror the checkout (`subscribed-harnesses/**`); the root
  `manifest.json` (`state-manifest/v1`, `keyedBy: tip`) makes it a state branch.
- **Writes:** spliced onto the tip through `scripts/branch-store.ts`, never
  force-pushed, never merged into `main`.
