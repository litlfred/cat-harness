import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "schemas-viewer",
      title: "Schemas viewer",
      description:
        "Render each declared schema directory as a page per subject instance, over one shared data index.",
      script: "schema:viz",
      renders: ["schemas"],
    }),
  ),
);
