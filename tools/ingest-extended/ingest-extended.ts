import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "ingest-extended",
    title: "Ingest, with PDF and image extensions",
    description:
      "Ingest a PDF into `library/` — embedded outline, page text, OCR for scans, and image extraction — using PyMuPDF, tesseract and pypdf with Pillow.",
    // The requirements file, NOT a pip line spelled out here. That line was
    // a second spelling of `schemas/python-deps.ts` and would have drifted
    // from it — it already omitted `cryptography`, which the declaration's
    // own checker caught. `requirements.txt` is generated from the
    // declaration; the apt packages are not pip-installable and stay named.
    install: { cli: "pip install -r cat-harness-tools/python/requirements.txt -r cat-harness-tools/python/requirements-extended.txt && apt-get install -y tesseract-ocr poppler-utils" },
    invoke: { shell: "bun run cat-harness-tools/scripts/ingest-document.ts" },
    requires: { runtime: ["python3", "pymupdf", "tesseract"], network: false },
    io: {
      inputs: [
        { name: "file", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The PDF to ingest, under the declared `uploads` graph." },
        { name: "outdir", schema: t("RepoPath"), required: false, arg: { flag: "--outdir" } },
        { name: "dryRun", schema: t("Flag"), required: false, arg: { flag: "--dry-run" } },
      ],
      outputs: [{ name: "slug", schema: t("Slug"), description: "The library entry written." }],
    },
    satisfies: ["library-ingestion"],
    selection: {
      when:
        "Reach for this when the upload is a PDF and you need its CONTENT — an outline-bearing document read at chapter granularity, a text-layer document read at page granularity, or a scan that must be OCR'd first. Confirm the backend is present before relying on it: `bun run cat check-deps`, or simply run the pair's entry point, which reports `no PDF backend` rather than guessing.",
      limits:
        "It adds nothing for archives, spreadsheets or metadata — `ingest-stdlib` already does those, and does them where this cannot run. Its PDF rungs ARE testable in CI as of `68dt`, which installs the lean set; the table rung (`pdf-tables.py`, camelot) is the one part that still is not, and anything gated on THAT remains a path CI cannot exercise — the `5rfy` defect.",
      cost:
        "Measured 2026-09-20: the lean set is 144 MB and CI installs it, so the PDF rungs ARE exercised there now. `camelot-py` for `pdf-tables.py` is the part CI still skips — 912 KB itself, but 323 MB with numpy, pandas and OpenCV, more than the whole lean set. The dependencies are not independent either: `pypdf` image extraction needs `Pillow`, and `cryptography` panics under pyo3 on IMPORT when `cffi` is missing. All of it is declared in `schemas/python-deps.ts`, so the cost is read rather than rediscovered.",
    },
  }),
);
