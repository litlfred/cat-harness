import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The audits, which had no node while auditing the graph that holds ─
//
// `tool-coverage.ts` has said since 2026-09-18 that its tier A "is the list
// to act on", and `kg-audit` writes the committed verdict for every node in
// the graph. Neither was reachable by asking that graph. A node here is the
// premise of bean `d308` closing on itself: the instrument that finds
// unreachable mechanisms was one.
//
// No `maintains` on either, for the reason `schema-docs` records: each writes
// one artefact PER SUBJECT — a sidecar per node, an SVG per diagram — and
// `maintains.artefact` is a single path, so naming one file out of hundreds
// would read as a complete provenance record and be false.
export default toolFactory((t) =>
  defineTool({
    id: "kg-audit",
    title: "Knowledge-graph audit",
    description:
      "Audit every join in the actor→role→skill→task sentence and write a committed QA sidecar per node. A printed verdict is gone; a sidecar is what makes \"unbound since it was drawn\" distinguishable from \"broken in the commit under review\".",
    install: { none: true },
    invoke: { shell: "bun run cat kg:audit" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed sidecars and fail on a critical finding or a stale one, instead of writing." },
        { name: "strict", schema: t("Flag"), required: false, arg: { flag: "--strict" }, description: "Promote `major` to failing as well. Not what CI runs; see the note on constant-red checks in `remote-skill-servable.test.ts`." },
      ],
      outputs: [
        { name: "sidecars", schema: t("RepoPath"), description: "The QA tree, mirroring each subject's own path — flat would collide, since several basenames already occur twice." },
        // `unknown` is a result, not an absence, and it belongs in the
        // contract: a criterion that could not be evaluated must not be read
        // as a pass, and a caller that cannot see the distinction will read it
        // as one.
        { name: "worstSeverity", schema: t("Text"), description: "critical, major, minor — or none. `unknown` findings are never a pass." },
      ],
    },
    satisfies: ["code-node-review"],
    requires: { runtime: ["bun"], network: false },
  }),
);
