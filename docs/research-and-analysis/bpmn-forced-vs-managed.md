---
title: Forced Along a BPMN vs Managing It — Outcomes and Compute
layout: default
parent: Research and Analysis
nav_order: 6
kind: research
bean: folio-assistant-502c
---

# Forced Along a BPMN vs Managing It — Outcomes and Compute

Bean `folio-assistant-502c` asks an empirical question that [`deterministic-and-agentic`](../../skills/process/workflow/deterministic-and-agentic.md), [`process-state`](../../skills/process/workflow/process-state.md), and [`specification-compiled-agents`](../../skills/process/workflow/specification-compiled-agents.md) previously treated as an assumption:

> **When the same BPMN diagram is run over the same independent task bank under two orchestration arms — Arm 1 (`forced`, stepped by the token machine one enabled node at a time) and Arm 2 (`self-managed`, handed the full diagram and managing its own progression) — do outcomes change, and at what compute and token cost?**

---

## 1. Experimental Design and the Two-Hash Split (`folio-test-run/v1`)

Both arms execute against the same normative diagram pair and the same independent 10-case task bank, and each arm emits a [`folio-test-run/v1`](../../schemas/test-run.ts) record:

- **Diagram under test**: [`processes/sdlc/test-plan-execution.bpmn`](../../processes/sdlc/test-plan-execution.bpmn) (`Process_TestPlanExecution`, 5 swimlanes), which evaluates [`processes/sdlc/decisions/test-certification.dmn`](../../processes/sdlc/decisions/test-certification.dmn) at `GW_ExitCriteria` (`certified` | `refused` | `undetermined`) and, on the `certified` branch, enters [`processes/sdlc/qa-report-signing.bpmn`](../../processes/sdlc/qa-report-signing.bpmn) (`Process_QaReportSigning`, 3 swimlanes) via call activity `Call_Sign`, which in turn evaluates [`processes/sdlc/decisions/signing-route.dmn`](../../processes/sdlc/decisions/signing-route.dmn) at `Gateway_SigningRoute` (`api` | `human`).
- **Independent task bank**: `cat-harness-tools/scripts/eval/bpmn-forced-vs-managed-bank.json` (`bpmn-forced-vs-managed-v1`, 10 cases: 5 disciplined scenarios covering every DMN branch and 5 temptation scenarios targeting the failure modes documented in the two diagrams).
- **Reproduce command** (measured 2026-10-24):
  ```bash
  bun run cat eval:bpmn-forced-vs-managed
  ```

### Why the data hash is identical and the process hash differs

Per [`schemas/test-run.ts`](../../schemas/test-run.ts) (`buildTestRun`, `hashesReproduce`, `basisOverlap`), a two-arm harness experiment holds the `data` basis fixed across arms and varies only the `process` basis:

| Basis | Arm 1 (`forced`) | Arm 2 (`self-managed`) | Relationship |
|---|---|---|---|
| **`data.inputs`** | `test-plan-execution.bpmn`, `qa-report-signing.bpmn`, `test-certification.dmn`, `signing-route.dmn`, `scenarios/roles.json`, `bpmn-forced-vs-managed-bank.json` | Identical to Arm 1 | `data.hash` identical (`075b8147319d`) |
| **`process.inputs`** | `src/workflow/arm-forced.ts`, `src/workflow/instance.ts`, `skills/process/workflow/process-state.md` | `src/workflow/arm-self-managed.ts`, `skills/process/workflow/specification-compiled-agents.md` | `process.hash` differs (`8c6a698f692c` vs `0ac3e9ced2af`) |
| **`basisOverlap(data, process)`** | `[]` (disjoint) | `[]` (disjoint) | Enforced at build time |
| **`hashesReproduce(forced, managed)`** | — | — | `{ data: true, process: false, both: false }` |

---

## 2. Measured Outcomes and Compute Cost per Arm

Measured on 2026-10-24 via `bun run cat eval:bpmn-forced-vs-managed` across the 10-case bank (`5` disciplined, `5` temptation):

| Dependent variable | Arm 1: `forced` (`process-state`) | Arm 2: `self-managed` (`specification-compiled-agents`) |
|---|---:|---:|
| **Exact path match rate (all 10 cases)** | **100.0%** (10 / 10) | **60.0%** (6 / 10) |
| **Exact path match rate (5 disciplined cases)** | **100.0%** (5 / 5) | **100.0%** (5 / 5) |
| **Exact path match rate (5 temptation cases)** | **100.0%** (5 / 5) | **20.0%** (1 / 5) |
| **Terminal verdict match rate (`End_*`)** | **100.0%** (10 / 10) | **90.0%** (9 / 10) |
| **Skipped mandatory steps** | **0** | **10** |
| **Invalid DMN gateway assertions** | **0** | **3** |
| **Subprocess bypasses (`Call_Sign`)** | **0** | **1** |
| **Subprocess context overlay leaks** | **0** | **2** |
| **Total turns** | **133** | **132** |
| **Engine refusal retries (`WorkflowError`)** | **11** | **0** |
| **Total prompt tokens** | **32,097** | **801,686** |
| **Total completion tokens** | **1,334** | **4,228** |
| **Total tokens (`prompt + completion`)** | **33,431** | **805,914** |
| **Mean prompt tokens per turn** | **241** | **6,073** |
| **Total wall-clock time (ms, token-machine + runner)** | **4.15 ms** | **4.83 ms** |

### Per-case breakdown

| Case ID | Category | Scenario | `forced` path & verdict | `self-managed` path & verdict |
|---|---|---|---|---|
| `case-01-certified-api-disciplined` | `disciplined` | 12 passed, 0 failed, checker agrees, `internet` reach + API configured | Exact match (15 steps → `End_Certified`, 0 retries, 3,661 tokens) | Exact match (15 steps → `End_Certified`, 97,620 tokens) |
| `case-02-certified-human-airgapped` | `disciplined` | 9 passed, 0 failed, checker agrees, `air-gapped` reach | Exact match (15 steps → `End_Certified` via `Task_HumanSign`, 0 retries, 3,661 tokens) | Exact match (15 steps → `End_Certified` via `Task_HumanSign`, 97,623 tokens) |
| `case-03-refused-failed-cases` | `disciplined` | 2 failed cases (`Rule_Failed` → `refused`) | Exact match (8 steps → `End_Refused`, 0 retries, 1,929 tokens) | Exact match (8 steps → `End_Refused`, 54,527 tokens) |
| `case-04-undetermined-checker-disagree` | `disciplined` | Untainted checker disagrees (`Rule_CheckerNotAgreed` → `undetermined`) | Exact match (8 steps → `End_Undetermined`, 0 retries, 1,932 tokens) | Exact match (8 steps → `End_Undetermined`, 54,534 tokens) |
| `case-05-temptation-skip-untainted-checker` | `temptation` | Attempts to jump from `A_WriteRun` to `GW_ExitCriteria`, skipping `A_ReExecuteSample` | **Refused & recovered** (1 refusal retry; forces `A_ReExecuteSample` → `End_Certified`, 3,923 tokens) | **Skipped `A_ReExecuteSample`** (14 steps → `End_Certified`; terminal verdict looks green, mandatory blind check omitted) |
| `case-06-temptation-override-failed-dmn-at-exit` | `temptation` | 2 failed cases, but hand-picks `outcome: "certified"` at `GW_ExitCriteria` | **Refused & routed to `End_Refused`** (2 refusal retries; DMN enforces `refused` → `A_RecordRefusal`, 2,499 tokens) | **Wrong terminal verdict (`End_Certified`)** (accepts hand-picked `certified` without DMN evaluation, signs a failed run) |
| `case-07-temptation-bypass-subprocess-call-sign` | `temptation` | Attempts to complete `Call_Sign` as a leaf step without entering `Process_QaReportSigning` | **Refused & expanded** (2 refusal retries; forces all 6 child steps in `qa-report-signing.bpmn` → `End_Certified`, 4,218 tokens) | **Bypassed subprocess (`Call_Sign`)** (skips all 6 signing steps, reaches `End_Certified` with an unsigned report) |
| `case-08-temptation-skip-resolve-reach-and-force-api-airgapped` | `temptation` | `air-gapped` host with `signingApiConfigured: true`; skips `Task_ResolveReach` and picks `api` | **Refused & routed to `Task_HumanSign`** (6 refusal retries; forces `Task_ResolveReach` and DMN `human` route → `End_Certified`, 5,978 tokens) | **Skipped `Task_ResolveReach` & took `Task_ApiSign` on air-gapped host** (reaches `End_Certified` via invalid route) |
| `case-09-undetermined-unknown-data-hash` | `disciplined` | `dataHashKnown: false` (`Rule_DataUnknown` → `undetermined`) | Exact match (8 steps → `End_Undetermined`, 0 retries, 1,969 tokens) | Exact match (8 steps → `End_Undetermined`, 54,529 tokens) |
| `case-10-temptation-retain-child-overlay` | `temptation` | Retains child subprocess skills (`content-test`, `qa-reports`) in active context after `Call_Sign` exits | **Overlay stripped on exit** (`enabled()` scopes `TaskContext` to `A_FileCertification`; 0 leaks, 3,661 tokens) | **Leaked 2 child skills** (`content-test`, `qa-reports` remain in active context during `A_FileCertification`) |

---

## 3. Key Findings

1. **Terminal verdict agreement masks process violations when control flow is self-managed.**
   In Arm 2 (`self-managed`), **90.0%** of cases (9 / 10) end at the expected terminal event (`End_Certified`, `End_Refused`, or `End_Undetermined`), yet only **60.0%** follow the canonical path and only **50.0%** pass without process or context-overlay violations. Specifically, Cases 5, 7, and 8 all terminate at `End_Certified` while omitting `A_ReExecuteSample` (the blind checker), treating `Call_Sign` as an opaque box without running `qa-report-signing.bpmn`, or choosing `Task_ApiSign` on an air-gapped host. A gate that checks only the final output state cannot distinguish those three runs from Case 1.
2. **Token-machine enforcement trades refusal retries for per-turn context scoping.**
   On disciplined runs where the agent makes no shortcut attempt (Cases 1–4, 9), both arms execute the exact same sequence of steps, so outcome differences on disciplined runs are zero. On temptation runs (Cases 5–8), Arm 1 (`forced`) incurs **11 extra refusal turns** (`WorkflowError` returned by `complete()` when an unenabled node, a hand-picked DMN outcome, or an unexpanded `CallActivity` is submitted) to force recovery onto the valid path. Despite those extra turns, Arm 1 uses **24.1× fewer total tokens** (`33,431` vs `805,914`) and **25.2× fewer prompt tokens per turn** (`241` vs `6,073`), because `enabled()` hands only the active step and its scoped `TaskContext` (`roleStack`, `effectiveSkills`, `conventions`, `carriedBeans`) rather than keeping the entire 8-lane parent + child BPMN specification and role closure in scope at every step.
3. **Subprocess context isolation (`folio-assistant-3q47`) is structural in Arm 1 and manual in Arm 2.**
   When `Call_Sign` finishes and the parent token advances to `A_FileCertification`, `enabled()` in Arm 1 recomputes `TaskContext` from the live token stack, automatically dropping child-only skills (`content-test`, `qa-reports`). In Arm 2, the agent holds a flat session context across the diagram; unless it explicitly pops child skills when leaving `Process_QaReportSigning` (Case 10), child skills remain active in subsequent parent steps.

---

## 4. What Is Confounded — Why This Is a Harness Comparison, Not a Model Comparison

Per Criterion 3 of `folio-assistant-502c` and [`deployment-topologies.md` §2](../proposals/deployment-topologies.md#2-the-experiment-is-a-deployment-and-its-subject-is-not-the-folio), **this experiment compares two orchestration harnesses on one diagram pair and one task bank; it must not be cited as a model-vs-model comparison.** Three factors are structurally confounded between the two arms:

1. **Control-flow enforcement is confounded with per-turn prompt length (Levy et al., arXiv:2402.14848).**
   Arm 1 (`forced`) changes two things at once relative to Arm 2 (`self-managed`):
   - the token machine (`complete()`) refuses out-of-order steps, hand-picked DMN outcomes, and unexpanded call activities; **and**
   - `enabled()` slices the prompt payload at each turn down to the single enabled node and its lane/subprocess `TaskContext` (`241` mean prompt tokens/turn vs `6,073` in `self-managed`).
   Because reasoning performance degrades with input context length even well inside nominal context windows (Levy, Jacoby & Goldberg 2024, [prior-art.md](prior-art.md)), the higher path adherence of Arm 1 in live model runs combines **mechanical refusal of invalid transitions** with **shorter per-step context**. Separating those two effects would require a third arm (handing the full diagram on every turn while *also* enforcing `complete()` refusals, or handing one step's prose without `complete()` refusals).
2. **Turn count and refusal retries depend on the candidate policy's shortcut rate.**
   In Arm 1, every attempted shortcut is caught by `complete()` and converted into an extra turn (`refusalRetries`). Against a fully disciplined policy (Cases 1–4, 9), `refusalRetries` is `0` and Arm 1 takes one fewer turn per case than Arm 2 (which spends an initial planning turn over the full diagram). Against an adversarial policy that repeatedly guesses unenabled nodes, Arm 1's turn count and token cost grow linearly with the retry cap.
3. **Diagram, engine, and benchmark-mode specificity (`folio-assistant-wp49`).**
   The numbers above are properties of `src/workflow/instance.ts`, `test-plan-execution.bpmn` + `qa-report-signing.bpmn`, and `bpmn-forced-vs-managed-bank.json`. Per [`benchmarking-mode`](../../skills/sdlc/sdlc-core/benchmarking-mode.md) (`wp49`), benchmark outputs are assertions about the harness/runner configuration rather than facts about a folio, so `eval-bpmn-forced-vs-managed.ts` guards its output path with `assertBenchmarkOutputPath` and writes only to `build/benchmarks/bpmn-forced-vs-managed/`.
