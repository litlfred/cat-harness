---
title: "Developer Mode: Topology, Tool Parity, and Capability Guard"
summary: >-
  Specification and measured reality of Developer Mode: topology preset values,
  MCP-vs-CLI tool parity measurement, and single-model capability refusal guard.
date: 2026-10-09
bean: folio-assistant-2ngl
---

# Developer Mode: Topology, Tool Parity, and Capability Guard

> **Bean**: `folio-assistant-2ngl`  
> **Source Issue**: [#363](https://github.com/litlfred/folio-assistant/issues/363)  
> **Topology Reference**: [Deployment topologies and operating modes](../proposals/deployment-topologies.md)

Developer mode represents a local workstation environment for folio authors and platform developers.
It is modeled as a **point in the topology product**, paired with a **measured tool parity evaluation** and a **capability refusal guard**.

---

## 1. The Topology Point

Developer mode is defined in `schemas/cat-harness.ts` as `DEVELOPER_MODE_PROFILE` / `DEVELOPER_MODE_TOPOLOGY`:

| Axis | Value | Rationale |
|---|---|---|
| **forge** | `none` | Local git repository only; no dependency on GitHub or remote git forge |
| **visibility** | `internal` (or `private`) | Workstation checkout; not published externally |
| **publication host** | `local-server` | Local HTTP server serving previews and rendered artefacts |
| **compute** | `workstation` | The developer's own machine |
| **network reach** | `internet` | Allows model API calls or package fetches when permitted |
| **tool surface** | `cli` (or `both`) | Invoked via shell scripts / CLI commands |
| **model cardinality** | `single` | One model configured for all workflows |
| **model provenance** | `hosted` or `open-weight-local` | Flexible depending on local workstation resources |
| **data stores** | `[none]` | No live external HAPI FHIR, EMR, or national portal connections |
| **outward facing** | `false` | Not serving external users |

This preset produces zero conflicts in `topologyConflicts()`.

---

## 2. MCP-vs-CLI Tool Parity Measurement

### The Hypothesis (Bean `folio-assistant-2ngl`)

> *"Every capability here exists twice: as an MCP tool and as a bun run script... If some capability is MCP-only, then developer mode is not merely a preset — it is blocked on parity, and that parity gap should be measured before this bean is scoped."*

### Measured Result

- **Measurement Date**: 2026-10-09
- **Measurement Tool**: `scripts/check-tool-parity.ts`
- **Measurement Command**: `bun run cat check:tool-parity` (or `bun run scripts/check-tool-parity.ts`)
- **Total Declared Tools**: 145

### Tool Distribution

| Surface | Tool Count | Percentage | Description |
|---|---|---|---|
| **Both (MCP + CLI)** | 9 | 6.2% | Has both `invoke.mcp` and `invoke.shell` |
| **MCP Only** | 16 | 11.0% | Callable **only** over MCP; no CLI shell command declared |
| **CLI Only** | 112 | 77.2% | Callable via `bun run` or shell script; not served over MCP |
| **Neither** | 8 | 5.5% | Spec-only or internal placeholders |
| **Total MCP Capable** | 25 | 17.2% | All tools served by MCP server |
| **Total CLI Capable** | 121 | 83.4% | All tools executable via CLI |

### The Parity Gap: MCP-Only Skills

Of 79 skills satisfied across all tools:
- **15 skills** are satisfied on both surfaces.
- **55 skills** are satisfied on CLI only.
- **9 skills** are satisfied **ONLY by MCP tools** and have **no CLI equivalent**:

| Skill | Implementing MCP Tools | Impact on CLI-Only Developer Mode |
|---|---|---|
| `process-state` | `workflow-list`, `workflow-start`, `workflow-next`, `workflow-gate`, `workflow-complete` | **Cannot inspect or advance BPMN workflows via CLI** |
| `skills-and-tools` | `skill-fetch`, `skill-list` | **Cannot dynamically query skills/tools via CLI** |
| `build-pdf` | `paper-preferences` | **Cannot set paper PDF preferences via CLI** |
| `build-docs` | `paper-preferences` | **Cannot set documentation build preferences via CLI** |
| `rendering-auditor` | `paper-preview` | **Cannot trigger paper preview review via CLI** |
| `staging-review` | `paper-preview` | **Cannot trigger staging preview review via CLI** |
| `task-authorization` | `user-auth` | **Cannot run interactive whoami/auth check via CLI** |
| `deployment-auth` | `user-auth` | **Cannot run deployment auth check via CLI** |
| `decision-audit` | `translation-signoff` | **Cannot sign off translation decisions via CLI** |

### The 16 MCP-Only Tools

1. `workflow-list` (`workflow_list`)
2. `workflow-start` (`workflow_start`)
3. `workflow-next` (`workflow_next`)
4. `workflow-gate` (`workflow_gate`)
5. `workflow-complete` (`workflow_complete`)
6. `skill-fetch` (`skill_fetch`)
7. `skill-list` (`skill_list`)
8. `paper-preferences` (`paper_preferences`)
9. `paper-preview` (`paper_preview`)
10. `user-auth` (`auth_whoami`)
11. `translation-extract` (`translation_extract`)
12. `translation-inject` (`translation_inject`)
13. `translation-status` (`translation_status`)
14. `translation-signoff` (`translation_signoff`)
15. `translation-validate` (`translation_validate`)
16. `bean-query` (`bean_query`)

### Conclusion for Developer Mode

Developer mode configured strictly with `toolSurface: "cli"` is **blocked on workflow and interactive skill inspection capabilities**. A developer in a pure CLI shell without an MCP client cannot execute BPMN token-machine workflows (`workflow-start`, `workflow-next`, `workflow-complete`).

Therefore, practical Developer Mode on workstations should configure:
```json
{
  "topology": {
    "toolSurface": "both"
  }
}
```
or run an MCP server alongside local CLI tooling until CLI shims for workflow operations are implemented.

---

## 3. Single-Model Capability Refusal Guard

### The Problem

In developer mode with `modelCardinality: "single"`, one model is assigned across all workflow lanes.
Different lanes carry different roles with distinct capability demands:
- A `deep-researcher` or `clinical-sme` requires `reasoning_tier: "high"`, `tool_use: true`, and `context_window: 64000+`.
- A lightweight formatting or translation pass might require only `reasoning_tier: "low"`.

If a single model (e.g., a lightweight 8B model with 8k context and no function calling) is dispatched to a high-reasoning, tool-using lane, it will produce malformed outputs or hallucinated tool syntax.
**Degrading silently is worse than refusing.**

### The Guard Mechanism

The guard is implemented in `schemas/model-capabilities.ts` and `src/workflow/model-capabilities.ts`:

1. **Role Capability Declaration**:
   Roles in `scenarios/roles.json` (and `RoleDef`) declare `requiredCapabilities`:
   ```json
   {
     "id": "deep-researcher",
     "requiredCapabilities": {
       "reasoning_tier": "high",
       "tool_use": true,
       "context_window": 64000
     }
   }
   ```

2. **Model Capability Specification**:
   The configured model declares its capabilities via `ModelConfig`:
   ```ts
   const modelConfig: ModelConfig = {
     id: "gemini-1.5-flash",
     capabilities: {
       reasoning_tier: "medium",
       tool_use: true,
       context_window: 1000000,
     },
   };
   ```

3. **Explicit Refusal**:
   When `validateWorkflowModel(processModel, modelConfig, roles)` or `startInstance(model, { model: modelConfig, roles })` or `complete(model, state, nodeId, { model: modelConfig, roles })` executes:
   If the model fails any required capability (reasoning tier hierarchy, tool use support, minimum context window, multimodal requirement, or named specific capability), execution **immediately refuses** by throwing:
   ```ts
   throw new WorkflowCapabilityRefusalError(roleId, laneName, required, model, violations);
   ```
   The resulting error specifies the exact missing capabilities and values, preventing silent corruption of workflow state.
