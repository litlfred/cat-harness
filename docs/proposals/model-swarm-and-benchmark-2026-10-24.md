---
title: Model swarm and harness benchmark — requirements draft (amom, oz9e)
parent: Proposals
---

# Model swarm and harness benchmark — requirements draft

Beans `amom` (MODE: test/swarm) and `oz9e` (BENCHMARK: outcome evaluation),
epic `5a3l`. Sources: folio-assistant issue
[#363](https://github.com/litlfred/folio-assistant/issues/363) and the
ARG-Designer mapping, issue
[#1491](https://github.com/litlfred/folio-assistant/issues/1491) row B8.

**A CRDM draft for the owner to review. Nothing here is built.** The owner
asked for it on 2026-10-24 (card "C. CRDM drafts for both"). The two beans
are drafted together because `oz9e` cannot be measured without the
independent queues `amom` defines.

**Stage: `draft`.** Every requirement below is proposed. None is approved.
The owner answered Q2–Q5 on 2026-10-24 (below); Q1 is open.

## Consolidation: the benchmark is the test process (owner, 2026-10-24)

The owner asked whether QA results, at least the machine ones, can feed the
task bank and spec-kit, and whether the infrastructure can be shared. **Most of
what this draft asks for already exists as the test process** (arc `3fva`,
proposal `qa-reports-branch-and-test-process-2026-10-01`). Beans `ygzh`, `3o5b`
and `ff09` are completed. So the benchmark should be built on it, not beside
it.

| this draft needs | already on main | status |
|---|---|---|
| a task bank | `test-plan/v1` (`schemas/test-plan.ts`): cases, assertions, fixed or seeded test data, `requirements[]` | ✅ built; one plan, `test/plans/crdm-detect-evaluation.test-plan.json` |
| one record per run | `folio-test-run/v1`: separate data and process hashes, `plan` and `sut` refs | ✅ built; this covers **REQ-009** (replay) |
| the result is a report (REQ-006) | `test-report/v1`: per-case verdicts and a rollup per plan, written to `qa-reports` under `tests/<plan>/<sut>/<run>/` | ✅ built; it replaces the `wp49` report location |
| who scores (Q3 = D) | reviewer `kind`: `script`, `agent` or `human` (`TestReviewerSchema`, `QaWitness`) | ✅ built |
| asking before a run (REQ-007) | `test-plan-execution.bpmn`: requester, tester, untainted checker, certifier; `test-certification.dmn` | ✅ built |
| **which model ran** (REQ-002) | `sut` is `{actor, version, reach}`, with **no model and no configuration** | ❌ **gap 1** |
| with vs without the harness (REQ-004) | nothing marks a configuration | ❌ **gap 1** (same field) |
| independent queues (N1) | one plan executed against several SUTs; the rollup stays per plan, so comparing SUTs on one plan is allowed | ⚠️ **gap 2**: no multi-SUT run or side-by-side view |
| outcome and cost (REQ-005) | the run records outcome; cost and tokens have no field | ❌ **gap 3** |

**Machine QA results as test cases.** Test-plan assertion ids are criterion
ids (proposal §3.2), so every machine (`script`) QA criterion can already
serve as an assertion, and its producer as the scorer.

The QA history also gives tasks with known answers. Take a machine finding
that was later fixed: the artefact before the fix and the finding become the
case, and "the checker passes" is the assertion. 1,249 result files sit under
`test/results/` on main, and git history holds the before and after of each
fix.

That is **gap 4**: a generator that turns fixed machine findings into
`test-plan/v1` cases. It belongs with `vm6m` (test data, in progress, agy's).
Agent and human verdicts are not used as ground truth, only machine ones, as
the owner said.

**spec-kit and CRDM.** A plan's `requirements[]` takes `req:` ids, so a
**graduated** requirement links to its tests already. A spec-kit spec in
draft has only `FR-`/`SC-` ids in an issue comment, so its success criteria
cannot point at a plan case yet. That is **gap 5**, and it is the same
missing link as Q1 gap 2.

**What is left for `amom` and `oz9e`.** Five gaps instead of nine
requirements:

1. `sut` gains `model` and `configuration`.
2. A run of one plan against N SUTs, with a side-by-side view.
3. Cost and token fields on a run, with unknown recorded as `unknown`.
4. A generator from fixed machine findings to plan cases.
5. A spec-kit `SC-` to plan-case link.

The shared-queue mode stays today's swarm (Phase 2). REQ-001 to REQ-009 below
are kept for the record. The mapping above says which ones are already met.

## Phase 1 — needs

| # | need, in the owner's words | bean |
|---|---|---|
| N1 | "test/swarm mode: may have a stack of models, to queue work on (a cross-model swarm mode). shared or indepedent work queues." | amom |
| N2 | B8: "they measure accuracy on benchmarks; we check structure." The owner, 2026-09-29: that gap is **intended to be closed**. | oz9e |

**What exists and is reused, not rebuilt:**

| need | already here | gap |
|---|---|---|
| a shared work queue | `beans/`: claim-before-you-work, never resolve a sibling's bean | assumes one agent per item |
| asking before a swarm | `swarm-management` skill: agent count, model level and cost, asked every time | one model class per swarm |
| who made a result | `schemas/attribution.ts`: an `agent` attribution **requires** `model` (`ModelIdSchema`, `bootstrap-tools/schemas/model-registry.ts`) | nothing writes it for a swarm result |
| where a benchmark result lives | bean `wp49` (completed): a benchmark is a **report**, not KG content | no report exists |
| which tool version ran | bean `3sbm`: tool releases and a PROV-O run record (`schemas/run-context.ts`) | steps 2–8 open |

## Phase 2 — the two modes are two processes

Shared and independent queues are **different modes, not one setting**
(`amom` §2). Conflating them yields a benchmark that compares different
items.

| | shared queue (throughput) | independent queues (comparison) |
|---|---|---|
| purpose | get work done faster | compare models, or with vs without the harness |
| an item is taken by | any one model | **every** model in the stack, separately |
| store | `beans/` (it already is the shared queue) | **not** `beans/`: a run is a test execution, not work-plan work (`AGENTS.md`: never bulk-create machine-generated queues as beans) |
| result | the bean's own outcome | one result per (item, model, configuration) |
| output | the work | a `wp49` report |

The proposed BPMN shape (for the BA to confirm before it is drawn):

1. **Process_BenchmarkRun** — Owner_Approves (swarm ask: models, count,
   cost) → Load_TaskBank → *for each model × configuration*: Run_Item
   (multi-instance) → Record_Result → Score → Write_Report.
2. The shared mode needs **no new process**. It is today's swarm, with
   one change: each result records its model (REQ-002).

## Phase 3 — requirements (draft)

### Must-have

- [ ] **REQ-001** (SHALL) — A run declares its mode
  - _Description:_ every swarm or benchmark run states `shared` or
    `independent` before it starts, and the record keeps it.
  - _Acceptance:_ `SC-1` (test) — a run record with no mode fails its
    schema; `SC-2` (test) — a `shared` run cannot be passed to the
    report writer.
  - _Source:_ N1; `amom` §2. _Sign-off owner:_ the owner. _Scope:_ 1 bean, 1 PR.
- [ ] **REQ-002** (SHALL) — Every result records the model that produced it
  - _Description:_ each result carries an `agent` attribution with its
    `model`, reusing `schemas/attribution.ts`. No second attribution shape.
  - _Acceptance:_ `SC-1` (test) — a result without a model is refused;
    `SC-2` (inspection) — the schema imports `AttributionSchema`, not a copy.
  - _Source:_ N1, N2; `amom` box 2. _Sign-off owner:_ the owner. _Scope:_ 1 bean.
- [ ] **REQ-003** (SHALL NOT) — Independent runs do not write beans
  - _Description:_ an independent-queue run keeps its items and results
    outside `beans/`, so the claim protocol is unchanged.
  - _Acceptance:_ `SC-1` (test) — a run over N models leaves `beans/`
    byte-identical; `SC-2` (inspection) — the skill states the reason.
  - _Source:_ `amom` box 3 and its open BA question. _Sign-off owner:_ the owner.
- [ ] **REQ-004** (SHALL) — The harness itself is a variable
  - _Description:_ the same task bank runs **with** the harness (process,
    roles, skills) and **without** it, per model.
  - _Acceptance:_ `SC-1` (test) — a benchmark config with only one
    configuration is refused as not a comparison.
  - _Source:_ N2; `oz9e` "What this bean is for". _Sign-off owner:_ the owner.
- [ ] **REQ-005** (SHALL) — Outcome and cost, both
  - _Description:_ per (item, model, configuration): success or score,
    tokens in and out, wall-clock, and the tool release that ran (`3sbm`
    run context).
  - _Acceptance:_ `SC-1` (test) — a missing cost field is reported as
    `unknown`, never as 0 ("no data is not zero").
  - _Source:_ N2. _Sign-off owner:_ the owner.
- [ ] **REQ-006** (SHALL) — The result is a report, not KG content
  - _Description:_ written where `wp49` puts reports; nothing is added to a
    folio's graph.
  - _Acceptance:_ `SC-1` (inspection) — the writer's output path is the
    report location, checked by `check:requirements`.
  - _Source:_ `wp49`. _Sign-off owner:_ the owner.
- [ ] **REQ-007** (SHALL) — Every run is asked for
  - _Description:_ the swarm ask (agent count, models, rough cost) is made
    every time, per run, as `swarm-management` already requires.
  - _Acceptance:_ `SC-1` (inspection) — Process_BenchmarkRun starts with
    an owner task, and no trigger starts it on a schedule.
  - _Source:_ `AGENTS.md`, `swarm-management`. _Sign-off owner:_ the owner.

### Should-have

- [ ] **REQ-008** (SHOULD) — Comparable with ARG-Designer
  - _Description:_ the report states its setup (models, bank, scoring,
    seeds or temperature) well enough to set beside ARG-Designer's table.
  - _Acceptance:_ `SC-1` (review) — #1491 row B8 links to the report.
  - _Source:_ `oz9e` box 4.
- [ ] **REQ-009** (SHOULD) — A run can be replayed
  - _Description:_ the bank, the config and the tool releases are hashed,
    so a second run of the same inputs is identifiable as the same run.
  - _Source:_ vm6m's hashing dependency (claimed by another session).

### Deliverables summary

| ID | Title | Priority | Beans | Status |
|---|---|---|---|---|
| REQ-001 | A run declares its mode | Must | amom | ⬜ |
| REQ-002 | Every result records its model | Must | amom | ⬜ |
| REQ-003 | Independent runs do not write beans | Must | amom | ⬜ |
| REQ-004 | The harness itself is a variable | Must | oz9e | ⬜ |
| REQ-005 | Outcome and cost, both | Must | oz9e | ⬜ |
| REQ-006 | The result is a report | Must | oz9e | ⬜ |
| REQ-007 | Every run is asked for | Must | amom, oz9e | ⬜ |
| REQ-008 | Comparable with ARG-Designer | Should | oz9e | ⬜ |
| REQ-009 | A run can be replayed | Should | oz9e | ⬜ |

### UI / wireframe

Not applicable in this draft. The report's page, if it gets one, goes
through `wireframe-design-review` before it is built.

## Owner answers, 2026-10-24

| # | question | answer |
|---|---|---|
| 1 | which methodology governs? | **open**: analysis below |
| 2 | which task bank? | **B, maybe A**: harness-native tasks first; a public set only if it fits. Candidate list below |
| 3 | who scores? | **D**: mechanical checks first, an LLM judge only where no check exists. The judge carries its own attribution (REQ-002) |
| 4 | which models? | **B, other vendors too.** Gemini already runs through another agent. **Manual multi-model runs now**: a person or agent runs each model and records its result. Coordinated API runs come later. **Open-weight models are in scope** |
| 5 | budget per run? | **D**: no ceiling. Each run is asked for with its own estimate (REQ-007) |

What the answers change:

- **REQ-002** must hold for a manual run: a result typed in by hand still
  carries its `model`. `ModelIdSchema` accepts any runtime id, but the registry
  (`bootstrap/models/models.json`) lists only Claude and Gemini models today.
  An open-weight model needs an entry there, `validation: unverified` at
  least, before its results can be attributed.
- **REQ-005**: a manual run's cost may be unknown. It is recorded as
  `unknown`, never as 0.
- **REQ-007**: the ask before each run states its own estimate. There is no
  fixed ceiling.

## Q1 — spec-kit or CRDM: what a rewrite means

**What the house router says.** `crdm-detect` sends a change to the
platform's own capability, raised by a tool developer and with a
content-agnostic answer, to `spec-kit`. It sends stakeholder-facing WHO/IG
work to `crdm`. The two are never blended (`methodology-adoption`).

**How this work splits.** The machinery is content-agnostic: the two queue
modes, attribution, scoring and the report. That is spec-kit's by the
router. A **smart-\* task bank** (Q2) is not: what counts as a correct DAK
or IG artefact is WHO content. If it needs WHO stakeholder sign-off, that is
CRDM's.

**Recommended: split, not blended.** A spec-kit spec for the machinery
(`amom` + `oz9e`), and later a separate CRDM requirement set for the smart-\*
task bank, only if it needs stakeholder sign-off.

**What a spec-kit rewrite involves:**

| | now (this CRDM draft) | as a spec-kit spec |
|---|---|---|
| where it lives | committed, `docs/proposals/` | a **comment on the governing issue**, not committed (FR-013); this PR would close unmerged |
| shape | REQ-001…009, open questions | **User Scenarios** (P1, P2… with Given-When-Then), **FR-001…**, **SC-001…** (technology-agnostic), Edge Cases, Assumptions |
| open questions | a list | `[NEEDS CLARIFICATION]` markers, which block `Adjudicated` until a person settles them |
| check | none | `check:spec --issue <n>` |
| after delivery | beans under `5a3l` | FRs graduate into `req:*` statements in the governing skill (`swarm-management`), with tests |

The answers to Q2–Q5 carry over unchanged, and nothing built depends on the
current form.

**How spec-kit is used today, measured on main (2026-10-24).**
`check:spec` exists (`cat-harness-tools/scripts/check-spec.ts`), but **no CI
workflow runs it**. `processes/` holds **no spec-kit process**. CRDM has nine
(`crdm-needs` … `crdm-close`). `docs/requirements/` holds only its README and
index, so no CRDM requirement set has been filed either.

**Linkages that exist:** one requirement definition shared by both
(`specification-management`, bootstrap `requirement.schema.json`); the same
sign-off codes (`adjudication`, `adjudication-requirement-set`); the router
(`crdm-detect`); beans as the work plan.

**Linkages that are missing:**

1. **spec-kit has no BPMN.** Its cycle (specify → plan → tasks → implement →
   converge) is only in a skill. No Task ties its steps to beans or to a
   sign-off the way `crdm-signoff.bpmn` does.
2. **No shared terminal store.** A CRDM set ends in `docs/requirements/` as a
   `RequirementSet` that `check:requirements` gates. A spec-kit spec ends as
   `req:*` statements in a skill. No process step moves either into the
   other, so "one requirement definition" is not checked end to end.
3. **No hand-off between tracks.** The router picks one at the start. Nothing
   says what happens when a spec-kit spec finds a part that needs stakeholder
   sign-off, which is exactly the smart-\* task bank case.
4. **`check:spec` is not a gate.** A spec can skip the template and nothing
   fails.
5. **This draft sits in `docs/proposals/`**, which is neither track's home: a
   symptom of 1–3.

Each gap is a candidate bean under the SDLC epic. None is fixed here.

## Q2 — candidate benchmarks for smart-\* authoring and consumption

Searched 2026-10-24. **No published benchmark covers WHO SMART Guidelines or
DAK authoring**, so a harness-native bank (answer B) is needed whatever
happens. The public ones below are partial fits, listed for answer A.

| benchmark | what it tests | fit |
|---|---|---|
| [FHIR-AgentBench](https://arxiv.org/abs/2509.19319) (Verily, 2025) | agents answering clinical questions over MIMIC-IV on FHIR | **consumption**: querying FHIR data |
| [MedAgentBench](https://arxiv.org/abs/2501.14654) (Stanford, 2025) | agent tasks in a virtual FHIR EHR | **consumption**: acting through a FHIR API |
| [Flexpa LLM FHIR eval](https://www.flexpa.com/eval) / [JMIR 2025](https://www.jmir.org/2025/1/e73540) | FHIR knowledge and resource handling, open source | **authoring**: closest to FHIR resource and profile work |
| [MedGUIDE](https://neurips.cc/virtual/2025/124905) (NeurIPS 2025) | following clinical guideline decision trees | **consumption**: guideline logic, like DAK decision tables |
| [CPGPrompt](https://arxiv.org/html/2601.03475v1) | turning clinical guidelines into executable decision support | **authoring**: guideline → logic, the L2 → L3 step |
| [Kourani et al. 2024](https://arxiv.org/pdf/2412.00023) | LLMs generating process models from text | **authoring**: DAK business processes (BPMN) |
| [BPMN Assistant](https://arxiv.org/pdf/2509.24592) | LLM-based BPMN editing and generation | **authoring**: BPMN |
| [HealthBench](https://arxiv.org/abs/2505.08775) (OpenAI, 2025) | 5,000 health conversations scored against physician-written rubrics | **general health**: not SMART-specific, but rubric scoring fits answer D |

Not found: a public benchmark for **CQL authoring**, or for **terminology
mapping** to SNOMED CT, ICD-11 or LOINC. Studies exist, but there is no
shared task set.

**A harness-native bank could draw on** (answer B):

- Closed beans with known outcomes.
- The SUSHI and IG Publisher builds of the smart-\* IGs: does generated FSH
  compile? (a mechanical check, answer D).
- DAK decision tables against their published test cases.
- `check:*` gates as scorers.

**Comparability with ARG-Designer** (REQ-008) needs its public set (MMLU,
GSM8K, HumanEval). None of the rows above is in it, so REQ-008 is weak under
answer B. That is for the owner to keep or drop.

## What happens after sign-off

Phase 4 impact analysis, then beans: one feature per REQ group (amom:
REQ-001–003, 007; oz9e: REQ-004–006, 008–009), filed under `5a3l`.
