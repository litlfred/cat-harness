---
layout: default
generated: scripts/gen-skill-docs.ts — do not hand-edit; edit the skill
title: 'Review: a pointer to the review skills'
parent: Skill instructions
---

{: .note }
> Generated from [`folio-assistant-core/skills/review/review.md`](https://github.com/litlfred/folio-assistant/blob/main/folio-assistant-core/skills/review/review.md) — do not edit here.
>
> [✎ Edit this page's source](https://github.com/litlfred/folio-assistant/edit/main/folio-assistant-core/skills/review/review.md){: .fa-edit-source data-fa-link="edit" data-src="folio-assistant-core/skills/review/review.md" data-repo="litlfred/folio-assistant" }

{% raw %}
# Review: a pointer to the review skills

Bean `0jtl`. The owner asked for review skills "for document review for large
things like a DAK or L1 digital transofrmation hadbook", to go in
folio-assistant-core. On 2026-10-06 the owner ruled where they live: **leave
them in cat-harness and point to them from core.** Nothing moved. This file
is the pointer.

So this skill holds no rules of its own. Each rule below belongs to the skill
it names, and that skill is the one to read and change.

## The skills, in the order a review uses them

| step | question it answers | skill | lives in |
|---|---|---|---|
| 1. What changed | Which blocks did this edit-set add, change, move or remove? | [`staging-review`](staging-review.md) | cat-harness |
| 2. Where to look first | Which sections changed most, have open comments, and are failing or stale on QA? | [`review-heatmap`](review-heatmap.md) | cat-harness |
| 3. What it looks like | Before/after pictures of a rendered change, and a measured count | [`before-after-preview`](before-after-preview.md), [`visual-diff`](visual-diff.md) | cat-harness |
| 4. Saying something | How a reviewer comments on a block, and how the comment follows a renamed block | [`review-comments`](review-comments.md) | core |
| 5. The gate | Who reviews, and what passing means: Technical Officer first pass, Clinical SME clinical sign-off, Content Reviewer approval | [`content-review`](content-review.md) | cat-harness |

The data these skills read is core's content vocabulary, which is why the
pointer sits here:
- the ChangeSet, `schemas/changeset.ts`
- review comments, `schemas/review-comment.ts`
- reviewer verdicts and coverage, `schemas/review-verdict.ts`

## Why the steps go in this order

A large document is reviewed **diff-first**: start from what changed (step 1),
and let the heat map (step 2) say which slice of it deserves a person's time.
Reading a 300-page handbook front to back spends the same attention on an
unchanged appendix as on a rewritten recommendation. The heat map's coverage
column measures how far that slicing got. Its meaning, and what it must not be
read as, is in `review-heatmap`, not here.

## What is not here yet

The bean originally asked for three skills. The 2026-10-06 ruling narrowed it
to this pointer. None of the following exists as a skill, and none should be
written in this package without a new owner decision:
- `large-document-review`: the method, covering slicing by the folio/ graph,
  role assignment, stop rules and sign-off per slice.
- `review-navigation`: how an agent drives the review page for a person.
- Rules mined from the WHO IG starter-kit SOPs (bean `sopq`) or from
  IEEE 1028.
{% endraw %}
