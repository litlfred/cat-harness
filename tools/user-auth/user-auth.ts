import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "user-auth",
    title: "Who is asking, and what may they do",
    description:
      "User authentication and authorization (issue #1207). Asks GitHub for the caller's login and repository role, maps the role to a gateway actor, and answers from the ODRL policies — for an action, or for a BPMN step. Always states that GitHub's role covers the whole repository, not a sub-graph, node or query path.",
    install: bundled,
    invoke: inProcess("src/tools/auth.ts", "auth_whoami"),
    io: {
      inputs: [
        { name: "actor", schema: t("Text"), required: false, description: "A declared actor the caller is acting as." },
        { name: "action", schema: t("Text"), required: false, description: "An ODRL action to ask about, e.g. content-authoring." },
        { name: "process", schema: t("Text"), required: false, description: "Process id, to scope the question or check a task." },
        { name: "task", schema: t("Text"), required: false, description: "Node id; with process, runs the task-authorization check." },
        { name: "role", schema: t("Text"), required: false, description: "The role the lane binds." },
        { name: "target", schema: t("Text"), required: false, description: "The content acted on." },
      ],
      outputs: [{ name: "answer", schema: t("Markdown"), description: "Identity, GitHub role, ODRL grants and decisions, and what GitHub's grain cannot express." }],
    },
    satisfies: ["task-authorization", "deployment-auth"],
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "The caller's GitHub role is GitHub's answer; without it the role is unknown and nothing is granted on it." }],
  }),
);
