import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "gitlab-mr-comment",
    title: "Comment on a merge request (GitLab)",
    description: "Add a comment to one merge request. The comment is read from stdin, never from the command line.",
    install: { cli: "glab" },
    invoke: { shell: "glab mr note create" },
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
      when: "The change proposals live on GitLab — the checkout's remote is a GitLab project.",
      limits: "GitLab only. For a GitHub repository use `github-pr-comment`.",
      cost: "`glab`, authenticated (`glab auth login` or `GITLAB_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "gitlab.com", none: "No declared Tool reaches the GitLab API another way. A self-managed GitLab answers on its own host, which this record cannot name; `glab` reaches it once `glab auth login --hostname` has been run for that host." }],
  }),
);
