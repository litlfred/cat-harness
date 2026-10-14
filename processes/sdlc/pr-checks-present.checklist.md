<!-- GENERATED from cat-harness/processes/sdlc/pr-checks-present.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Which open pull requests have no CI run on their head?

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/pr-checks-present.bpmn` (process `Process_PrChecksPresent`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Find the open pull requests whose head has no CI run, past an age gate, and say so on one tracking issue and once per head on the pull request.

## Begin — Hourly (:37), or on dispatch (`Start_Sweep`)

- Begin here.
- Call `workflow_start` with `process: "Process_PrChecksPresent"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Sweep` (Ask, per open PR, whether its HEAD has a run — skipping heads younger than 15 min)

### 1. Ask, per open PR, whether its HEAD has a run — skipping heads younger than 15 min (`Task_Sweep`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Run check:prs-have-runs --min-age-minutes 15, writing the report file first.
- Record it: `workflow_complete` with `node: "Task_Sweep"`.
- next: → `GW_Determined` (Could we tell?)

### Decide — Could we tell? (`GW_Determined`)

- Asked of the `verdict` output of the `Sweep` step in .github/workflows/pr-checks-present.yml, which runs `check:prs-have-runs --min-age-minutes 15`.
- Call `workflow_complete` with `node: "GW_Determined"` and `outcome` set to the label that holds:
  - «no» → `End_Unknown` (Unknown — job RED, issue UNTOUCHED)
  - «yes» → `Task_Label` (Ensure the tracking label exists)

## Done — Unknown — job RED, issue UNTOUCHED (`End_Unknown`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 2. Ensure the tracking label exists (`Task_Label`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Create the pr-no-checks label with --force so it exists before either issue path runs — the close path filters on it too, and on a repository that has never had a finding it would not exist yet.
- Record it: `workflow_complete` with `node: "Task_Label"`.
- next: → `GW_Finding` (Any head with no run?)

### Decide — Any head with no run? (`GW_Finding`)

- Asked of the same `verdict`.
- Call `workflow_complete` with `node: "GW_Finding"` and `outcome` set to the label that holds:
  - «none» → `Task_Close` (Close the tracking issue)
  - «one or more» → `Task_Track` (Open or EDIT the one tracking issue)

### 3. Close the tracking issue (`Task_Close`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Clean: close the open pr-no-checks issue, if any, saying why (every open pull request's head now has a CI run).
- Record it: `workflow_complete` with `node: "Task_Close"`.
- next: → `End_Clean` (Every head has a run)

### 4. Open or EDIT the one tracking issue (`Task_Track`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `ci-health`.
- What: Findings: EDIT the one open issue labelled pr-no-checks if there is one, otherwise create it, with the sweep's report as the body.
- Record it: `workflow_complete` with `node: "Task_Track"`.
- next: → `Task_Comment` (Comment ONCE per (PR, head sha))

## Done — Every head has a run (`End_Clean`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Comment ONCE per (PR, head sha) (`Task_Comment`)

- Who: the `Scheduled log sweep` lane (role `build-pipeline`).
- Skill: `issue-working`.
- What: Comment on each affected open PR once per (PR, head sha): a hidden marker carrying the sha is checked first, so a re-run on the same head stays silent and a new push can be reported again.
- Record it: `workflow_complete` with `node: "Task_Comment"`.
- next: → `End_Recorded` (Recorded — job stays GREEN)

## Done — Recorded — job stays GREEN (`End_Recorded`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
