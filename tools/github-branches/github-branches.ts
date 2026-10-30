import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// `{owner}` and `{repo}` are gh's own placeholders, filled by gh from the
// current checkout's remote. They are words gh reads, not a template this
// harness substitutes: no Tool input reaches them.

export default toolFactory((t) =>
  defineTool({
    id: "github-branches",
    title: "List branches (GitHub)",
    description: "List the branch names of the current checkout's GitHub project, as the forge reports them.",
    install: { cli: "gh" },
    invoke: { shell: "gh api --paginate --jq .[].name repos/{owner}/{repo}/branches" },
    io: {
      inputs: [],
      outputs: [
        { name: "branches", schema: t("Markdown"), description: "One branch name per line." }
      ],
    },
    satisfies: ["coordinate"],
    selection: {
      when: "The change proposals live on GitHub — the checkout's remote is a GitHub project.",
      limits: "GitHub only. For a GitLab project use `gitlab-branches`.",
      cost: "`gh`, authenticated (`gh auth login` or `GH_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
