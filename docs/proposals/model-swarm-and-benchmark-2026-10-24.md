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

## Open questions for the owner (the BA)

These need the owner's answer before sign-off. They are not decided here.

1. **Which methodology governs?** `crdm-detect` routes tool-developer,
   content-agnostic work to `spec-kit`, and this is that kind of work. The
   owner chose a CRDM draft. Keep CRDM, or move it to spec-kit?
2. **Which task bank?** Public benchmarks (MMLU, GSM8K, HumanEval…) for
   comparability with ARG-Designer, a bank of harness-native tasks (for
   example closed beans with known outcomes), or both. `oz9e` names this as
   a CRDM question.
3. **Who scores?** A mechanical check, an LLM judge, or a person. An LLM
   judge is itself a model and would need its own attribution.
4. **Which models are in the stack?** Only Claude models, or other vendors
   too. Other vendors need credentials this platform does not hold today.
5. **Budget per run.** A ceiling the ask in REQ-007 can be held to.

## What happens after sign-off

Phase 4 impact analysis, then beans: one feature per REQ group (amom:
REQ-001–003, 007; oz9e: REQ-004–006, 008–009), filed under `5a3l`.
