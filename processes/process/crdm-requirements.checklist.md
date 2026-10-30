<!-- GENERATED from cat-harness/processes/process/crdm-requirements.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — CRDM requirements

> **Generated, and not the authority.** This is `cat-harness/processes/process/crdm-requirements.bpmn` (process `Process_CRDM`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

A feature request turned into agreed, signed-off requirements and delivered, with one call activity per CRDM phase from issue linking to close-out.

## Begin — Need identified (`Start_BA`)

- Begin here.
- Call `workflow_start` with `process: "Process_CRDM"` and the subject this run is about; keep the instance id it returns.
- next: → `BA_Submit` (Describe the need (chat, issue, discussion))

### 1. Describe the need (chat, issue, discussion) (`BA_Submit`)

- Who: the `BA / Feature Requestor` lane (role `business-analyst`).
- Skill: `crdm-requirements-workflow`.
- What: The BA describes the capability gap in their own words.
- Record it: `workflow_complete` with `node: "BA_Submit"`.
- next: → `A_Detect` (Detect feature request (crdm-detect skill))

### 2. Detect feature request (crdm-detect skill) (`A_Detect`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-detect`.
- What: Recognise the request as a platform capability change rather than content work, from crdm-detect's signals.
- Record it: `workflow_complete` with `node: "A_Detect"`.
- next: → `GW_Feature` (Feature?)

### Decide — Feature? (`GW_Feature`)

- Answered by crdm-detect: is this request a feature request, a change to the platform, rather than content work?
- Call `workflow_complete` with `node: "GW_Feature"` and `outcome` set to the label that holds:
  - «no» → `End_Content` (Continue authoring)
  - «yes» → `Call_BeanOpen` (Open the bean)

## Done — Continue authoring (`End_Content`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 3. Open the bean (`Call_BeanOpen`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `bean-coordination`.
- What: Process_BeanOpen: check before you create, find out whose the bean is, and claim it — or leave it alone when it is someone else's.
- A subprocess (`Process_BeanOpen`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_BeanYours` (Bean claimed?)

### Decide — Bean claimed? (`GW_BeanYours`)

- Reads which end Process_BeanOpen reached.
- Call `workflow_complete` with `node: "GW_BeanYours"` and `outcome` set to the label that holds:
  - «claimed» → `Call_Issue` (Link the work to an issue)
  - «not yours» → `End_BeanNotYours` (Not yours — left alone)

### 4. Link the work to an issue (`Call_Issue`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: Feature work must be linked to a GitHub issue.
- A subprocess (`Process_CRDM_Issue`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_Needs` (Phase 1 Needs)

## Done — Not yours — left alone (`End_BeanNotYours`)

- The instance completes here: Someone else holds the bean; this run stops without touching it. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Phase 1 Needs (`Call_Needs`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: Identify the stakeholders, synthesise a needs statement from the sources, and loop until the BA and the stakeholders both recognise it.
- A subprocess (`Process_CRDM_Needs`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_Requirements` (Phases 2–4 BPA + requirements)

### 6. Phases 2–4 BPA + requirements (`Call_Requirements`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: Map the current workflow, then define the requirements and the impact they carry, and loop until approved.
- A subprocess (`Process_CRDM_Requirements`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_DataModel` (Data model Entities + cardinalities)

### 7. Data model Entities + cardinalities (`Call_DataModel`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: Between requirements and sign-off, and the order is the argument: requirements are statements about things, and the model says what the things ARE.
- A subprocess (`Process_CRDM_DataModel`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_Signoff` (Phase 5 Beans + sign-off)

### 8. Phase 5 Beans + sign-off (`Call_Signoff`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: The approved requirements become work-plan items, the BA signs off, and the branch is announced on the issue.
- A subprocess (`Process_CRDM_Signoff`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_Deliver` (Phase 6 Implement + acceptance)

### 9. Phase 6 Implement + acceptance (`Call_Deliver`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: One phase and not three, because the loops say so: an increment the BA rejects, an MVP that is not ready, and stakeholder findings all route back into implementation.
- A subprocess (`Process_CRDM_Deliver`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_Close` (Close-out)

### 10. Close-out (`Call_Close`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `crdm-requirements-workflow`.
- What: The stakeholders sign off, the BA confirms every criterion is met, and only then does the agent close the issue.
- A subprocess (`Process_CRDM_Close`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Call_BeanClose` (Close the bean)

### 11. Close the bean (`Call_BeanClose`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: Process_BeanClose: end the bean in a state that says why — complete and archive it, scrap it with its reasons and archive it, or record the blocker and hand it back.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_CRDM` (Feature delivered)

## Done — Feature delivered (`End_CRDM`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
