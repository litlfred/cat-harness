---
name: journey-maps
description: >
  Journeys and workshops as knowledge-graph content: a DAK user scenario told
  as a journey map (`user-scenario` kind: ordered steps, per person what they
  do and feel, pain points, enablers, the record's trust state, and edges to
  stories, BPMN tasks, requirements, FHIR examples and building blocks), a
  workshop that teaches from it (`workshop` kind: modules, objectives,
  questions for the room on each step, reference tables, sheets, job aids),
  and the `journeys-viewer` visualiser that draws both for an instance and the
  layers it mounts. Read before writing a journey or a workshop, before
  declaring the viewer, and before building a journey walkthrough app of your
  own.
---

# Journey maps — journeys and workshops as nodes

> Skill id: `journey-maps` · Package: `ui-core` · Kinds: `user-scenario`,
> `workshop` · Tool: `journeys-viewer` (`bun run cat journeys:viz`)

## The rule

**A journey is content, a workshop is content, and the walkthrough is a
viewer of both.** Write the journey once, as a `user-scenario` node; teach
from it with a `workshop` node that points at its step ids; declare the
`journeys-viewer` visualiser. Do not hand-write the journey again in an app,
in TypeScript, or in a page: each copy drifts from the BPMN and the stories
the node already links.

## The `user-scenario` kind

One file per journey (`user-scenario/0.2.0`; the draft `0.1.0` is read
unchanged), in a directory the instance declares with that kind
(conventionally `scenarios/user-scenarios/`). It keeps the DAK
`UserScenario` fields — `id`, `title`, `description`, `personas` (actor
ids) — and adds the ordered `steps`:

| a step holds | what |
|---|---|
| `lead`, `experiences[]` | per person present: `doing`, `feeling` in their words, `emotion` −2..2 |
| `painPoint`, `enabler`, `policy` | what goes wrong without it, what makes it work, the policy point in one sentence |
| `record` | a code of the scenario's `trustLadder` code list, what it means here, where it is held |
| `handoff` | what passes on: `carrier`, `payload`, `offline` |
| `whatIf[]`, `gaps[]` | alternative paths; what the specification does not cover yet |
| `stories` | user story ids (`scenarios/stories.json`): role-level stories, persona-level steps |
| `realisedBy` | a BPMN file and the flow-node ids that carry the step out |
| `requirements`, `examples` | `req:` node ids; FHIR examples as `Type/id` |
| `uses[]` | a block of a `building-blocks/0.1.0` catalogue, and the ROLE it plays in this step |

Two relations arrange journeys, and they are not the same: **`follows`
chains** one story told as several journeys (J2 follows J1); **`partOf`
groups** sub-journeys under a parent, which may have no steps of its own. One
journey is one BPMN process, usually.

Every person is fictional. A persona's name, role, goal, needs and the
colour and initials the viewer draws them with live on the actor
(`meta.persona`), never on the journey.

## The `workshop` kind

One `workshop/0.1.0` file per workshop, in a directory declared `workshop`.
It names the `scenarios` it teaches from and, per step it uses
(`{ scenario, step }`): the question for the whole room, a facilitator cue,
the module questions (each tagged with its module), the capabilities the
step needs, and which rows of which `tables` it touches. Tables are generic
(decision rights, legal bases, substitution patterns, cost drivers are rows a
workshop names, not fields of the kind). `assessment` gives the scales a table
rates a capability on; `sheets` the printable canvases; `resources` the job
aids, handouts and readings, each tied to modules or steps. **A question is a
question:** a module asks a room to name, not to decide.

The journey never names the workshop. One journey can be taught by several
workshops to several audiences without changing.

## The viewer

Declare it in the instance that publishes the site:

```json
{ "id": "journeys", "renderedBy": "journeys-viewer", "coversKinds": ["user-scenario", "workshop"], "subgraphs": "instance" }
```

A site build runs it with the other declared writers. It writes, under
`<locale>/<instance>/journeys/`, an index of every journey in the checkout
(the mounted layers' included, each instance a sub-graph page), a page per
journey (journey map, then step by step with the step's BPMN flow nodes
highlighted and the workshop layer under each step), and a page per workshop,
per module and for the printable sheets. Everything is static; one small
script adds the stepper, a filter and remembering a table's ticks in the
browser. An edge that resolves to nothing is drawn as unresolved, never
dropped.

## Checks

`check:kind-validators` parses every node of both kinds against their Zod
(`cat-harness-tools/schemas/process/user-scenario.ts`, `workshop.ts`): step
ids unique, every actor a step names among the personas, every module, table,
row and sheet a workshop names declared in it. References that cross files —
an actor, a story, a BPMN task id, a block — are the instance's own check
until the harness has one.
