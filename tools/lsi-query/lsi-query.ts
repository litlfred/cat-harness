import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "lsi-query",
    title: "Latent Semantic Indexing over a prose graph",
    description:
      "Find units of a declared prose graph (a library, the skills, the beans, docs) that discuss a query in OTHER words — the vocabulary gap lexical search cannot reach. Each hit is labelled lexical+latent or latent only, and the score is a cosine in the latent space, never merged with a lexical result.",
    install: bundled,
    invoke: { ...inProcess("src/tools/lsi-query.ts", "lsi_query"), shell: "bun run cat lsi query" },
    io: {
      inputs: [
        { name: "text", schema: t("Text"), required: true, arg: { stdin: true }, description: "The query, in any words, on STDIN — free text never goes on a command line." },
        { name: "instance", schema: t("Slug"), required: false, arg: { flag: "--instance" }, description: "Instance declaring the graph, e.g. `cat-harness`." },
        { name: "graph", schema: t("Slug"), required: false, arg: { flag: "--graph" }, description: "Graph id within the instance, e.g. `library`." },
      ],
      outputs: [{ name: "report", schema: t("Markdown"), description: "Per graph: the top hits by cosine, each marked lexical+latent or latent only." }],
    },
    satisfies: ["lsi-indexing"],
    requires: { network: false },
  }),
);
