import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "workflow-complete",
    title: "Complete a step",
    description:
      "Record an enabled step as done — or supply the facts a decision gateway is computed from — and advance the instance. Refuses a step that is not enabled.",
    install: bundled,
    invoke: inProcess("src/tools/workflow.ts", "workflow_complete"),
    io: {
      inputs: [
        { name: "instance", schema: t("InstanceId"), required: true, arg: { positional: 0 } },
        { name: "node", schema: t("NodeId"), required: true, arg: { positional: 1 } },
        {
          name: "outcome",
          schema: t("NodeId"),
          required: false,
          arg: { flag: "--outcome" },
          description: "Which branch a plain gateway takes. Refused at a gateway backed by a decision table — asserting the answer would defeat the table.",
        },
        {
          name: "facts",
          schema: t("DecisionFacts"),
          required: false,
          description: "Facts a DMN table is evaluated against. Structured, so it is never a command-line word.",
        },
        { name: "actor", schema: t("Text"), required: false, description: "Who you say performed the step, written to the history. Authorization is decided on the principal GitHub vouches for, in strict mode (issue #1207)." },
        { name: "target", schema: t("Text"), required: false, description: "The content the step acted on, for the access check." },
        // Free prose, and prose is not a command-line word — see
        // `tool-types` on why `Markdown` is excluded from INJECTION_SAFE.
        { name: "note", schema: t("Markdown"), required: false, arg: { stdin: true }, description: "Appended to the instance's bean." },
      ],
      outputs: [{ name: "position", schema: t("Markdown"), description: "The instance's new position, and what is enabled next." }],
    },
    // NOT `dmn-authoring`: EVALUATING a decision table is not AUTHORING
    // one, and the skill's contract says so — it requires `decisionName` and
    // `inputVariables`, which are what you supply to write a table, not to
    // answer one. `check:tools` refuses the edge.
    satisfies: ["process-state", "bean-coordination"],
    requires: { network: false },
  }),
);
