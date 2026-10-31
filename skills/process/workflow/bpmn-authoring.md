---
input: schemas/skills/bpmn-authoring/input.schema.json
output: schemas/skills/bpmn-authoring/output.schema.json
---

# bpmn-authoring

> Skill id: `bpmn-authoring` · Package: `workflow` ·
> Named by `l2-dak-authoring.bpmn` (**Business processes · BPMN 2.0**,
> `Business analyst` lane) and `crdm-requirements.bpmn` (**Phase 2: Map current
> workflow (BPA)**, `Agent` lane).

Author BPMN 2.0 business process diagrams — both a DAK's L2 business processes
and this repository's own `processes/**/*.bpmn`.

## Inputs and outputs

`schemas/skills/bpmn-authoring/`:

- **in** — `processName` (required), `sourceWorkflow`, `existingBpmn`,
  `participants`
- **out** — `bpmnFile`, `diagramFile`, `taskCount`, `gatewayCount`,
  `participantCount`

`graphviz` is a declared capability with `degradation: skip` — layout help
degrades, authoring does not stop.

## Diagram Interchange is not optional

A `.bpmn` with no DI section — no explicit `x`/`y` on its shapes — parses and
renders **blank**. This is the single most common way a new diagram here
arrives broken, and it survives review because the XML looks complete.

`bun run cat render:bpmn` renders every diagram to `docs/assets/img/workflows/`
with bpmn-js in headless Chromium; `bun run cat render:bpmn:check` fails when an
SVG is stale. Run the renderer and look at the SVG before you call a diagram
done.

## In this repository, a diagram is executable

`processes/**/*.bpmn` are not pictures. `workflow_start` / `workflow_next`
/ `workflow_complete` run them, and `workflow_complete` **refuses a step that
is not enabled**. That has consequences for how you author:

- **Every activity carries `<bootstrap.processes:skill ref="…"/>`** naming the skill that
  implements it, and `<cat-harness.processes:bean store="beans/"/>` where it touches the work
  plan. `bun run cat check:workflow-refs` fails on a ref that resolves to nothing,
  and `bun run cat kg:audit` additionally fails when the named skill exists but no
  package can **serve** it.
- **Every lane names a role.** Declare the role once as a top-level
  `<bpmn:resource id="<role id>" name="<title>"/>` (before the collaboration
  and the process), and set `partitionElementRef="<role id>"` on the lane; the
  id is the role's in `scenarios/roles.json`, verbatim. Lane names are free
  text and sixty of them once spelled two dozen positions; an explicit ref is
  the join that does not depend on spelling. `<bootstrap.processes:role ref>`
  is the deprecated form (owner, 2026-10-16). A diagram using any
  `bootstrap.processes:` element declares the namespace as the first child of
  `<bpmn:definitions>`: `<bpmn:import
  namespace="https://litlfred.github.io/bootstrap/v0/processes/ns#"
  location="https://litlfred.github.io/bootstrap/v0/processes/ns.jsonld"
  importType="http://www.w3.org/ns/json-ld"/>`.
- **The process's own `bpmn:documentation` opens with what it is for.** Its
  first sentence is the diagram's row on the publication-workflow page.
  `kg-export` carries it on the `Process` node as `summary` (the whole text as
  `description`), the page reads it from the published named-subgraph JSON-LD
  (`bun run cat subgraph:jsonld`) rather than from anything written by hand, and
  `check:process-index` fails when a declared diagram's node has none. So that sentence says what the process does or answers
  — not who asked for it, which bean or issue it came from, or where the work
  got to. Those belong later in the documentation, or in the bean.
- **A gateway may be computed rather than chosen** — see `dmn-authoring`.
- **Policy is declared on the process.** `<cat-harness.processes:policy enforcement="strict"/>`
  means `workflow_gate` refuses a step that is not enabled; absent policy means
  strict. Steps marked `relaxable="false"` may never be relaxed by any package.

## Readable diagrams: what the research supports

Owner, 2026-10-31: take what holds up from the BPMN comprehension research and
check it mechanically. `kg:audit` reports each rule below per process
(`src/workflow/diagram-quality.ts` in cat-harness-tools). The papers are being
ingested under bean `folio-assistant-e0jh`.

- **Separate routing from work.** A task never has two outgoing flows: put an
  exclusive or parallel gateway after it, or a reader must guess fork vs
  choice (`activity-implicit-split`, major). A loop-back INTO a task is fine.
  A gateway either joins or splits, not both (`gateway-mixed`).
- **Keep it small.** Split by phase into call activities past 20 flow nodes
  (`process-size`). That 20 is house style. The only threshold with evidence is
  7PMG's 50 (`process-decompose`, major), and it predicts modelling errors
  such as deadlocks, not reading speed.
- **One start event per process level** (`process-single-start`). Several
  named end events are fine, and the bean CLOSE pattern needs them.
- **A decision is a question, its branches are the answers**
  (`decision-label-question`).
- **Label activities verb-object**: imperative verb, then its object (*Review
  the draft*, not *Draft review*) (`activity-label-verb-first`). The evidence
  is one study of how ambiguous labels felt (29 students), so this is reported,
  never gated.

### Untangle every diagram you touch

The same discipline as ArchiMate views ([`archimate-models`](../../ui/ui-core/archimate-models.md)
§"Untangle every view you touch"), and the same geometry: a change never adds
a tangle. Run `bun run cat kg:audit` before and after, and compare
`edge-crossing`, `edge-through-node` and `edge-rectilinear` for the diagram.
Say both counts in the PR. Route loop-backs in the channel below the lane
([`bpmn-processes`](bpmn-processes.md) §"Edge routing"), then look at the
rendered SVG.

### What the evidence does NOT support

Do not import these from style guides or model output; each was checked:

- **Mandatory left-to-right flow.** Figl & Strembeck 2015 (44 people) found
  no significant difference in accuracy or time across four directions.
  Lay out left-to-right for consistency, not because it reads faster.
- **A word cap on labels**, a **gateway fan-out cap of 4**, and **a fixed
  colour palette.** No study behind them. Colour highlighting helps novices,
  not experts (Reijers et al. 2011).
- **OR-gateways** need no rule: the process model refuses inclusive gateways
  at load.

## If it has actors, activities and a control flow, it is BPMN

Not a Mermaid fence. Mermaid stays for the things that are *not* processes —
component maps, lattices, navigation graphs. The audit of which is which is on
the [publication workflow](https://litlfred.github.io/folio-assistant/folio-assistant-core/process/publication-workflow.html#which-diagrams-are-bpmn-and-which-are-not)
page, which the content core authors.

## Why a DAK section sits in a platform package

This skill lived in `authoring-who-smart-guidelines` until 2026-09-20, and it
never belonged there: its own first line says it covers *both* a DAK's L2
business processes **and this repository's own `processes/**/*.bpmn`*, five
of its six sections are content-agnostic, and `crdm-requirements.bpmn` — a
PLATFORM process — names it from the `Agent` lane. A platform process
depending on a content-type package is the boundary
the `platform-boundary-guard` subagent exists to keep — measured under bean
`ugid`, moved under `3g13`.

The section below stayed with it rather than being split out. A generic skill
naming a domain worked example is ordinary; two skills that must be read
together to author one diagram are not. If a second content type ever needs
its own section here, that is the moment to reconsider — not before.

## When a layer above transforms it

A layer built on this one may transform an authored business process into
another artefact — FHIR Shorthand, for instance — and then the BPMN is a
**source artefact** rather than documentation of one. Author it knowing it
will be transformed: names and ids you choose here appear in what is
generated. That layer's own tooling skill has the mechanics; this one names
no layer above it.
