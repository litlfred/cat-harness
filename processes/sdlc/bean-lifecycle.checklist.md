<!-- GENERATED from cat-harness/processes/sdlc/bean-lifecycle.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Agent bean lifecycle

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/bean-lifecycle.bpmn` (process `Process_BeanLifecycle`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

The whole life of a work-plan item, and the rules that make one agent's bean legible to another: check before you create, claim before you work, keep the body current as you go, and end it in a state that says why.

## Begin — Durable work identified (`Start_DurableWork`)

- Begin here.
- Call `workflow_start` with `process: "Process_BeanLifecycle"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_CheckExists` (Check before you create (exact-title search))

### 1. Check before you create (exact-title search) (`Task_CheckExists`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: STRICT.
- Record it: `workflow_complete` with `node: "Task_CheckExists"`.
- next: → `GW_Exists` (Already exists?)

### Decide — Already exists? (`GW_Exists`)

- Answered by the exact-title check before it (`todo-manager` §'Check before you create'): `beans list --json --search` followed by an exact comparison of titles, since `--search` is fuzzy.
- Call `workflow_complete` with `node: "GW_Exists"` and `outcome` set to the label that holds:
  - «no» → `Task_Create` (Create the bean (agent CLI, not an engine op))
  - «yes» → `GW_Owner` (Whose bean?)

### 2. Create the bean (agent CLI, not an engine op) (`Task_Create`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: `beans create "<title>"`.
- Record it: `workflow_complete` with `node: "Task_Create"`.
- next: → `Task_Claim` (Claim it (status: in-progress))

### Decide — Whose bean? (`GW_Owner`)

- Answered from the existing bean and its surroundings (`bean-coordination`).
- Call `workflow_complete` with `node: "GW_Owner"` and `outcome` set to the label that holds:
  - «someone else's» → `Task_LeaveAlone` (Leave it alone (coordinate instead))
  - «mine / unclaimed» → `Task_Claim` (Claim it (status: in-progress))

### 3. Claim it (status: in-progress) (`Task_Claim`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `bean-coordination`.
- What: Idempotent.
- Record it: `workflow_complete` with `node: "Task_Claim"`.
- next: → `Task_Work` (Work, keeping the body current (this is 'edit'))

### 4. Leave it alone (coordinate instead) (`Task_LeaveAlone`)

- Who: the `Sibling session or human (not yours to close)` lane (role `sibling-session`).
- Skill: `bean-coordination`.
- What: Never resolve, scrap or delete a bean another session or a human owns.
- Record it: `workflow_complete` with `node: "Task_LeaveAlone"`.
- next: → `End_NotYours` (Not yours to close)

### 5. Work, keeping the body current (this is 'edit') (`Task_Work`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: Editing a bean is not a separate ceremony: check off todo items as they happen, append measurements with the command and date that produced them, and record what you now know that the next agent does not.
- Record it: `workflow_complete` with `node: "Task_Work"`.
- next: → `GW_Outcome` (Outcome?)

## Done — Not yours to close (`End_NotYours`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### Decide — Outcome? (`GW_Outcome`)

- The performer's judgement on the work, and one of three recorded endings.
- Call `workflow_complete` with `node: "GW_Outcome"` and `outcome` set to the label that holds:
  - «done» → `Task_Complete` (Complete (no unchecked todos left))
  - «not wanted» → `Task_Scrap` (Scrap with reasons NEVER delete)
  - «blocked» → `Task_RecordBlocker` (Record the blocker and hand back)

### 6. Complete (no unchecked todos left) (`Task_Complete`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: Only once nothing is unchecked, and with a summary of what changed.
- Record it: `workflow_complete` with `node: "Task_Complete"`.
- next: → `End_Recorded` (State recorded)

### 7. Scrap with reasons NEVER delete (`Task_Scrap`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `todo-manager`.
- What: `status: scrapped`, plus a "Reasons for Scrapping" section.
- Record it: `workflow_complete` with `node: "Task_Scrap"`.
- next: → `End_Recorded` (State recorded)

### 8. Record the blocker and hand back (`Task_RecordBlocker`)

- Who: the `Agent (this session)` lane (role `authoring-agent`).
- Skill: `bean-coordination`.
- What: Blocked is not scrapped.
- Record it: `workflow_complete` with `node: "Task_RecordBlocker"`.
- next: → `End_Recorded` (State recorded)

## Done — State recorded (`End_Recorded`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
