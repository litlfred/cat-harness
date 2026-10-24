---
# folio-assistant-2ipj
title: 'PROCESS CATALOGUES: clinical (smart-base-clinical holds none yet), public health and health system (from the DTH documents)'
status: completed
type: feature
priority: normal
created_at: 2026-10-10T14:06:52Z
updated_at: 2026-10-24T07:25:00Z
parent: folio-assistant-uhkv
---

Owner, 2026-10-10: *"there is a WHO/smart-base-clinical ... which will be the catalog of clinical processes/encoutners. Assume that such analouges will exist for public health and health systems (these will come fromt he already ingested Digiatl Transformation Handbooks (for supply chain architecture, product catalogu,,,) and more are coming)."*

## Measured 2026-10-10
WorldHealthOrganization/smart-base-clinical and litlfred/smart-base-clinical (b2d0df3) hold **no** processes, encounters, personas, CodeSystems or ValueSets:
- 24 CPG-derived profiles (`sg-encounter`, `sg-careplan`, …)
- one extension
- the WHOCommon CQL library

smart-core is a pre-SUSHI data-element IG with no processes either. So the clinical catalogue does not exist yet. The public health and health-system catalogues would come from the DTH documents already ingested in smart-base's library.

## Done when
- [x] a decision on where each catalogue lives (smart-base-clinical for clinical; new or existing IGs for public health and health system) and on its shape (BusinessProcessWorkflow + BPMN, with persona ActorDefinitions)
- [x] the recommendation-scenario extraction looks catalogues up in its precedence order, and reports "catalogue absent" until they exist

_2026-10-16T10:45:00Z_ — Parented to `uhkv` (SMART STACK) by subject: it had no parent, so it sat under no epic or goal and failed the parent check on main (https://claude.ai/code/session_01NUrhvvMEwU5MmPW4L2w9jP).

_2026-10-24T07:40:00Z_ — Second done-when item checked on smart-base main (782f011): `scripts/l1-recommendation-scenarios.ts` looks a process up as guide → domain process catalogue → `could-not-determine` (decision D4) and reports "domain process catalogue absent"; `library/9789240116191-eng/l1-extraction/scenarios/scenario-warnings.md` shows it firing for all 18 DTH product-catalogue recommendations. The placement of the public-health and health-system catalogues is the one item left, put to the owner (https://claude.ai/code/session_01UbCbH19GrhqDNakmbgQTF3).

_2026-10-24T07:25:00Z_ — **Completed.** Owner ruled 2026-10-24: *"eventually we will have WHO/who-iris. leave in smart-base for now, but bean up migration once WHO/who-iris is live"*. So clinical goes to smart-base-clinical (2026-10-10), and public health and health system stay in smart-base, shaped as BusinessProcessWorkflow + BPMN with persona ActorDefinitions. The move to WHO/who-iris is bean `17iw`.
