import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
// It draws the instance's published graph document, which `kg:export` builds from
// its own skills, scenarios, processes, Tools and schemas — so it renders those kinds.
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "kg-viewer",
      title: "Knowledge graph viewer",
      description:
        "Render the instance's published knowledge graph as one page: facets by kind and sub-graph, search, a node's properties, its edges and back-links, and the graph's own gaps — reading the JSON-LD document at the site root rather than carrying a copy.",
      script: "kg:viewer",
      renders: ["cat-harness", "skills", "scenarios", "processes", "tools", "schemas"],
    }),
  ),
);
