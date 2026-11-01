<!-- GENERATED from cat-harness/processes/library/materialize-remote.bpmn by cat-harness-tools/scripts/bpmn-checklist.ts. Do not edit: change the diagram and regenerate (bun run cat bpmn:checklist). -->

# Checklist — Materialize remote content — the shared subprocess

> **Generated, and not the authority.** This is `cat-harness/processes/library/materialize-remote.bpmn` (process `Process_MaterializeRemote`) walked as a state machine. The diagram and the workflow engine decide; this list only reads them. Follow the `next:` line of each step rather than the order on the page, and record each step with the call it names, so the engine's committed state — not this list — says which edge was taken.

One process, called wherever remote content is landed locally.

## Begin — Remote content is wanted locally (`StartEvent_Asked`)

- Begin here: The only entry point.
- Call `workflow_start` with `process: "Process_MaterializeRemote"` and the subject this run is about; keep the instance id it returns.
- next: → `Task_Purpose` (Declare the purpose: working or archival)

### 1. Declare the purpose: working or archival (`Task_Purpose`)

- Who: the `Contributor (human or agent)` lane (role `user`).
- Skill: `materialize-remote`.
- What: working or archival, and it is asked FIRST because three of the five gates mean different things under each.
- Record it: `workflow_complete` with `node: "Task_Purpose"`.
- next: → `Task_Enumerate` (Enumerate the subset against the source)

### 2. Enumerate the subset against the source (`Task_Enumerate`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: Resolve the request against the source's descriptor (one per corpus, in the declared sources/ of the instance that owns it, e.g.
- Record it: `workflow_complete` with `node: "Task_Enumerate"`.
- next: → `Task_Size` (Size the fraction and the whole)

### 3. Size the fraction and the whole (`Task_Size`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: What is being taken, and what the whole collection would cost.
- Record it: `workflow_complete` with `node: "Task_Size"`.
- next: → `Task_Restrictions` (Check restrictions (unknown is not yes))

### 4. Check restrictions (unknown is not yes) (`Task_Restrictions`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: The owner's phrase is 'no restrictions known in context', and that is a STATE, not a green light.
- Record it: `workflow_complete` with `node: "Task_Restrictions"`.
- next: → `Task_Copyright` (Check copyright per file and derivative)

### 5. Check copyright per file and derivative (`Task_Copyright`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: What the licence permits for THIS bitstream, and separately whether it permits the derivation.
- Record it: `workflow_complete` with `node: "Task_Copyright"`.
- next: → `Task_Retention` (RETENTION what expires this copy)

### 6. RETENTION what expires this copy (`Task_Retention`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: A copy with no expiry cannot be told from an abandoned one — the same argument bean-blocking makes about a block with no expiry.
- Record it: `workflow_complete` with `node: "Task_Retention"`.
- next: → `Task_SourceLoss` (Check what survives if the origin goes)

### 7. Check what survives if the origin goes (`Task_SourceLoss`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: Not hypothetical.
- Record it: `workflow_complete` with `node: "Task_SourceLoss"`.
- next: → `Gateway_Gates` (All five answered, none refused?)

### Decide — All five answered, none refused? (`Gateway_Gates`)

- Have all five gates been answered, with none refusing?
- Call `workflow_complete` with `node: "Gateway_Gates"` and `outcome` set to the label that holds:
  - «yes» → `Task_Fetch` (Fetch, and record fixity)
  - «no, or unknown» → `Task_StayRef` (Leave it `referenced`, record why)

### 8. Fetch, and record fixity (`Task_Fetch`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: Fetch, then record sha256 and byte count.
- Record it: `workflow_complete` with `node: "Task_Fetch"`.
- next: → `Task_Declare` (Declare the node `materialized`)

### 9. Leave it `referenced`, record why (`Task_StayRef`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: A refusal is not a failure of the process — it is the process working.
- Record it: `workflow_complete` with `node: "Task_StayRef"`.
- next: → `EndEvent_Refused` (Not materialized, and the graph says why)

### 10. Declare the node `materialized` (`Task_Declare`)

- Who: the `Ingestion Engine (agent, runs unattended)` lane (role `ingestion-agent`).
- Skill: `materialize-remote`.
- What: The node's state moves from `referenced` to `materialized`, carrying purpose, localPath, gates and (archival) fixity.
- Record it: `workflow_complete` with `node: "Task_Declare"`.
- next: → `EndEvent_Done` (Local copy exists, with its five answers)

## Done — Not materialized, and the graph says why (`EndEvent_Refused`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.

## Done — Local copy exists, with its five answers (`EndEvent_Done`)

- The instance completes here. `workflow_next` then reports nothing enabled — that, not this line, is the record of completion.
