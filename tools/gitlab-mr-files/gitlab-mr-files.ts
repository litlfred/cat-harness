import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// `glab mr diff` has no `--name-only`, so the command is a script key: the
// script (in the tools layer) runs `glab mr diff --raw` and reads the paths
// out of the diff (bean folio-assistant-4dbr, owner 2026-10-24 "Fill both gaps").

export default toolFactory((t) =>
  defineTool({
    id: "gitlab-mr-files",
    title: "List a merge request's changed files (GitLab)",
    description: "List the paths one merge request changes.",
    install: { cli: "glab" },
    invoke: { shell: "bun run cat gitlab:mr-files" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the change proposal of the current branch.", arg: { positional: 0 } }
      ],
      outputs: [
        { name: "files", schema: t("Markdown"), description: "One repository path per line." }
      ],
    },
    satisfies: ["coordinate"],
    selection: {
      when: "The change proposals live on GitLab — the checkout's remote is a GitLab project.",
      limits: "GitLab only. For a GitHub repository use `github-pr-files`. The paths are read from the raw diff, so a file GitLab leaves out of a too-large diff is not listed.",
      cost: "`glab`, authenticated (`glab auth login` or `GITLAB_TOKEN`), and one API round trip per call; the whole diff is downloaded.",
    },
    requires: { network: true },
    remedies: [{ host: "gitlab.com", none: "No declared Tool reaches the GitLab API another way. A self-managed GitLab answers on its own host, which this record cannot name; `glab` reaches it once `glab auth login --hostname` has been run for that host." }],
  }),
);
