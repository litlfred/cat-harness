---
layout: default
generated: scripts/gen-skill-docs.ts — do not hand-edit; edit the skill
title: 'Content Review'
parent: Skill instructions
---

{: .note }
> Generated from [`cat-harness/skills/authoring/content-lifecycle/content-review.md`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/skills/authoring/content-lifecycle/content-review.md) — do not edit here. Typed contract: [schema reference](../skills/content-review.html).
>
> [✎ Edit this page's source](https://github.com/litlfred/folio-assistant/edit/main/cat-harness/skills/authoring/content-lifecycle/content-review.md){: .fa-edit-source data-fa-link="edit" data-src="cat-harness/skills/authoring/content-lifecycle/content-review.md" data-repo="litlfred/folio-assistant" }

{% raw %}
# Content Review

Formal review and approval of validated content before publication.

## Responsibilities
- Review L2 content before L3 begins (phase gate)
- Review L3 content before publication (phase gate)
- Assess breaking vs. non-breaking changes
- Ensure alignment with source guidelines
- Approve draft publications for stakeholder circulation
- Provide final publication release sign-off

## Actors
- Content Reviewer (lead, approval authority)
- Technical Officer (first-pass review)
- Clinical SME (clinical sign-off)
- Programme Manager (governance oversight)

## Inputs
- Validated content artifacts
- Validation reports
- Change log / diff from previous version

## Outputs
Findings and a decision — two things, not one. See
[`decision-audit`](decision-audit.md) and
[`schemas/qa-review.ts`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/schemas/qa-review.ts).

- **Findings** — one per observation, each carrying the axis this reviewer can
  speak on: `blocking | suggestion | praise` for a person, `critical | major |
  minor` for a checker. Neither defaults into the other, and `praise` has no
  machine equivalent.
- **A decision** — `approve | request-changes | reject`, naming every finding it
  weighed and every one it overruled. An overruled finding stays on the record.
- **Audit notes** — why this outcome, and why each overruled finding was left.
  At least one per decision, each citing corpus evidence. Approving over an open
  `critical` or `blocking` finding without overruling it is a reported problem.

## Staging links

When a staging preview exists, every request this skill makes for feedback,
review or sign-off carries it: one deep link per changed page, to the anchor
where the change sits, with the same page on main as *before*. Where the skill
declares an output contract, they go in its `stagingLinks` field. The rule, and
where the page list comes from:
[`staging-review`](staging-review.md) §"The deep-link rule".
{% endraw %}

## Processes that run this skill

| process | step(s) that name it |
|---|---|
| [Narrative review](../../en/cat-harness/processes/review-narrative.html) | Read the sidecar findings |
| [Review task](../../en/cat-harness/processes/review-task.html) | Classify what changed; Consolidate findings |
| [Authoring a document](../../en/cat-harness/processes/authoring-a-document.html) | 8 · Review and feedback |
| [Content Change and Review](../../en/cat-harness/processes/content-change-review.html) | Review each slice (calls a sub-process); Review impact assessment; Request changes |
| [Content lifecycle](../../en/cat-harness/processes/content-lifecycle.html) | Editing and HCI validation (calls a sub-process); Draft, review and publish (calls a sub-process) |
| [Draft, review and publish](../../en/cat-harness/processes/draft-to-publication.html) | Circulate the draft; Review the draft publication; Clinical / scientific sign-off |
| [Editing and HCI validation](../../en/cat-harness/processes/editing-hci-validation.html) | Agent review of the change; Human / SME review |
| [Evidence for a recommendation](../../en/cat-harness/processes/evidence-retrieval.html) | Review the guidance already in this content |
| [Authoring a paper](../../en/cat-harness/processes/authoring-a-paper.html) | 8 · Review and feedback |
| [L2 component edit and review](../../en/cat-harness/processes/l2-component-edit-review.html) | Review the staged component (calls a sub-process) |
| [L2 DAK authoring](../../en/cat-harness/processes/l2-dak-authoring.html) | Clinical validation |
| [SMART Guideline end to end](../../en/cat-harness/processes/smart-guideline-end-to-end.html) | Adjudicate the L1 source list (calls a sub-process); Adjudicate the L1 KG (calls a sub-process); Adjudicate L2 dependencies (calls a sub-process); Review each L2 asset (before / after if adapted) (calls a sub-process); Adjudicate L3 dependencies (calls a sub-process); Review each L3 asset (before / after if adapted) (calls a sub-process); Adjudicate the wireframes and the application (calls a sub-process) |

