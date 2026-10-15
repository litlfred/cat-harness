import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "document-kinds-viewer",
      title: "Document kinds viewer",
      description:
        "Render each declared document-kinds directory: every kind's structure, sections and sources, one page per subject instance.",
      script: "document-kinds:viz",
      renders: ["document-kinds"],
    }),
  ),
);
