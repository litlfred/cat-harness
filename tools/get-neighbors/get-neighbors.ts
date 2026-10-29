import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "get-neighbors",
    title: "Walk the content graph from one node",
    description:
      "List the nodes adjacent to one node, out (what it depends on) or in (what depends on it), to a given depth and optionally over named edge terms only. An unknown edge term is reported, never silently dropped.",
    install: bundled,
    invoke: inProcess("src/tools/graph.ts", "get_neighbors"),
    io: {
      inputs: [
        { name: "id", schema: t("Text"), required: true, description: "Node @id or authored label, e.g. `thm:main`." },
        { name: "direction", schema: t("Slug"), required: false, description: "`out` (default), `in` or `both`." },
        { name: "hops", schema: t("Count"), required: false, description: "Traversal depth, 1-6 (default 1)." },
        { name: "edges", schema: t("Text"), required: false, description: "A LIST of edge terms (uses, interprets, cites, contains, ...) to restrict to. Omit for all." },
      ],
      outputs: [{ name: "result", schema: t("Markdown"), description: "JSON: the neighbours, each with the edge path that reached it." }],
    },
    satisfies: ["corpus-grep"],
    requires: { network: false },
  }),
);
