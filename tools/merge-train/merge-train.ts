import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The merge steward's three commands — bean `blgm` ──────────────────
//
// Owner-approved 2026-10-02, replacing the steward's scratch scripts. Each
// satisfies `merge-conflict-patterns` because each reads its declaration
// (what is generated) and none adds a second one. The merge-queue skill
// being written on the merge-pipeline epic is the one they serve; when it
// lands, it joins `satisfies`.
export default toolFactory((t) =>
  defineTool({
    id: "merge-train",
    title: "Merge train",
    description:
      "Build a train branch from a base SHA: merge each member (a PR number or branch) with `merge-base.ts --no-regen`, refusing — never hand-resolving — a member whose conflicts no declared pattern covers; then one `bun run cat regen`, `check:l1-complete --write`, every check an instance declares `afterMerge` (its declared writer run when red), and `kg:audit:all:check`; then merge `origin/main`, taking main's side of generated conflicts and regenerating once more. Emits a `merge-train-report/v1` JSON report. Never pushes, opens or merges a PR.",
    install: { none: true },
    invoke: { shell: "bun run cat merge:train" },
    io: {
      inputs: [
        { name: "base", schema: t("CommitSha"), required: true, arg: { flag: "--base" }, description: "The commit the train branch starts from." },
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--branch" }, description: "The train branch to create; default `merge-train/<base>-<time>`." },
        { name: "dry-run", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Simulate with `git merge-tree`: classify each member's conflicts against the simulated train and change nothing." },
        { name: "no-main", schema: t("Flag"), required: false, arg: { flag: "--no-main" }, description: "Skip merging `origin/main` into the train." },
        { name: "members", schema: t("Branch"), required: true, repeated: true, arg: { positional: 0 }, description: "PR numbers or branches, in train order. On the command line a PR may be pinned to the head CI saw as `N:<sha>`." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "`merge-train-report/v1` on stdout: members merged, refused with reasons and conflicted paths, the checks run, main's merge, and the head. Exit 0 built, 1 needs a person, 2 could not start." }],
    },
    satisfies: ["merge-conflict-patterns", "prepare-merge"],
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "github.com", none: "It composes from the remote's open pull requests." }],
    selection: {
      when: "The steward has chosen a batch of green, mutually independent PRs (see merge-overlap) and wants one branch that carries them all, regenerated once.",
      limits: "Each member's merge commit is not proved on its own; the train is proved at its end by one regen. A refused member is left out and reported — handing it back to its owner is the steward's step. It does not push: CI on the train runs only after the steward pushes it.",
      cost: "One `merge-base.ts` per member (seconds each), then one regen (5-13 min measured 2026-10-02) and the three checks; a second regen if main had generated conflicts.",
    },
  }),
);
