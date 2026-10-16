import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── Downstream outputs ─────────────────────────────────────────────
//
// Bean `fq5u`: a Tool that keeps a derived output current declares it,
// with its inputs, so `kg:audit`'s `tool-downstream-fresh` can say whether
// the last run SUCCEEDED over the current inputs — and never reads "no
// run recorded" as green. See `schemas/tool.ts#ToolDownstreamSchema`.
export default toolFactory((t) =>
  defineTool({
    id: "lsi-index",
    title: "Build the Latent Semantic Indexing index of a prose graph",
    description:
      "Build the per-graph LSI index sidecar for every declared prose graph (or the one named): input fingerprint, parameters, dimension summaries, nearest neighbours and near-duplicate findings, never the vectors. Records each run's outcome and input fingerprint, success or failure, as a `folio-tool-run/v1` record.",
    install: { none: true },
    invoke: { shell: "bun run cat lsi index" },
    io: {
      inputs: [
        { name: "instance", schema: t("Slug"), required: false, arg: { flag: "--instance" }, description: "Instance declaring the graph, e.g. `cat-harness`." },
        { name: "graph", schema: t("Slug"), required: false, arg: { flag: "--graph" }, description: "Graph id within the instance, e.g. `skills`." },
      ],
      outputs: [
        { name: "index", schema: t("RepoPath"), description: "`test/results/lsi/<instance>/<graph>.lsi.json`, and the run record under `test/results/tool-runs/lsi-index/`." },
      ],
    },
    satisfies: ["lsi-indexing"],
    requires: { runtime: ["bun"], network: false },
    downstream: {
      output: "cat-harness/test/results/lsi/",
      inputs: ["every declared prose graph (graph typologies library, skills, folio, docs, methodology, memory, policies, glossary)"],
      judgedAt: "checkout",
    },
  }),
);
