import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "workflow-start",
    title: "Start a process instance",
    description:
      "Open an instance of a process for a subject. Idempotent: an existing instance for the same subject is returned rather than duplicated.",
    install: bundled,
    invoke: inProcess("src/tools/workflow.ts", "workflow_start"),
    io: {
      inputs: [
        { name: "process", schema: t("ProcessId"), required: true, arg: { positional: 0 } },
        { name: "subject", schema: t("Text"), required: true, description: "What the instance is about — a block label, a release, a bean." },
        { name: "bean", schema: t("BeanId"), required: false, arg: { flag: "--bean" }, description: "The work-plan item this instance carries out." },
      ],
      outputs: [{ name: "instance", schema: t("InstanceId"), description: "The instance opened or found." }],
    },
    satisfies: ["process-state", "bean-coordination"],
    requires: { network: false },
  }),
);
