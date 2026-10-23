import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "theme-viewer",
      title: "Themes viewer",
      description:
        "Render every theme in the checkout, the platform's and each instance's declared themes, with palette, contrast and art.",
      script: "theme:viz",
      renders: ["themes"],
    }),
  ),
);
