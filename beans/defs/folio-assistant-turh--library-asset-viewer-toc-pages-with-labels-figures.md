---
# folio-assistant-turh
title: 'Library asset viewer: TOC, pages with labels, figures/tables, section extracts — for any ingested library/ entry (#2302)'
status: in-progress
type: feature
created_at: 2026-10-06T20:27:04Z
updated_at: 2026-10-09T18:20:00Z
parent: folio-assistant-slw1
---

Owner, #2302 session 2026-10-06: re-ingest the who-iris library with the updated method, and give ingested documents a viewer — browse page by page (with printed labels), an overview of figures/tables, the TOC linking to sections, and extracted summaries of each section. Not who-iris-specific: the viewer belongs to the ingestion SCHEMA (pdf-structure/v1 structure.json + sections/), so every library/ asset of every instance gets it; who-iris is the first consumer.

- [x] extend the existing library viewer (cat-harness/scripts/gen-library-viz.ts) with a document view built from structure.json: TOC (with confidence), pages (label, sections, figures), figures/tables, sections (summary or extract), diagnostics (alignment, gaps, label conflicts)
- [x] re-ingest who-iris library entries with the updated pdf-structure
- [x] check it rendered (screenshots)
- [ ] tests / gates

## 2026-10-09 — re-ingest run end to end; NOT promoted into the repository (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)

Run from who-iris's own repository (cat-harness mounted at `6c2d453`), all three entries:

- **Tooling had to be got first** — PyMuPDF (pip), tesseract + poppler (apt). That is now a tool and a skill: `bun run cat software:ensure` / `finding-software` (cat-harness branch `claude/ensure-software`).
- **Rungs:** `9789241548960-eng` pdf-structure (257 of 258 outline entries); `who-pub-tps-931` pdf-ocr+pdf-pages (a scan; OCR from tesseract 5.3.4); `wpr-rdo-2020-003-eng` pdf-structure, inferred contents REFUSED by the trust test ("48% of the 46 sections it would cut hold under 50 characters") → page granularity.
- **Two pipeline defects found and fixed:** the OCR rung could never finish (the vector arms exit 2 with a recorded UNDETERMINED on a scan; the sequencer stopped) — fixed in `ingest-document` (branch `claude/ensure-software`, test watched); and two stale image verdicts (`img-p009-6/7`, duplicates of `img-p008-2/3`) — removed in who-iris `06f2b79`.
- **Staged and promotable:** section ids identical in all three (summaries and verdicts keyed on them survive); the two bogus inferred contents lists (the manual's 41 "entries", all on page 2) are gone.
- **Not committed:** promotion regenerates the JSON-LD from inside the mount, which drops every block's `@type` — bean `j3ls`. Re-run promotion once that is fixed; the staging is reproducible with the commands above.

## 2026-10-11 — the j3ls blocker is lifted (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)
who-iris#43 mounts folio-assistant-sci, and with it `gen-library-jsonld` from who-iris's repository writes the committed JSON-LD exactly (813 nodes up to date). Promotion no longer drops the `@type`s, so the staged re-ingest can be re-run and promoted from a checkout named `who-iris`.

## 2026-10-12 — re-ingest promoted: who-iris#44 (merged, cf41bbc) (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)
- All three entries were staged and promoted from a checkout named `who-iris`, with sci mounted. `gen-library-jsonld --check`: 813 up to date. Gates 0. Tests 101/101.
- **wpr:**
  - printed page labels added (33);
  - figures, the toc-refusal reason, and two vector figures added;
  - page bodies unchanged.
- **tps (scan):** the bogus contents list and the "Abies" title are gone.
  - The FRESH OCR WAS WORSE (Manual→Manval, name→nome, rule→tule, on 30 pages), so the committed OCR was kept and pages rebuilt from it with `--title`.
  - Follow-up: ingest-document passes no title to pdf-pages.
  - Follow-up: the OCR rung doesn't record the OCR engine/config, so a degraded re-OCR is invisible unless diffed.
- **Kept as committed:** palette-optimised PNGs. The re-extraction writes larger RGBA; nothing records their hashes.
- **Small losses:**
  - tps `source.pages` and `extractor` (manifest `pages: 121`): only pdf-structure writes them.
  - wpr pages' `doc_title` is now the capitalised heading.
- **Remaining:** tests/gates box; the viewer on who-iris's own site (kx0p).
