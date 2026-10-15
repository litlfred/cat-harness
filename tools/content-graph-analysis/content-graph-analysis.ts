import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── Scripts a skill used to list as its own (#1168, B3) ─────────────────
//
// Until B3 a skill named its scripts (`SkillDefinition.scripts`), which is
// the general node pointing at its dependents: every new script meant an
// edit to the skill. Each script that exists is now a Tool that names the
// skill it `satisfies`; the entries naming a script that does not exist
// (eleven, e.g. `scripts/verify-proofs.sh`) were dropped rather than
// modelled, since a Tool whose command is missing is a false claim.
export default toolFactory((t) =>
  defineTool({
    id: "content-graph-analysis",
    title: "Editorial content-graph analysis",
    description:
      "Build the block- and section-level editorial dependency graph of one paper from its `.ts` manifests and report forward references, cross-chapter coupling, sparse or dense sections and isolated blocks, ranked. Reads `uses[]`/`interprets` only — the editorial relation, never the formal one.",
    install: { none: true },
    invoke: { shell: "bun run cat content:graph-analysis" },
    io: {
      inputs: [
        { name: "paper", schema: t("Slug"), required: false, arg: { flag: "--paper" }, description: "The paper directory under the content root. Its default names one folio's paper, which is migration debt: pass it explicitly." },
        { name: "chapter", schema: t("Slug"), required: false, arg: { flag: "--chapter" }, description: "Restrict the analysis to one chapter directory." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit the whole graph as JSON on stdout and exit." },
        { name: "md", schema: t("Flag"), required: false, arg: { flag: "--md" }, description: "Write the report to /tmp/content-graph-report.md." },
        { name: "visualise", schema: t("Flag"), required: false, arg: { flag: "--visualise" }, description: "Render the Graphviz SVGs (needs graphviz)." },
        { name: "proposals", schema: t("Flag"), required: false, arg: { flag: "--proposals" }, description: "Write concrete reorganisation proposals to /tmp/content-graph-proposals.md." },
      ],
      outputs: [
        { name: "report", schema: t("Text"), description: "The ranked findings, or the graph as JSON with `--json`." },
      ],
    },
    satisfies: ["content-graph"],
    requires: { runtime: ["python3"], network: false },
  }),
);
