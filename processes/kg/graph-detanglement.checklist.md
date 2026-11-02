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
- next: → `Call_Detangle` (Declare, detangle and isolate it)

## Done — Not yours — left alone (`End_BeanNotYours`)

- The instance completes here: Someone else holds the bean; this run stops without touching it. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 3. Declare, detangle and isolate it (`Call_Detangle`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: The four gates, stages 1-3: declared in place, detangled with the unassigned column first, and isolated.
- A subprocess (`Process_KgSeparationDetangle`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_MeasuredOut` (Measured out?)

### Decide — Measured out? (`GW_MeasuredOut`)

- Reads which end the detangle phase reached: isolated, or could not determine.
- Call `workflow_complete` with `node: "GW_MeasuredOut"` and `outcome` set to the label that holds:
  - «isolated» → `Call_Authorise` (Authorise the extraction)
  - «unknown» → `Call_BeanClose` (Close the bean)

### 4. Authorise the extraction (`Call_Authorise`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `deletion-requires-confirmation`.
- What: Report what would move, then ask the administrator to authorise the extraction.
- A subprocess (`Process_KgSeparationAuthorise`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Authorised` (Authorised?)

### 5. Close the bean (`Call_BeanClose`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_BeanClosedHow` (How did it end?)

### Decide — Authorised? (`GW_Authorised`)

- Reads which end the authorise phase reached.
- Call `workflow_complete` with `node: "GW_Authorised"` and `outcome` set to the label that holds:
  - «authorised» → `Task_Extract` (Extract — a directory move, not a file-by-file sift)
  - «declined» → `Call_BeanClose` (Close the bean)

### Decide — How did it end? (`GW_BeanClosedHow`)

- Which outcome the bean was closed with, so each ends at its own named end event.
- Call `workflow_complete` with `node: "GW_BeanClosedHow"` and `outcome` set to the label that holds:
  - «extracted» → `End_Extracted` (Extracted)
  - «declined» → `End_Declined` (Stays where it is — declared, detangled, isolated)
  - «unknown» → `End_Unknown` (UNKNOWN — stop. Not “not yet”, not clean)

### 6. Extract — a directory move, not a file-by-file sift (`Task_Extract`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: Only once edges are zero and the declaration stands alone: move the sub-graph out as one directory move, not a file-by-file sift.
- Record it: `workflow_complete` with `node: "Task_Extract"`.
- next: → `Call_BeanClose` (Close the bean)

## Done — Extracted (`End_Extracted`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Stays where it is — declared, detangled, isolated (`End_Declined`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — UNKNOWN — stop. Not “not yet”, not clean (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
