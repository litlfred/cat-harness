import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "bean-query",
    title: "Query the beans knowledge graph",
    description:
      "Query the beans knowledge graph using named graph analytics or arbitrary SPARQL 1.1.",
    install: bundled,
    invoke: inProcess("src/tools/beans-prime.ts", "bean_query"),
    io: {
      inputs: [
        { name: "named", schema: t("Text"), required: false, description: "Pre-defined named query (e.g. safe_drain_candidates, actionable_leaves)." },
        { name: "sparql", schema: t("Text"), required: false, description: "Arbitrary SPARQL 1.1 SELECT query over the bean store." },
        { name: "format", schema: t("Text"), required: false, description: "Output format: table, json, or ids." },
      ],
      outputs: [{ name: "result", schema: t("Markdown"), description: "Query results formatted as table, JSON, or IDs." }],
    },
    satisfies: ["todo-manager", "bean-coordination"],
    requires: { network: false },
  }),
);
