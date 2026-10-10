---
# folio-assistant-kvd2
title: 'RECOMMENDATION SCENARIO: every extracted L1 recommendation gets a user-scenario candidate (persona, process, domain), reusing existing vocabulary and warning when none fits'
status: todo
type: feature
priority: high
created_at: 2026-10-10T14:07:07Z
updated_at: 2026-10-10T14:07:07Z
---

Owner, 2026-10-10: *"also add to the skills, as part of extracting a recommnedation the scenario (user story,role) get described. i am not sure what the 'process' is, but we need one for a role ... skill is to reuse existing vocabulary if possible ... For the measeles example, the process should be chosen from existint smart-immz processes if possivle. warn if not."*

## Shape (decided in session 2026-10-10: L2 nodes, not L1 fields)
L1 records what the document says, verbatim. A role, a process or a scenario is an interpretation, so it is L2. Each extracted recommendation gets a **user-scenario candidate**. It reuses smart-base `UserScenario` (title, id, description, personas) and the smart-kg L2 edges, unchanged:
- `recommendation implementedBy user-scenario`
- `user-scenario involves persona`
- `business-process realises user-scenario`

The scenario description is written as a user story: "As a <persona>, during <process>, I <act> so that <outcome>". Each link records its source (declared / context / inferred), as intake classifications do, and stays a candidate until a person reviews it.

## Reuse first, warn otherwise
Stop at the first hit.
- **persona:** the guide's own personas → smart-base generic `DAK.Persona.*` (ISCO/CDHI) → glossary candidate + WARNING
- **process:** the guide's own processes → the domain catalogue (clinical / public health / health system; none exists yet, see the catalogue bean) → `could-not-determine` + WARNING. Never invent a process.
- **domain:** the guideline-domain scheme (its own bean)

## Measles worked example (expected)
- routine schedule and contraindications → IMMZ.D Administer vaccine (D2)
- campaigns → IMMZ.B
- catch-up → IMMZ.F / IMMZ.D
- recording → IMMZ.D / IMMZ.I
- WARN: case management C01-C12, outbreak response, surveillance

## Done when
- [ ] skill text in smart-base `dak-l1-library` (or a `recommendation-extraction` skill) holding the shape and the precedence
- [ ] an output file per document beside the L1 graph, validated against the smart-kg L2 shape
- [ ] the measles position paper in smart-immunizations has a scenario candidate for each of its 75 recommendations, with warnings listed

Related: 8pzh (L1 extraction from ingested PDFs), 55ao (recommendation block kind), and the ontologist, guideline-domain and process-catalogue beans filed the same day.
Sibling beans: 4nfs (ontologist/terminologist), 398x (guideline domain), 2ipj (process catalogues), 96y4 (IMMZ BPMN), n3h9 (harness the smart-* repos).
