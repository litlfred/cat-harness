import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "state-viewer",
      title: "State graph viewer",
      description:
        "Render each declared state graph with a projection as a dashboard page: what the work plan holds, and what state it is in.",
      script: "state:visualizer",
      renders: ["beans", "bean-defs", "bean-notes", "workflow-state", "merge-queue", "session-survey", "sweep-marks", "todos", "todo-items", "todo-feedback", "boards", "board-positions", "issue-marks", "qa", "health", "attestations", "swimlane-glossary", "uploads", "code", "typologies", "validators", "qa-checkers", "block-kinds", "content-adapters", "code-list", "memory", "pipeline-plugins", "editor-checkers"],
    }),
  ),
);
