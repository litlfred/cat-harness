import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The gates, on the COMBINED state — bean `nytj` ──────────────────
//
// `gates` above runs what CI runs, on THIS tree. The failure it cannot
// see is the one neither PR evaluates: green on the branch, green on the
// base, stale on the two merged. Three times on 2026-09-23.
export default toolFactory((t) =>
  defineTool({
    id: "gates-merged",
    title: "Gates on the merged tree",
    description:
      "Build this branch merged with the current base in a throwaway worktree and run the full `bun run cat gates` there — the state a merge will actually produce, which neither the branch's CI nor the base's CI evaluates. Exit 0 passes, 1 conflicts or fails, 2 could not determine (never read as clean). The working copy is never touched.",
    install: { none: true },
    invoke: { shell: "bun run cat check:merged" },
    io: {
      inputs: [
        { name: "base", schema: t("Branch"), required: false, arg: { flag: "--base" }, description: "The base branch to merge with; `main` when omitted. Fetched first." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "The gate report for the merged tree, or the conflicting paths." }],
    },
    satisfies: ["prepare-merge"],
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "github.com", none: "It merges against the remote's current base; with the remote refused, the base cannot be fetched." }],
    selection: {
      when:
        "Immediately before asking for a merge, and again if the base has moved since. Not on every push: it is the full gate set, on a second tree.",
      limits:
        "It tests the base as fetched NOW; the base can still move before the merge lands. The merge queue (`merge_group:` on the gating workflows, switched on by the owner) is what closes that last gap.",
      cost: "One full `bun run cat gates`, plus a worktree; a `bun install` only when the merge changes the lockfile.",
    },
  }),
);
