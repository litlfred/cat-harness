import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Judge a tree once, on any runner, and say so by digest ─────────────
//
// Owner, 2026-10-16: "github should be one Tool of
// several". `gates` RUNS the checks in one checkout; this judges a whole
// composed TREE head-against-base and leaves a verdict record anyone can
// find again by the tree's digest. The digest is the index lock's fixity
// digests (each instance's declaration sha256 and directory treeDigests,
// as mount-from-lock checks them), the caller's entry replaced by its PR
// tree (`git rev-parse HEAD^{tree}`), and the judging-scripts version. Same
// bytes, same digest, whichever runner computed it: an agent container, a
// local machine, or GitHub Actions. GitHub is where a verdict is PUBLISHED
// (the commit status `judge-tree`), not where it must be reached.
//
// The implementation is the tools layer's `scripts/judge-tree.ts`; the
// record's shape is its `schemas/verdict-record.schema.json`
// (`cat-harness-verdict-record/v1`).
export default toolFactory((t) =>
  defineTool({
    id: "judge-tree",
    title: "Judge a tree and record the verdict by digest",
    description:
      "Run the layer PR-check gates and tests on a composed tree (head) and on its base, or reuse a stored verdict whose digest is the base tree's, compare them with the layer-pr-checks compare scripts, and write a verdict record: {treeDigest, runner {kind agent|github-actions|local, id}, startedAt, finishedAt, gates [{name, exit, seconds, skipped?}], tests {total, failed, new}, verdict green|red|unknown}. With a token it publishes the verdict as the commit status `judge-tree`; `check` answers whether any runner judged a digest green; `sample` re-runs a seeded few gates of a record.",
    install: { none: true },
    invoke: { shell: "bun run cat judge:tree judge" },
    io: {
      inputs: [
        { name: "lock", schema: t("RepoPath"), required: true, arg: { flag: "--lock" }, description: "The index.lock.json whose fixity digests name every instance but the caller." },
        { name: "caller", schema: t("RepoFullName"), required: true, arg: { flag: "--caller" }, description: "The caller as owner/name (or its lock instance): the entry replaced by its PR tree. Every runner must name it the same way." },
        { name: "caller-dir", schema: t("RepoPath"), required: false, arg: { flag: "--caller-dir" }, description: "The caller's git checkout; its HEAD^{tree} (or --sha's) is the PR tree." },
        { name: "sha", schema: t("CommitSha"), required: false, arg: { flag: "--sha" }, description: "The head commit: whose tree is read from --caller-dir, and where the status is published." },
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "The mounted index with the caller swapped in, where run-gates.py runs." },
        { name: "instance", schema: t("InstanceId"), required: false, arg: { flag: "--instance" }, description: "The own instance(s) run-gates.py judges; repeatable." },
        { name: "base-verdict", schema: t("RepoPath"), required: false, arg: { flag: "--base-verdict" }, description: "A stored verdict record standing in for the base run; refused unless its treeDigest is the base tree's (--base-tree)." },
        { name: "base-root", schema: t("RepoPath"), required: false, arg: { flag: "--base-root" }, description: "A mounted base tree to run the gates on instead." },
        { name: "test-path", schema: t("RepoPath"), required: false, arg: { flag: "--test-path" }, description: "What `bun test` runs on each side; none means no tests." },
        { name: "publish", schema: t("Flag"), required: false, arg: { flag: "--publish" }, description: "Post the commit status `judge-tree` when GITHUB_TOKEN/GH_TOKEN is set; without one, the record file is the verdict." },
      ],
      outputs: [
        { name: "record", schema: t("RepoPath"), description: "The verdict record, `<records-dir>/<treeDigest>.json` unless --out names it; valid against the tools layer's `schemas/verdict-record.schema.json`. Three exit codes: 0 green, 1 red, 2 COULD NOT DETERMINE (no judging scripts, a stored base verdict for another tree, a compare script that crashed, or no gate ran). 2 is never green, and neither is a verdict for another digest." },
      ],
    },
    satisfies: ["platform-gates", "prepare-merge"],
    requires: { runtime: ["bun", "python3", "git"], network: false },
    remedies: [{ host: "api.github.com", none: "Publishing and `check` against statuses need the API; without it the record file is the verdict and `check --records-dir` reads records instead." }],
    selection: {
      when:
        "When a PR's tree must be judged and any runner can do it: an agent before pushing, a developer locally, or CI. Then `verdict-check.yml` passes the PR on the published verdict instead of re-running ~300 gates per side.",
      limits:
        "The digest trusts the lock's fixity digests for every instance but the caller, so a run that takes lower layers at main instead of the lock judges a tree the digest does not name. A verdict answers only for its exact digest: a change to the judging scripts is a new digest and needs a new verdict.",
      cost: "That of layer-pr-checks for one side, or two when no stored base verdict exists: gates dominate (minutes to tens of minutes). `digest` and `check` are one hash and at most one HTTP request.",
    },
  }),
);
