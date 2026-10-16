import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "translation-status-viewer",
      title: "Translation status viewer",
      description:
        "Render the translation status of every declared translation-sources directory, per locale, as one page.",
      script: "translation:status",
      renders: ["translation-sources"],
    }),
  ),
);
