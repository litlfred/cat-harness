import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "lsi-viewer",
      title: "Latent semantic index viewer",
      description:
        "Render every committed LSI index — dimensions as two poles, narrow-dimension and near-duplicate findings — and which declared prose graphs still need one.",
      script: "lsi:viz",
      renders: ["qa"],
    }),
  ),
);
