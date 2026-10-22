<!-- GENERATED from cat-harness/processes/sdlc/repository-health-watch.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Is the repository itself healthy?

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/repository-health-watch.bpmn` (process `Process_RepoHealth`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Is the repository itself healthy — what the review previews cost the publish branch, what a clone costs, whether the work plan holds duplicates or unhonoured claims — reported in one tracking issue and never acted on.

## Begin — Daily (06:41 UTC), or on dispatch (`Start_Sweep`)

- Begin here.
- Call `workflow_start` with `process: "Process_RepoHealth"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Check` (Run the health checks, keeping the report either way)

### 1. Run the health checks, keeping the report either way (`Task_Check`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `deletion-requires-confirmation`.
- What: Run bun run cat health --out and upload the JSON report whatever the verdict — on unknown it is the only evidence of why the sweep went blind.
- Record it: `workflow_complete` with `node: "Task_Check"`.
- next: → `GW_Determined` (Could we tell?)

### Decide — Could we tell? (`GW_Determined`)

- Asked of the `verdict` output of 'Run the health checks' in .github/workflows/health-check.yml, which runs `bun run cat health --out`.
- Call `workflow_complete` with `node: "GW_Determined"` and `outcome` set to the label that holds:
  - «no» → `End_Unknown` (Unknown — job RED, issue UNTOUCHED)
  - «yes» → `Task_Label` (Ensure the tracking label exists)

## Done — Unknown — job RED, issue UNTOUCHED (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 2. Ensure the tracking label exists (`Task_Label`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Create the tracking label (the `label` input) with --force so it exists before either issue path runs — the close path filters on it too, and on a repository that has never had a finding it would not exist yet.
- Shared step `GT_EnsureTrackingLabel`, with `label` = `repo-health`.
- Record it: `workflow_complete` with `node: "Task_Label"`.
- next: → `GW_Finding` (Any findings?)

### Decide — Any findings? (`GW_Finding`)

- Asked of the same `verdict`.
- Call `workflow_complete` with `node: "GW_Finding"` and `outcome` set to the label that holds:
  - «clean» → `Task_Close` (Close the tracking issue)
  - «not clean» → `Task_Track` (Open or EDIT the one tracking issue)

### 3. Close the tracking issue (`Task_Close`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Clean: close the open issue carrying the tracking label (the `label` input), if any, saying why the verdict is clean.
- Shared step `GT_CloseTrackingIssue`, with `label` = `repo-health`.
- Record it: `workflow_complete` with `node: "Task_Close"`.
- next: → `End_Clean` (Repository clean)

### 4. Open or EDIT the one tracking issue (`Task_Track`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Findings: EDIT the one open issue carrying the tracking label (the `label` input) if there is one, otherwise create it, with the report as the body.
- Shared step `GT_TrackIssue`, with `label` = `repo-health`.
- Record it: `workflow_complete` with `node: "Task_Track"`.
- next: → `End_Found` (Recorded — job stays GREEN)

## Done — Repository clean (`End_Clean`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Recorded — job stays GREEN (`End_Found`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
