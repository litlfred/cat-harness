import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "subgraph-readmes",
    title: "Directory READMEs from the Knowledge Graph",
    description:
      "Write a README for every directory an instance declares, from the declaration and the files themselves: the declared title and description, the Graph Typologies, and one row per file described from the file, with 'used by' only where a diagram records it. Renders the Liquid templates in `tools/templates/readme/`, part of the tools graph, which may include one another with Jekyll-style include tags. Writes only between `<!-- kg:subgraph:begin -->` and `:end`; a README without the markers is left alone and reported. Records every missing title, missing or over-long description, absent directory and unmarked README in `test/results/subgraph-readmes.qa-results.json`.",
    install: { none: true },
    invoke: { shell: "bun run cat readme:subgraphs" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if any directory README or the QA record is stale; write nothing." },
      ],
      outputs: [
        { name: "readmes", schema: t("RepoPath"), description: "`<directory>/README.md` for each declared directory, and the QA record." },
      ],
    },
    // `upload-routes` too, and not as a courtesy: `uploads/README.md` is
    // one of the READMEs this writes and it lists EVERY file in the queue,
    // so any arrival stales it and `readme:subgraphs:check` is a blocking
    // step in `code-quality-gates.yml`. This is the mechanism that
    // discharges that obligation, whichever route placed the file.
    satisfies: ["docs-generation", "upload-routes"],
    requires: { runtime: ["bun"], network: false },
  }),
);
