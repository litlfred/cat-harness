import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The two OpenAPI ingest tools — bean `folio-assistant-7jkp`, owner
// ruling 2026-10-10: two tools, not one with a mode, because a repository
// and a published URL are different inputs that fail differently. Both
// write into the instance's declared `openapi` directory, verbatim, with a
// `folio-openapi-source/v1` provenance beside each document, and
// `ingest-openapi.ts --check` verifies either kind offline.
export default toolFactory((t) =>
  defineTool({
    id: "openapi-ingest-source",
    title: "OpenAPI ingest from source",
    description:
      "Ingest the OpenAPI documents an instance's `cat-openapi.config.json` lists under `documents` from a local checkout of their repository, read AT a branch, tag or commit (`git show`), verbatim, with a provenance recording the resolved commit and the document's sha256. `--check` verifies the committed copies offline.",
    install: { none: true },
    invoke: { shell: "bun run cat openapi:ingest" },
    io: {
      inputs: [
        { name: "instance", schema: t("RepoPath"), required: true, arg: { flag: "--instance" }, description: "The instance root holding `cat-openapi.config.json` and the declared `openapi` directory." },
        { name: "source", schema: t("RepoPath"), required: true, arg: { flag: "--source" }, description: "A local checkout of the documents' repository." },
        { name: "ref", schema: t("Branch"), required: false, arg: { flag: "--ref" }, description: "The branch, tag or commit to read each document at. Default: the checkout's HEAD." },
      ],
      outputs: [
        { name: "documents", schema: t("RepoPath"), description: "`<id>.openapi.json` and `<id>.source.json` per document, in the declared `openapi` directory." },
      ],
    },
    satisfies: ["library-ingestion"],
    selection: {
      when: "An instance holds an OpenAPI spec whose source is a repository (e.g. a gateway's spec file) and the KG should describe it, pinned to a commit.",
      limits: "Reads a LOCAL checkout; fetching the repository is the caller's. A document that is not OpenAPI 3 fails rather than being written.",
      cost: "One git read and one JSON parse per document. No network.",
    },
    requires: { runtime: ["bun", "git"], network: false },
  }),
);
