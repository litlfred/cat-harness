import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

// The knowledge-graph tools. Their handlers lived only in the viewer
// server's embedded chat agent, so no MCP client could call them: an agent
// session got "Tool corpus_search not found" for the check a folio runs
// before declaring anything open (qou bean `qou-q261`). One module, one
// registrar, four served names.
export default toolFactory((t) =>
  defineTool({
    id: "corpus-search",
    title: "Search the corpus and follow the graph",
    description:
      "Seed lexically over the authored folio and every declared library, then expand along graph edges, labelling each hit MATCHED or REACHED and by which edge. Counts are split authored vs ingested, and a root that exists but holds no graph nodes is reported rather than read as an empty answer.",
    install: bundled,
    invoke: inProcess("src/tools/graph.ts", "corpus_search"),
    io: {
      inputs: [
        { name: "query", schema: t("Text"), required: true, description: "Words to seed on. Seeding is lexical, so a short phrase works; a long query no node contains seeds nothing." },
        { name: "hops", schema: t("Count"), required: false, description: "Expansion depth, 0-4 (default 1). 0 is a plain lexical search." },
        { name: "direction", schema: t("Slug"), required: false, description: "`out`, `in` or `both` (default)." },
        { name: "provenance", schema: t("Slug"), required: false, description: "`authored` or `ingested`: restricts the seeds, not the expansion." },
        { name: "searchText", schema: t("Flag"), required: false, description: "Also seed on companion Markdown bodies." },
        { name: "limit", schema: t("Count"), required: false, description: "Seed cap before expansion (default 20)." },
      ],
      outputs: [{ name: "result", schema: t("Markdown"), description: "JSON: summary, emptyRoots, dangling, and hits each carrying a `why`." }],
    },
    satisfies: ["corpus-grep"],
    requires: { network: false },
  }),
);
