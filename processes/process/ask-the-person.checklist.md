<!-- GENERATED from cat-harness/processes/process/ask-the-person.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Ask the person

> **Generated, and not the authority.** This is `cat-harness/processes/process/ask-the-person.bpmn` (process `Process_AskThePerson`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

The ONE way a question or decision is put to a person.

## Begin — A question is due (`Start_Process_AskThePerson`)

- Begin here.
- Call `workflow_start` with `process: "Process_AskThePerson"` and the subject this run is about; keep the instance id it returns.
- next: → `A_Compose` (Compose the full question)

### 1. Compose the full question (`A_Compose`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `ask-the-person`, `decision-comparison`.
- What: What is being decided, stated as what will differ; every id, path and coined name glossed; every option with its letter, a one-line explanation and its trade-off; the recommendation, first and marked; what will happen if no answer comes.
- Record it: `workflow_complete` with `node: "A_Compose"`.
- next: → `GW_Discussing` (Talking with the person?)

### Decide — Talking with the person? (`GW_Discussing`)

- `yes` when this agent is the one the person is talking with right now.
- Call `workflow_complete` with `node: "GW_Discussing"` and `outcome` set to the label that holds:
  - «yes» → `A_WriteInChat` (Write it in the chat)
  - «no» → `A_HandBack` (Hand it back to the discussion)

### 2. Write it in the chat (`A_WriteInChat`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `ask-the-person`.
- What: Post the whole composed question as ordinary chat text BEFORE any card.
- Record it: `workflow_complete` with `node: "A_WriteInChat"`.
- next: → `A_OfferCard` (Offer the same options as a tappable card)

### 3. Hand it back to the discussion (`A_HandBack`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `hand-back-to-discussion`.
- What: The composed question goes, unchanged, to the discussion agent, which asks it through this same process on its `yes` branch and routes the answer back: the sibling's half of `Process_HandBackToDiscussion` (a task here, not a call, because that process calls this one).
- Record it: `workflow_complete` with `node: "A_HandBack"`.
- next: → `End_HandedBack` (Answer returned through the discussion)

### 4. Offer the same options as a tappable card (`A_OfferCard`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `ask-the-person`.
- What: Whatever the host calls its selection tool (`AskUserQuestion`, `request_decision`, a button card): the same letters and labels as the chat text, the recommended option marked.
- Record it: `workflow_complete` with `node: "A_OfferCard"`.
- next: → `U_Choose` (Choose an option)

## Done — Answer returned through the discussion (`End_HandedBack`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Choose an option (`U_Choose`)

- Who: the `Person` lane (role `user`).
- Skill: `interaction-modality`.
- What: One tap on the card, or any answer the person prefers to give.
- Record it: `workflow_complete` with `node: "U_Choose"`.
- next: → `GW_Answered` (Answered?)

### Decide — Answered? (`GW_Answered`)

- `yes` when the person chose an option.
- Call `workflow_complete` with `node: "GW_Answered"` and `outcome` set to the label that holds:
  - «yes» → `A_Record` (Record the answer)
  - «no» → `A_ProceedOnDefault` (Proceed on the stated default, question left open)

### 6. Record the answer (`A_Record`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `ask-the-person`, `symbiotic-interaction`.
- What: Hand the answer back to the calling step, quoted.
- Record it: `workflow_complete` with `node: "A_Record"`.
- next: → `End_Answered` (Answer returned to the caller)

### 7. Proceed on the stated default, question left open (`A_ProceedOnDefault`)

- Who: the `Agent` lane (role `authoring-agent`).
- Skill: `ask-the-person`.
- What: Do what the question said would happen with no answer, and say so.
- Record it: `workflow_complete` with `node: "A_ProceedOnDefault"`.
- next: → `End_Default` (Default taken, question still open)

## Done — Answer returned to the caller (`End_Answered`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Default taken, question still open (`End_Default`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
