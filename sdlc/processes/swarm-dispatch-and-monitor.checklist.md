<!-- GENERATED from cat-harness/sdlc/processes/swarm-dispatch-and-monitor.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Swarm dispatch and monitor

> **Generated, and not the authority.** This is `cat-harness/sdlc/processes/swarm-dispatch-and-monitor.bpmn` (process `Process_SwarmDispatchAndMonitor`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Dispatches parallel isolated-worktree worker agents against disjoint sub-beans under an approved or waived swarm-spawn gate, then supervises them on reactive completion wakeups and a 2-to-4-minute fallback timer until the queue drains or halts.

## Begin — Parallel work requested (`Swarm_Start`)

- Begin here: Two or more independent workstreams are candidates for parallel background execution, or the owner asks to drain an epic with monitored workers.
- Call `workflow_start` with `process: "Process_SwarmDispatchAndMonitor"` and the subject this run is about; keep the instance id it returns.
- next: → `Swarm_Decompose` (Decompose disjoint sub-beans)

### 1. Decompose disjoint sub-beans (`Swarm_Decompose`)

- Who: the `Coordinator` lane (role `session-coordinator`).
- Skill: `bean-coordination`.
- What: Verify that a swarm is justified over serial execution (swarm-management), partition the work into sub-beans with non-overlapping writable paths and explicit Done-when criteria in the shared beans store, and size worker count, model tiers (cost-aware routing), and host concurrency bounds.
- Record it: `workflow_complete` with `node: "Swarm_Decompose"`.
- next: → `Swarm_GwWaived` (Swarm-spawn waived?)

### Decide — Swarm-spawn waived? (`Swarm_GwWaived`)

- Yes when an active owner confirmation waiver explicitly covers swarm-spawn up to this worker count and model tier, quoted in the turn report.
- Call `workflow_complete` with `node: "Swarm_GwWaived"` and `outcome` set to the label that holds:
  - «No» → `Owner_DecideSpawn` (Decide swarm card)
  - «Yes» → `Swarm_OpenBean` (Open the swarm epic)

### 2. Decide swarm card (`Owner_DecideSpawn`)

- Who: the `Owner` lane (role `user`).
- Skill: `interaction-modality`.
- What: Coordinator posts the full context, worker count, model tiers, relative token cost, options, and recommendation in chat, followed immediately by a tappable card; the owner approves or declines.
- Record it: `workflow_complete` with `node: "Owner_DecideSpawn"`.
- next: → `Swarm_GwApproved` (Spawn approved?)

### 3. Open the swarm epic (`Swarm_OpenBean`)

- Who: the `Coordinator` lane (role `session-coordinator`).
- Skill: `bean-coordination`.
- What: Claim the parent swarm epic and initial worker sub-beans in the shared beans store through Process_BeanOpen and push state to the branch store so sibling sessions see every active claim.
- A subprocess (`Process_BeanOpen`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Swarm_Dispatch` (Dispatch workers and arm timer)

### Decide — Spawn approved? (`Swarm_GwApproved`)

- Yes when the owner approves the swarm card.
- Call `workflow_complete` with `node: "Swarm_GwApproved"` and `outcome` set to the label that holds:
  - «No» → `Swarm_EndSerial` (Run serially)
  - «Yes» → `Swarm_OpenBean` (Open the swarm epic)

### 4. Dispatch workers and arm timer (`Swarm_Dispatch`)

- Who: the `Coordinator` lane (role `session-coordinator`).
- Skill: `dispatch-agent`.
- What: Launch workers in isolated git worktrees with the verbatim progress contract, governing skill paths, interaction-modality and hand-back-to-discussion rules, and CPU thread caps; arm the 2-to-4-minute one-shot fallback wakeup timer.
- Record it: `workflow_complete` with `node: "Swarm_Dispatch"`.
- next: → `Work_Execute` (Execute slice and emit progress)

## Done — Run serially (`Swarm_EndSerial`)

- The instance completes here: Swarm declined or unjustified; work proceeds sequentially one sub-bean at a time. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Execute slice and emit progress (`Work_Execute`)

- Who: the `Worker agents` lane (role `authoring-agent`).
- Skill: `continual-progress`.
- What: Each worker executes its claimed disjoint slice in its worktree, tees long commands to logs, emits live progress blocks every ~90 seconds and at each step, runs verification, pushes its branch and draft/ready PR, and emits a final DONE block without merging.
- Record it: `workflow_complete` with `node: "Work_Execute"`.
- next: → `Mon_Sweep` (Sweep progress, queues and swap)

### 6. Sweep progress, queues and swap (`Mon_Sweep`)

- Who: the `Swarm monitor` lane (role `swarm-monitor`).
- Skill: `swarm-monitor`.
- What: Woken reactively by worker completion/messages or by the 2-to-4-minute fallback timer: run the targeted JSONL progress extractor, query live forge PR/issue counts and synced beans states, and inspect CPU load, root disk free space (df -h /), and total plus compressed/swap memory (top -l 1 -o mem -st
- Record it: `workflow_complete` with `node: "Mon_Sweep"`.
- next: → `Mon_GwHealthy` (Stall, drift or swap leak?)

### Decide — Stall, drift or swap leak? (`Mon_GwHealthy`)

- Yes when any worker subprocess breaches the memory+compressed/swap or root-disk floor, a worker is silent for over 3 minutes or repeats step counters across two sweeps, workers collide on a path, or completed slices diverge structurally.
- Call `workflow_complete` with `node: "Mon_GwHealthy"` and `outcome` set to the label that holds:
  - «Yes» → `Mon_Triage` (Nudge, kill leak or pull Andon)
  - «No» → `Mon_Report` (Publish scoreboard and rollup)

### 7. Nudge, kill leak or pull Andon (`Mon_Triage`)

- Who: the `Swarm monitor` lane (role `swarm-monitor`).
- Skill: `swarm-monitor`.
- What: Immediately SIGKILL any runaway subprocess leaking into compressed memory or swapfiles and message its worker; nudge a silent worker via SendMessage; route dead sessions through stalled-agent-triage; or pull the Andon cord to halt remaining workers on structural divergence or host exhaustion.
- Record it: `workflow_complete` with `node: "Mon_Triage"`.
- next: → `Mon_Report` (Publish scoreboard and rollup)

### 8. Publish scoreboard and rollup (`Mon_Report`)

- Who: the `Swarm monitor` lane (role `swarm-monitor`).
- Skill: `swarm-monitor`.
- What: Synthesize a self-contained human status update with zero naked worker codes, bare PR ranges, or unglossed bean IDs: (A) Live Repository Queue Scoreboard across PRs, Work Items, and Issues, and (B) Milestone and Epic Progress Rollups stating the track goal, landed verified results with metrics, read
- Record it: `workflow_complete` with `node: "Mon_Report"`.
- next: → `Mon_GwReadyPr` (Verified PR ready?)

### Decide — Verified PR ready? (`Mon_GwReadyPr`)

- Yes when a completed worker branch passes independent parent verification (typecheck, tests, and applicable gates) and is ready for merge-steward intake.
- Call `workflow_complete` with `node: "Mon_GwReadyPr"` and `outcome` set to the label that holds:
  - «Yes» → `Steward_QueuePr` (Queue PR in merge watch)
  - «No» → `Mon_GwJoinNext`

### 9. Queue PR in merge watch (`Steward_QueuePr`)

- Who: the `Merge steward` lane (role `merge-steward`).
- Skill: `merge-manager-watcher`.
- What: Hand the verified six-line merge request (or ready-to-merge / needs-repin label) to the active merge steward for batch approval and merge-train landing; neither workers nor monitor self-merge outside the merge-steward lane.
- A subprocess (`Process_MergeManagerWatch`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Mon_GwJoinNext`

### Merge — `Mon_GwJoinNext`

- Nothing to do or decide: the paths meet here and the engine passes through.
- next: → `Mon_GwContinue` (Slots active or refillable?)

### Decide — Slots active or refillable? (`Mon_GwContinue`)

- Yes while workers remain live or unclaimed, unblocked sub-beans remain in the shared beans queue with healthy host headroom and no Andon halt.
- Call `workflow_complete` with `node: "Mon_GwContinue"` and `outcome` set to the label that holds:
  - «Yes» → `Mon_Refill` (Refill slots and re-arm timer)
  - «Drained» → `Mon_CloseBean` (Close or park swarm epic)

### 10. Refill slots and re-arm timer (`Mon_Refill`)

- Who: the `Swarm monitor` lane (role `swarm-monitor`).
- Skill: `swarm-monitor`.
- What: Claim the next unblocked sub-beans in the shared beans store (pushing claims to the branch store), dispatch fresh isolated-worktree workers into freed slots, and re-arm the 2-to-4-minute one-shot fallback timer before ending the turn.
- Record it: `workflow_complete` with `node: "Mon_Refill"`.
- next: → `Work_Execute` (Execute slice and emit progress)

### 11. Close or park swarm epic (`Mon_CloseBean`)

- Who: the `Swarm monitor` lane (role `swarm-monitor`).
- Skill: `todo-manager`.
- What: Cancel any remaining wakeup timer and run Process_BeanClose on the swarm epic: complete and archive when all sub-beans landed, or record explicit blockers/owner decisions in beans and hand back cleanly.
- A subprocess (`Process_BeanClose`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Mon_EndClosed` (Swarm closed)

## Done — Swarm closed (`Mon_EndClosed`)

- The instance completes here: All swarm slots have drained or halted cleanly, final Dual Scoreboard and Milestone Rollup is published, and shared work-plan state is synced. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
