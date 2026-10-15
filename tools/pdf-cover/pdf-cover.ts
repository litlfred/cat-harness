import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The ingest pair ────────────────────────────────────────────────
//
// Two Tools, one skill, deliberately. `library-ingestion` states the
// capability; these are the two mechanisms, and which one an agent can
// use is a fact about the MACHINE rather than about the document.
//
// The split is not stdlib-for-its-own-sake. It is where the dependency
// boundary actually falls: reading a zip's central directory, sniffing
// magic bytes and parsing an xlsx's XML are all in the Python standard
// library, while rendering a PDF's text layer is not and never will be.
// Measured 2026-09-19: reaching a working image extractor in a bare
// container took three installs (`pypdf`, then `cffi` — whose absence
// makes `cryptography` panic under pyo3 on IMPORT — then `Pillow`).
//
// Bean `68dt` asked whether to declare Python dependencies and install
// them in CI. This reframes it: the dependency posture becomes a property
// of a named Tool that an agent can read, instead of a repository-wide
// yes/no nobody can see from a skill.
export default toolFactory((t) =>
  defineTool({
    id: "pdf-cover",
    title: "PDF page raster",
    description:
      "Render one page of a PDF to a PNG — the thumbnail a repository listing shows — and print the provenance a catalogue needs to record it as DERIVED: source, digest, page, geometry, renderer.",
    // PyMuPDF only. Not the `ingest-extended` install line: that one also
    // brings tesseract and Pillow, which a page raster does not need, and a
    // Tool node that overstates its install is a Tool nobody can schedule.
    install: { cli: "pip install pymupdf" },
    invoke: { shell: "bun run cat pdf:cover" },
    requires: { runtime: ["python3", "pymupdf"], network: false },
    io: {
      inputs: [
        { name: "pdf", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The PDF to render from. Its bytes must be here; nothing is fetched." },
        { name: "out", schema: t("RepoPath"), required: true, arg: { flag: "--out" }, description: "The PNG to write." },
        { name: "page", schema: t("Count"), required: false, arg: { flag: "--page" }, description: "1-based page to render, default 1. Asking for a page past the end is refused, not clamped." },
        { name: "width", schema: t("Count"), required: false, arg: { flag: "--width" }, description: "Output width in pixels, default 300. `Count` admits zero and a zero width does not; the script refuses it rather than writing a 0x0 PNG, which is the tighter bound stated at the port as `CountSchema` asks. Height follows the page's own aspect and is never forced." },
        { name: "checkOnly", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Write nothing; exit non-zero if the target differs from what would be written." },
      ],
      outputs: [
        { name: "facts", schema: t("Text"), description: "With `--json`: source path and sha256, page, page count, point geometry, pixel geometry, output bytes and sha256, media type, renderer version. Everything a provenance record needs and nothing it has to guess." },
      ],
    },
    satisfies: ["asset-extraction"],
    selection: {
      when:
        "A listing needs a cover and the bytes are already held. It renders page 1 by default and calls that the cover, because page 1 is a determined answer and \"the cover\" is not — the same choice `pdf-pages.py` makes about sections.",
      limits:
        "It decides nothing beyond the raster. WHICH documents get a cover, where the file lands, and what the catalogue must say about the derivation are the catalogue's to declare — see `folio-assistant-core/scripts/gen-covers.ts`, which reads them from an instance's catalogue and refuses to write bytes for a THUMBNAIL that does not declare itself derived. It also cannot tell you whether the page it rendered IS the cover; it can only tell you it is page 1.",
      cost:
        "One PyMuPDF wheel, no network at run time, and a few milliseconds per page. Deterministic — identical input gives identical bytes, which is what lets a caller gate on `--check` rather than re-deciding.",
    },
  }),
);
