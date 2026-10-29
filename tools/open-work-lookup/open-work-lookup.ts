/**
 * The Tool node for "does this exist anywhere reachable", bean `pomp`.
 *
 * pomp's three cases: a branch older than the claim (ask the remote), a fetch
 * in the same command as the read (separate them), and the file existing only
 * on an open PR's head, which no skill line can cover because it needs the PR
 * list. The owner said "wait" on 2026-10-22 until a second session hit case 3.
 * f1e1 on 2026-10-24 was that session, and the owner reopened pomp (choice B).
 *
 * The bean-id query is what `bean-claim-check` calls. The path and prefix
 * queries are what an agent calls before it publishes that something does
 * not exist (`issue-working`), or before it builds a module a sibling may
 * already have in flight.
 *
 * @module tools/open-work-lookup
 */

import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "open-work-lookup",
    title: "Does a path or bean exist on main or any open PR",
    description:
      "Answer whether a path, a path prefix or a bean id appears on a repository's default branch or on the head of any of its open pull requests, and where: the PR number, head branch, first commit author and creation time. A path or prefix matches files at the default branch and files each open PR changes; a bean id matches PR titles, bodies and head branch names. Repositories or PRs that could not be read are listed, so an empty answer is never mistaken for absence.",
    install: { none: true },
    invoke: {
      inProcess: { module: "scripts/open-work-lookup.ts" },
      shell: "bun run cat lookup:open-work",
    },
    io: {
      inputs: [
        { name: "path", schema: t("RepoPath"), required: false, arg: { flag: "--path" }, description: "An exact repository path." },
        { name: "prefix", schema: t("RepoPath"), required: false, arg: { flag: "--prefix" }, description: "A directory or file-name prefix; every path under or starting with it matches." },
        { name: "bean", schema: t("BeanId"), required: false, arg: { flag: "--bean" }, description: "A bean id, full or short." },
        { name: "repo", schema: t("RepoFullName"), required: false, repeated: true, arg: { flag: "--repo" }, description: "Repositories to search. Repeat. Defaults to the current checkout's origin." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit `definitions.lookup` as JSON." },
      ],
      outputs: [
        {
          name: "lookup",
          schema: t("Markdown"),
          description:
            "One line per hit: repository, default branch or PR number, head, author, when, and what matched. Then what could not be read. Exactly one of path, prefix or bean must be given. With --json, `definitions.lookup` of schemas/skills/bean-drain/output.schema.json.",
        },
      ],
    },
    satisfies: ["bean-coordination", "issue-working"],
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool lists open PRs another way. A session with the GitHub MCP server can list them with `list_pull_requests` and read each one's files." }],
    selection: {
      when: "Before starting work that a sibling may already have in flight, and before publishing that a path or a piece of work does not exist.",
      limits:
        "Open PRs only, not unpushed local branches or closed PRs. It uses the GitHub REST API, not GraphQL, because cloud sessions are refused GraphQL. A PR's changed-file list is capped by the API at 3000 files; a bigger PR is listed under unread rather than guessed. For the current checkout alone, `git show origin/main:<path>` in its own command is enough.",
      cost: "One paged REST listing of open PRs per repository, plus one files listing per open PR for a path or prefix query.",
    },
  }),
);
