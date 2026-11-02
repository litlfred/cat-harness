<!-- GENERATED from cat-harness/processes/kg/kg-separation-detangle.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Declare, detangle and isolate a sub-graph

> **Generated, and not the authority.** This is `cat-harness/processes/kg/kg-separation-detangle.bpmn` (process `Process_KgSeparationDetangle`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Measures a sub-graph out of its parent before anything moves: declare it in place, take the wrong-direction edges to zero, then make it stand alone with its own declaration, namespace and artefact.

## Begin — A sub-graph to measure out (`Start_Detangle`)

- Begin here.
- Call `workflow_start` with `process: "Process_KgSeparationDetangle"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Declare` (Declare in place (nothing moves))

### 1. Declare in place (nothing moves) (`Task_Declare`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: A `<name>.json` entry with its `graphs[]` kinds.
- Record it: `workflow_complete` with `node: "Task_Declare"`.
- next: → `GW_Declared` (Declared in place?)

### Decide — Declared in place? (`GW_Declared`)

- Computed, not chosen: decisions/subgraph-declared-gate.dmn (hit policy FIRST) over three inputs — the declaration parsed (`readable`), an entry present for the sub-graph, and every declared path exists.
- Computed by the DMN table `decisions/subgraph-declared-gate.dmn#Decision_SubgraphDeclaredGate`: call `workflow_complete` with `node: "GW_Declared"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «unknown» → `End_DetangleUnknown` (Could not determine)
  - «declared» → `Task_Measure` (Measure — unassigned column FIRST)
  - «not yet» → `Task_Declare` (Declare in place (nothing moves))

## Done — Could not determine (`End_DetangleUnknown`)

- The instance completes here: A gate answered unknown: a declaration that did not parse, or edges nobody judged. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 2. Measure — unassigned column FIRST (`Task_Measure`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: `bun run cat check:partition`.
- Record it: `workflow_complete` with `node: "Task_Measure"`.
- next: → `GW_Detangled` (Detangled?)

### Decide — Detangled? (`GW_Detangled`)

- Computed from `check:partition`'s counts by decisions/detanglement-gate.dmn (hit policy FIRST).
- Computed by the DMN table `decisions/detanglement-gate.dmn#Decision_DetanglementGate`: call `workflow_complete` with `node: "GW_Detangled"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «unknown» → `End_DetangleUnknown` (Could not determine)
  - «keep detangling» → `Task_Move` (Prune, merge, factor — or the classification is wrong)
  - «detangled» → `Task_Isolate` (Isolate — own declaration, namespace, artefact)

### 3. Prune, merge, factor — or the classification is wrong (`Task_Move`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: The only four moves.
- Record it: `workflow_complete` with `node: "Task_Move"`.
- next: → `Task_Measure` (Measure — unassigned column FIRST)

### 4. Isolate — own declaration, namespace, artefact (`Task_Isolate`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: Only once cross-edges measure zero: give the sub-graph its own declaration, its own namespace and its own published artefact, as bootstrap/ has (its own declaration, bs: namespace and graph document).
- Record it: `workflow_complete` with `node: "Task_Isolate"`.
- next: → `GW_Isolated` (Stands alone?)

### Decide — Stands alone? (`GW_Isolated`)

- Computed by decisions/isolation-gate.dmn (hit policy FIRST) over three inputs: its own declaration with paths relative to itself, its own namespace with every minted term defined, and a published artefact of its own.
- Computed by the DMN table `decisions/isolation-gate.dmn#Decision_IsolationGate`: call `workflow_complete` with `node: "GW_Isolated"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «not yet» → `Task_Isolate` (Isolate — own declaration, namespace, artefact)
  - «isolated» → `End_Isolated` (Isolated)

## Done — Isolated (`End_Isolated`)

- The instance completes here: Declared, detangled and standing alone. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
