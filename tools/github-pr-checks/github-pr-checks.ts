import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-checks",
    title: "Read a pull request's checks (GitHub)",
    description: "Read the check runs of one pull request and their state.",
    install: { cli: "gh" },
    invoke: { shell: "gh pr checks" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } }
      ],
      outputs: [
        { name: "checks", schema: t("Markdown"), description: "One line per check run: name, state, elapsed time, link." }
      ],
    },
    satisfies: ["prepare-merge-auto", "watch"],
        requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
