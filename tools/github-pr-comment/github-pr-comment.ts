import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-comment",
    title: "Comment on a pull request (GitHub)",
    description: "Add a comment to one pull request. The comment is read from stdin, never from the command line.",
    install: { cli: "gh" },
    invoke: { shell: "gh pr comment --body-file -" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } },
        { name: "body", schema: t("Markdown"), required: true, description: "The comment.", arg: { stdin: true } }
      ],
      outputs: [
        { name: "url", schema: t("Url"), description: "The comment created, as the forge CLI prints it.", render: { as: "url", reason: "a reader follows it to the comment; the scheme is checked before it reaches an href" } }
      ],
    },
    satisfies: ["prepare-merge-auto", "coordinate"],
    selection: {
      when: "The change proposals live on GitHub — the checkout's remote is a GitHub project.",
      limits: "GitHub only. For a GitLab project use `gitlab-mr-comment`.",
      cost: "`gh`, authenticated (`gh auth login` or `GH_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
