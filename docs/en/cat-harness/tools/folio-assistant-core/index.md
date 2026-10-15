---
title: "Tools — folio-assistant-core"
description: "The Tool nodes folio-assistant-core declares — how each is installed and invoked, and which skill it satisfies."
generated: gen-tools-viz.ts — do not hand-edit; run `bun run cat tools:viz`
rendered-by: tools-viewer
---
<style>
.tg-tag{display:inline-block;padding:.05rem .4rem;border-radius:3px;font-size:.72rem;
  font-weight:600;white-space:nowrap;border:1px solid currentColor;margin-right:.2rem}
/* Bean rtuo: these inks were chosen for a LIGHT page and measured 2.33-2.54:1
   on this site's default dark one (#27262b), under the 4.5:1 text floor. The
   dark inks are the default; the site's light scheme keeps the originals,
   which clear 5.9:1 on white. Every ratio computed, not eyeballed. */
.tg-shell{color:#5cd3bd}   /* 8.23:1 on #27262b */
.tg-mcp{color:#b9a8ec}     /* 7.06:1 */
.tg-inproc{color:#86b8f2}  /* 7.26:1 */
.tg-manual{color:#f5a070}  /* 7.25:1 */
:root[data-fa-scheme="light"] .tg-shell{color:#0d6e5e}
:root[data-fa-scheme="light"] .tg-mcp{color:#6b5b95}
:root[data-fa-scheme="light"] .tg-inproc{color:#1d5fa8}
:root[data-fa-scheme="light"] .tg-manual{color:#a8430f}
.tg-grid{display:flex;flex-wrap:wrap;gap:.75rem;margin:1rem 0}
.tg-stat{flex:1 1 8rem;border:1px solid rgba(128,128,128,.35);border-radius:6px;padding:.5rem .7rem;text-decoration:none;color:inherit;display:block}
.tg-stat:hover,.tg-stat:focus{border-color:currentColor;text-decoration:none}
.tg-stat b{display:block;font-size:1.25rem;line-height:1.2}
.tg-stat span{font-size:.75rem;opacity:.75}
.table-wrapper{position:relative}
.table-wrapper table{min-width:36rem}
@media (max-width: 799.98px) {
  @supports (animation-timeline: scroll()) {
    .table-wrapper {
      mask-image: linear-gradient(to right,
        transparent 0, #000 var(--fa-cue-l, 0px),
        #000 calc(100% - var(--fa-cue-r, 2.5rem)), transparent 100%);
      animation: fa-scroll-cue linear both;
      animation-timeline: scroll(self inline);
    }
  }
  @supports not (animation-timeline: scroll()) {
    .table-wrapper {
      mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent 100%);
    }
  }
}
@property --fa-cue-l { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --fa-cue-r { syntax: "<length>"; inherits: false; initial-value: 0px; }
@keyframes fa-scroll-cue {
  0%   { --fa-cue-l: 0px;    --fa-cue-r: 2.5rem; }
  12%  { --fa-cue-l: 2.5rem; }
  88%  { --fa-cue-r: 2.5rem; }
  100% { --fa-cue-l: 2.5rem; --fa-cue-r: 0px; }
}
</style>

The Tool nodes **folio-assistant-core** declares in its `tools` graph — one instance's slice of [every instance's tools](../).

A **skill** states a capability generically: what an actor needs to know to
perform a task. A **Tool** is one concrete way to exercise it, with an
installation, an invocation and typed inputs and outputs. One skill may be
satisfied by several tools, and one tool may satisfy several skills.

They are separate graphs and this is the tools one. The relation between them
is `satisfies`, and it runs **from a tool to a skill** — *this tool is one way
to do that*, never *this skill is a tool*.

<div class="tg-grid">
<a class="tg-stat" href="#every-tool"><b>12</b><span>Tool nodes</span></a>
<a class="tg-stat" href="#does-every-satisfies-name-a-skill-that-exists"><b>9</b><span>skills satisfied</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>12</b><span>invoked as a shell command</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>0</b><span>reachable over MCP</span></a>
</div>

## How they are invoked, and installed

A tool may declare more than one invocation, so these do not sum to the total.

| invocation | tools |
|---|---|
| <span class="tg-tag tg-shell">shell</span> | 12 |

| installation | tools |
|---|---|
| `none` | 12 |

## Does every `satisfies` name a skill that exists?

Yes — all **9** skills named across **12** tools resolve to a
skill document in this checkout. A `satisfies` pointing at nothing would be a
tool advertising a capability the graph cannot locate.

## Every tool

| tool | what it does | invoked | satisfies | i/o |
|---|---|---|---|---|
| <a id="bibliography-page"></a>[`bibliography-page`](#bibliography-page)<br>Bibliography page | Render every reference in the checkout (each declared `references` directory's folio-reference/v1 nodes and each `catalogue` directory's Dublin Core records) as the bibliography page and one page per sub-graph, each with its BibTeX, CSL-JSON, RIS and Dublin Core JSON-LD exports and a per-reference export, at the route of the visualiser core declares for it. | <span class="tg-tag tg-shell">shell</span> | [`graph-rendering`](../../../../reference/skill-instructions/graph-rendering.html) | 2 in / 1 out |
| <a id="block-actions"></a>[`block-actions`](#block-actions)<br>Block edit and feedback links | Each labelled block's links back to where it can be changed: [edit] opens the block's Markdown source in GitHub's editor on `main`, and [feedback] opens a new GitHub issue about the block, from the folio's `.github/ISSUE_TEMPLATE/block-feedback.yml` when it has one (prefilling only the fields it declares: block, section, source, page, url) or as a plain issue whose body carries the same facts. The document build draws these on every block; this Tool prints them as JSON for one block or all. Governed by the `block-actions` skill (bean `uphx`, REQ-17). | <span class="tg-tag tg-shell">shell</span> | [`block-actions`](../../../../reference/skill-instructions/block-actions.html) | 5 in / 1 out |
| <a id="dublin-core-render"></a>[`dublin-core-render`](#dublin-core-render)<br>Dublin Core renderings | Render every `folio-dublin-core/v1` record a catalogue item names as Dublin Core XML (qualified DC, per DCMI's XML guidelines) and as JSON-LD bound to DCMI Metadata Terms. Both are written into the instance's published root (`<instanceRoot>/dublin-core/<stem>.dc.xml` and `.dc.jsonld`), so the site mount publishes them beside the item pages. Deterministic. `--check` fails on a missing, stale or orphaned rendering. Governed by the `dublin-core-renderings` skill (bean `7eak`). | <span class="tg-tag tg-shell">shell</span> | [`dublin-core-renderings`](../../../../reference/skill-instructions/dublin-core-renderings.html) | 2 in / 1 out |
| <a id="folio-changeset"></a>[`folio-changeset`](#folio-changeset)<br>Folio ChangeSet | What changed in a folio between two git refs, block by block: each block added, removed, or changed — and for a changed block, every aspect that applies (renamed, prose, manifest, moved). Keyed on the block label, which the `id-unique` / `id-stable` QA criteria guard, not on file paths. | <span class="tg-tag tg-shell">shell</span> | [`diff`](../../../../reference/skill-instructions/diff.html)<br>[`staging-review`](../../../../reference/skill-instructions/staging-review.html) | 5 in / 1 out |
| <a id="folio-review-comment-move"></a>[`folio-review-comment-move`](#folio-review-comment-move)<br>Move a review comment's status | A review-process task moves one `review-comment/1.0.0` todo's status (address, send back, resolve, adjudicate, withdraw) through `transition()`, which refuses any move the named BPMN task may not make. The comment is written to the folio's todos graph (its declared `todo-feedback` directory) and, with `--commit`, committed to the edit-set's FEATURE branch. Refused on the base branch and on a detached HEAD. | <span class="tg-tag tg-shell">shell</span> | [`review-comments`](../../../../reference/skill-instructions/review-comments.html) | 9 in / 1 out |
| <a id="folio-review-comments"></a>[`folio-review-comments`](#folio-review-comments)<br>Folio review comments | Ingest a pull request's tagged conversation comments (`block: <label>` on the first line) into `review-comment/1.0.0` todos, and write them as `review-comments.json`. Idempotent over its previous output, whose statuses it keeps. Re-anchors every comment against the head's blocks, following `renamedFrom`, and orphans a comment whose block is gone rather than dropping it. | <span class="tg-tag tg-shell">shell</span> | [`review-comments`](../../../../reference/skill-instructions/review-comments.html) | 10 in / 1 out |
| <a id="folio-review-coverage"></a>[`folio-review-coverage`](#folio-review-coverage)<br>Folio review coverage | Compute the two facts `content-change-review.bpmn`'s coverage gate (`GW_Covered`) reads: `uncoveredBlocks`, the changed blocks with no reviewer verdict on their CURRENT hash, and `openDefects`. Reads a preview's `changeset.json`, `blocks.json` and `review-comments.json`. With `--commit`, writes the ingested `folio-review-verdict/v1` verdicts into the todos graph's declared `review-verdicts` directory and commits them to the edit-set's FEATURE branch; refused on the base branch and a detached HEAD. Prints the facts as JSON on stdout. | <span class="tg-tag tg-shell">shell</span> | [`review-comments`](../../../../reference/skill-instructions/review-comments.html) | 7 in / 1 out |
| <a id="glossary-build"></a>[`glossary-build`](#glossary-build)<br>Glossary build | Build a paper's glossary index from its manifests and render the LaTeX. `--check` reports drift instead of writing, comparing everything except the `generated` timestamp so a re-run is not mistaken for a change. | <span class="tg-tag tg-shell">shell</span> | [`document-intake`](../../../../reference/skill-instructions/document-intake.html) | 2 in / 1 out |
| <a id="glossary-page"></a>[`glossary-page`](#glossary-page)<br>Glossary page | Render every declared glossary — authored SKOS schemes, the swimlane ledger and the terms extracted from knowledge-graph assets — as the glossary page and one page per asset type, at the route of the visualiser core declares for it. | <span class="tg-tag tg-shell">shell</span> | [`graph-rendering`](../../../../reference/skill-instructions/graph-rendering.html) | 2 in / 1 out |
| <a id="l1-coverage"></a>[`l1-coverage`](#l1-coverage)<br>L1 extraction coverage | Of the normative sentences in a publication (the closed marker list of smart-kg's `docs/COVERAGE.md` §1), count how many an L1 extraction CAPTURED, how many are EXCLUDED for a fixed-list reason a person signed off, and how many are UNACCOUNTED — per page and in total. Writes the contract's §4 report and exits non-zero below 100% accounted-for. Issue #2405 FR-009. | <span class="tg-tag tg-shell">shell</span> | [`l1-coverage`](../../../../reference/skill-instructions/l1-coverage.html) | 4 in / 1 out |
| <a id="tabular-csv"></a>[`tabular-csv`](#tabular-csv)<br>CSV tabular metadata | Read a delimited text file into a `folio-tabular-csvw/v1` record: one table, its columns and their CSVW datatypes, each measured or explicitly undetermined. Routing is by content, never by extension: the first rows must agree on one field count of two or more, under exactly one of `,` `;` TAB `\|`. A CSV's `fac:anchor` sheet and cell are a determined null. Governed by the `tabular-metadata` skill (bean `eief`). | <span class="tg-tag tg-shell">shell</span> | [`tabular-metadata`](../../../../reference/skill-instructions/tabular-metadata.html) | 3 in / 1 out |
| <a id="tabular-xlsx"></a>[`tabular-xlsx`](#tabular-xlsx)<br>Spreadsheet tabular metadata | Read a workbook into a `folio-tabular-csvw/v1` record, one CSVW table per rectangular block of cells. Blocks are split on empty rows, then on empty columns, so several tables on one sheet are found, each anchored at its real top-left cell (`fac:anchor`: sheet, A1 cell, row, column). Dates are read through the number formats in `styles.xml`, not misread as integer serials. A malformed part is refused rather than half-read. No new dependency: ZIP via `node:zlib`, SpreadsheetML via `fast-xml-parser`. Governed by the `tabular-metadata` skill (bean `eief`). | <span class="tg-tag tg-shell">shell</span> | [`tabular-metadata`](../../../../reference/skill-instructions/tabular-metadata.html) | 3 in / 1 out |
