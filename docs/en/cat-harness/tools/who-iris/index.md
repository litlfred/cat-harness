---
title: "Tools — who-iris"
description: "The Tool nodes who-iris declares — how each is installed and invoked, and which skill it satisfies."
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

The Tool nodes **who-iris** declares in its `tools` graph — one instance's slice of [every instance's tools](../).

A **skill** states a capability generically: what an actor needs to know to
perform a task. A **Tool** is one concrete way to exercise it, with an
installation, an invocation and typed inputs and outputs. One skill may be
satisfied by several tools, and one tool may satisfy several skills.

They are separate graphs and this is the tools one. The relation between them
is `satisfies`, and it runs **from a tool to a skill** — *this tool is one way
to do that*, never *this skill is a tool*.

<div class="tg-grid">
<a class="tg-stat" href="#every-tool"><b>1</b><span>Tool nodes</span></a>
<a class="tg-stat" href="#does-every-satisfies-name-a-skill-that-exists"><b>1</b><span>skills satisfied</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>1</b><span>invoked as a shell command</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>0</b><span>reachable over MCP</span></a>
</div>

## How they are invoked, and installed

A tool may declare more than one invocation, so these do not sum to the total.

| invocation | tools |
|---|---|
| <span class="tg-tag tg-shell">shell</span> | 1 |

| installation | tools |
|---|---|
| `none` | 1 |

## Does every `satisfies` name a skill that exists?

Yes — all **1** skills named across **1** tools resolve to a
skill document in this checkout. A `satisfies` pointing at nothing would be a
tool advertising a capability the graph cannot locate.

## Every tool

| tool | what it does | invoked | satisfies | i/o |
|---|---|---|---|---|
| <a id="iris-pages"></a>[`iris-pages`](#iris-pages)<br>IRIS replica and catalogue pages | Render who-iris's replica of the IRIS site, its docs pages, and the catalogue visualiser who-iris declares — what the catalogue knows and what it records that it does not know — at that visualiser's declared route. | <span class="tg-tag tg-shell">shell</span> | [`graph-rendering`](../../../../reference/skill-instructions/graph-rendering.html) | 1 in / 1 out |
