import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "get-graph-stats",
    title: "Content graph counts",
    description:
      "Node and edge counts for the content graph by provenance and kind, and whether each root exists. Tells 'nothing matched' from 'that population has not been built'.",
    install: bundled,
    invoke: inProcess("src/tools/graph.ts", "get_graph_stats"),
    io: {
      inputs: [{ name: "refresh", schema: t("Flag"), required: false, description: "Rebuild the index from disk first." }],
      outputs: [{ name: "stats", schema: t("Markdown"), description: "JSON: node and edge counts, by provenance and kind, per root." }],
    },
    satisfies: ["corpus-grep"],
    requires: { network: false },
  }),
);
