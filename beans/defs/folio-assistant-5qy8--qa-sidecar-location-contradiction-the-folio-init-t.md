---
# folio-assistant-5qy8
title: 'QA SIDECAR LOCATION CONTRADICTION: the folio_init template commits *.qa.json while AGENTS.md puts QA on the qa-reports branch'
status: completed
type: bug
priority: normal
created_at: 2026-10-04T15:10:09Z
updated_at: 2026-10-09T11:42:00Z
parent: folio-assistant-3fva
---

Recorded from the qou work-plan analysis, 2026-10-04 (session https://claude.ai/code/session_01NdDGeP1SyShmoUssLuRZ91). Not started: recorded so the gap has an owner. The owner ruled 2026-10-04 for qou: use the cat-harness qa-reports branch. The folio_init template (cat-harness/templates/) still writes a layout that commits sidecars on main. Reconcile the template with skills/sdlc/sdlc-core/qa-reports.md.

## Closed 2026-10-09

Reconciled folio workflow templates in `templates/document/github/workflows/` with `skills/sdlc/sdlc-core/qa-reports.md`:
- `templates/document/github/workflows/qa-sweep-nightly.yml`: Replaced the rolling PR workflow that committed `*.qa.json` sidecars to `main` with a publish step using `qa-store.ts publish` (`qa:publish`) targeting the orphan `qa-reports` branch (`main/<sha>/`), keeping `main` clean. Updated permissions to `contents: write` (removing `pull-requests: write`).
- `templates/document/github/workflows/qa-sweep.yml`: Updated comments and schema sanity checks to reflect that derived QA verdicts live in `test/results/` and are stored on the orphan `qa-reports` branch, while authored judgements and reviewer attestations stay on `main` in `test/attestations/`. Added attestation schema validation (`qa-attestations/v1`).
- `templates/document/github/workflows/section-title-audit.yml`: Updated documentation and step comments to reflect that machine findings belong with QA results on the orphan `qa-reports` branch while agent judgements/attestations remain on `main`.

Commit: `ddbba9a05ae225ba0a4b228b5bdd371efd7dc4a4` (pushed to `origin/main`).
Verification: Template YAML validation tests passing via `bun test scripts/tests/init-folio.test.ts -t "every template parses as YAML"`.
