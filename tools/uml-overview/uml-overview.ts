import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The site's visual assets, which had no SKILL until 2026-09-20 ─────
//
// These two were blocked rather than missing. Both are committed, published,
// single-file artefacts — the exact shape `maintains` exists for — and
// neither could be declared, because `satisfies` requires a skill and no
// skill stated the capability. `kg-export` serializes the graph to JSON;
// `rendering-auditor` audits a content block's visual output; neither is
// "render the graph's asset nodes into the site's stylesheets".
//
// That is the THIRD mismatch in `covered-is-not-reachable`: a mechanism with
// no skill, invisible to `tools:coverage` by construction because it
// enumerates skills and asks which lack Tools. The skill was authored first,
// on the owner's decision (bean `yean`), and deliberately names no script —
// a skill written to give a command somewhere to point is a Tool with front
// matter that passes every check and teaches nothing.
//
// They are siblings rather than alternatives: one renders theme tokens and
// the other avatar glyphs, and a caller wanting either is not served by the
// other.
// The two UML generators (bean `19cc`). Siblings rather than alternatives:
// one draws every declared sub-graph from the registry, the other draws
// the harness object model with its relationships, and neither covers
// the other.
export default toolFactory((t) =>
  defineTool({
    id: "uml-overview",
    title: "UML overview per named sub-graph",
    description:
      "Draw one UML class diagram per harness and one per named sub-graph it declares, as PlantUML, Mermaid and Graphviz DOT from one model, with every class read from the graph typology's node schema, and render the PlantUML to the SVG each page shows (needs Java; the check does not). The DOT is the page's Interactive view, laid out in the reader's browser by the site's vendored Graphviz WASM with draggable nodes. A kind with none is drawn as could-not-determine, never as an empty box.",
    install: { none: true },
    invoke: { shell: "bun run cat uml:overview" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if any diagram, SVG or page is stale or orphaned, instead of writing." },
      ],
      outputs: [{ name: "diagrams", schema: t("RepoPath"), description: "uml/overview/ (.puml and .mmd), their SVG renderings and Graphviz DOT beside them, and the docs/uml/overview/ pages that show them." }],
    },
    satisfies: ["uml-overview", "kg-subgraph-layout"],
    requires: { runtime: ["bun"], network: false },
  }),
);
