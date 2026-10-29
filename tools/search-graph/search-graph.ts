import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "search-graph",
    title: "Lexical search over the content graph",
    description:
      "Find graph nodes, authored or ingested, whose label, title, kind or tags contain a string, with no graph expansion. corpus-search composes this with a neighbour walk.",
    install: bundled,
    invoke: inProcess("src/tools/graph.ts", "search_graph"),
    io: {
      inputs: [
        { name: "query", schema: t("Text"), required: true, description: "Substring to look for." },
        { name: "provenance", schema: t("Slug"), required: false, description: "`authored` or `ingested`. Omit for both." },
        { name: "searchText", schema: t("Flag"), required: false, description: "Also scan companion Markdown bodies." },
        { name: "limit", schema: t("Count"), required: false, description: "Max hits (default 20)." },
      ],
      outputs: [{ name: "result", schema: t("Markdown"), description: "JSON: the matching nodes and which field matched." }],
    },
    satisfies: ["corpus-grep"],
    requires: { network: false },
  }),
);
