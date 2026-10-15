import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "workflow-list",
    title: "List processes",
    description: "The BPMN processes this instance defines, and the instances currently open against them.",
    install: bundled,
    invoke: inProcess("src/tools/workflow.ts", "workflow_list"),
    io: {
      inputs: [],
      outputs: [{ name: "processes", schema: t("Markdown"), description: "Each process, its policy, and its open instances." }],
    },
    satisfies: ["process-state"],
    requires: { network: false },
  }),
);
