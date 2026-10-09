---
title: "Semantic subgraphs: site chrome, themes, and concern groups a downstream can mount"
kind: proposal
summary: >-
  Owner, 2026-10-09, after who-iris's standalone site could not be composed without the whole of cat-harness's 97 MB docs graph: make the just-the-docs CHROME its own subgraph, make the THEMES beyond the light/dark/accessibility base their own subgraph, and carry the eight concern groups (`9umr`) through docs and code so a downstream mounts a concern, not a monolith. Measured: chrome is 4 generic includes, 8 CSS and 11 JS files and the theme keys of one config, referenced by path from ~130 files; the themes are 14 entries in one TypeScript list plus 45 art declarations (5.1 MB). A mount can name only top-level directory ids today. Four layout options for the concern groups; C (kind-first layout plus a concern selector in the mount) is recommended. Five owner decisions.
---

# Semantic subgraphs: site chrome, themes, and concern groups a downstream can mount

**Status: proposal.** Slices 1 and 2 (chrome and themes) are ruled by the
owner, 2026-10-09; their *shape* below is still open to argument. Slice 3
(concern groups through docs and code) is options only. Nothing is built.

> ## Rulings, owner, 2026-10-09
>
> | ruling | words |
> |---|---|
> | the chrome is a subgraph | *"go ahead with the cat-harness chrome subgraph"* |
> | the themes are a subgraph | *"put the themes (beyond light and dark) as their own seperate subgraph"* |
> | semantic subgraphs are wanted | *"can we further breakdown into semantic subgraphs? like doc-ingestion, SDLC, publication for docs and skills/tools and such? please reivew and propose some organizational options"* |

1. TOC
{:toc}

---

## 0. Why now: a downstream could not build its own site

who-iris left `litlfred/folio-assistant` (cutover `g8jp`) without kg-separation
stages 7 and 12: nothing published `litlfred.github.io/who-iris/`, because
`/who-iris/` had only ever been a mount inside folio-assistant's
`docs-site.yml` build. Building it from who-iris's own repository with the
harness's tools found two walls, both measured 2026-10-09:

1. **`compose-docs.ts` takes all of `cat-harness/docs/` as the base layer.**
   `docsLayers` (`scripts/compose-docs.ts:174`) reads every `docs`-kind entry
   of `cat-harness.json`; there is one, `docs/`, so a who-iris build composed
   **3,456 files** of the harness's own pages to get a theme. The just-the-docs
   chrome is inside that directory and declared by nothing.
2. **A downstream mount can name only top-level directory ids.**
   `remote-mount.ts` builds `byId` from the raw top-level `directories`
   (`:358`) and refuses any other id at plan time (`:379–387`); it never calls
   `resolveDirectories`/`promoteFromWithin`, so a nested entry — `proposals`
   in `docs/docs.json`, `voices` in `skills/skills.json`, `openapi-scripts` in
   `openapi/graph.json` — cannot be mounted by name. Nested content arrives
   only with its whole parent.

So "mount the part you need" fails twice: the part is not declared, and a
declared part could not be named. Each slice below removes one wall.

## 1. What is there (measured 2026-10-09, `main` at `6ea9242`)

| concern of the corpus | where it is | grouped by concern today? |
|---|---|---|
| skills | `skills/<area>/<area>-core/…` — 14 areas, ~290 files | yes, nearly: areas ≈ the eight groups (`authoring` is the baselined exception, due under `content`) |
| processes | `processes/<group>/` — sdlc 29, kg 14, process 13, library 10, ui 4, content 3 | **yes** — `processes/processes.json` is `concern-groups/v1` |
| docs | `docs/` — 921 asset files (42 MB), ~170 authored pages in `doc-group`s, the rest generated | **no** — `docs.json` declares `doc-group`s (start, concepts, guides, process, fhir), not concern groups |
| code | `scripts/` 437 entries, `cat-harness-tools/scripts/` 154 | **no** — flat; by name ~40 ingestion, ~45 sdlc, ~60 publication, ~45 kg, ~45 QA, ~18 translation, ~7 theming |
| chrome | `docs/_config.yml`, `_includes/`, `_data/`, `assets/{css,js}`, `Gemfile` | not declared at all |
| themes | `schemas/themes.ts` (14 entries in `RAW`), `scripts/gen-themes-css.ts` → `docs/assets/css/themes.css`, 45 `landing-*` art declarations in `cat-harness.json` (5.1 MB) | not declared as a graph; who-iris already declares its own `themes/` as a `themes`-kind directory |

**The vocabulary already exists.** The eight concern groups are ruled
(`9umr`) and defined once, in `code-lists/concern-group.json`;
[Placement by concern group](placement-concern-groups-2026-10-01.html) §1.1
settles *concern is the sub-subgraph, layer is the instance*. The terms in the
owner's question map onto it without a new word:

| asked for | existing group | its definition |
|---|---|---|
| doc-ingestion | `library` | how a source is acquired, uploaded, described by metadata in the KG, and held in `library/` |
| SDLC | `sdlc` | how a change is planned, tracked, verified and shipped |
| publication | `ui` | how the corpus is rendered, **published** and presented: the docs site, viewers, boards and themes |
| skills / tools | `tools` | how a capability becomes a Tool node and an MCP service |

Whether `publication` deserves to be split out of `ui` is decision **D4**.

## 2. Slice 1 — the site chrome, `site-chrome/`

### 2.1 What is chrome, and what only looks like it

The survey read every file under `docs/_includes/` and `docs/_data/`. The
line is not the directory:

| file | verdict |
|---|---|
| `_includes/head_custom.html`, `footer_custom.html`, `nav_footer_custom.html`, `mermaid_config.js` | **chrome** — just-the-docs overrides any site uses |
| `assets/css/*` (8), `assets/js/*` (11 + `vendor/`) | **chrome**, except `work-plan.*`, `process-index.js`, `slice-sqlite*` and `kg-render.js`, which serve harness pages (decision **D2**) |
| `_config.yml`: `remote_theme`, `search_enabled`, `heading_anchors`, `color_scheme`, `mermaid`, `plugins`, Gemfile excludes | **chrome** |
| `_config.yml`: `title`, `description`, `baseurl: /folio-assistant`, `url`, `footer_content`, `keep_files`, the 30-odd `defaults` placing harness sections in the nav | **the harness's site identity and nav** — stays in `docs/` |
| `_includes/title.html`, `landing.html`, `harness_details.html` | harness templates reading `_data` — stay |
| `_includes/generated/*` (navbar, todo listing) | generated harness output — stays |
| `_data/*` (all six: `harness.json`, `instance-themes.json`, `stickies.json`, `node-kinds.json`, `translations.json`, `translation-qa.json`) | generated harness data — stays (`instance-themes.json` goes to slice 2) |

### 2.2 The shape

- A new top-level directory **`site-chrome/`**, declared in `cat-harness.json`
  with graph typology `docs` and concern `ui`, holding exactly the chrome rows
  above in their Jekyll-relative places (`site-chrome/_includes/…`,
  `site-chrome/assets/css/…`, `site-chrome/_config.yml`, `site-chrome/Gemfile`).
- **Top-level, not nested in `docs/docs.json`**, because of wall 2: until the
  mount resolves nested ids (slice 3), only a top-level id is mountable.
- `nav_footer_custom.html` includes the generated navbar; the chrome carries an
  **empty `_includes/generated/navbar-footer.html`** that `docs/` overrides, so
  a site with no harness pages still builds instead of failing on a missing
  include.
- `compose-docs` already composes several `docs`-kind layers in declaration
  order, later wins, with `_config.yml` merged (overlay keys win, objects
  merge, lists replace — the owner's rule of 2026-09-21). Declaring
  `site-chrome` **before** `docs` makes it the base and `docs/` its first
  overlay. No new mechanism.
- A downstream mounts `cat-harness` with
  `overrides: { "cat-harness": { directories: ["site-chrome", "schemas", "cat-harness-scripts", …] } }`
  and omits `docs`. `docsLayers` reports the absent `docs` layer as `missing`
  rather than failing; that is the path who-iris needs.

### 2.3 What it costs, measured

Files naming a chrome path today, across cat-harness, cat-harness-tools and
folio-assistant-core:

| path | files (tests) |
|---|---|
| `docs/_includes/head_custom` | 16 (5) |
| `docs/_includes/footer_custom` | 10 (2) |
| `docs/_includes/nav_footer_custom` | 7 (0) |
| `docs/_includes/mermaid_config` | 2 (0) |
| `docs/assets/css` | 23 (4) |
| `docs/assets/js` | 60 (5) |
| `docs/_config.yml` | 12 (1) |
| `docs/Gemfile` | 2 (1) |

Plus folio-assistant's `docs-site.yml`, `preview-site.sh`, and the generators
that WRITE into `assets/css` (`gen-themes-css`, `gen-avatars-css`,
`gen-navbar-geometry-css`). A path a script composes rather than spells will
not show in that count; `check:stale-paths` and `check:declared-paths` are the
net.

**The one property that must hold:** the tree `compose-docs --out` produces for
folio-assistant is the same before and after, file for file. `_config.yml` is
the exception that has to be argued: once two layers both carry one, the
merge round-trips YAML and the bytes change (comments go). The test is
**parse equality** of the composed config, plus byte identity of every other
file. If parse equality is not good enough — the published config is read by
a person — the alternative is that `docs/_config.yml` keeps its full content
and only a downstream's build merges (decision **D1**).

## 3. Slice 2 — the themes, `themes/`

### 3.1 The line: base versus theme

"Beyond light and dark" draws the line here:

| stays with the chrome (the BASE) | becomes the `themes` subgraph |
|---|---|
| just-the-docs `color_scheme` light/dark, which every page needs | `pale-sage`, `pale-sage-fade`, `dusty-carolina`, `dusty-carolina-fade` |
| `high-contrast-light`, `high-contrast-dark` — the owner's *"whatever needed accessibility"* (2026-09-19); a site that mounts no themes must still meet WCAG AA, so these are base, not decoration | `grumpy-cat`, `grumpy-cyborg-agents`, `bootstrap`, `operations` |
| | `engineer`, `library`, `analyst`, `architecture`, with their 45 `landing-*` art declarations (5.1 MB) |
| | the generated `themes.css` and `_data/instance-themes.json` |

### 3.2 The shape

- A new top-level directory **`themes/`** of graph typology `themes` (the kind
  exists; who-iris's `themes/` is the precedent), concern `ui`.
- The `RAW` list leaves `schemas/themes.ts` for **one `folio-theme` node per
  theme** in `themes/`, each beside its art. `schemas/theme.ts` (the SCHEMA)
  stays in `schemas/`; only the data moves. That also answers a standing
  question in `schemas/themes.ts` — it is tagged `@graphNode schema` while
  holding data, not a schema.
- The base pair stays code in `schemas/` (or in `site-chrome/`, decision
  **D3**), so `themeById` and `DEFAULT_THEME_ID` resolve with no `themes/`
  mounted.
- **The default is the open point.** `DEFAULT_THEME_ID` is `pale-sage`, the
  owner's pick to match the staging bar (confirmed on PR #405's preview,
  2026-09-19). Under this split pale-sage is a theme, not base. Proposed: the
  default is DECLARED by the `themes` subgraph and FALLS BACK to the base
  light/dark when it is not mounted, so folio-assistant's default is unchanged
  and who-iris (which declares its own themes) never needs cat-harness's.
- Readers to repoint: `gen-themes-css.ts`, `render-theme-sheet.ts`,
  `gen-docs-pages.ts`, `tools/index.ts`, `partition/instance-rules.ts`, and
  core's `scripts/platform.ts` re-export (16 files name the module in all,
  including generated indexes).

## 4. Slice 3 — concern groups through docs and code: four options

The goal the owner named: a downstream mounts **a concern** — "publication",
"SDLC", "doc ingestion" — across every kind (its skills, processes, docs,
code), not a whole harness and not a hand-made list of directories.

### Option A — kind-first, concern-second, everywhere (extend `9umr` as ruled)

`docs/<group>/`, `scripts/<group>/` and `cat-harness-tools/scripts/<group>/`
join `skills/<group>/` and `processes/<group>/`, each declared through
`concern-groups/v1` the way `processes/processes.json` already is.

- **For:** it is the ruled direction (§1.1 of the concern-groups proposal) and
  PR9 there (*"docs pages follow their subject"*) already plans the docs half.
- **Against:** it does nothing for mounting on its own — every group directory
  is NESTED, which is wall 2. And it is the largest move of code paths:
  ~430 scripts re-homed, every `bun run cat-harness/scripts/x.ts` invocation
  rewritten.

### Option B — concern-first top-level directories

`ui/{skills,processes,docs,scripts}`, `sdlc/{…}`, and so on, each a top-level
directory of graph typology `cat-harness` with a `graph.json` declaring its
kinds from within — the shape `openapi/` already has.

- **For:** mountable today by top-level id (`overrides.directories: ["ui"]`),
  and a concern is one directory, which is what "a semantic subgraph" sounds
  like.
- **Against:** it **reverses** the `9umr`/`1g4s` ruling that the KIND is the
  first path segment, so every kind's readers change, and `skills/` and
  `processes/` move again having just been grouped.

### Option C — Option A's layout, plus a concern selector in the mount (recommended)

Keep kind-first. Add two things to `remote-mount`:

1. **Nested ids resolve**: `byId` is built from `resolveDirectories`, not the
   raw top level, so `overrides.directories` may name `proposals`, `voices`,
   or `openapi-scripts`.
2. **A `concerns` selector**: `overrides.<instance>.concerns: ["ui"]` expands
   to every directory that is a member of that group in any `concern-groups/v1`
   declaration of the instance — `skills/ui`, `processes/ui`, `docs/ui`,
   `site-chrome`, `themes` — plus what those need (below).

- **For:** keeps the ruled layout; turns "mount the publication concern" into
  one line; both additions are local to `remote-mount.ts` and its schema.
- **Against:** a mount plan becomes a resolution, not a list, so the lock
  (`index.lock.json`) must record what a selector resolved to — which it
  already does for directories.

### Option D — chrome and themes only

Do slices 1 and 2, leave the rest flat.

- **For:** smallest; unblocks who-iris.
- **Against:** the next downstream that wants "the SDLC concern" (a folio with
  its own merge gates) meets wall 2 again.

### The constraint every option meets: code does not subset like content

A concern's PAGES can be mounted alone. Its SCRIPTS mostly cannot: a
publication script imports `schemas/cat-harness.ts`, which imports the
graph-typology registry, which imports bootstrap-tools — the import cone is
most of `schemas/`. So for code, a concern selector must mount the concern's
scripts **plus their import closure**, which `check:tools-closure` already
computes for kg-separation stage 6. Mounting "publication" without that would
produce a checkout where `compose-docs.ts` is present and cannot load. This is
stated here because it is the cost Options A and C share, and Option B only
hides it inside the directory.

### Comparison

| | layout churn | mountable by concern | keeps `9umr` | code closure handled |
|---|---|---|---|---|
| A | large (docs + all scripts) | no | yes | n/a |
| B | largest (every kind) | yes, today | **no** | by directory, coarsely |
| C | as A, staged | yes | yes | yes, via `check:tools-closure` |
| D | small | no | yes | n/a |

## 5. Stages

| PR | what | gate |
|---|---|---|
| 1 | `site-chrome/` declared and populated; `compose-docs` base order; every path reader repointed | folio-assistant's composed tree identical except `_config.yml` parse-equal; `check:stale-paths`; `check:declared-paths` |
| 2 | `themes/` declared; `RAW` → one node per theme; art declarations move with their themes; default with fallback | `gen-themes-css --check` byte-identical `themes.css`; `theme-contrast` QA unchanged |
| 3 | `remote-mount`: nested ids resolve | a downstream naming `site-chrome` + `themes` + code mounts and builds |
| 4 | who-iris publishes its own site from `site-chrome` + its own `themes/` (kg-separation stages 7 and 12 for who-iris) | the site at `litlfred.github.io/who-iris/` builds and every replica link resolves |
| 5+ | Option C's `concerns` selector, then docs and scripts into their groups, one group per PR | `check:concern-groups`; `check:tools-closure` |

PRs 1–4 are the ruled slices and the who-iris unblock. 5+ waits on **D5**.

## 6. Decisions for the owner

| | question | proposed default |
|---|---|---|
| **D1** | Composed `_config.yml`: parse-equal acceptable, or must the published bytes stay identical? | parse-equal |
| **D2** | `work-plan.*`, `process-index.js`, `slice-sqlite*`, `kg-render.js`: chrome, or harness pages' assets that stay in `docs/`? | stay in `docs/` — they serve harness pages |
| **D3** | The base light/dark + high-contrast pair: code in `schemas/`, or nodes in `site-chrome/`? | `site-chrome/` — the base travels with the chrome that needs it |
| **D4** | Split `publication` out of `ui` as a ninth concern group? | no — `ui`'s definition already says "rendered, published and presented"; a ninth code is a `9umr` amendment |
| **D5** | Option A, B, C or D for slice 3 | **C** |

## 7. What would change this

- If `compose-docs`'s merge of two `_config.yml` layers changes the published
  site in any way a reader sees (nav order, search), slice 1 keeps the whole
  config in `docs/` and only downstream builds merge (D1, other branch).
- If the import closure of `compose-docs.ts` + `mount-instance-docs.ts` turns
  out to be most of `scripts/` as well as `schemas/`, a concern selector buys
  little for code, and Option C should be scoped to content kinds only.
- If a second downstream (not who-iris) never asks for a concern, Option D is
  enough and slice 3 is not worth its churn.

## Related

- [Placement by concern group](placement-concern-groups-2026-10-01.html) — the
  ruled vocabulary and the kind-first layout this extends; its PR9 is this
  proposal's slice 3 for docs.
- [Separation arc](separation-arc-2026-10-01.html) — where MCP becomes a
  subgraph inside the `tools` group.
- [`kg-separation`](../reference/skill-instructions/kg-separation.html) — stages
  7, 10 and 12, which who-iris's cutover skipped.
