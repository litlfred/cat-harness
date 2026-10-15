import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "ingest-stdlib",
    title: "Ingest, standard library only",
    description:
      "Ingest an upload into `library/` using only the Python standard library — archive listings, CSV and spreadsheet records, technical file metadata, and the content sniff that routes a file to its rung.",
    // Nothing to install: `zipfile`, `tarfile`, `csv`, `xml.etree` and
    // `hashlib` ship with Python. Stated, so "needs nothing" is
    // distinguishable from an unfinished record.
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/ingest-document.ts" },
    requires: { runtime: ["python3"], network: false },
    io: {
      inputs: [
        { name: "file", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The upload to ingest, under the declared `uploads` graph." },
        { name: "outdir", schema: t("RepoPath"), required: false, arg: { flag: "--outdir" }, description: "Library root; defaults to the declared `library` graph." },
        { name: "dryRun", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Report the chosen rung and stop." },
      ],
      outputs: [{ name: "slug", schema: t("Slug"), description: "The library entry written." }],
    },
    satisfies: ["library-ingestion"],
    selection: {
      when:
        "Reach for this first, and in CI always. It is the only one of the pair that runs where nothing has been installed — which is every fresh container and every CI job here, since the workflow installs `ruff` and nothing else. It covers archives, CSV and spreadsheets, technical metadata, and the sniff that decides which rung a file takes, including the OOXML/ODF container check that stops a workbook being listed as a bag of XML parts.",
      limits:
        "It cannot read a PDF. Text layer, embedded outline, page rendering, OCR and image extraction all need a backend it deliberately does not have, so a PDF routes to `undetermined` and is REFUSED rather than half-ingested. `ingest-extended` is the sibling that does those.",
      cost:
        "None beyond `python3` itself. No wheels, no C toolchain, no network, nothing to keep current, and no CI minutes spent installing.",
    },
  }),
);
