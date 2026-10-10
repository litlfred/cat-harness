---
# folio-assistant-n3h9
title: 'HARNESS the smart-* IG repositories: index.config.json remote mounts, Actions gh-pages switched off, agent-run harnessed publish'
status: in-progress
type: epic
priority: high
created_at: 2026-10-10T14:06:53Z
updated_at: 2026-10-10T15:10:00Z
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

## 2026-10-10 — progress, and what this container cannot reach

**Merged.** The Actions gh-pages builds are off:
- smart-hiv#1, smart-base-clinical#1 and smart-core#1: `ghbuild.yml` removed, `fhirbuild.yml` dispatch-only;
- smart-ra#35: `staging.yml` and `ra-mapper.yml` dispatch-only, on the owner's "agent-run as well". This reverses the 2026-10-09 "it needs CI" setting.

**Ownership.** smart-base, smart-trust and smart-immunizations go to session_017QXvm7c7RDYFguWzSxhrMb, once the owner confirms it there.

**Network.** The policy refuses these hosts with 403:
- smart.who.int, worldhealthorganization.github.io
- packages.fhir.org, packages2.fhir.org, build.fhir.org
- iris.who.int, www.who.int, cdn.who.int

The owner says the policy is not theirs to change.

**Workaround.** The FHIR package cache is seeded with `fhir-cache-seed-npm.ts`, through npm, the litlfred/fhir-package-mirror, and `--site-repo smart.who.int.=WorldHealthOrganization/smart-html`; raw.githubusercontent.com is reachable. For smart-base-clinical, 9 of 13 packages seed. Missing at their exact versions:
- `hl7.terminology#7.3.0` (npm has 7.0.1)
- `hl7.fhir.uv.crmi#2.0.0` (npm has 2.0.0-ballot)
- `hl7.fhir.uv.cqm#2.0.0` (npm has 1.0.0)
- `smart.who.int.base#1.0.0`, which is found once `--site-repo` names smart-html

Adding the three HL7 tarballs to litlfred/fhir-package-mirror, with their SHA512SUMS lines, from a machine that can reach packages.fhir.org would unblock SUSHI and the IG Publisher here.

**Seeding source.** The three forks have no gh-pages branch, and WHO's published copies are on refused hosts. So the artefact index must come from a local IG Publisher build, which needs the packages above.

## 2026-10-10 — staging previews are agent-run (owner's decision)
Owner, 2026-10-10, choosing between agent-run previews, PR previews in Actions, and no previews: **"Agent-run previews"**.

The one agent-run build tool this epic delivers also publishes a branch preview at `STAGING/<branch>/`, the path smart-ra's public-comment links expect for the AFTER side. It runs on request, or from a Routine. Nothing in Actions builds a preview on its own.

Until the tool exists, an agent starts `staging.yml` by hand (workflow_dispatch) for any PR that needs a preview.

Done when, added:
- [ ] the build tool takes `--staging <branch>` and writes only `STAGING/<branch>/`, keeping the root site and the other previews
- [ ] smart-ra: a public-comment change set can be reviewed on an agent-built `STAGING/<branch>/` preview
