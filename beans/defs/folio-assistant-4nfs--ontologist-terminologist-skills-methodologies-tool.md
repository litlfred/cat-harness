---
# folio-assistant-4nfs
title: 'ONTOLOGIST / TERMINOLOGIST: skills, methodologies, tools and processes for reviewing content and classifying/coding it'
status: todo
type: feature
priority: high
created_at: 2026-10-10T14:07:07Z
updated_at: 2026-10-10T14:07:07Z
---

Owner, 2026-10-10: *"(add bean: need to provide ontologist/termonologist skills+methdologies+tools+processes when trying to review content and classify/code it)"*.

## What exists (measured 2026-10-10)
- **Skills.** core `skills/library/cataloguing/ontologist.md` (scan → ambiguities → formal glossary → mapping); `glossary-terms.md` ("reference first, define second", candidate/authored/could-not-extract); `glossary-build.md`.
- **Schemas.** core `schemas/glossary.ts` (`folio-glossary/v1`, SKOS); harness `schemas/pinned-terminology.ts`; intake `classifications` (scheme, code, source declared/context/inferred, basis); smart-base L1 `terminology-code` with the `KGTerminologySystem` codes (SMART, ICD-11, ICF, ICHI, SNOMED-GPS, ATC, UHC, CDHI).
- **Open beans.** 5yhm (identification, mapping, adjudication), 2i5f (extractor vs terminology), 7wou (completed).

## What is missing
- **Roles.** No terminologist or ontologist reviewer role in the harness role graph. smart-base has `SGAuthoring.Persona.terminologist` for DAK authoring, but nothing binds it to a review process here.
- **Method.** No methodology for classifying or coding content during review: which scheme for which slot (ICD-11 condition, ICHI/CDHI intervention, ISCO persona, ATC medicine, the guideline domain), what precedence, and when to mint rather than reuse.
- **Process.** No BPMN process with a terminologist lane.
- **Tools.** No terminology lookup Tool behind a declared contract. OCL was named in 5yhm.

## Done when
- [ ] a reviewer role and a process (BPMN) for "classify and code content", with a terminologist/ontologist lane
- [ ] a methodology naming the scheme for each slot and the reuse-first precedence, citing glossary-terms
- [ ] a Tool contract for terminology lookup, even if its first implementation is local code lists only
- [ ] the recommendation-scenario extraction (see its bean) cites this methodology for persona, process and domain coding

Related: 5yhm, 2i5f (terminology), 8pzh (L1 extraction).
