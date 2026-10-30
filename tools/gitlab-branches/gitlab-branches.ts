import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// `:id` is glab's own placeholder for the current checkout's project. No
// Tool input reaches it.

export default toolFactory((t) =>
  defineTool({
    id: "gitlab-branches",
    title: "List branches (GitLab)",
    description: "List the branch names of the current checkout's GitLab project, as the forge reports them.",
    install: { cli: "glab" },
    invoke: { shell: "glab api --paginate projects/:id/repository/branches" },
    io: {
      inputs: [],
      outputs: [
        { name: "branches", schema: t("Markdown"), description: "The branches as the API returns them, one JSON object each." }
      ],
    },
    satisfies: ["coordinate"],
    selection: {
      when: "The change proposals live on GitLab — the checkout's remote is a GitLab project.",
      limits: "GitLab only. For a GitHub repository use `github-branches`.",
      cost: "`glab`, authenticated (`glab auth login` or `GITLAB_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "gitlab.com", none: "No declared Tool reaches the GitLab API another way. A self-managed GitLab answers on its own host, which this record cannot name; `glab` reaches it once `glab auth login --hostname` has been run for that host." }],
  }),
);
