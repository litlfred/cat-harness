---
title: "Tools — folio-assistant-sci"
description: "The Tool nodes folio-assistant-sci declares — how each is installed and invoked, and which skill it satisfies."
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

The Tool nodes **folio-assistant-sci** declares in its `tools` graph — one instance's slice of [every instance's tools](../).

A **skill** states a capability generically: what an actor needs to know to
perform a task. A **Tool** is one concrete way to exercise it, with an
installation, an invocation and typed inputs and outputs. One skill may be
satisfied by several tools, and one tool may satisfy several skills.

They are separate graphs and this is the tools one. The relation between them
is `satisfies`, and it runs **from a tool to a skill** — *this tool is one way
to do that*, never *this skill is a tool*.

<div class="tg-grid">
<a class="tg-stat" href="#every-tool"><b>7</b><span>Tool nodes</span></a>
<a class="tg-stat" href="#does-every-satisfies-name-a-skill-that-exists"><b>4</b><span>skills satisfied</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>5</b><span>invoked as a shell command</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>1</b><span>reachable over MCP</span></a>
</div>

## How they are invoked, and installed

A tool may declare more than one invocation, so these do not sum to the total.

| invocation | tools |
|---|---|
| <span class="tg-tag tg-shell">shell</span> | 5 |
| <span class="tg-tag ">container</span> | 1 |
| <span class="tg-tag tg-inproc">inProcess</span> | 1 |
| <span class="tg-tag tg-mcp">mcp</span> | 1 |

| installation | tools |
|---|---|
| `none` | 6 |
| `container` | 1 |

## Does every `satisfies` name a skill that exists?

Yes — all **4** skills named across **7** tools resolve to a
skill document in this checkout. A `satisfies` pointing at nothing would be a
tool advertising a capability the graph cannot locate.

## Every tool

| tool | what it does | invoked | satisfies | i/o |
|---|---|---|---|---|
| <a id="latex-image"></a>[`latex-image`](#latex-image)<br>Compile LaTeX in a container | Compile a rendered paper's `main.tex` with latexmk inside a TeX Live (full) image, for a host with Docker but no TeX engine. The image carries TeX Live, latexmk, Pandoc, latexdiff, graphviz and poppler-utils; it does not run the content pipeline, which renders the chapters on the host first. | <span class="tg-tag ">container</span> | `latex-build-cache` | 1 in / 1 out |
| <a id="lean-cache"></a>[`lean-cache`](#lean-cache)<br>Lake olean cache | Restore, verify, seed and diagnose the prebuilt `.lake/` artefacts for a Lean package. Always try `restore` first: a from-source Mathlib build is 30–60 minutes, a restore about two. | <span class="tg-tag tg-shell">shell</span> | `lean-cache-restore` | 3 in / 1 out |
| <a id="lean-formal-edges"></a>[`lean-formal-edges`](#lean-formal-edges)<br>Formal edges from the Lean build | Extract ELABORATED formal dependencies between a folio's lean.ref declarations (LeanArchitect's rule over the folio's own lean.ref set). Needs a Lean toolchain and a built Lake project. Tagged declarations missing from the build are reported, never recorded as dependency-free; with ingest the result is recorded in the formal cache as source "elaborated". | <span class="tg-tag tg-inproc">inProcess</span> <span class="tg-tag tg-mcp">mcp</span> | `lean-formal-edges` | 3 in / 1 out |
| <a id="lean-html-docs"></a>[`lean-html-docs`](#lean-html-docs)<br>Build a Lean package's HTML docs (doc-gen4) | Build the doc-gen4 HTML render of a folio's Lake package — the visualiser of a declared `lean` directory — with `lake -R -Kenv=dev build <Lib>:docs`, cache-aware: refuses while another lake/lean process holds `.lake/`, refuses on a restored tree that carries no traces (a Lake build there EVICTS the cache), checks or restores the warm cache first, and enables a sentinel-commented doc-gen4 `[[require]]` for this build only, restoring the lakefile on exit. Never runs `lake update`. Output: `<lake-root>/.lake/build/doc`. | <span class="tg-tag tg-shell">shell</span> | `lean-html-docs` | 6 in / 1 out |
| <a id="lean-render-publish"></a>[`lean-render-publish`](#lean-render-publish)<br>Publish a Lean render under a folio site, with the harness rail | Stage a doc-gen4 render under a folio's built site (`<site>/<route>/`, default `lean/`) and give every page the harness navbar and rail by running `cat-harness/scripts/rail-standalone-pages.ts --foreign-site` over the site — the same rail `stage-folio-local.ts` applies to the folio's own pages. Leaves out Lake's `.hash`/`.trace` bookkeeping, marks doc-gen4's iframe navbar and `find/` redirect `folio-navbar: none` so no rail is drawn inside the sidebar, adds a layout shim so the rail does not cover doc-gen4's fixed sidebar, and with `--modules` prunes to the folio's own modules, repointing links into dropped ones to the community docs. Then asserts every staged page is railed or declined. | <span class="tg-tag tg-shell">shell</span> | `lean-html-docs` | 9 in / 1 out |
| <a id="paper-feature-build"></a>[`paper-feature-build`](#paper-feature-build)<br>Paper feature build (changed chapters + latexdiff) | Quick preview of a paper folio's branch: render the paper with the sci print template (plus the folio's notation fragment when it has one), then compile ONLY the chapters changed against a base ref, and a colored and a plain latexdiff of each. Margin notes are off by default (`FAST_PREVIEW=1`, about 2x). Cross-references to chapters outside the build print as '??'. A preview, never a publish build. Run from the folio. Without a TeX engine the render still runs and the compile steps are skipped with a message. | <span class="tg-tag tg-shell">shell</span> | `latex-build-cache` | 6 in / 1 out |
| <a id="tex-install"></a>[`tex-install`](#tex-install)<br>Install TeX Live in a sandbox | Install TeX Live (full) and latexmk where no TeX engine is present, disabling the firewalled launchpad PPAs that otherwise abort `apt-get update`. Idempotent: does nothing when pdflatex and memoize.sty are already present. About 5 GB and 10-20 minutes, so run it in the background. pdflatex unpacks early but is not usable until the post-install format build ends (`kpsewhich memoize.sty` returning a path is the ready signal). | <span class="tg-tag tg-shell">shell</span> | `latex-build-cache` | 0 in / 1 out |
