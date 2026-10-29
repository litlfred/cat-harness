import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// Wireframes (issue #1023): `wireframe-viewport-check`, the mechanical step of `wireframe-design-review`.
// It records per-viewport pass/fail entries and never a score, because the
// `wiregen` methodology adopts the structure of its source's rating and
// refuses the arithmetic.
export default toolFactory((t) =>
  defineTool({
    id: "wireframe-check",
    title: "Wireframe check at web and mobile viewports",
    description:
      "Render each mid-fidelity wireframe candidate of one topic at a web viewport (1280x800) and a mobile viewport (390x844). For each viewport it records `script` entries for renders, no-overflow and no-placeholder, each pass or fail with a note. It writes a screenshot per viewport and a report.json carrying the use, topic and surface, and exits 1 on any fail and 2 when the candidate set is not one the use admits.",
    install: { none: true },
    invoke: { shell: "bun run cat wireframe:check" },
    io: {
      inputs: [
        // `use`, `topic` and `surface` are what `wireframe-design-review`'s
        // input contract requires (owner, 2026-10-14: the Tool takes them
        // rather than the contract being relaxed), and the script uses each.
        { name: "use", schema: t("WireframeUse"), required: true, arg: { flag: "--use" }, description: "`design` or `as-is`. Design needs at least two candidates, compared blind; as-is candidates are drawings of what renders on main, each marked `as-is` in its file name. Anything else exits 2." },
        { name: "topic", schema: t("Slug"), required: true, arg: { flag: "--topic" }, description: "Which wireframe is checked: its asset directory, docs/wireframes/<topic>/ for as-is use and docs/proposals/<topic>/wireframes/ for design use (docs/wireframes/<topic>/ is also accepted there). With no candidates, every .html in it is checked; a candidate outside it is refused." },
        { name: "surface", schema: t("SurfaceRef"), required: true, arg: { flag: "--surface" }, description: "What is drawn: a visualiser route key or a chrome name. Recorded in report.json; for as-is use it must be the topic itself or a ref docs/wireframes/index.json says the topic covers." },
        { name: "candidates", schema: t("RepoPath"), required: false, repeated: true, arg: { positional: 0 }, description: "Wireframe HTML files, all in the topic's directory. Absent: every .html there. Each must carry both a web and a mobile layout (responsive CSS or two layouts)." },
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Where screenshots and report.json go; default <the topic's directory>/checks." },
      ],
      outputs: [{ name: "report", schema: t("RepoPath"), description: "report.json: per candidate, per viewport, per criterion. The screenshots are beside it." }],
    },
    // The STEP, not the whole review: `wireframe-design-review`'s contract
    // asks for the use, topic and surface, which a renderer neither needs nor
    // can act on (check-tools: "the skill's own contract contradicts").
    satisfies: ["wireframe-viewport-check"],
    requires: { runtime: ["bun", "chromium"], network: false },
  }),
);
