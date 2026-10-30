import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Where each harness got to in its initialization, and how healthy it is ──
//
// Bean `supn`, boxes 1 and 2. Owner, 2026-10-24 (card A, "Work out at publish
// time"): the deploy runs bootstrap's read-only setup check on every harness
// and publishes one state file each, so nothing is committed and nothing goes
// stale. The steps are bootstrap-tools' `initSteps`, the tool half of
// `complete-initialization.bpmn`, so this Tool satisfies bootstrap's
// `initialization-steps` skill rather than keeping a second list of steps.
export default toolFactory((t) =>
  defineTool({
    id: "harness-state",
    title: "Per-harness setup position and health",
    description:
      "For every harness in the checkout, run bootstrap's setup check without performing anything or touching the network, and write one `folio-harness-state/v1` file: each step in its state, the first step not done (its position) with what to do next, and health badges that are the harness's own (setup steps; the instance's committed health report, unknown without one). A recommendation is said, never acted on.",
    install: { none: true },
    invoke: { shell: "bun run cat harness:state" },
    io: {
      inputs: [
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Where `<harness>.json` and `index.json` go. The deploy passes `./_site/assets/harnesses`. Absent: print the states and write nothing." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Print the states as JSON and write nothing." },
      ],
      outputs: [
        { name: "states", schema: t("RepoPath"), description: "One `<harness>.json` per harness and an `index.json` listing them with their positions." },
        { name: "report", schema: t("Text"), description: "One line per harness: its position, the next step, and its badges." },
      ],
    },
    satisfies: ["initialization-steps"],
    selection: {
      when: "A page or an agent needs to know, per harness, how far its setup got and what to do next, or whether the harness itself is healthy, as against its repository.",
      limits:
        "Offline and dry-run: a step that needs the network (documents at their IRIs, Pages live) is could-not-determine, never done. In an index that mounts an instance in part, every step looking for a file in it is could-not-determine. Built at deploy and never committed, so it describes the tree the deploy published.",
      cost: "About 6 seconds for 11 harnesses. Nothing to install, no network.",
    },
    requires: { runtime: ["bun"], network: false },
  }),
);
