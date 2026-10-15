import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The generated reference, which `docs-generation` did not reach ────
//
// `docs-generation` was already covered — by `readme-audit` and
// `readme-sync`, which maintain a README's generated SECTIONS. Neither
// generates a page of the documentation site, and the two generators that do
// were reachable from no node.
//
// That is the THIRD instance of one shape in this session: a skill satisfied
// by the neighbours of its mechanism while the mechanism stays invisible.
// `kg-export` was the first (five nodes, none performing an export) and this
// is the second and third. It is worth naming as a pattern rather than
// recording three times as a coincidence — `check:tools` answers "does this
// skill have a Tool", and nothing yet answers "is this command reachable",
// which is bean `d308`.
//
// Neither carries `maintains`, and that is a judgement not an omission. Each
// writes ONE PAGE PER SUBJECT plus an index — tens of files — and
// `maintains.artefact` is a single path. A declaration naming one page out of
// tens would be false in the specific way that is worse than absent: it would
// look like a complete provenance record.
export default toolFactory((t) =>
  defineTool({
    id: "schema-docs",
    title: "Skill contract reference",
    description:
      "Render each skill's input/output JSON Schema as a browsable Markdown reference page, with an index. The generated pages are committed so they are readable on the forge as well as on the site.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/gen-schema-docs.ts" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed pages and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "schemaReference", schema: t("RepoPath"), description: "The generated reference directory. Never hand-edited." }],
    },
    satisfies: ["docs-generation"],
    requires: { runtime: ["bun"], network: false },
  }),
);
