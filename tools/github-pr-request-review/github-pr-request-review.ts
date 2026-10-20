import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-request-review",
    title: "Request review on a pull request (GitHub)",
    description: "Ask one or more accounts to review a pull request. Adds to the reviewers already requested.",
    install: { cli: "gh" },
    invoke: { shell: "gh pr edit" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } },
        { name: "reviewers", schema: t("Login"), required: true, repeated: true, arg: { flag: "--add-reviewer" } }
      ],
      outputs: [
        { name: "url", schema: t("Url"), description: "The pull request.", render: { as: "url", reason: "a reader follows it to the proposal; the scheme is checked before it reaches an href" } }
      ],
    },
    satisfies: ["pickup", "prepare-merge-auto"],
        requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
