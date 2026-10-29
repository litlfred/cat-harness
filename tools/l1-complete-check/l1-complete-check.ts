import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The L1 completeness gate, reachable at last ───────────────────────
//
// Bean `vo9d`, and the owner's answer: a **Tool node**, no npm script. This
// is the dispatch-points rule applied — `covered-is-not-reachable`
// §"Reachability is PLURAL": the question is not which caller a mechanism
// should have but what should be able to start it, and each of those is a
// trigger or a Tool.
//
// A Tool and NOT a script here, because the thing it reads is a FOLIO's
// `library/` tree and this repository carries no folio. A `check:l1-complete`
// script would land in `SCRIPT_EXEMPTIONS` as `no-folio` and never run — an
// entry point added and still unexercised, which is the cost I argued against
// for `0bzg`'s first option. A Tool node reaches downstream, where the tree
// exists.
//
// It had NO caller at all before this: an `import.meta.main`, and its only
// occurrence outside itself was a string literal in `repo-partition.ts`'s
// classification table.
  //
  // **Verified by running it, and one claim had to be walked back.** The first
  // draft of the output description below said exit 2 was what a folio-less
  // run gives. It is not: `instanceRootFor` tries the cwd's instance and then
  // FALLS BACK to the script's own, and `cat-harness` declares a `library`
  // graph of its own — so invoked from `/tmp` it still finds this instance's
  // one entry and exits 0. The exit-2 path is real and correctly written
  // (`checkAll` returns `undefined` for "no declaration anywhere", distinct
  // from `[]` for "declared and empty"), but it cannot be reached while the
  // script lives beside a declared library. What was measured here is the
  // exit-0 path over one real entry — 11 requirements, all met.
export default toolFactory((t) =>
  defineTool({
    id: "l1-complete-check",
    title: "L1 source completeness",
    description:
      "Is a `library/<bib-slug>/` entry complete as L1 source content? Each requirement is met, unmet, or NOT-DERIVABLE, so a document that cannot yield an artefact is distinguished from one that simply has not.",
    install: { none: true },
    invoke: { shell: "bun run cat check:l1-complete" },
    io: {
      inputs: [
        // Optional: with no argument it walks every entry in the declared
        // `library` graph, which is the sweep a folio wants. Naming one entry
        // is the narrow case, not the default.
        { name: "targetPath", schema: t("RepoPath"), required: false, arg: { positional: 0 }, description: "One `library/<bib-slug>/` entry. Absent, every entry the declared `library` graph holds." },
      ],
      outputs: [
        { name: "report", schema: t("Text"), description: "Per requirement: met, unmet, or `not-derivable` — the third distinguishes a document that CANNOT yield an artefact from one that simply has not. Exit 2 means no `library` graph is declared anywhere, which the script states as \"This is NOT a pass. Treat it as unknown.\"" },
      ],
    },
    // `library-ingestion`, whose other two Tools INGEST. This one gates what
    // they produced, so it is not an alternative to them (its I/O differs):
    // `ingest-stdlib` and `ingest-extended` are substitutable with each other,
    // and a completeness check is not a third way to ingest.
    //
    // The skill carries no input contract, so `check-tools` cannot verify this
    // edge against one. The clean run does not mean the edge was tested.
    satisfies: ["library-ingestion"],
    requires: { runtime: ["bun"], network: false },
  }),
);
