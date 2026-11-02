---
title: "The Beans store behind any Tool, and a state machine that starts any model's agent"
kind: proposal
issue: 991
bean: folio-assistant-bsd1
summary: >-
  Proposed 2026-11-02, in the context of the WHO Assured AI concept note on
  Gemini integration and benchmarking: make every process and skill that
  touches the work plan speak only the work-plan store's contract, with the
  git state branch as one Tool among others (a beans server, an MCP service).
  Then let the BPMN state machine start an agent of any model (Claude, Gemini
  through Antigravity) on an enabled step, hand it a bean tagged with its
  process and step, and record every move. The same records are the trace a
  benchmark run (Route 0, A, B) is scored on.
---

# The Beans store behind any Tool, and a state machine that starts any model's agent
{: .no_toc }

**Status:** proposal, nothing built. Questions for the owner are in §7.
Issue [#991](https://github.com/litlfred/cat-harness/issues/991), bean
`folio-assistant-bsd1`. It builds on the work-plan store contract
([`work-plan-store`](../../skills/sdlc/sdlc-core/work-plan-store.md), Q-DS-1 A
and Q-DS-2 A), Beans store links in diagrams (Q-BR-8 F, PR #972), the
beans-by-process pages (cat-harness-tools#1413) and the recording follow-up
(#988).

1. TOC
{:toc}

---

## 0. Context: WHO Assured AI, Gemini parity and benchmarking

This proposal is written for the concept note *Gemini Integration and
Benchmarking Methodology for WHO Assured AI* (owner, 2026-11-02). That note
asks for three things this harness must deliver, and each depends on the
work below:

| The concept note says | What it needs from the harness | Where in this proposal |
|---|---|---|
| Agents are confined to BPMN swimlanes, each task backed by skills and Tools, with bounded context, to keep them on track | The state machine, not the agent, decides the step and hands over only that step's context | §4.4, §4.5 |
| Agents use MCP servers for tools and data | The work plan reachable over MCP, not only through git commands a given agent may not have | §4.2 (`beans-mcp`) |
| Usability parity across frontier models; guardrails replicated in `GEMINI.md` | A **model-neutral work order** an agent of any model receives, so guardrails live in the process and the work order, not in one vendor's prompt file | §4.5 |
| Routes 0, A and B, run through Gherkin test specifications and the BPMN harness, with reasoning traces captured for the ITB | One dispatcher that can start the same case under each route and record every step, refusal and bean change as a trace | §4.6, §4.7 |

Two facts about today matter here. `GEMINI.md` in each repository is five
lines that point to `AGENTS.md`, so the guardrails an agent gets are the same
text for every model, and anything Claude-specific lives in Claude's own
session configuration rather than in the process. And
[`req:model-benchmark`](../../skills/requirements/model-benchmark.json)
(cat-harness#686) already says **a benchmark never writes to `beans/`**, which
a store that can only be the git branch cannot honour without care: a
benchmark run needs a store of its own (§4.7).

---

## 1. The ask

Owner, 2026-11-02:

> we have a bean data store as part of our processes/skills/tools. i want to
> make sure documentation is complete. currently we are using github repo
> branch as one Tool. another Tool could be using the server (there is an mcp
> service for example) to manage bean state. can we make sure that process
> documentation is independent of Tool.
>
> we also have a bpmn state machine. i think that can use beans already as
> part of context for agents (if not it should be). the state machine should
> be able to start a agent (e.g. via API) and give a bean (which is tagged
> hopefully with process + task + etc.) that the agent is supposed to work on
> and also track process with (as they go through processes and tasks). we
> should be able to track the evolution of the bean over time.

> look at what we have and what needs to be done

Four goals follow from this:

- **G1.** Process and skill text says *what* happens to the work plan, never
  *how one Tool does it*.
- **G2.** The state machine gives an agent its bean as context. Partly true
  today.
- **G3.** The state machine can start an agent on a step, with a bean tagged
  by process and step. Not true today.
- **G4.** A bean's history over time can be read from the store, whatever
  Tool backs it. Only true for the git Tool, and only by reading git.
- **G5.** (from the concept note) The same process can be run by an agent of
  any model, under Route 0, A or B, and the run leaves a trace that can be
  scored and compared.

---

## 2. What we have

Measured on cat-harness `f06cff0` and cat-harness-tools `main` (2026-11-02).

### 2.1 The store is already modelled as a Role with Tools

| Piece | Where | State |
|---|---|---|
| The work plan as a mechanical Role with a `store` block (holds, api, realisedBy) | `scenarios/roles.json` → `work-plan` | done (Q-DS-1 A) |
| The contract the store keeps (6 responsibilities) | `skills/sdlc/sdlc-core/work-plan-store.md` | written, **no tests** (`mechanical-role-untested`) |
| One global `bpmn:dataStore id="work-plan"` | `processes/global-tasks.bpmn` | done |
| Tools that satisfy the bean skills | `tools/beans-cli`, `tools/beans-manual`, `tools/bean-query`, `tools/bean-claim-check`, `tools/work-plan-prime` | declared, each with `satisfies` and `selection` |
| Bean schema | `schemas/kinds/bean-defs.schema.json` | `id, title, status, type, priority, parent, blocking, blocked_by, created_at, updated_at, tags, issue, targets` |

So the shape G1 needs exists: Role → contract skill → several Tools, picked by
`selection`. The gap is in the prose around it.

### 2.2 Where the git Tool leaks into Tool-neutral text

| File | Lines naming git or the branch store |
|---|---|
| `work-plan-store.md` (the contract itself) | 0 literal, but responsibilities 5 ("a push that is refused fetches, rebuilds on the tip") and 6 ("Git shows who changed a bean") **are** the git Tool, and "Where: `beans/` in each instance" is a layout |
| `todo-manager.md` | 14 (`branch-store.ts push --id beans`, `state:mount`, `cat/cat-harness/beans`) |
| `bean-coordination.md` | 16 |
| `idle-backlog.md` | 12 |
| `bean-drain.md` | 7 |
| `continual-progress.md` | 5 |
| `workflow-state.md` / `process-state.md` | 2 / 1 |
| BPMN diagrams | **clean**: no diagram names the branch. The 115 `<folio:bean op="note">` marks (being swapped for Beans store links in #972) are Tool-neutral |

The diagrams already meet G1. The skills do not: about 57 lines across 7
skills tell an agent to run git commands to change a bean.

### 2.3 The engine writes beans through one Tool

`workflow_complete` (cat-harness-tools `src/tools/workflow.ts`) calls
`applyWorkPlanOp` (`src/workflow/bean-link.ts`), which runs the `beans` CLI and
falls back to **editing the Markdown file**. That code path is the git Tool.
A server-backed store could not be used without changing the engine.

### 2.4 Beans as agent context (G2): half there

- `TaskContext` (`src/workflow/instance.ts`) carries `carriedBeans`, together
  with role, role stack, skills and conventions. `workflow_next` returns it.
- An instance names its bean (`bean`, `carriedBeans`), but **a bean does not
  name its instance, process or step**. Nothing in the bean's front matter
  says "I am at `Task_RunCI` of `Process_CodeChangeReview`". The only way to
  place a bean is to scan every instance file. The beans-by-process pages do
  exactly that.
- The bean's body (what to do) is not in `TaskContext`: the agent gets the id
  and must fetch the bean through a Tool.

### 2.5 Starting agents (G3): exists outside the harness only

- The harness has **no** step that starts an agent. `arm-forced.ts` (bean
  `502c`) walks a diagram and hands one agent the enabled step, but inside one
  process run, as an experiment arm.
- **`beans-serve` already starts agents per bean.** Its GraphQL API
  (`litlfred/beans`, `internal/graph/schema.graphqls`) has
  `sendAgentMessage(beanId, message)` ("Starts a session if none exists"),
  `stopAgent`, `agentSession(beanId)`, `agentSessionChanged` and
  `activeAgentStatuses` subscriptions, and a worktree per bean. It runs the
  `claude` CLI (`internal/agent/claude.go`). The beans repository also has a
  draft bean `beans-kp3h`, "Wrap beans in an MCP server", with one
  `beans_graphql` tool.
- Other ways to start an agent: a Claude Code session or routine through its
  API, Gemini through Antigravity (`agy`; the project already hands it prompts,
  for example `bean-drain-2026-10-31/agy-prompt-1142.md`), GitHub Copilot's
  assign-to-issue, a local `claude -p`. Each is started by hand today, with a
  prompt written for that model.
- The closest thing to a benchmark driver is bean `502c`'s two arms in
  cat-harness-tools: `arm-forced.ts` (the token machine hands one step at a
  time and refuses out-of-order steps) and `arm-self-managed.ts` (the agent
  gets the whole diagram and manages itself). They measure exactly the
  guardrail the concept note describes, but run one bank case in-process, not
  a dispatched agent of a chosen model.

### 2.6 History (G4): only in git, and recording stopped

- The bean: `git log` on `cat/cat-harness/beans`. Notes in `beans/notes/`.
  No API: `beans-serve` has no history query.
- The process position: each instance's `history` (node, at, actor, note).
- Recording stopped in early October. The 12 instances on the branch last
  moved 28 to 42 days ago (#988).

---

## 3. What needs to be done

| # | Gap | Goal |
|---|---|---|
| N1 | The contract names git behaviour (race handling, history via git) | G1, G4 |
| N2 | 7 skills give git commands for bean operations | G1 |
| N3 | The engine writes beans through the CLI or the file, not through a store interface | G1, G3 |
| N4 | No store operation reads a bean's history; there is no event model | G4 |
| N5 | A bean does not record which process, step and instance it is at | G2, G3 |
| N6 | `TaskContext` carries bean ids, not the bean | G2 |
| N7 | Nothing in a diagram or the engine starts an agent | G3 |
| N8 | Agents do not start or advance instances, so positions are stale | G3, G4 (#988) |
| N9 | No test holds any Tool to the contract | G1 |
| N10 | The guardrails an agent receives depend on how it was started and which model it is | G5 |
| N11 | A benchmark run has nowhere to write beans and instances that is not the real work plan | G5 |
| N12 | Route 0, A and B are not a setting of any runner; the trace of a run is spread over git, instance files and session logs | G5 |

---

## 4. Proposal

### 4.1 The contract speaks operations, not git (N1, N9)

Rewrite `work-plan-store.md` as a list of **operations** every Tool must
provide, each with its guarantee:

| Operation | Guarantee |
|---|---|
| `get(id)` | the bean as last written, or "none" |
| `list(filter)` | by status, type, tag, parent, process, step |
| `create(bean)` | id is unique |
| `update(id, change, ifMatch)` | refused when `ifMatch` is stale; **never loses a concurrent write** |
| `note(id, text, by)` | appended, never rewritten |
| `history(id)` | every change, oldest first: when, by whom, what, and from which process step |
| `link(id, instance, node)` | the bean's current position (§4.4) |

Keep the six responsibilities and phrase each against the operations.
"Lose nothing to a race" becomes "`update` with a stale `ifMatch` is refused,
and a retry on the fresh version lands". How the git Tool does that (fetch,
rebuild on the tip, push, never force) moves to the git Tool's own page.

Then **one conformance test suite** runs against each Tool (N9). `kg-audit`
stops reporting `mechanical-role-untested` once the git Tool passes it.

### 4.2 Tools, each with its own page (N2)

| Tool | Backed by | Status |
|---|---|---|
| `beans-git-branch` | the `cat/<harness>/beans` branch, `branch-store.ts`, `beans` CLI or manual edit | today's behaviour, renamed and documented as one Tool |
| `beans-server` | `beans-serve` GraphQL (`ifMatch` already exists on mutations) | proposed |
| `beans-mcp` | an MCP server, for example `beans-kp3h`'s single `beans_graphql` tool, or harness MCP tools over the same operations | proposed |

The git commands in the 7 skills move into `beans-git-branch`'s page. Each
skill line becomes the operation ("note the bean", "claim it"), with a link
to the Tool pages. A check, `check:store-tool-neutral`, refuses git or branch
terms in a skill whose Role is `work-plan` unless the line sits in a Tool
page. The skill already has a precedent in `selection.when`.

### 4.3 The engine calls the store, not the CLI (N3)

Put a `WorkPlanStore` interface in cat-harness-tools with the operations of
§4.1, and make `applyWorkPlanOp` call it. The git Tool is its first adapter
(today's code, moved). The adapter in use comes from the deployment
(`deployment-descriptions.md`), the same way other Tools are chosen. This
fits the platform-boundary rule: different code, so an adapter.

### 4.4 A bean knows where it is (N5, N6)

Add an optional, engine-written `process` block to the bean schema:

```yaml
process:
  - instance: code-change-review--bean-1j3q
    process: Process_CodeChangeReview
    node: Task_RunCI
    since: 2026-10-03T13:33:00Z
```

The instance stays the source of truth. The block is a projection the engine
writes on every `workflow_start` and `workflow_complete`, so `list(filter:
process, step)` works on any Tool without scanning instances. Ordinary tags
(`process:code-change-review`) were considered and rejected as the only
mechanism: they cannot hold the instance or the time.

`TaskContext` gains the bean itself (title, status, body, links, position),
read through `get`, not just its id.

### 4.5 The state machine can start an agent (N7, N8)

Add a global task `Task_DispatchAgent` to `processes/global-tasks.bpmn`.
When an enabled step's lane binds an agent Role, the engine (or a watcher)
hands a **work order** to an `agent-launch` Tool:

| Field | From |
|---|---|
| bean | `get(bean)`, with its `process` block |
| instance, node | the token |
| role, skills, conventions | `TaskContext` |
| store | which work-plan Tool to use, and how to reach it |
| report | "call `workflow_complete` on this instance and node when done" |

The work order is **model-neutral**: plain data plus the skill texts, the same
for every model. Model-specific wording (how Claude or Gemini is best told to
stay on the step) is the launch Tool's job, kept on that Tool's page and
tested, so parity is something a test can check rather than a prompt someone
remembers to copy into `GEMINI.md`.

Candidate `agent-launch` Tools, each a Tool page with `selection`, like the
store Tools:

| Tool | Model | Exists today |
|---|---|---|
| `launch-beans-serve` | Claude (`claude` CLI) | yes, `sendAgentMessage` |
| `launch-claude-session` | Claude, cloud session or routine through its API | the API exists; no harness Tool |
| `launch-antigravity` | Gemini through Antigravity, on the GCP project the concept note requests | prompts written by hand today |
| `launch-copilot` | GitHub Copilot, assign-to-issue | the API exists; no harness Tool |
| `launch-local` | any CLI agent, for example `claude -p` | no |

The agent moves the token with `workflow_complete`, which writes the instance
history, updates the bean's `process` block and notes the bean (§4.6). The
diagram draws dispatch as a step, so whoever reads the process sees where
agents start. #988's rule ("an agent working a bean through a process starts
or advances an instance") becomes a property of the engine, not a habit.

### 4.6 One event log, readable from any store (N4)

Every store change is an **event**: `created`, `status-changed`, `claimed`,
`noted`, `step-reached`, `dispatched`, `completed`, each with `at`, `by`,
and, when it came from the engine, `instance` and `node`. `history(id)` returns
them in order.

- The git Tool builds `history` from `git log` on the bean file plus the
  instance histories, so nothing is migrated.
- A server Tool keeps the events as rows.

The beans-by-process pages then gain a timeline per bean
(`processed-bean/<bean>/` from cat-harness-tools#1414), from `history(id)`.

### 4.7 Benchmark runs: routes, isolated stores, traces (N10, N11, N12)

With §4.1 to §4.6 in place, a benchmark run is the same dispatch with three
settings, and no new runner:

| Setting | Values |
|---|---|
| system under test | model + launch Tool + configuration (the `req:model-benchmark` notion) |
| route | **0** the case text only, no work order, no skills, no graph · **A** work order with skills, graph Tools withheld · **B** work order with skills and the knowledge-graph Tools |
| store | a **run-scoped store** Tool (in memory, or a scratch branch per run), seeded from the case, never the real work plan |

- **Cases.** A Gherkin scenario from the test plan becomes a seeded bean and a
  started instance in the run's store. The `Given` seeds the store, the `When`
  is the dispatched step, the `Then` is checked against the store and the
  instance after the agent finishes.
- **Trace.** `history(id)` on the run's store, the instance history and its
  `refusals` (each refused out-of-order step or hand-asserted gateway) are the
  run's trace, in one shape whatever the model. That is the reasoning trace
  the concept note wants handed to the ITB, and bean `502c`'s refusal counts
  become a metric of every run, not of one experiment.
- **Isolation.** The run-scoped store is what lets a benchmark honour "never
  writes to `beans/`" while still exercising every bean step.
- **Results** land where `benchmarking-mode` says (`build/benchmarks/`,
  `reports/`), never in a declared graph.

---

## 5. Order of work

| Step | Work | Repo | Depends on |
|---|---|---|---|
| 1 | Rewrite `work-plan-store.md` as operations (§4.1); add the Tool pages (§4.2), git commands moved there | cat-harness | owner OK on §7 |
| 2 | Conformance tests for the operations, run against the git Tool | cat-harness-tools | 1 |
| 3 | `WorkPlanStore` interface; `applyWorkPlanOp` through it (§4.3) | cat-harness-tools | 2 |
| 4 | `process` block in the bean schema, written by the engine; bean in `TaskContext` (§4.4) | cat-harness + tools | 3 |
| 5 | `history(id)` and the event model for the git Tool; timeline on `processed-bean/<bean>/` (§4.6) | tools | 3 |
| 6 | Skills rewritten to name operations; `check:store-tool-neutral` (§4.2) | cat-harness | 1 |
| 7 | `Task_DispatchAgent` and the first `agent-launch` Tool (§4.5) | cat-harness + tools | 4 |
| 8 | A server Tool (`beans-serve` or MCP) passes the same conformance tests | tools | 2, 3 |
| 9 | Run-scoped store Tool; route setting on dispatch; Gherkin case → seeded bean + instance (§4.7) | tools | 2, 7 |
| 10 | `launch-antigravity` Tool; the same cases under Routes 0, A, B for Claude and Gemini; traces exported for the ITB | tools | 7, 9 |

Steps 1 to 6 change no behaviour for the git Tool. Step 7 changes how agents
are started, so it needs the owner's choice of first launch Tool (§7, Q3).
Steps 9 and 10 are the part the concept note's GCP credits and model access
would pay for; steps 1 to 8 are needed first and need neither.

---

## 6. What this does not do

- It does not move beans off the git branch. The git Tool stays the default.
- It does not change the diagrams' meaning. The diagrams are already
  Tool-neutral; #972's Beans store links stay.
- It does not decide what an agent works on. Dispatch starts an agent on a
  step that the process has already enabled.

---

## 7. Questions for the owner

| Q | Question | Options (recommended first) |
|---|---|---|
| Q1 | Where does a bean's position live? | **A** engine-written `process` block on the bean, instance stays the truth · B only in instances, found by scanning · C only on the bean |
| Q2 | How is the store Tool chosen? | **A** by deployment description, per checkout · B per call, by `selection` · C fixed per harness |
| Q3 | First `agent-launch` Tool? | **A** `beans-serve` `sendAgentMessage` (exists) · B Claude Code session API · C Gemini through Antigravity · D local CLI agent |
| Q4 | Where does history come from for the git Tool? | **A** derived from git log plus instance histories, no migration · B a new events file per bean on the branch |
| Q5 | Where does a benchmark run keep its beans and instances? | **A** a run-scoped store Tool (in memory, or a scratch branch per run) · B a dedicated benchmark branch shared by runs · C the real work plan, tagged |
