import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "workflow-next",
    title: "What is enabled now",
    description: "The activities an instance may work right now, each with the lane that owns it and the skill that implements it.",
    install: bundled,
    invoke: inProcess("src/tools/workflow.ts", "workflow_next"),
    io: {
      inputs: [{ name: "instance", schema: t("InstanceId"), required: true, arg: { positional: 0 } }],
      outputs: [{ name: "enabled", schema: t("Markdown"), description: "Activity, lane and skill for each enabled step." }],
    },
    satisfies: ["process-state"],
    requires: { network: false },
  }),
);
