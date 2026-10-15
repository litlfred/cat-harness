---
title: "Tools — fhir-harness"
description: "The Tool nodes fhir-harness declares — how each is installed and invoked, and which skill it satisfies."
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

The Tool nodes **fhir-harness** declares in its `tools` graph — one instance's slice of [every instance's tools](../).

A **skill** states a capability generically: what an actor needs to know to
perform a task. A **Tool** is one concrete way to exercise it, with an
installation, an invocation and typed inputs and outputs. One skill may be
satisfied by several tools, and one tool may satisfy several skills.

They are separate graphs and this is the tools one. The relation between them
is `satisfies`, and it runs **from a tool to a skill** — *this tool is one way
to do that*, never *this skill is a tool*.

<div class="tg-grid">
<a class="tg-stat" href="#every-tool"><b>32</b><span>Tool nodes</span></a>
<a class="tg-stat" href="#does-every-satisfies-name-a-skill-that-exists"><b>8</b><span>skills satisfied</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>32</b><span>invoked as a shell command</span></a>
<a class="tg-stat" href="#how-they-are-invoked-and-installed"><b>0</b><span>reachable over MCP</span></a>
</div>

## How they are invoked, and installed

A tool may declare more than one invocation, so these do not sum to the total.

| invocation | tools |
|---|---|
| <span class="tg-tag tg-shell">shell</span> | 32 |

| installation | tools |
|---|---|
| `none` | 27 |
| `cli` | 5 |

## Does every `satisfies` name a skill that exists?

Yes — all **8** skills named across **32** tools resolve to a
skill document in this checkout. A `satisfies` pointing at nothing would be a
tool advertising a capability the graph cannot locate.

## Every tool

| tool | what it does | invoked | satisfies | i/o |
|---|---|---|---|---|
| <a id="build-ig-site"></a>[`build-ig-site`](#build-ig-site)<br>Stage one IG as its own just-the-docs Jekyll site | Turn an IG source repository into ONE Jekyll source for just-the-docs, as the IG Publisher builds one IG per site: `input/pagecontent` pages with title, parent and order from `sushi-config.yaml` `pages:`, the files the Publisher resolves `{% include %}` against, images, `_data/fhir.json` from `ig-site-data`, and a `_config.yml`. The pages render unchanged, `{{ site.data.fhir.* }}` included (bean `bamf`, owner's choice of one site per IG). With the IG's menu, the layout is the one every IG site wears (bean `mftp`): the IG's own top bar, the IG's TOC declared as the folio-assistant navbar's section (added by `rail-standalone-pages`), no sidebar of its own, an edit link per page, and per heading a source-line link and a pre-filled feedback issue. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 4 in / 2 out |
| <a id="check-wireframe-questionnaire"></a>[`check-wireframe-questionnaire`](#check-wireframe-questionnaire)<br>Check a Questionnaire field for field against the wireframe it was derived from | Compare the `data-element` fields of a mid-fidelity wireframe (per `data-layout`, in document order) with the answerable items of a BUILT Questionnaire (depth first, named by `definition` or `code`). Reports a field with no item, an item with no field, an item naming no data element, a data element twice in one layout, and the first place the order differs. Fidelity, not design. Moved down from the WHO layer on the owner's ruling of 2026-10-14: nothing in it is WHO's. | <span class="tg-tag tg-shell">shell</span> | `fhir-questionnaire-wireframe` | 2 in / 1 out |
| <a id="fhir-cache-seed-npm"></a>[`fhir-cache-seed-npm`](#fhir-cache-seed-npm)<br>Seed the FHIR package cache from trusted sources (exact versions) | Fill `~/.fhir/packages` (or `--cache`) for an environment that cannot reach packages.fhir.org, from trust anchors only: npm account `grahamegrieve` (owner-trusted), publishers' own published-site repositories (the seeder's list, each fetch verified against the tarball's own package.json), template repos found through FHIR/ig-registry's templates.json read live each run, and an owner `--mirror`. Exact versions only (a patch wildcard resolves as the Publisher resolves it, recorded); every tarball verified; nothing computed once and kept; provenance recorded; missing versions listed, never substituted. | <span class="tg-tag tg-shell">shell</span> | `ig-publisher-fork` | 5 in / 2 out |
| <a id="fhir-package-mirror"></a>[`fhir-package-mirror`](#fhir-package-mirror)<br>Mirror FHIR packages from packages.fhir.org into a git repository | On a machine that reaches packages.fhir.org, fetch exactly a missing list (from `fhir-cache-seed-npm --missing-out`), check each tarball names itself exactly, record SHA512SUMS, and commit and push to a git repository that an environment without packages.fhir.org reads with `--mirror`. The person running it is the trust anchor for what it adds. | <span class="tg-tag tg-shell">shell</span> | `ig-publisher-fork` | 2 in / 1 out |
| <a id="fsh-cone"></a>[`fsh-cone`](#fsh-cone)<br>FSH dependency cone | Compute the dependency cone over an IG's FSH graph, and the blast radius of a set of changed files. What makes an incremental IG build possible: without it, any edit rebuilds everything. | <span class="tg-tag tg-shell">shell</span> | `fhir-validation` | 5 in / 1 out |
| <a id="ig-artifact-jsonld"></a>[`ig-artifact-jsonld`](#ig-artifact-jsonld)<br>Write one JSON-LD node per IG artefact, and check a built site's nodes | `write` turns an artefact index into `artifact/<Type>-<id>.jsonld` (and a `.json` twin) under a docs root: one `folio-ig-artifact-jsonld/v1` node per artefact, in borrowed vocabularies only (the FHIR RDF class, dcterms, schema.org, PROV), naming the artefact's canonical URL, its representations and, for a compiled copy, what built it. `check` is the kind's QA: over a BUILT site, every artefact has its node and no node is an orphan, each node is its own file's, its twin matches, and every local resource it names is on the site. It also writes and checks the index node, `artifact/index.jsonld` (`folio-ig-artifact-index-jsonld/v1`): every artefact once, each entry naming its node. WHO-free; the assets the thin pages render (owner, 2026-10-11, option A; thin by default since 2026-10-12). | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 6 in / 1 out |
| <a id="ig-ast-diff"></a>[`ig-ast-diff`](#ig-ast-diff)<br>List and view the delta between two IG ASTs | Diff two ASTs by resource key: added, removed, changed (with a structural element-level differential) and version-changed resources, plus edges added and removed; optionally fold in the incremental plan, and render just-the-docs pages (an index that lists, a page per resource that shows) every one of which carries the provisional mark. `list <ast>` summarises one AST. | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta` | 4 in / 2 out |
| <a id="ig-ast-export"></a>[`ig-ast-export`](#ig-ast-export)<br>Build an IG and write its AST | Run one ordinary IG Publisher build through `AstPublisher` (a subclass that overrides nothing) and write the AST beside `output/`: one JSON file per resource keyed `canonical\|version`, `dependencies.json` (upstream's DependencyAnalyser plus the Library/PlanDefinition/ActivityDefinition/Measure edges it leaves empty), SUSHI's `fsh-index.json`, and a manifest that declares itself a cache and records the inputs it is valid for. | <span class="tg-tag tg-shell">shell</span> | `ig-publisher-fork` | 2 in / 2 out |
| <a id="ig-ast-incremental-build"></a>[`ig-ast-incremental-build`](#ig-ast-incremental-build)<br>Rebuild only the cone of a change and merge it into the AST | Write the unchanged part of a base AST as a FHIR package into the package cache, build a temporary IG of only the rebuild set with the stock Publisher, merge the result into a mixed-provenance AST (`builtAt` per resource), and repeat while the merged graph's cone reaches resources that were not rebuilt. | <span class="tg-tag tg-shell">shell</span> | `ig-publisher-fork` | 5 in / 1 out |
| <a id="ig-ast-jsonld"></a>[`ig-ast-jsonld`](#ig-ast-jsonld)<br>Export an IG AST as JSON-LD | Write an AST as linked data against `fhir-harness/schemas/ig-ast.context.jsonld`: each resource a node identified by its canonical URL (`urn:fhir:<Type>/<id>` when it has none) and typed by its FHIR resource type, each dependency edge a link to its target, and the manifest's `authority: cache` and `provisional` list carried on the graph. The AST is validated against the Zod declaration the JSON Schemas are generated from before it is exported (bean `l0lq`). | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta` | 1 in / 1 out |
| <a id="ig-ast-list"></a>[`ig-ast-list`](#ig-ast-list)<br>Summarise one IG AST | Counts per resource type, edges in total and resolved inside the IG, edges by origin (upstream's DependencyAnalyser or ast-export's LogicEdges), whether the AST is mixed-provenance and how many resources each revision built, and what the manifest declares provisional. | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta` | 1 in / 1 out |
| <a id="ig-ast-measure-real-igs"></a>[`ig-ast-measure-real-igs`](#ig-ast-measure-real-igs)<br>Measure the AST export on real IGs | Build smart-trust and smart-immunizations through `ig-ast-export` and print the W1/W2 measurements: counts, whether FSH sources sit where the plan expects, and logic-layer edge coverage per resource type against 458 of 458. `--byte-identical` adds a stock build and an `output/` diff. | <span class="tg-tag tg-shell">shell</span> | `ig-publisher-fork` | 1 in / 1 out |
| <a id="ig-ast-plan"></a>[`ig-ast-plan`](#ig-ast-plan)<br>Plan an incremental IG build from a delta of changed files | Map a delta (a commit range, a PR's diff, or the staged index) onto a base AST: which resources to rebuild (the forward cone), which to load from cache, which to remove, or a full build and why. Builds nothing. | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta`<br>`ig-publisher-fork` | 4 in / 1 out |
| <a id="ig-ast-refresh"></a>[`ig-ast-refresh`](#ig-ast-refresh)<br>Refresh an IG's AST cache on a runner | Dispatch an IG repository's `ig-ast-refresh.yml`, which calls fhir-harness's reusable `.github/workflows/ig-ast-refresh.yml`: mount the layers the IG's index.lock.json pins, restore and judge the cache for `ref`, and when it is not valid (or `force`) run the caller's optional `pre-export` overlay command and build the IG with the pinned Publisher AST exporter (the AST is recorded against the clean commit's inputs, the overlay's changes put back), check the new AST is valid for its commit, and seed `cat/fhir-harness/fhir-ast/<package id>` with `ig-cache seed --push` — only from a commit on the default branch with the tip's inputs. Builds no site, writes no gh-pages, dispatches nothing. | <span class="tg-tag tg-shell">shell</span> | `compiled-artefact-cache`<br>`ig-build-pipeline` | 3 in / 1 out |
| <a id="ig-ast-render"></a>[`ig-ast-render`](#ig-ast-render)<br>Render a computed IG AST delta as just-the-docs pages | Write the pages for a delta already computed by `ig-ast-diff --json`: an index that lists, a page per changed resource that shows, every one opening with the provisional mark and with Liquid in values neutralised. | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta` | 2 in / 1 out |
| <a id="ig-ast-validity"></a>[`ig-ast-validity`](#ig-ast-validity)<br>Is this IG AST still valid for the IG's current inputs? | Run folio-assistant-core's `compiledValidity` on an AST manifest's `inputs`: recompute the input digest (the same algorithm as the Java writer, pinned by a shared golden vector) and the source revision, and answer valid, stale-inputs (naming which input), or cannot-tell. | <span class="tg-tag tg-shell">shell</span> | `ig-ast-delta` | 3 in / 1 out |
| <a id="ig-binary-audit"></a>[`ig-binary-audit`](#ig-binary-audit)<br>Measure the IG Publisher's binary outputs on a pages branch | Read a pages branch's git tree and report the Publisher's binary outputs (full-ig.zip, package.tgz and variants, package.db, validator packs, the definitions/examples/expansions zips, spreadsheets) by name: copies, bytes, and how much of it sits in branch previews. Reads the tree, never a checkout, so a multi-gigabyte branch costs a depth-1 fetch. | <span class="tg-tag tg-shell">shell</span> | `ig-binary-artefacts` | 2 in / 1 out |
| <a id="ig-cache"></a>[`ig-cache`](#ig-cache)<br>FHIR AST cache | Restore, verify, seed and diagnose the prebuilt AST artefacts for an IG. Always try `restore` first: a full AST build via AstExportCli is expensive, a restore is fast. | <span class="tg-tag tg-shell">shell</span> | `compiled-artefact-cache`<br>`ig-ast-delta` | 4 in / 1 out |
| <a id="ig-pages"></a>[`ig-pages`](#ig-pages)<br>Generate an IG instance's reader-facing pages from its artefact index | Write `<instance>/docs/` — an index page, one page per artefact, a page per over-large category and per menu group — from `fhir-artifact-index/index.json` (and `menu.json` when ingested), styled by the template chrome an owning instance ingested. Moved down to this layer because nothing in it was one IG's own (#1767); with `--summary` it writes an instance's landing page, opening with that instance's harness section. For an instance whose docs declare `igSite` (bean `mftp`) it writes no index, menu or category pages — the IG site's own replace them — and only a front-matter `artifacts.md` naming the Tool that drew it. Where an instance declares a visualiser `renderedBy: ig-pages`, it also writes that visualiser's route page, `<base>/<instance>/<id>/`, which opens the artefact index. For an IG whose SOURCE is at hand, `build-ig-site` renders the IG's own pages instead; this is for an IG known only by what it published. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 8 in / 1 out |
| <a id="ig-repo-site"></a>[`ig-repo-site`](#ig-repo-site)<br>Build an IG repository's own site from its cached AST, with no instance declaration | The three checkout scripts the platform's site build runs for a repository that holds an IG and only mounts layers (`index.config.json`): `ig-site:ast` restores the AST from the IG's cache branch (`ig-cache.sh restore`) and judges it, refusing a stale, cannot-tell or absent one (a stale one is accepted for a preview with `SITE_ACCEPT_STALE_AST=1`); `ig-site:compose` derives the artefact index from the AST (binding any IG API sidecars a layer above left in `$SITE_WORK/ig-api/`), writes the thin artefact pages, stages the IG's `input/` and `sushi-config.yaml` (menu read at build time, palette from the webpage theme of the top layer the repository mounts, edit links from its origin) and composes it at the ROOT of the host site source; `ig-site:publisher-pages` serves the AST's resources (`ast-data/` and `<Type>-<id>.json`), the artefact index and the sidecars, refuses a page wearing the IG Publisher's chrome, repairs repeated element ids and stamps `folio-build.json`. Never runs the Publisher and never reads its output. Compose lists the pages it puts in the site in `FOLIO_SITE_UPSTREAM_PAGES`, so the site build reports the IG's own dead links rather than refusing the publish over them. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 4 in / 1 out |
| <a id="ig-site-data"></a>[`ig-site-data`](#ig-site-data)<br>Populate site.data.fhir for a just-the-docs IG render | Write the IG Publisher's Jekyll variables (`site.data.fhir.ig.*`, `packageId`, `canonical`) for ONE implementation guide, from `sushi-config.yaml` or a published IG's `fhir-artifact-index`, so pages written for the Publisher render on just-the-docs unchanged. fhir-harness declares `site.data` as a pass-through Liquid prefix; this is what Jekyll then reads (bean `bamf`). | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 3 in / 2 out |
| <a id="ingest-ig-menu"></a>[`ingest-ig-menu`](#ingest-ig-menu)<br>Ingest an IG's navigation from its sushi-config | Read `menu:` (and the page tree) out of an IG source repository's `sushi-config.yaml` into `fhir-artifact-index/menu.json`, recording the repository and commit it was read at — the declared source `stage-ig-sites` clones. `--check` re-derives it against a checkout; with no `--source` it reports COULD NOT DETERMINE and exits 2, never 0. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 3 in / 1 out |
| <a id="ingest-ig-releases"></a>[`ingest-ig-releases`](#ingest-ig-releases)<br>Record an IG's GitHub releases as pointers to their binary assets | Read an IG repository's GitHub releases and write `fhir-artifact-index/releases.json` (`ig-releases/v1`): each asset's name, size, SHA-256 digest and download URL, never its bytes. The IG site's generated `releases` page lists them (bean `b8ip`). | <span class="tg-tag tg-shell">shell</span> | `ig-binary-artefacts` | 2 in / 1 out |
| <a id="jsonld-vocabularies"></a>[`jsonld-vocabularies`](#jsonld-vocabularies)<br>ValueSet expansions → JSON-LD | JSON-LD vocabularies built from the ValueSet expansions in the published output. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 1 in / 1 out |
| <a id="logical-model-schemas"></a>[`logical-model-schemas`](#logical-model-schemas)<br>Logical models → JSON Schema | A JSON Schema per logical model, from the published FHIR resources. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 1 in / 1 out |
| <a id="pin-ig-terminology"></a>[`pin-ig-terminology`](#pin-ig-terminology)<br>Snapshot a published IG's terminology at its pinned version | Read every CodeSystem concept out of a FHIR IG clone checked out at its pinned tag and write a `folio-pinned-terminology/v1` snapshot: the offline, version-fixed answer `check:term-mapping` resolves its `fhir` target against. Which IG, which pin record and which snapshot path are the caller's (`--pin`, `--out`, `--source`); this layer names none (#1767, stage B′). | <span class="tg-tag tg-shell">shell</span> | `vocabulary-authority` | 1 in / 1 out |
| <a id="sdc-checks"></a>[`sdc-checks`](#sdc-checks)<br>Check an IG's built Questionnaires with CSIRO's SDC libraries | Build-time Structured Data Capture checks, one result per Questionnaire (`sdcChecks[]` of `fhir-questionnaire-wireframe`): `assemble` (`@aehrc/sdc-assemble` 2.0.3: an assemble-root's sub-forms resolve in this IG, and `--out` writes the assembled Questionnaire), `template-extract` (`@aehrc/sdc-template-extract` 1.0.16: extraction from the IG's fixture response yields the expected resources), `populate` (`@aehrc/sdc-populate` 4.7.2: FHIRPath pre-population from a fixture context gives the expected answers) and `behaviour` (`@aehrc/questionnaire-test-toolkit` 0.1.0: the IG's own behavioural test, warn-only). Owner, 2026-10-14: checks, not UI. | <span class="tg-tag tg-shell">shell</span> | `fhir-questionnaire-wireframe` | 4 in / 1 out |
| <a id="stage-ig-sites"></a>[`stage-ig-sites`](#stage-ig-sites)<br>Stage every IG whose instance records its source, one Jekyll site each | For every instance holding `fhir-artifact-index/menu.json` with a sushi-config source, clone the IG at the recorded commit and stage it with `build-ig-site`: the instance's webpage theme (inherited along `needs` when it declares none), its artefact pages and `artifacts` page, its post-processing fills, and an edit link to the IG's default branch. An instance whose docs directory declares `igSite` is staged to be served AT `/<instance>/` with its artefact pages copied in (a collision is refused); otherwise beside it at `/<instance>/ig/`. Prints one `<instance> <jekyll source> <at>` line per IG for the caller's `jekyll build` (beans `bamf`, `mftp`). | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 9 in / 1 out |
| <a id="strip-library-binaries"></a>[`strip-library-binaries`](#strip-library-binaries)<br>Strip binary payloads from Library resources | Remove base64 `content.data` from published `Library` resources, so an IG embedding compiled CQL does not ship the bytes twice. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 1 in / 1 out |
| <a id="strip-library-content"></a>[`strip-library-content`](#strip-library-content)<br>Replace inline Library content with URL references | Replace inline CQL/ELM in `Library` resources with a URL reference to the published copy. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 1 in / 2 out |
| <a id="terminology-index"></a>[`terminology-index`](#terminology-index)<br>Write an IG site's static terminology index from the IG's own cache | Read the IG Publisher's `expansions.json` and `txcache/`, as `ig-cache.sh restore` leaves them, and write `index.json` (gzipped as `index.json.gz` over 1 MB): every code with its system and display, and each value set's codes. The IG site's service worker answers the self-hosted Form Builder's LOINC search from it, and its UCUM search from the vendored full UCUM list, so the site makes no cross-site call (owner, 2026-10-14: "cache + ucum. this is gh-pages so no XSS"). `build-ig-site` runs it for every IG with a Questionnaire. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 3 in / 1 out |
| <a id="valueset-schemas"></a>[`valueset-schemas`](#valueset-schemas)<br>ValueSets → JSON Schema | A JSON Schema per ValueSet, plus the enumeration-response schemas published at the IG root. | <span class="tg-tag tg-shell">shell</span> | `ig-build-pipeline` | 1 in / 1 out |
