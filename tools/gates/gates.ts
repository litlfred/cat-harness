import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Running the checks CI runs ────────────────────────────────────────
//
// `tools/` is an INHERITED declaration and `.github/workflows/` is not:
// a downstream instance gets this node and none of the gates it names.
// That asymmetry is the whole business case for the node.
export default toolFactory((t) =>
  defineTool({
    id: "gates",
    title: "The platform's quality gates",
    description:
      "Run the checks CI runs, derived from the workflow rather than listed here. One Tool for all of them, not one per gate: the list is computed from `.github/workflows/code-quality-gates.yml` at call time, so it cannot drift from what CI actually enforces.",
    install: { none: true },
    invoke: { shell: "bun run cat gates" },
    io: {
      inputs: [
        { name: "all", schema: t("Flag"), required: false, arg: { flag: "--all" }, description: "Add the jobs that need a browser; the default is the fast set." },
        { name: "list", schema: t("Flag"), required: false, arg: { flag: "--list" }, description: "Print the derived gates and exit, running none." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "One line per gate, then a pass count or the failures. Three exit codes, because two cannot carry the distinction: 0 every gate passed, 1 a gate failed, 2 the gate set could NOT BE DERIVED — the workflow it reads is absent or yields nothing. A caller must not read 2 as either verdict; it matters most downstream, where this Tool is inherited and `.github/workflows/` is not." }],
    },
    // ONE node, and that is the design rather than a shortcut — bean
    // `folio-assistant-ppkm`, route B of `folio-assistant-3lbz`.
    //
    // The obvious reading of "bind the gates as Tool nodes" is one node per
    // gate. The audit that proposed route B named the cost of that itself:
    // the Tool list becomes A SECOND ANSWER to "what are the gates", free
    // to disagree with `gates.ts` the moment either changes. `gates.ts`
    // derives the list from the workflow, so 43 hand-written nodes would be
    // 43 copies of a fact that is already computed.
    //
    // Two further reasons, both measured. `Gate` carries `{ job, step,
    // command }` and NO skill binding, so each of the 43 would need an
    // invented `satisfies:` — 43 judgements, none derived from anything.
    // And route A settled the same question one bean earlier, on the
    // owner's own instruction about Zod schemas: "a Tool per Zod schema...
    // no, but there should be common patterns (single pattern?) with some
    // parameters more or less".
    //
    // Per-gate discoverability is still reachable, and the way to get it is
    // to give `Gate` a declared skill in the workflow the list is derived
    // FROM — not to hand-maintain the nodes here.
    satisfies: ["platform-gates", "prepare-merge", "continual-progress"],
    requires: { runtime: ["bun"], network: false },
    selection: {
      when:
        "Before any push, and as the answer to \"what checks this?\". It matters most where CI is not: `tools/` is an INHERITED declaration and `.github/workflows/` is not, so a downstream instance gets this Tool and none of the gates it names. #363's self-sovereign topology has no CI at all.",
      limits:
        "It runs what the workflow declares, so a check CI does not run is a check this does not run — that is the point, not a gap. The default omits the browser jobs; `--all` adds them, and `render:bpmn:check` needs Chromium.",
      cost: "The fast set is about a minute, dominated by `bun test`. `--all` adds a browser render.",
    },
  }),
);
