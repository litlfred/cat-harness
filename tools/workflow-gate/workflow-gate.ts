import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "workflow-gate",
    title: "May this step be performed?",
    description:
      "Ask before doing work a strict process governs. The content-agnostic processes refuse a step that is not enabled; the per-content-type ones advise.",
    install: bundled,
    invoke: inProcess("src/tools/workflow.ts", "workflow_gate"),
    io: {
      inputs: [
        { name: "instance", schema: t("InstanceId"), required: true, arg: { positional: 0 } },
        { name: "activity", schema: t("NodeId"), required: true, arg: { positional: 1 } },
        { name: "actor", schema: t("Text"), required: false, description: "Who you say would perform it. Recorded only: strict mode authorizes the principal GitHub vouches for (issue #1207)." },
        { name: "target", schema: t("Text"), required: false, description: "The content it would act on, for the access check." },
      ],
      outputs: [{ name: "verdict", schema: t("Markdown"), description: "Permitted, refused with the reason, or advisory — and the task-authorization verdict." }],
    },
    satisfies: ["process-state"],
    requires: { network: false },
  }),
);
