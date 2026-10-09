---
# folio-assistant-7eak
title: 'Dublin Core renderings: DC XML + JSON(-LD) per record, as a skill and tool in the rendering pipeline, published to gh-pages; who-iris links to both'
status: completed
type: task
created_at: 2026-09-30T08:54:51Z
updated_at: 2026-10-09T19:30:00Z
parent: folio-assistant-7deg
---

## The ask, owner 2026-09-30 (verbatim)

> do we render the proper xml for dublin core?  it should be in rendering ppiple as skill and tool.   i tihnk.  and then pushed to gh-pages
> that is in cat-harness... bean up for now
> (and who-iris should link to json and xml renderings)

## What is true today (measured 2026-09-30, not yet investigated in depth)

- Dublin Core terms are used as JSON-LD predicates (`dcterms:*` — e.g. `dcterms:isReplacedBy`, `dcterms:requires`, `dcterms:source` in the glossary export). No step renders a record as **Dublin Core XML** (the `oai_dc` / `dc:` XML form a catalogue harvester reads), and nothing publishes one to gh-pages.
- Bean `7deg` (parent) introduces Dublin Core in folio-assistant-core; it does not cover rendering or publication.

## Done when

- [ ] A skill in cat-harness says which records get a DC rendering, which DC XML form (oai_dc vs qualified DC), and how each field maps from the node's own data (never composed).
- [ ] A Tool node + script renders DC XML and the JSON(-LD) form for each such record, deterministically, with a `--check`.
- [ ] The docs-site pipeline publishes both beside the record's page on gh-pages.
- [ ] who-iris's pages link each record to its JSON and XML renderings.
- [ ] A gate fails when a record that should have a rendering lacks one, or a rendering is stale.

## Not now

Owner: keep the primary focus on the bootstrap / bootstrap-tools staging separation (bean `xsqm`). This is queued, not started.

## Claim

Claimed by claude/dublin-core-renderings (session https://claude.ai/code/session_01CVVoavPoCHMLA7AASxG8cH). Issue #1840.

## Completed 2026-10-09 — each done-when checked on evidence, not on a PR landing (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)

The claim above (`claude/dublin-core-renderings`) was last touched 2026-10-02 and the work it names is on main in both repositories; this closes it on what is true today, item by item:

- [x] **skill** — `folio-assistant-core/skills/.../dublin-core-renderings.md`: which records get a rendering (exactly those an item names through `metadataRef`), which XML form and why, the field mapping from the record's own data, and the gate.
- [x] **Tool node + script, deterministic, with `--check`** — `dublin-core-render` in `folio-assistant-core/tools/index.ts`; `scripts/dc-render.ts`.
- [x] **published beside the record's page** — measured on a local build of who-iris's own site (the publish Routine's steps 3–7): `/who-iris/dublin-core/<stem>.dc.xml` and `.dc.jsonld` for all 3 records.
- [x] **who-iris links each record to both** — every item page carries `href="dublin-core/<stem>.dc.xml"` and `.dc.jsonld` (6 links over 3 pages); a whole-site link check finds 0 unresolved hrefs.
- [x] **a gate fails on a missing or stale rendering** — watched: with `who-pub-tps-931.dc.xml` removed, `bun run dc:render:check` in who-iris exits 1 ("1 problem(s)"); restored, it reports "3 record(s), 6 rendering(s) current, no orphans". In the separated who-iris the gate runs as step 3 of the publish Routine (no GitHub Actions, owner's rule), not in `code-quality-gates.yml` as the skill's table still says — that row is monorepo-era.
