<!-- GENERATED from cat-harness/sdlc/processes/merge-request.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Merge request: find or elect the merge manager

> **Generated, and not the authority.** This is `cat-harness/sdlc/processes/merge-request.bpmn` (process `Process_MergeRequest`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

The sibling's side of merging (owner ruling, 2026-11-07).

## Begin — PR ready to merge (`Sib_Start`)

- Begin here: A sibling session (any coding agent) has a PR whose full tier is green as judged and wants it merged.
- Call `workflow_start` with `process: "Process_MergeRequest"` and the subject this run is about; keep the instance id it returns.
- next: → `Sib_GwActive` (Merge manager active?)

### Decide — Merge manager active? (`Sib_GwActive`)

- Yes when the latest "merge manager: <session id>" announcement in the coordination group names a session that is live: active, and it answered within the stall window (holding.stalledAfterMinutes).
- Call `workflow_complete` with `node: "Sib_GwActive"` and `outcome` set to the label that holds:
  - «Yes» → `Sib_Send` (Send the six-line merge request)
  - «No» → `Sib_GwNeeded` (Merge manager needed?)

### 1. Send the six-line merge request (`Sib_Send`)

- Who: the `Sibling session` lane (role `sibling-session`).
- Skill: `merge-manager-watcher`.
- What: To the merge manager: the PR URL and full head SHA, the session URL, 1-3 sentences on the change, the rendered preview URL or no preview with a reason, what to look for, and full tier green as judged (owner ruling, 2026-11-07).
- Record it: `workflow_complete` with `node: "Sib_Send"`.
- next: → `Sib_GwAcked` (Acknowledged in time?)

### Decide — Merge manager needed? (`Sib_GwNeeded`)

- The measured condition (laneNeeded): two or more active sessions have ready PRs in the same repositories, and either the runners are contended (more than about 10 queued runs on a repository, or the oldest queued run older than about 30 minutes) or PRs conflict with or supersede each other (owner ru
- Call `workflow_complete` with `node: "Sib_GwNeeded"` and `outcome` set to the label that holds:
  - «Yes» → `Sib_Elect` (Elect the merge manager with the siblings)
  - «No» → `Sib_Self` (Merge manager for its own PRs)

### Decide — Acknowledged in time? (`Sib_GwAcked`)

- Yes when the merge manager acknowledged the request within the stall window.
- Call `workflow_complete` with `node: "Sib_GwAcked"` and `outcome` set to the label that holds:
  - «Yes» → `Sib_EndQueued` (With the merge manager)
  - «No» → `Sib_CallStalled` (Stalled-agent triage)

### 2. Elect the merge manager with the siblings (`Sib_Elect`)

- Who: the `Sibling session` lane (role `sibling-session`).
- Skill: `merge-manager-watcher`.
- What: The deterministic rule (electHolder): the active session that owns the P0 PR, else the earliest-created active session, the session id breaking a tie.
- Record it: `workflow_complete` with `node: "Sib_Elect"`.
- next: → `Sib_GwWon` (Elected this session?)

### 3. Merge manager for its own PRs (`Sib_Self`)

- Who: the `Sibling session` lane (role `sibling-session`).
- What: No merge manager is needed (a lone session, or a lapsed lane): the session is its own merge manager for its own PRs only, so it runs the merge manager loop for them.
- A subprocess (`Process_MergeManagerWatch`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Sib_EndSelf` (Own PRs landed)

## Done — With the merge manager (`Sib_EndQueued`)

- The instance completes here: The merge manager owns the landing from here: it reports landed, or hands the PR back with the reason. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 4. Stalled-agent triage (`Sib_CallStalled`)

- Who: the `Sibling session` lane (role `sibling-session`).
- What: Tell the owner that the merge manager stalled, then re-elect with the stalled session excluded.
- A subprocess (`Process_StalledAgentTriage`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Sib_Elect` (Elect the merge manager with the siblings)

### Decide — Elected this session? (`Sib_GwWon`)

- Call `workflow_complete` with `node: "Sib_GwWon"` and `outcome` set to the label that holds:
  - «Yes» → `Sib_Announce` (Announce and note the merge manager)
  - «No» → `Sib_Send` (Send the six-line merge request)

## Done — Own PRs landed (`Sib_EndSelf`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Announce and note the merge manager (`Sib_Announce`)

- Who: the `Sibling session` lane (role `sibling-session`).
- Skill: `merge-manager-watcher`.
- What: Send "merge manager: <session id>" to every sibling and the owner, and note it durably on the coordination work item, so it is used by all, including siblings started later.
- Record it: `workflow_complete` with `node: "Sib_Announce"`.
- next: → `Sib_CallWatch` (Merge manager watch)

### 6. Merge manager watch (`Sib_CallWatch`)

- Who: the `Sibling session` lane (role `sibling-session`).
- What: The elected session holds the merge steward lane and runs its loop until it hands over or the lane lapses.
- A subprocess (`Process_MergeManagerWatch`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Sib_EndHolds` (Lane handed over or lapsed)

## Done — Lane handed over or lapsed (`Sib_EndHolds`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
