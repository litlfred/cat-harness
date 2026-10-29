import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Task_Validate, served by TWO Tools that are not alternatives ──────
//
// Groups 6 (`oait`) and 10 (`9x17`) of `d308` both bind `authoring-a-paper ·
// Task_Validate` and both satisfy `content-validate`. Both beans asked for
// an alternative relation and `selection` between them "since they share a
// task", and **that is the inference `deriveAlternatives` refuses**:
// sharing a skill does not make two Tools substitutable, measured across 12
// of this instance's 25 multi-Tool skills. It also needs the same I/O.
//
// These two are the ordinary case, not the exception. One asks whether the
// content GRAPH is well-formed and well-ordered; the other asks whether a
// block is valid against its schema. A folio runs both, in that order, and
// neither answer substitutes for the other — so pairing them would oblige
// `selection` prose comparing two things that do not compete, and an
// author made to write it writes noise. Their I/O differs, so none is
// derived, and both beans were corrected rather than satisfied.
export default toolFactory((t) =>
  defineTool({
    id: "content-graph-build",
    title: "Content graph",
    description:
      "Build the content graph under a path and report its edges, separated into the EDITORIAL relation an author maintains and the FORMAL one derived from Lean. Reading the two as one number is how the editorial signal gets overwritten.",
    install: { none: true },
    invoke: { shell: "bun run cat content:graph" },
    io: {
      inputs: [
        // Optional, because the script defaults to `<repo>/content` — and
        // `check-tools` matches a contract by PORT NAME rather than by
        // required-ness, so declaring it optional still satisfies
        // `content-validate` honestly instead of overstating the argument.
        { name: "targetPath", schema: t("RepoPath"), required: false, arg: { positional: 0 }, description: "Content root to walk; defaults to the folio's `content/`." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" } },
      ],
      outputs: [
        // STILL one `Text` port, and `Count` existing does not change that —
        // which is worth saying, because the obvious move once the type landed
        // would be to split this into two numbers.
        //
        // The reason was never only the missing type. A SHELL arm returns a
        // printed report, so `editorialEdges: Count` would overstate what the
        // invoke arm hands a caller: it would promise a parsed number where the
        // mechanism emits text. A node whose ports describe an API it does not
        // have is the same defect as a `satisfies` edge whose contract it
        // cannot receive.
        //
        // The EDITORIAL / FORMAL split survives in the description instead,
        // and it is the fact that matters: `uses[]` and `interprets` are what
        // a READER must have read, while the formal graph is machine-derived
        // from `lean.ref`. A single combined edge count would invite exactly
        // the "sync uses from the formal graph" operation that destroys the
        // signal every ordering metric is computed from — `oait` names that as
        // the one rule this group must not break.
        { name: "report", schema: t("Text"), description: "Block count, then edge counts reported separately and never summed: EDITORIAL (`uses[]`, `interprets` — author-maintained) and FORMAL (derived from `lean.ref`). The formal line distinguishes `0` from `cache ABSENT`, so an unavailable formal graph cannot be read as a graph with no formal edges." },
      ],
    },
    // NO input or output offering to populate `uses[]` from the formal graph,
    // and that absence is the point rather than an omission — `oait` names it
    // as the one rule the group must not break.
    satisfies: ["content-validate"],
    requires: { runtime: ["bun"], network: false },
  }),
);
