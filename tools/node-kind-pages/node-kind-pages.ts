import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "node-kind-pages",
      title: "Node kind pages",
      description:
        "Render a page for every node kind, every harness holding nodes of it, and every node, under /<locale>/<declaring>/<kind>/ (issue #2195).",
      script: "node-kind:pages",
      renders: ["todo-items"],
    }),
  ),
);
