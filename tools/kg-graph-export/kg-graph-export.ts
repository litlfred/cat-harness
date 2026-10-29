import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The export itself, which five nodes claimed and none performed ────
//
// `kg-export` was already `satisfies`-covered FIVE times over —
// `pages-publish`, `serve-rendering` and the three schema carriers below —
// and not one of them runs an export. `pages-publish` publishes a built
// directory; `serve-rendering` serves one; the carriers regenerate JSON
// Schemas through `kg:schema`. The command that builds the graph rendering
// in the first place, `bun run cat kg:export`, was reachable from no node.
//
// That is worth a comment rather than a silent addition, because
// `check:tools` reported this skill as covered throughout and was right to:
// coverage is a relation between a Tool and a SKILL, and a skill can be
// satisfied by neighbours of its mechanism. Found 2026-09-20 while working
// bean `d308`, whose whole premise is that code with no node is invisible
// even when its skill looks served. This node is that premise's first
// instance in the graph rather than in a bean.
export default toolFactory((t) =>
  defineTool({
    id: "kg-graph-export",
    title: "Knowledge-graph export",
    description:
      "Dump this instance's knowledge graph — skills, BPMN activities and their lanes, roles, actors, directories — to one JSON-LD document for publication. The export is data; something else draws it.",
    install: { none: true },
    invoke: { shell: "bun run cat kg:export" },
    io: {
      inputs: [
        // The script reads `KG_BASE_URL` when the flag is absent, and falls
        // back to `harness.json`'s `canonicalUrl`. Declared as the flag
        // because that is the arm a caller controls; the other two are
        // defaults, not inputs.
        { name: "baseUrl", schema: t("Url"), required: false, arg: { flag: "--base-url" }, description: "Publication base the node IRIs are minted against; a preview passes its own." },
        // input-site: inert #5eaba3b5 — prose naming the directory, in a message or a description
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Where to write; defaults to `_kg/<stub>.jsonld`, which is build output and gitignored." },
      ],
      outputs: [
        { name: "graph", schema: t("RepoPath"), description: "The written JSON-LD document." },
        // A source that cannot be read is reported and counted, never
        // dropped — the script's own three-state rule, and it belongs in the
        // contract rather than only in its header. An export that quietly
        // omits half a corpus looks well-formed to a consumer, which is bean
        // `dh4f`.
        { name: "problems", schema: t("Text"), description: "Sources that could not be read, counted rather than silently omitted." },
      ],
    },
    // Bean `n350`: the Tool that publishes bootstrap's graph, so it also
    // satisfies the two skills that govern that graph. They live in
    // `bootstrap/skills/`; `check-tools` resolves them across instances.
    satisfies: ["kg-export", "bootstrap-graph-emission", "bootstrap-graph-publication"],
    // Not an alternative to its siblings, and `deriveAlternatives` agrees:
    // the four sharing this skill are COMPLEMENTARY steps — export, then
    // publish, then serve — with different I/O, not four ways to do one
    // thing. A rule keyed on "shares a skill" alone would pair them.
    requires: { runtime: ["bun"], network: false },
  }),
);
