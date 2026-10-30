import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "processes-viewer",
      title: "Processes viewer",
      description:
        "Render the declared BPMN processes as an index page and one page per diagram.",
      script: "processes:viz",
      renders: ["processes"],
    }),
  ),
);
