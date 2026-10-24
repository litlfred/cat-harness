<!-- GENERATED from cat-harness/processes/kg/graph-detanglement.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — A sub-graph wants to leave

> **Generated, and not the authority.** This is `cat-harness/processes/kg/graph-detanglement.bpmn` (process `Process_GraphDetanglement`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Part of a repository wants to leave, for size or a semantic reason: four gated stages measure it out of the graph before anything moves, and an administrator authorises the extraction.

## Begin — Size, or a semantic reason to separate (`Start_Wants`)

- Begin here.
- Call `workflow_start` with `process: "Process_GraphDetanglement"` and the subject this run is about; keep the instance id it returns.
- next: → `Call_BeanOpen` (Open the bean)

### 1. Open the bean (`Call_BeanOpen`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `bean-coordination`.
- What: Process_BeanOpen: check before you create, find out whose the bean is, and claim it — or leave it alone when it is someone else's.
- A subprocess (`Process_BeanOpen`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_BeanYours` (Bean claimed?)

### Decide — Bean claimed? (`GW_BeanYours`)

- Reads which end Process_BeanOpen reached.
- Call `workflow_complete` with `node: "GW_BeanYours"` and `outcome` set to the label that holds:
  - «claimed» → `Task_Brief` (Brief the topic before touching anything)
  - «not yours» → `End_BeanNotYours` (Not yours — left alone)

### 2. Brief the topic before touching anything (`Task_Brief`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `opening-brief`.
- What: What am I doing and why is it worth doing; what do I already know, with each measurement's provenance; how do I plan to do it and WHAT WOULD FALSIFY THE APPROACH.
- Record it: `workflow_complete` with `node: "Task_Brief"`.
- next: → `Task_Declare` (1 · Declare in place (nothing moves))

## Done — Not yours — left alone (`End_BeanNotYours`)

- The instance completes here: Someone else holds the bean; this run stops without touching it. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 3. 1 · Declare in place (nothing moves) (`Task_Declare`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: A `<name>.json` entry with its `graphs[]` kinds.
- Record it: `workflow_complete` with `node: "Task_Declare"`.
- next: → `GW_Declared` (Declared in place?)

### Decide — Declared in place? (`GW_Declared`)

- Computed, not chosen: decisions/subgraph-declared-gate.dmn (hit policy FIRST) over three inputs — the declaration parsed (`readable`), an entry present for the sub-graph, and every declared path exists.
- Computed by the DMN table `decisions/subgraph-declared-gate.dmn#Decision_SubgraphDeclaredGate`: call `workflow_complete` with `node: "GW_Declared"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «unknown» → `Call_BeanClose_3` (Close the bean)
  - «declared» → `Task_Measure` (2a · Measure — unassigned column FIRST)
  - «not yet» → `Task_Declare` (1 · Declare in place (nothing moves))

### 4. Close the bean (`Call_BeanClose_3`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Unknown` (UNKNOWN — stop. Not “not yet”, not clean)

### 5. 2a · Measure — unassigned column FIRST (`Task_Measure`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: `bun run cat check:partition`.
- Record it: `workflow_complete` with `node: "Task_Measure"`.
- next: → `GW_Detangled` (Detangled?)

## Done — UNKNOWN — stop. Not “not yet”, not clean (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### Decide — Detangled? (`GW_Detangled`)

- Computed from `check:partition`'s counts by decisions/detanglement-gate.dmn (hit policy FIRST).
- Computed by the DMN table `decisions/detanglement-gate.dmn#Decision_DetanglementGate`: call `workflow_complete` with `node: "GW_Detangled"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «unknown» → `Call_BeanClose_3` (Close the bean)
  - «keep detangling» → `Task_Move` (2b · Prune, merge, factor — or the classification is wrong)
  - «detangled» → `Task_Isolate` (3 · Isolate — own declaration, namespace, artefact)

### 6. 2b · Prune, merge, factor — or the classification is wrong (`Task_Move`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: The only four moves.
- Record it: `workflow_complete` with `node: "Task_Move"`.
- next: → `Task_Measure` (2a · Measure — unassigned column FIRST)

### 7. 3 · Isolate — own declaration, namespace, artefact (`Task_Isolate`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: Only once cross-edges measure zero: give the sub-graph its own declaration, its own namespace and its own published artefact, as bootstrap/ has (its own declaration, bs: namespace and graph document).
- Record it: `workflow_complete` with `node: "Task_Isolate"`.
- next: → `GW_Isolated` (Stands alone?)

### Decide — Stands alone? (`GW_Isolated`)

- Computed by decisions/isolation-gate.dmn (hit policy FIRST) over three inputs: its own declaration with paths relative to itself, its own namespace with every minted term defined, and a published artefact of its own.
- Computed by the DMN table `decisions/isolation-gate.dmn#Decision_IsolationGate`: call `workflow_complete` with `node: "GW_Isolated"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «not yet» → `Task_Isolate` (3 · Isolate — own declaration, namespace, artefact)
  - «isolated» → `Task_Propose` (Report what would move — sizes, and what breaks)

### 8. Report what would move — sizes, and what breaks (`Task_Propose`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `deletion-requires-confirmation`.
- What: The agent reports and waits: what would move, how large, what in the parent breaks, and the rollback.
- Shared step `GT_ReportWhatMoves`.
- Record it: `workflow_complete` with `node: "Task_Propose"`.
- next: → `Task_Authorise` (Authorise the extraction)

### 9. Authorise the extraction (`Task_Authorise`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `deletion-requires-confirmation`.
- What: The one step no package may relax.
- A subprocess (`Process_AskThePerson`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Task_Extract` (4 · Extract — a directory move, not a file-by-file sift), → `Call_BeanClose` (Close the bean)

### 10. 4 · Extract — a directory move, not a file-by-file sift (`Task_Extract`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: Only once edges are zero and the declaration stands alone: move the sub-graph out as one directory move, not a file-by-file sift.
- Record it: `workflow_complete` with `node: "Task_Extract"`.
- next: → `Call_BeanClose_2` (Close the bean)

### 11. Close the bean (`Call_BeanClose`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Declined` (Stays where it is — declared, detangled, isolated)

### 12. Close the bean (`Call_BeanClose_2`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Extracted` (Extracted)

## Done — Stays where it is — declared, detangled, isolated (`End_Declined`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Extracted (`End_Extracted`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
