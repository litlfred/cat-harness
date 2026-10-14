---
# folio-assistant-ymvt
title: 'INDEX.CONFIG.JSON: one root file declares the instantiated harnesses, their sources and which one controls <base>/index.html'
status: in-progress
type: feature
priority: high
created_at: 2026-10-07T22:20:18Z
updated_at: 2026-10-14T20:30:00Z
parent: folio-assistant-7x5n
---

## The owner's decision (2026-10-07)

> migration to index.config.json importing <harness>.config.json information as needed

Then, the same evening: *"go ahead and start the migration NOW to index.config.json, /coordinate as needed"*.

Issue #2483. Proposal `cat-harness/docs/proposals/index-config.md`. Skill `index-config`.

## What it is

A root `index.config.json` (`folio-index-config/v1`) declares:
- which harnesses the checkout instantiates;
- where each one comes from: local `at`, or `remote` (a `remoteMounts` entry without `harness`);
- each one's config: the imported `<name>.config.json`, overlaid by inline fields;
- which harness controls `<base>/index.html` (`site.landing`: an instance name or `hub`).

When the file is present it is authoritative. When it is absent, today's behaviour is unchanged.

## Related

- `1yd7`: landing stickies live with their own instance. `gen-landing-data` now picks the landing instance through `resolveLandingInstance` instead of its own location, so moving the stickies stays a separate, unblocked step.
- `t4xb`: mount path and route collisions. The generated `.gitignore` block lists every mount path the index and the lock name. A route-namespacing decision would read the same index.
- #2468 (`track`, `mount:update`, consent) routes its mount writes through `writeDeclaredMounts`.

## Done when

- [ ] Root `index.config.json` lists every instantiated harness, with `site.landing: "cat-harness"`.
- [ ] `remoteMounts` has moved off `folio-assistant.json`.
- [x] `index.lock.json` has replaced `folio-assistant.mount-lock.json`, with a legacy read fallback.
- [x] `instantiatedHarnessNames`, `resolveLandingInstance` and `readHarnessConfig` read the index first. (2026-10-14: so do `readEffectiveConfig` and every cat-harness-tools reader that opened `<name>.config.json` itself — cat-harness-tools#222.)
- [x] A landing that names an instance the index does not list is an error.
- [x] The reserved `index` stem is skipped by every root scan, and the five re-implemented scans are folded into one.
- [x] `check:landing-instance` reports how the index and the root configs agree — and, since cat-harness-tools#222, every legacy import: a pending migration is said, a file that disagrees with its entry fails.
- [ ] `check:index-ignores` and `index-config:migrate:check` are wired into the gates.
- [x] `init-folio` writes the index — with the scaffold's config INLINE in its entry, and no `<slug>.config.json` (cat-harness-tools#222).
- [ ] `index-config:migrate` converts the separated repositories (follow-up PRs per repo).
- [ ] Retire every `<name>.config.json` whose content belongs inline (owner, restated 2026-10-14: *"i thought ONLY index.config.json"*):
  - [x] The tool: `index-config:migrate --inline --write` folds each imported file into its entry (the readers' own overlay, so no effective config changes) and deletes it; `index-config:inline:check` is red while one remains (cat-harness-tools#222, merged 954ef7b).
  - [x] Every reader index-first, a legacy file only as a REPORTED fallback: `recipeFromConfig`/`recipeRead` (`build-instance-site`, the publish path), `check-published-refs`, `content-adapter`, `folio_init`, `subscribed-harnesses`, `subscriptions-viz` (#222). `kg-instantiate` writes the entry inline when an index exists.
  - [x] smart-ra: `dpi-h-ra.config.json` retired, cat-harness-tools re-pinned to 954ef7b (smart-ra#61, merged 30e57e0); `stage-local --plan` identical.
  - [x] smart-base: `smart-base.config.json` retired (smart-base#62, merged 791d073).
  - [ ] smart-trust: `smart-trust.config.json` retired on `claude/config-inline` (draft smart-trust#37), HELD by the coordinator; needs main merged in and a cat-harness-tools re-pin to ≥ 954ef7b before it merges.
  - [x] Skill and process text that said to create `<name>.config.json`: cat-harness#222 (index-config, feature-staging, kg-subscription, directory-conventions, voice and QA skills), fhir-harness#64 (`ig-build-pipeline`), folio-assistant-core#93 (getting-started.bpmn, folio-intent.dmn, pages-live-gate.dmn, document-authoring).
  - [ ] Other repositories still carrying a root `<name>.config.json` beside an index (none measured on 2026-10-14 beyond the three above; re-measure, e.g. `index-config:inline:check` per repo), and wiring `index-config:inline:check` as a gate once a repository is clean.
  - [ ] Generated copies (`cat-harness/docs/reference/skill-instructions/`, process pages) regenerate from the corrected sources.
