import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "uploads-viewer",
      title: "Uploads viewer",
      description:
        "Render each declared uploads directory's intakes as a page per subject instance.",
      script: "uploads:viz",
      renders: ["uploads"],
    }),
  ),
);
