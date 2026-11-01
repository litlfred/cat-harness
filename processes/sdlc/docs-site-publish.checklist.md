<!-- GENERATED from cat-harness/processes/sdlc/docs-site-publish.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Publishing the docs site, and keeping the previews alive

> **Generated, and not the authority.** This is `cat-harness/processes/sdlc/docs-site-publish.bpmn` (process `Process_DocsSite`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Publish the docs site to `gh-pages`, verify the export before the deploy, and keep the open pull requests' previews alive across a deploy that replaces the whole branch.

## Begin — Push to main, or dispatch (`Start_Push`)

- Begin here.
- Call `workflow_start` with `process: "Process_DocsSite"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_SecurityGate` (Run the release security gate)

### 1. Run the release security gate (`Task_SecurityGate`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- Skill: `security`.
- What: `bun run cat security:gate`, before anything is built (bean `ieum`, owner 2026-10-07: "security check before release").
- Record it: `workflow_complete` with `node: "Task_SecurityGate"`.
- next: → `GW_Secure` (Security gate passed?)

### Decide — Security gate passed? (`GW_Secure`)

- `passed` only on exit 0, meaning no blocking check failed or could not be run.
- Call `workflow_complete` with `node: "GW_Secure"` and `outcome` set to the label that holds:
  - «passed» → `Task_Regenerate` (Regenerate every derived reference from its source)
  - «refused, or could not check» → `Call_Alert` (Alert the publication manager)

### 2. Regenerate every derived reference from its source (`Task_Regenerate`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- What: Regenerate every derived reference from its source before building: skill schema and instruction pages, content-backed docs pages, the graph projections and viewers, the handler and translation indexes, and the rendered BPMN diagrams.
- Record it: `workflow_complete` with `node: "Task_Regenerate"`.
- next: → `Task_Build` (Build the Jekyll site and the API reference)

### 3. Alert the publication manager (`Call_Alert`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- Skill: `publish-verification`.
- What: Process_PublishAlert — the ONE alert every failing step after the publish button goes through, whichever step it was.
- A subprocess (`Process_PublishAlert`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Failed` (Job RED — publication manager alerted)

### 4. Build the Jekyll site and the API reference (`Task_Build`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- What: Compose the docs layers, build the Jekyll site, mount instance-rendered content, and generate the TypeScript API reference with TypeDoc.
- Record it: `workflow_complete` with `node: "Task_Build"`.
- next: → `Task_Export` (Export the knowledge graph and its schema)

## Done — Job RED — publication manager alerted (`End_Failed`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 5. Export the knowledge graph and its schema (`Task_Export`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- What: Export the knowledge graph and its schema into the published tree, then check every maintained artefact is present and no block-level markup escaped.
- Record it: `workflow_complete` with `node: "Task_Export"`.
- next: → `GW_Complete` (Is every maintained artefact present?)

### Decide — Is every maintained artefact present? (`GW_Complete`)

- Answered by the export: is every maintained artefact present?
- Call `workflow_complete` with `node: "GW_Complete"` and `outcome` set to the label that holds:
  - «something is missing» → `Call_Alert` (Alert the publication manager)
  - «complete» → `Call_Verify` (Verify the export)

### 6. Verify the export (`Call_Verify`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- Skill: `publish-verification`.
- What: Process_PublishVerification: the verifier set over the built tree, before anything is deployed.
- A subprocess (`Process_PublishVerification`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Verified` (Verified?)

### Decide — Verified? (`GW_Verified`)

- Answered by the verification sub-process's end: `yes` only when every in-scope document passed.
- Call `workflow_complete` with `node: "GW_Verified"` and `outcome` set to the label that holds:
  - «yes» → `Task_Restore` (Restore the OPEN PRs' staging previews)
  - «no, or could not tell» → `Call_Alert` (Alert the publication manager)

### 7. Restore the OPEN PRs' staging previews (`Task_Restore`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- Skill: `feature-staging`.
- What: Copy every OPEN pull request's STAGING/<slug>/ preview from gh-pages into the publish directory before the replace, once per publish attempt.
- Record it: `workflow_complete` with `node: "Task_Restore"`.
- next: → `Task_Publish` (Push to the CDN gh-pages, FULL REPLACE)

### 8. Push to the CDN gh-pages, FULL REPLACE (`Task_Publish`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- Skill: `render-kg-to-cdn`.
- What: THIS SITE IS ONE INSTANCE OF THE GENERAL STEP (owner, 2026-09-30: gh-pages is "one specific tool of general 'publish to CDN'").
- A subprocess (`Process_RenderKgToCdn`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `GW_Deployed` (Did the deploy succeed?)

### Decide — Did the deploy succeed? (`GW_Deployed`)

- Answered by the deploy step itself.
- Call `workflow_complete` with `node: "GW_Deployed"` and `outcome` set to the label that holds:
  - «yes» → `GW_Survived` (Did the previews survive?)
  - «no» → `Call_Alert` (Alert the publication manager)

### Decide — Did the previews survive? (`GW_Survived`)

- Asked after the full-replace publish: are the open PRs' previews still there?
- Call `workflow_complete` with `node: "GW_Survived"` and `outcome` set to the label that holds:
  - «yes» → `Task_CloseAlert` (Close the publication manager's alert, if open)
  - «no, or could not tell» → `Call_Alert` (Alert the publication manager)

### 9. Close the publication manager's alert, if open (`Task_CloseAlert`)

- Who: the `CI/CD Pipeline` lane (role `build-pipeline`).
- What: A clean publish resolves whatever the last failure raised: close the open publication-manager tracking issue with a comment naming this run.
- Record it: `workflow_complete` with `node: "Task_CloseAlert"`.
- next: → `End_Published` (Site published, previews intact)

## Done — Site published, previews intact (`End_Published`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
