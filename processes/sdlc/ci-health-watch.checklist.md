<!-- GENERATED from cat-harness/processes/sdlc/ci-health-watch.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Is CI actually working on the default branch?

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/ci-health-watch.bpmn` (process `Process_CiHealth`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Is CI actually working on the default branch: record each workflow's state on one tracking issue, and fail the job only when the state could not be determined.

## Begin — Weekly (Mon 09:17 UTC), a FAILING gating run on main, or on dispatch (`Start_Sweep`)

- Begin here: Three ways in, and the first two answer different questions.
- Call `workflow_start` with `process: "Process_CiHealth"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Check` (Run check:ci-health, WRITING the report file)

### 1. Run check:ci-health, WRITING the report file (`Task_Check`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Run check:ci-health --out, writing the report file before any exit path.
- Record it: `workflow_complete` with `node: "Task_Check"`.
- next: → `GW_Determined` (Could we tell?)

### Decide — Could we tell? (`GW_Determined`)

- Asked of the `verdict` output that the `check` step of .github/workflows/ci-health.yml writes, not of the raw exit code.
- Call `workflow_complete` with `node: "GW_Determined"` and `outcome` set to the label that holds:
  - «no» → `End_Unknown` (Unknown — job RED, issue UNTOUCHED)
  - «yes» → `Task_Label` (Ensure the tracking label exists)

## Done — Unknown — job RED, issue UNTOUCHED (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 2. Ensure the tracking label exists (`Task_Label`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Create the tracking label (the `label` input) with --force so it exists before either issue path runs — the close path filters on it too, and on a repository that has never had a finding it would not exist yet.
- Shared step `GT_EnsureTrackingLabel`, with `label` = `ci-health`.
- Record it: `workflow_complete` with `node: "Task_Label"`.
- next: → `GW_Finding` (Anything red on main?)

### Decide — Anything red on main? (`GW_Finding`)

- Asked of the same `verdict`, once it is known.
- Call `workflow_complete` with `node: "GW_Finding"` and `outcome` set to the label that holds:
  - «clean» → `Task_Close` (Close the tracking issue)
  - «not clean» → `Task_Track` (Open or EDIT the one tracking issue)

### 3. Close the tracking issue (`Task_Close`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Clean: close the open issue carrying the tracking label (the `label` input), if any, saying why the verdict is clean.
- Shared step `GT_CloseTrackingIssue`, with `label` = `ci-health`.
- Record it: `workflow_complete` with `node: "Task_Close"`.
- next: → `End_Clean` (main is green)

### 4. Open or EDIT the one tracking issue (`Task_Track`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Findings: EDIT the one open issue carrying the tracking label (the `label` input) if there is one, otherwise create it, with the report as the body.
- Shared step `GT_TrackIssue`, with `label` = `ci-health`.
- Record it: `workflow_complete` with `node: "Task_Track"`.
- next: → `End_Found` (Recorded — job stays GREEN)

## Done — main is green (`End_Clean`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Recorded — job stays GREEN (`End_Found`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
