import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "folio-viewer",
      title: "Folio viewer",
      description:
        "Render each declared folio directory as a browsable page over its published index.",
      script: "folio:viz",
      renders: ["folio"],
    }),
  ),
);
