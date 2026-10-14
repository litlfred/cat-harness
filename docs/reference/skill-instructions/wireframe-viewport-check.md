---
layout: default
generated: scripts/gen-skill-docs.ts — do not hand-edit; edit the skill
title: 'Wireframe viewport check'
parent: Skill instructions
---

{: .note }
> Generated from [`cat-harness/skills/ui/ui-core/wireframe-viewport-check.md`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/skills/ui/ui-core/wireframe-viewport-check.md) — do not edit here.
>
> [✎ Edit this page's source](https://github.com/litlfred/folio-assistant/edit/main/cat-harness/skills/ui/ui-core/wireframe-viewport-check.md){: .fa-edit-source data-fa-link="edit" data-src="cat-harness/skills/ui/ui-core/wireframe-viewport-check.md" data-repo="litlfred/folio-assistant" }

{% raw %}
# Wireframe viewport check

Step 3 of [`wireframe-design-review`](wireframe-design-review.md): what can be judged without judgement. The review decides what to draw and which drawing wins; this step says only whether each drawing renders properly at both sizes. Method: [`wiregen`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/methodologies/wiregen.md), which records pass or fail per criterion and never a score.

## Input and output

The contract is [`input.schema.json`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/schemas/skills/wireframe-viewport-check/input.schema.json) and [`output.schema.json`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/schemas/skills/wireframe-viewport-check/output.schema.json).

- **In:** the `candidates`, which are HTML files with a web AND a mobile layout each, and `out`, where the screenshots and report go: the asset directory's `checks/`.
- **Out:** the `report` path, and per candidate its `source`, `screenshots.web` and `screenshots.mobile`, and its `entries`, with `by: script`.

## Criteria

At each viewport:

| criterion | pass when |
|---|---|
| renders | the page loads and draws, with no script error |
| no-overflow | nothing runs past the viewport's width |
| no-placeholder | no lorem ipsum or placeholder text: candidates show real content |

Any `fail` sends the candidate back to drawing. A candidate with only one layout fails at the viewport it does not serve.

## Tool

`wireframe-check` is the Tool for this skill. Its install, invocation and ports are in `cat-harness/tools/index.ts`; ask the tools graph rather than copying a command from here.
{% endraw %}
