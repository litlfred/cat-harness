import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "auto-docs-viewer",
      title: "Generated index pages",
      description:
        "Render index pages for the declared skills, docs and swimlane-glossary directories, one per directory.",
      script: "auto:docs",
      renders: ["skills", "docs", "swimlane-glossary", "uml"],
    }),
  ),
);
