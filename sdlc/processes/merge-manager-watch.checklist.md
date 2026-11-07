<!-- GENERATED from cat-harness/sdlc/processes/merge-manager-watch.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Merge manager watch: wake, read the queue live, route

> **Generated, and not the authority.** This is `cat-harness/sdlc/processes/merge-manager-watch.bpmn` (process `Process_MergeManagerWatch`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

The loop run by the agent that holds the merge-steward lane (actor merge-manager, skill merge-manager-watcher), which coordinates with the swarm siblings whenever a batch lands.

## Begin — Timer, PR event, main run done, or sibling message (`Start_Wake`)

- Begin here: Every 10 minutes in the merge window, and hourly outside it, as a backstop.
- Call `workflow_start` with `process: "Process_MergeManagerWatch"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Read` (Read PRs, runner queue, main verdict and owners)

### 1. Read PRs, runner queue, main verdict and owners (`Task_Read`)

- Who: the `Merge steward` lane (role `merge-steward`).
- Skill: `merge-manager-watcher`.
- What: Read live, never from a stored copy: the open PRs (draft, head, mergeable, owed checks, open owner decisions), the queued and running runs with the age of the oldest, the latest main push run, and each PR owner's last push or comment.
- Record it: `workflow_complete` with `node: "Task_Read"`.
- next: → `Gw_Route` (What does the queue need?)

### Decide — What does the queue need? (`Gw_Route`)

- Saturated: queued runs are 60+ minutes old and nothing has landed, or the owner says the runners are full.
- Call `workflow_complete` with `node: "Gw_Route"` and `outcome` set to the label that holds:
  - «Saturated» → `Task_Relieve` (Relieve the runners)
  - «Ready» → `Gw_Green` (All green per rule 1?)
  - «Stalled» → `Call_Stalled` (Stalled-agent triage)
  - «Nothing» → `End_Idle` (Nothing to do)

### 2. Relieve the runners (`Task_Relieve`)

- Who: the `Merge steward` lane (role `merge-steward`).
- Skill: `merge-manager-watcher`.
- What: Enforce the pacing rule of continual-progress (owner ruling, 2026-11-07, card Cancel CI): close superseded or duplicate PRs, such as a re-pin whose commits another open PR already carries, and cancel their runs; cancel stale queued runs that never started, never a main push run that has started; ask
- Record it: `workflow_complete` with `node: "Task_Relieve"`.
- next: → `Call_Meta` (Saturation meta-merge)

### Decide — All green per rule 1? (`Gw_Green`)

- Every check run on the head SHA has finished, and anything pending blocks; wait for every tier, e2e included.
- Call `workflow_complete` with `node: "Gw_Green"` and `outcome` set to the label that holds:
  - «Yes» → `Gw_Approved` (Owner approved?)
  - «No» → `End_NotGreen` (Not green yet)

### 3. Stalled-agent triage (`Call_Stalled`)

- Who: the `Merge steward` lane (role `merge-steward`).
- What: Tell the owner, then take the stalled PR over.
- A subprocess (`Process_StalledAgentTriage`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Done` (Wake handled)

## Done — Nothing to do (`End_Idle`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 4. Saturation meta-merge (`Call_Meta`)

- Who: the `Merge steward` lane (role `merge-steward`).
- What: Offer the card and land only on the owner's tap.
- A subprocess (`Process_SaturationMetaMerge`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Done` (Wake handled)

### Decide — Owner approved? (`Gw_Approved`)

- Yes when the owner tapped this batch's card in the merge manager's session, or said to merge this PR when green.
- Call `workflow_complete` with `node: "Gw_Approved"` and `outcome` set to the label that holds:
  - «Yes» → `Gw_Train` (Rides the train?)
  - «No» → `Task_Card` (Put it on the owner's batch card)

## Done — Not green yet (`End_NotGreen`)

- The instance completes here: Do not merge. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Wake handled (`End_Done`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### Decide — Rides the train? (`Gw_Train`)

- Yes for a folio-assistant PR that does not change .github/workflows/.
- Call `workflow_complete` with `node: "Gw_Train"` and `outcome` set to the label that holds:
  - «Yes» → `Call_Train` (Merge train)
  - «No» → `Task_Direct` (Merge it through merge:guard)

### 5. Put it on the owner's batch card (`Task_Card`)

- Who: the `Merge steward` lane (role `merge-steward`).
- Skill: `merge-manager-watcher`.
- What: One card per batch, naming each PR, in priority order: P0 main-red fixes and the re-pin chain, P1 work they unblock, P2 CI speed, P3 the rest.
- Record it: `workflow_complete` with `node: "Task_Card"`.
- next: → `End_AwaitOwner` (Awaiting the owner)

### 6. Merge train (`Call_Train`)

- Who: the `Merge steward` lane (role `merge-steward`).
- What: Add the merge-train label instead of merging; the train lands the batch with one CI run.
- A subprocess (`Process_MergeTrain`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Done` (Wake handled)

### 7. Merge it through merge:guard (`Task_Direct`)

- Who: the `Merge steward` lane (role `merge-steward`).
- Skill: `merge-manager-watcher`.
- What: A workflow PR, or a PR in a repository with no train, merges directly.
- Record it: `workflow_complete` with `node: "Task_Direct"`.
- next: → `End_Done` (Wake handled)

## Done — Awaiting the owner (`End_AwaitOwner`)

- The instance completes here: Do not merge. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
