<!-- GENERATED from cat-harness/processes/sdlc/jsonld-drift-check.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Are the .jsonld siblings still in sync with their .ts manifests?

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/jsonld-drift-check.bpmn` (process `Process_JsonLdDrift`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Check that the committed `.jsonld` siblings are still in sync with the `.ts` manifests they are generated from.

## Begin — Pull request, push to main, or dispatch (`Start_Change`)

- Begin here.
- Call `workflow_start` with `process: "Process_JsonLdDrift"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Check` (Regenerate the context, block, library and site graphs — and diff)

### 1. Regenerate the context, block, library and site graphs — and diff (`Task_Check`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- What: Run the five --check generators in one job — the JSON-LD context, block siblings, library nodes, site graph, then the label-resolution and emitter tests.
- Record it: `workflow_complete` with `node: "Task_Check"`.
- next: → `GW_Drift` (Did anything change?)

### Decide — Did anything change? (`GW_Drift`)

- Answered by the diff Task_Check takes after regenerating the context, block, library and site graphs.
- Call `workflow_complete` with `node: "GW_Drift"` and `outcome` set to the label that holds:
  - «no — in sync» → `End_Clean` (Every sibling in sync)
  - «yes — drifted» → `End_Drift` (Job RED — the generated file is stale)

## Done — Every sibling in sync (`End_Clean`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Job RED — the generated file is stale (`End_Drift`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
