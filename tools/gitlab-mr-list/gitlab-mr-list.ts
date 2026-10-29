import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "gitlab-mr-list",
    title: "List merge requests (GitLab)",
    description: "List the open merge requests of the current checkout's GitLab project, optionally only those from one branch.",
    install: { cli: "glab" },
    invoke: { shell: "glab mr list" },
    io: {
      inputs: [
        { name: "branch", schema: t("Branch"), required: false, description: "Only proposals whose source branch is this.", arg: { flag: "--source-branch" } }
      ],
      outputs: [
        { name: "proposals", schema: t("Markdown"), description: "One line per open change proposal: number, title, source branch." }
      ],
    },
    satisfies: ["prepare-merge-auto", "pickup", "coordinate"],
    selection: {
      when: "The change proposals live on GitLab — the checkout's remote is a GitLab project.",
      limits: "GitLab only. For a GitHub repository use `github-pr-list`.",
      cost: "`glab`, authenticated (`glab auth login` or `GITLAB_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "gitlab.com", none: "No declared Tool reaches the GitLab API another way. A self-managed GitLab answers on its own host, which this record cannot name; `glab` reaches it once `glab auth login --hostname` has been run for that host." }],
  }),
);
