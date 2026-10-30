import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "tools-viewer",
      title: "Tools viewer",
      description:
        "Render this instance's Tool nodes, and the skills each satisfies, as one page.",
      script: "tools:viz",
      renders: ["tools"],
    }),
  ),
);
