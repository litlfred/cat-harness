import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-files",
    title: "List a pull request's changed files (GitHub)",
    description: "List the paths one pull request changes.",
    install: { cli: "gh" },
    invoke: { shell: "gh pr diff --name-only" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } }
      ],
      outputs: [
        { name: "files", schema: t("Markdown"), description: "One repository path per line." }
      ],
    },
    satisfies: ["coordinate"],
        requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
