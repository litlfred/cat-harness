# cat-harness schemas

The schemas cat-harness keeps are the ones that are data:

- **[skills/](./skills/)** — the per-skill JSON Schemas.
- **[staging-comparison.schema.json](./staging-comparison.schema.json)** — the shape of a staging comparison report.
- **[assistant-schema.puml](./assistant-schema.puml)** — the PlantUML model of the content-object schema.

The Zod sources of the content-object model, and the code that reads these
schemas, moved to [cat-harness-tools/schemas/](https://github.com/litlfred/cat-harness-tools/tree/main/schemas)
in bean `8lcl` (owner, 2026-10-30, card "A. One coordinated move"). A
definition belongs here; the code that implements it belongs there.
