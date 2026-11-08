<!-- GENERATED from cat-harness/processes/kg/kg-separation-move.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Move the graph into its repositories

> **Generated, and not the authority.** This is `cat-harness/processes/kg/kg-separation-move.bpmn` (process `Process_KgSeparationMove`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

Creates the repositories, drains the open PRs until the source settles, seeds both repositories, has the parent consume the pair additively, makes the first release and checks every identifier dereferences.

## Begin — Extraction authorised (`Start_Move`)

- Begin here.
- Call `workflow_start` with `process: "Process_KgSeparationMove"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Create` (Create the repositories)

### 1. Create the repositories (`Task_Create`)

- Who: the `Administrator` lane (role `administrator`).
- Skill: `kg-separation`.
- What: The owner creates the content and tools repositories and their Pages.
- Record it: `workflow_complete` with `node: "Task_Create"`.
- next: → `GW_SeedReady` (Ready to seed?)

### Decide — Ready to seed? (`GW_SeedReady`)

- Asked AT SEED TIME, because the tree has moved since `8 · Rehearse`.
- Computed by the DMN table `decisions/seed-readiness-gate.dmn#Decision_SeedReadiness`: call `workflow_complete` with `node: "GW_SeedReady"` and the `facts` it reads — the table returns the branch; pass no `outcome`.
  - «not yet» → `Task_Drain` (Drain: land, close or re-target the open PRs)
  - «unknown» → `End_SeedUnknown` (UNKNOWN: do not seed)
  - «settled» → `Task_Seed` (Seed both repositories)

### 2. Drain: land, close or re-target the open PRs (`Task_Drain`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `kg-separation`.
- What: Work the PRs `seed:ready` named until the source settles: land or close the heavy movers and the next layer's PRs, bring the layer's open PRs to five or fewer, and finish any move in flight.
- Shared step `GT_Drain`.
- Record it: `workflow_complete` with `node: "Task_Drain"`.
- next: → `GW_SeedReady` (Ready to seed?)

## Done — UNKNOWN: do not seed (`End_SeedUnknown`)

- The instance completes here: Readiness could not be decided. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

### 3. Seed both repositories (`Task_Seed`)

- Who: the `Authoring agent` lane (role `authoring-agent`).
- Skill: `kg-separation`.
- What: Seed main, then bring the content and the tools in as reviewed pull requests with their history, so neither repository's first commit is unreviewable.
- Record it: `workflow_complete` with `node: "Task_Seed"`.
- next: → `Task_Consume` (Parent consumes, additively)

### 4. Parent consumes, additively (`Task_Consume`)

- Who: the `Platform authoring agent` lane (role `platform-authoring-agent`).
- Skill: `upstream-version-adoption`.
- What: The parent pins the pair (a commit while staging, a version once released) — a code dependency as a `source.remote` instance in its root `index.config.json` (remote-mount skill), never a submodule — repoints its imports, and keeps its own copy until it is green with the dependency declared.
- A subprocess (`Process_UpstreamAdoption`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `Task_Release` (First release)

### 5. First release (`Task_Release`)

- Who: the `Publication manager` lane (role `publication-manager`).
- Skill: `package-release`.
- What: Tag each repository, publish /v<major>/.
- Record it: `workflow_complete` with `node: "Task_Release"`.
- next: → `Task_Verify` (Every identifier dereferences)

### 6. Every identifier dereferences (`Task_Verify`)

- Who: the `Build pipeline` lane (role `build-pipeline`).
- Skill: `publish-verification`.
- What: After the release is live, every published identifier resolves to the file it names.
- A subprocess (`Process_PublishVerification`): `workflow_next` reports its own steps; complete those — this call activity itself is not completable.
- next: → `End_Moved` (Released and dereferencing)

## Done — Released and dereferencing (`End_Moved`)

- The instance completes here: Both repositories seeded, the parent consumes them, and the first release dereferences. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
