import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// `glab mr update --reviewer NAME` replaces the reviewers; `+NAME` adds one.
// A Tool input cannot carry that prefix, so the command is a script key: the
// script (in the tools layer) adds it after each name parses as a
// GitLabUsername (bean folio-assistant-4dbr, owner 2026-10-24 "Fill both gaps").

export default toolFactory((t) =>
  defineTool({
    id: "gitlab-mr-request-review",
    title: "Request review on a merge request (GitLab)",
    description: "Ask one or more users to review a merge request. Adds to the reviewers already requested.",
    install: { cli: "glab" },
    invoke: { shell: "bun run cat gitlab:request-review" },
    io: {
      inputs: [
        { name: "number", schema: t("ChangeProposalNumber"), required: false, description: "Absent: the merge request of the current branch.", arg: { positional: 0 } },
        { name: "reviewers", schema: t("GitLabUsername"), required: true, repeated: true, description: "GitLab usernames, without the @.", arg: { positional: 1 } }
      ],
      outputs: [],
    },
    satisfies: ["pickup", "prepare-merge-auto"],
    selection: {
      when: "The change proposals live on GitLab — the checkout's remote is a GitLab project.",
      limits: "GitLab only. For a GitHub repository use `github-pr-request-review`.",
      cost: "`glab`, authenticated (`glab auth login` or `GITLAB_TOKEN`), and one API round trip per call.",
    },
    requires: { network: true },
    remedies: [{ host: "gitlab.com", none: "No declared Tool reaches the GitLab API another way. A self-managed GitLab answers on its own host, which this record cannot name; `glab` reaches it once `glab auth login --hostname` has been run for that host." }],
  }),
);
