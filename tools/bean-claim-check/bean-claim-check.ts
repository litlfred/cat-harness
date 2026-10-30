/**
 * The Tool node for the drain's check-then-claim step.
 *
 * Bean `n7x7`, skill `bean-drain` step 2. The measured case is f1e1 on
 * 2026-10-24: agy opened the tools layer's PR #686 at 07:47:35Z
 * (https://github.com/litlfred/cat-harness-tools/pull/686), a cloud thread
 * made its first commit at 07:50:08Z and opened #688, and neither had claimed.
 * Both bean copies said `in-progress` since 2026-10-16 with no newer commit, so
 * a status check would have said nothing. The open PR said everything, which is
 * why this tool calls `open-work-lookup` before it claims.
 *
 * Why not `beans:claim`: `claimOnBranchStore` writes the one copy this checkout
 * points at, and reads status, not activity. This tool keeps its race safety
 * (re-read after a rejected push, never force) and adds the activity reads and
 * the second copy. When the bean store is one copy again, this becomes a thin
 * wrapper over `beans:claim` plus the lookup.
 *
 * @module tools/bean-claim-check
 */

import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "bean-claim-check",
    title: "Check a bean is free, then claim it on every copy",
    description:
      "For one bean: fetch every bean copy, read the last three commits on its file, skip it if another agent committed within the window or its last note is a claim, look for an open PR naming it in every listed repository, and only then set it in-progress with a dated claim note as a plain commit on every copy. A rejected push is fetched, rebased and re-checked, never forced.",
    install: { none: true },
    invoke: {
      inProcess: { module: "scripts/bean-claim-check.ts" },
      shell: "bun run cat beans:claim-check",
    },
    io: {
      inputs: [
        { name: "id", schema: t("BeanId"), required: true, arg: { positional: 0 }, description: "The bean, full or short id." },
        { name: "copy", schema: t("RepoPath"), required: false, repeated: true, arg: { flag: "--copy" }, description: "A local checkout of a bean copy. Repeat once per copy. Defaults to the current checkout." },
        { name: "repo", schema: t("RepoFullName"), required: false, repeated: true, arg: { flag: "--repo" }, description: "A repository whose open PRs are searched for the id. Repeat. Defaults to the copies' repositories." },
        { name: "minePr", schema: t("Url"), required: false, repeated: true, arg: { flag: "--mine-pr" }, description: "The link of an open PR that is the caller's own, when resuming a bean it already holds. Every cloud thread's PR has the same author, so without this any open PR naming the bean is a skip." },
        { name: "as", schema: t("Slug"), required: false, arg: { flag: "--as" }, description: "Which agent is asking, by its name in the agents table. Defaults to `cloud`." },
        { name: "session", schema: t("Url"), required: false, arg: { flag: "--session" }, description: "The caller's session link, matched against the `Claude-Session:` trailer so a sibling thread of the same agent is told apart. Defaults to $CLAUDE_SESSION_URL." },
        { name: "agents", schema: t("RepoPath"), required: false, arg: { flag: "--agents" }, description: "A JSON file of agents and their commit authors, as in the skill's input schema." },
        { name: "window", schema: t("TimeWindow"), required: false, arg: { flag: "--window" }, description: "Defaults to 24h." },
        { name: "dryRun", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Check only; report `would-claim` and write nothing." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit `definitions.claimCheck` as JSON." },
      ],
      outputs: [
        {
          name: "check",
          schema: t("Markdown"),
          description:
            "One of claimed, would-claim, skip-recent-commit, skip-claim-note, skip-open-pr, skip-closed or unknown, with the evidence per copy and the open PRs found. Exit 0 for claimed or would-claim, 1 for a skip, 2 for unknown. Unknown is never reported as free. With --json, `definitions.claimCheck` of schemas/skills/bean-drain/output.schema.json.",
        },
      ],
    },
    satisfies: ["bean-coordination"],
    requires: { runtime: ["bun"], network: true },
    remedies: [
      { host: "github.com", none: "With no fetch or push, nothing is claimed and the state is unknown. Claim by hand per the skill once the network is back." },
      { host: "api.github.com", none: "With no PR listing the open-work step cannot run, so the state is unknown rather than free. A session with the GitHub MCP server can list open PRs with `list_pull_requests` and search them for the id by hand." },
    ],
    selection: {
      when: "Before any work on a bean, when more than one agent may be draining the same store.",
      limits:
        "It sees commits and open PRs, not an agent's intent: an agent that works without committing or opening a PR is invisible until it does. One bean per call. `beans:claim` is the right claim when the store has one copy and no other agents drain it.",
      cost: "One fetch and one push per copy, and one paged GitHub REST listing of open PRs per repository.",
    },
  }),
);
