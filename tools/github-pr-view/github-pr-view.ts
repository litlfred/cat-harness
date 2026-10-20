import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-view",
    title: "Read a pull request (GitHub)",
    description: "Read one pull request: title, state, body, and its comments and reviews.",
    install: { cli: "gh" },
    invoke: { shell: "gh pr view --comments" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } }
      ],
      outputs: [
        { name: "proposal", schema: t("Markdown"), description: "The proposal as the forge prints it, comments included." }
      ],
    },
    satisfies: ["prepare-merge-auto", "pickup", "watch", "coordinate"],
    selection: {
      when: "The change proposals live on GitHub — the checkout's remote is a GitHub project.",
      limits: "GitHub only. For a GitLab project use `gitlab-mr-view`.",
      cost: "`gh`, authenticated (`gh auth login` or `GH_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
