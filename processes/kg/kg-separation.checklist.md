<!-- GENERATED from cat-harness/processes/kg/kg-separation.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — A knowledge graph leaves for its own repositories

> **Generated, and not the authority.** This is `cat-harness/processes/kg/kg-separation.bpmn` (process `Process_KgSeparation`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Move part of a knowledge graph into repositories of its own: the content and the tools that write and check it separate as a pair, into two repositories, not one.

## Begin — Too large, or readers and cadence differ (`Start_Trigger`)

- Begin here.
- Call `workflow_start` with `process: "Process_KgSeparation"` and the subject this run is about; keep the instance id it returns.
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
  - «claimed» → `Task_Brief` (Brief the work)
  - «not yours» → `End_BeanNotYours` (Not yours — left alone)

### 2. Brief the work (`Task_Brief`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `opening-brief`.
- What: What the work is and why, what is already measured with its provenance, how it will be done, and what would falsify the approach.
- Shared step `GT_Brief`.
- Record it: `workflow_complete` with `node: "Task_Brief"`.
- next: → `Task_Measure` (Measure the signals)

## Done — Not yours — left alone (`End_BeanNotYours`)

- The instance completes here: Someone else holds the bean; this run stops without touching it. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 3. Measure the signals (`Task_Measure`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `kg-separation`.
- What: Files and bytes per instance, clone cost (`bun run cat health`), gate time, merge contention, the candidate's cohesion and cut (`kg:detangle`), wrong-direction edges, and the would-be tools package's import cone.
- Record it: `workflow_complete` with `node: "Task_Measure"`.
- next: → `Task_Decide` (Ask whether to separate it)

### 4. Ask whether to separate it (`Task_Decide`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `kg-separation`.
- What: The owner decides from the measured signals, and also decides the address base for its identifiers, where verdicts about it live, and what its tools repository owns.
- A subprocess (`Process_AskThePerson`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Separate` (Separate this graph?)

### Decide — Separate this graph? (`GW_Separate`)

- Reads the owner's answer to the ask before it.
- Call `workflow_complete` with `node: "GW_Separate"` and `outcome` set to the label that holds:
  - «declined» → `Call_BeanClose` (Close the bean)
  - «separate» → `Task_Detangle` (Declare, detangle and isolate it)

### 5. Close the bean (`Call_BeanClose`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_BeanClosedHow` (How did it end?)

### 6. Declare, detangle and isolate it (`Task_Detangle`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `graph-detanglement`.
- What: Stages 1-3, the graph-detanglement gates: declared in place, zero wrong-direction edges on every axis, and standing alone.
- A subprocess (`Process_KgSeparationDetangle`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_MeasuredOut` (Measured out?)

### Decide — How did it end? (`GW_BeanClosedHow`)

- Which outcome the bean was closed with, so each ends at its own named end event.
- Call `workflow_complete` with `node: "GW_BeanClosedHow"` and `outcome` set to the label that holds:
  - «separated» → `End_Separated` (Separated)
  - «declined» → `End_Declined` (Stays in place, ready to leave)
  - «stays» → `End_Stays` (Stays where it is)
  - «unknown» → `End_Unknown` (UNKNOWN — stop. Not clean)

### Decide — Measured out? (`GW_MeasuredOut`)

- Reads which end the detangle phase reached: isolated, or could not determine.
- Call `workflow_complete` with `node: "GW_MeasuredOut"` and `outcome` set to the label that holds:
  - «isolated» → `Call_Prepare` (Prepare it to stand alone)
  - «unknown» → `Call_BeanClose` (Close the bean)

## Done — Separated (`End_Separated`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Stays in place, ready to leave (`End_Declined`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Stays where it is (`End_Stays`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — UNKNOWN — stop. Not clean (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 7. Prepare it to stand alone (`Call_Prepare`)

- Who: the `Platform authoring agent` lane (role `platform-authoring-agent`).
- Skill: `kg-separation`.
- What: Stages 4-8: identity, hosted output, the content-tools split, publication plan, and the standalone rehearsal.
- A subprocess (`Process_KgSeparationPrepare`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Prepared` (Green alone?)

### Decide — Green alone? (`GW_Prepared`)

- Reads which end the prepare phase reached.
- Call `workflow_complete` with `node: "GW_Prepared"` and `outcome` set to the label that holds:
  - «green» → `Call_Authorise` (Authorise the extraction)
  - «red: an unseen edge» → `Task_Detangle` (Declare, detangle and isolate it)
  - «could not run» → `Call_BeanClose` (Close the bean)

### 8. Authorise the extraction (`Call_Authorise`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `deletion-requires-confirmation`.
- What: Stage 9: report what moves and ask the administrator.
- A subprocess (`Process_KgSeparationAuthorise`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Authorised` (Authorised?)

### Decide — Authorised? (`GW_Authorised`)

- Reads which end the authorise phase reached.
- Call `workflow_complete` with `node: "GW_Authorised"` and `outcome` set to the label that holds:
  - «authorised» → `Call_Move` (Move it into its repositories)
  - «declined» → `Call_BeanClose` (Close the bean)

### 9. Move it into its repositories (`Call_Move`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `kg-separation`.
- What: Stages 10-12: create the repositories, drain, seed, consume additively, release, and check every identifier dereferences.
- A subprocess (`Process_KgSeparationMove`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Moved` (Seeded and released?)

### Decide — Seeded and released? (`GW_Moved`)

- Reads which end the move phase reached.
- Call `workflow_complete` with `node: "GW_Moved"` and `outcome` set to the label that holds:
  - «released» → `Call_Cutover` (Cut over)
  - «unknown» → `Call_BeanClose` (Close the bean)

### 10. Cut over (`Call_Cutover`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `kg-separation`.
- What: Stage 13: retire the parent's copy and measure the cutover until it is complete or cannot be shown complete.
- A subprocess (`Process_KgSeparationCutover`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_BeanClose` (Close the bean)
