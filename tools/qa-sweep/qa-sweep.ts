import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The QA sweep: one node over a checker REGISTRY ─────────────────────
//
// 27 files in this group and 2 entry points, which is the shape `d308` argues
// for rather than against: the group is already almost entirely
// library-behind-one-command. So this is one node over `qa-sweep`, and the
// checker registry underneath is untouched.
//
// **`qa-checker-discovery` is the extension point, not the entry point.** A
// new criterion is added by registering a checker, never by adding a Tool —
// a node per checker would put twenty-odd near-identical entries in the graph
// and still not describe how a criterion gets registered.
//
// And unlike `latex-authoring` and `proof-verification` above, `content-test`'s
// contract IS satisfiable: it requires `targetPath`, and `qa-sweep` takes a
// content root as its first positional. Found by running it — `usage:
// qa-sweep.ts <content-root> …`, exit 2 — rather than by reading for it.
export default toolFactory((t) =>
  defineTool({
    id: "qa-sweep",
    title: "QA sweep",
    description:
      "Run every registered criterion over the blocks under a path and write a per-block QA sidecar. A sidecar rather than a console report, because a printed verdict cannot distinguish \"never checked\" from \"checked and clean\".",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/pipeline/qa-sweep.ts" },
    io: {
      inputs: [
        { name: "targetPath", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The content root to sweep. Absent, the command exits 2 with its usage — could-not-determine, not a clean sweep." },
        { name: "dryRun", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Report what would change without writing sidecars." },
        { name: "ci", schema: t("Flag"), required: false, arg: { flag: "--ci" }, description: "Fail on a finding rather than recording it." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" } },
        // `--only ID,ID` and `--axis NAME,NAME` are DELIBERATELY not declared.
        // Both take a comma-separated list inside one argv word, and the type
        // vocabulary has no honest shape for that: `Slug` forbids the comma,
        // `repeated` would claim the flag may be given more than once when the
        // script parses one list, and `Text` is refused on argv for exactly the
        // reason it would be wrong here. Adding a type to fit a flag rather than
        // to describe a value is how the vocabulary stops meaning anything, so
        // these two stay undeclared and documented rather than mistyped.
      ],
      outputs: [
        { name: "sidecars", schema: t("RepoPath"), description: "One `<block>.qa.json` per block, committed beside its subject." },
      ],
    },
    satisfies: ["content-test"],
    requires: { runtime: ["bun"], network: false },
  }),
);
