import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "external-schemas-viewer",
      title: "External schemas viewer",
      description:
        "Render the declared external schemas, and which of this instance's modules conform to each, as one page.",
      script: "external-schemas:viz",
      renders: ["external-schema"],
    }),
  ),
);
