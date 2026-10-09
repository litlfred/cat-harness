---
$schema: folio-methodology/v1
name: agentic-pre-merge-review
title: Agentic pre-merge review — adversarial evaluation, would-have-blocked counterfactuals, and empirical promotion criteria
origin: >
  Derived from empirical agentic software engineering literature — CodeAgent
  (Zhang et al. 2024, arXiv:2402.02172v5), SWE-Debate (arXiv:2404.04834v4),
  SWE-Router (arXiv:2507.23348v1), TCAndon-Router (arXiv:2601.04544v1), and
  He et al. (arXiv:2607.00053v1) — combined with the folio-assistant merge-gate
  governance (bean folio-assistant-h1uq and proposal docs/proposals/merge-gate-2026-10-02.md).
applies-when: >
  **An agentic or LLM-based reviewer evaluates code changes prior to merge.**
  Use when designing, operating, or promoting pre-merge review gates where
  LLM judges generate findings. It specifies how to measure empirical
  false-positive rates counterfactually without destroying evidence, when
  a review must remain warn-only versus hard-blocking, and pre-registers
  promotion criteria before data collection. Not applicable to deterministic
  compile checks (Lean, SUSHI, JSON-LD schema) which have zero false-positive
  rate by construction.
---

# Agentic pre-merge review — adversarial evaluation, would-have-blocked counterfactuals, and empirical promotion criteria

**Adopted 2026-10-09.** Split from the merge-gate reconciliation (`5ge1`),
governed by owner rulings on 2026-10-02 and 2026-10-03, and formalized in bean
`folio-assistant-h1uq`.

## 1. The literature gap and noise boundaries

Across five foundational papers investigating agentic software engineering and
automated review:
- **CodeAgent** (Zhang et al. 2024, arXiv:2402.02172v5)
- **SWE-Debate** (arXiv:2404.04834v4)
- **SWE-Router** (arXiv:2507.23348v1)
- **TCAndon-Router** (arXiv:2601.04544v1)
- **He et al.** (arXiv:2607.00053v1)

**None reports an empirical false-positive rate (FPR) for an LLM judge.** The
nearest available empirical figures point in the wrong direction:
- In CodeAgent's own manual annotation, **48.6% of GPT-4's raised flags were
  unconfirmed** upon human inspection.
- The headline precision figures in literature are evaluated over restricted,
  hand-filtered subsets, with circular ground truths and no reporting of true
  negative baselines or blinding.
- SWE-Router and SWE-Debate demonstrate that LLM judges exhibit severe
  self-enhancement bias (favoring model-generated code), verbosity bias, and
  positional sensitivity.

Because external benchmarks cannot establish reliability on this repository's
code, the false-positive rate must be directly measured here.

## 2. Why only a warn-only phase can produce an FPR

A hard blocking gate destroys counterfactual evidence:
1. When an agentic gate blocks a pull request, the PR does not merge.
2. The author either rewrites the code to appease the reviewer, works around
   the flag, or abandons the change.
3. Once the code is altered, it is impossible to determine whether the original
   flag was a **true positive** (prevented a real defect) or a **false positive**
   (blocked valid, harmless code).

A warn-only review solves this counterfactual dilemma:
- A `blocking`-severity finding is recorded as **"would have blocked"**
  (`WouldHaveBlockedRecordSchema` in `schemas/merge-queue.ts`), bound to the PR's
  exact 40-character `headSha`.
- The PR is allowed to merge into `main` (provided deterministic compile checks
  and CI pass).
- The resulting deployment is observed against real repository health and defects.
- A human judge subsequently annotates the finding with a `humanVerdict`:
  - `true_positive`: The finding correctly identified a defect that broke or would
    break invariants.
  - `false_positive`: The finding was an unconfirmed alarm or incorrect criticism;
    the change was sound.
  - `unknown`: The outcome cannot be decisively confirmed or verified.

### The third-state rule

`unknown` is strictly maintained as an independent third state:
- Folding `unknown` into `true_positive` artificially deflates the false-positive rate:
  $\text{FPR} = \frac{\text{FP}}{\text{TP} + \text{FP} + \text{Unknown}}$ (falsely optimistic).
- Folding `unknown` into `false_positive` artificially inflates the false-positive rate:
  $\text{FPR} = \frac{\text{FP} + \text{Unknown}}{\text{TP} + \text{FP} + \text{Unknown}}$ (falsely punitive).
- The correct empirical formulation is:
  $$\text{FPR} = \frac{\text{confirmedFalsePositives}}{\text{confirmedTruePositives} + \text{confirmedFalsePositives}}$$
  while tracking **review coverage**:
  $$\text{Coverage} = \frac{\text{confirmedTruePositives} + \text{confirmedFalsePositives}}{\text{warnedFindings}}$$

## 3. Pre-registered promotion criteria

To prevent post-hoc rationalization (choosing thresholds to fit collected data),
the promotion criteria are pre-registered in `schemas/merge-queue.ts`
(`AgenticPromotionCriteriaSchema`):

| Parameter | Threshold | Rationale |
|---|---|---|
| `minimumPrWindow` | **50 PRs** | Sufficient statistical power over real PRs across multiple sessions and subsystems. |
| `maximumFalsePositiveRate` | **≤ 0.05 (5%)** | An automated blocker cannot cry wolf more than 1 in 20 flags without eroding developer trust and inducing alert fatigue. |
| `minimumReviewCoverage` | **≥ 0.80 (80%)** | At least 80% of warned findings must be conclusively adjudicated; a low-coverage evaluation cannot promote on high `unknown` rates. |

Promotion from warn-only to blocking requires that **all three criteria** are
simultaneously satisfied.

## 4. Current architectural decision: staying WARN-ONLY

As ruled by the repository owner on 2026-10-02 and confirmed 2026-10-03:
- **Agentic adversarial review is WARN-ONLY.** Findings are reported as warnings
  with `would-have-blocked` records; they do not block merging.
- **Deterministic compile gates remain BLOCKING**:
  - G5: Lean module build and axiom verification.
  - G6: SUSHI FHIR compilation.
  - G7: JSON-LD schema expansion and compaction.
- **Rationale**:
  1. The literature demonstrates a ~49% unconfirmed flag rate for LLM reviewers.
  2. No empirical false-positive rate has yet been measured on this repository.
  3. Pre-registered promotion criteria (window ≥ 50, FPR ≤ 5%, coverage ≥ 80%)
     have not yet been met.
