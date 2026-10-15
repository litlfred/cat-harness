import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The two JSON-LD artefacts a consumer dereferences ─────────────────
//
// Both are `maintains` nodes in the same sense as the three zod carriers
// below, and they were missing for the same reason those were: the relation
// between a source module and the public document it keeps true lived in a
// `package.json` script and nowhere a tool could read it.
//
// They are separate nodes because they answer different questions. A
// consumer that meets `folio:Actor` needs the VOCABULARY to learn what it
// means; a consumer parsing a block needs the CONTEXT to expand its keys.
// One document cannot be both. The vocabulary is one document per layer
// (`<stub>/ns`); the all-layers union at `ns/vocabulary.jsonld` was retired
// on 2026-09-30 (owner, bean `xsqm`), and bootstrap's layer document is
// bootstrap-tools' to write.
export default toolFactory((t) =>
  defineTool({
    id: "ns-vocabulary",
    title: "Namespace vocabulary",
    description:
      "Emit the folio namespace as a document that dereferences — one node per class and property, each with an @id, a type, a label and a definition, so a consumer holding only the JSON-LD can resolve any term it meets.",
    install: { none: true },
    invoke: { shell: "bun run cat ns:export" },
    io: {
      inputs: [
        { name: "layer", schema: t("NamespaceLayer"), required: false, arg: { flag: "--layer" }, description: "Emit one namespace layer — `bootstrap` for the layer that must resolve before anything else does." },
        // input-site: inert #13384224 — prose naming the directory, in a message or a description
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Where to write; defaults under `_kg/`, which is build output." },
      ],
      outputs: [{ name: "vocabulary", schema: t("RepoPath"), description: "The written namespace document." }],
    },
    satisfies: ["kg-export"],
    // The PRIMARY job is the graph documenting itself — the owner's
    // correction, 2026-09-19, and the order matters. That `--check` also lets
    // CI assert every minted term is defined is a second use of one artefact,
    // not the reason it exists. Stated here because a node whose description
    // led with "conformance test" would invert that and invite someone to
    // drop the document once CI was satisfied another way.
    maintains: [
      { source: "schemas/vocabulary.ts", artefact: "cat-harness/ns.jsonld", format: "json-ld" },
    ],
    requires: { runtime: ["bun"], network: false },
  }),
);
