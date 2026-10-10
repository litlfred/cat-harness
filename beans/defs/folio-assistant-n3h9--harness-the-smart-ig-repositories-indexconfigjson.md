---
# folio-assistant-n3h9
title: 'HARNESS the smart-* IG repositories: index.config.json remote mounts, Actions gh-pages switched off, agent-run harnessed publish'
status: todo
type: epic
priority: high
created_at: 2026-10-10T14:06:53Z
updated_at: 2026-10-10T14:06:53Z
---

Owner, 2026-10-10: *"you can work onthe litlfred/smart-* go ahead and harness them with index.config.json and make sure they stop the ghpages currrent redering pipleine and use to the harnessed one"* (fhir-harness, smart-base harness). Repositories: *"smart-base, smart-base-clinical, smart-core, smart-immunizations, smart-hiv and smart-trust smart-ra"*.

## State measured 2026-10-10
- **Push-triggered gh-pages builds:**
  - smart-hiv: `ghbuild.yml` on push
  - smart-base-clinical: `ghbuild.yml` on push
  - smart-core: `ghbuild.yml` on push
  - smart-ra: `staging.yml` on push to main
- **Manual-only:** smart-base (`ghbuild` is workflow_call only; `folio-site.yml` and `ci.yml` by dispatch), smart-immunizations and smart-trust (`fhirbuild` by dispatch).
- **Submodules:** smart-base and smart-ra carry the folio-assistant submodule. fhir-harness's `templates/ig-repo-site/folio-site.yml` predates the separation (it assumes the submodule and runs in Actions).
- **Another session** (session_017QXvm7c7RDYFguWzSxhrMb, "Epic separation status review") is working on smart-base, smart-trust and smart-immunizations (claude/seed-smart-base, 48a6 rollout). It was messaged before any push to those three.

## Decided (session 2026-10-10)
Agent-run publishing, as for who-iris: an `index.config.json` remote-mounting smart-base (whose closure brings in fhir-harness, core and the harness layers), no submodule, and one parameterised build tool driven by a Routine. Each repository's gh-pages Actions deploy is switched off.

## Done when, per repository
- [ ] `index.config.json` declares the instance and its remote mounts, with consent recorded
- [ ] no push- or PR-triggered workflow writes gh-pages
- [ ] the harnessed site is built from an empty directory and published by an agent; its Pages run succeeds
- [ ] smart-base: the per-branch IG previews under `branches/` survive
- [ ] smart-core (pre-SUSHI): builds, or is recorded as not buildable with the reason
