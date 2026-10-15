import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "staging-graph-viewer",
      title: "Staging-only graph viewer",
      description:
        "Render a kept-but-unpublished workspace graph as one page, for a local build or a staging preview only; a canonical deploy withholds it.",
      script: "staging-graph:viz",
    }),
  ),
);
