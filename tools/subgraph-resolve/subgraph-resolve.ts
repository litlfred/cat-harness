import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "subgraph-resolve",
    title: "Resolve a declared subgraph's content source",
    description:
      "Say where a declared subgraph gets its content — the checkout's own directory, a declared repository branch (with its keying), or a branch family (with its prefix, key and repository) — after the instance config's `subgraphSources` override by id, and which layer answered. The same `declaredSubgraph` resolver the KG export, the publishers and the mount tool use, so a shell sees the answer they act on.",
    install: { none: true },
    invoke: { shell: "bun run cat subgraph:resolve" },
    io: {
      inputs: [
        { name: "id", schema: t("Slug"), required: false, description: "A declared directory id. Repeatable; absent with `--all`." },
        { name: "all", schema: t("Flag"), required: false, arg: { flag: "--all" }, description: "Every subgraph the checkout declares." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Machine-readable output." },
      ],
      outputs: [
        { name: "source", schema: t("Text"), description: "One line per subgraph: its source kind and location, its declarer, and `declaredIn`. Exit 1 when no instance declares the id, 2 when the declaration contradicts itself or names an undeclared branch." },
      ],
    },
    satisfies: ["directory-conventions"],
    requires: { runtime: ["bun"], network: false },
  }),
);
