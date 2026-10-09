---
$schema: folio-methodology/v1
name: agentic-pre-merge-review
title: Tool-Integrated Agentic Pre-Merge Review — Multi-Agent Verification Loops, Supervised Consistency, and Gate Boundaries
origin: >
  Xunzhu Tang, Kisub Kim, Yewei Song, Cedric Lothritz, Bei Li, Saad Ezzini,
  Haoye Tian, Jacques Klein, and Tegawendé F. Bissyandé, "CodeAgent: Autonomous
  Communicative Agents for Code Review" / "CodeAgent: Enhancing Code Generation with
  Tool-Integrated Agent Systems" (arXiv:2402.02172v5), University of Luxembourg et al.
  Preprint September 2024, 35pp. Evaluated against bean folio-assistant-nok9 (pre-merge
  adversarial review gate) and the owner's 2026-10-02/10-03 rulings.
evidence:
  - library/arxiv-2402.02172v5
applies-when: >
  **A pull request or merge train is evaluated for merge admission.**
  Use when designing or executing pre-merge quality gates, adversarial agentic code
  reviews, and multi-agent verification loops. It governs the strict boundary between
  deterministic compile/test checks (which must block) and LLM-mediated agentic
  evaluations (which must warn and record), as well as the calibration of supervisory
  checker loops against runaway token costs, latency, and false-positive fatigue.
---

# Tool-Integrated Agentic Pre-Merge Review — Multi-Agent Verification Loops, Supervised Consistency, and Gate Boundaries

**Adopted 2026-10-09.** Ingested under `library/arxiv-2402.02172v5` (35pp, outline read
via `pdf-structure` with 32 greppable sections, 135 raster inspection verdicts, and 19
rendered vector figures). Synthesized with epic bean `folio-assistant-nok9`, the owner's
2026-10-02/10-03 rulings, and proposal `cat-harness/docs/proposals/merge-gate-2026-10-02.md`.

---

## 1. The Core Thesis of Tool-Integrated Multi-Agent Review

Single-turn, single input-output generative models struggle to automate code review because
code review is inherently interactive, multi-perspective, and communicative. A lone model
prompted to review an entire diff hallucinates bugs, misses subtle semantic discrepancies,
and produces ungrounded rewrite advice without validation.

CodeAgent proposes decomposing code review into **specialized communicative agents** across
four sequential waterfall phases, supervised by an instruction-driven **QA-Checker**:

| Phase | Roles | Core Function |
|---|---|---|
| **1. Basic Info Sync** | CEO, CTO, Coder | Synchronize context: classify input modalities (prose, code, AST) and target programming languages (Python, Java, Go, C++, etc.). |
| **2. Code Review** | Reviewer, Coder | Execute multi-perspective analysis: Consistency Analysis (CA), Vulnerability Analysis (VA), Format Analysis (FA), and Code Revision suggestions (CR). |
| **3. Code Alignment** | Coder, Reviewer | Iteratively revise diffs, reconcile syntax discrepancies, and propose concrete patches. |
| **4. Document** | CEO, CPO, Coder, Reviewer | Synthesize reviewer reports, summarize actions, and produce an integrated review verdict for human maintainers. |

### The Supervisory QA-Checker Mechanism
In each pairwise conversation between an Instructor agent and an Assistor agent, conversational
drift is common: agents stray from the initial diff or fabricate unverifiable assertions.
CodeAgent introduces a **QA-Checker** that evaluates each turn's answer $a_i$ against the instruction
$q_i$. If $a_i$ is non-responsive or incomplete, the QA-Checker computes an augmented instruction:
$$q_{i+1} = \text{CB}(q_i + \text{aai}_i)$$
where $\text{aai}_i$ is an added adjustment instruction. The dialogue iterates until the QA-Checker
verifies that the answer directly answers the query, or until a hard `max_dialogue_turns` cutoff is reached.

---

## 2. Pre-Merge Gate Integration & The nok9 Settlement

### The Owner's 2026-10-02 Ask vs. The 2026-10-02/10-03 Ruling
On 2026-10-02, the repository owner requested:
> *"full agentic adversarial software code review on changes done by >= 1 agent; no blocking RED FLAGS from any agentic review; (if math content block) any lean changes compile; (if FHIR IG) sushi/IG AST compiles; json(ld)+schema for the KG renders..."*

Later that same day, the owner ruled on the merge gate behavior:
> *"dont want hard gate (at least not for now, lots of backlog on content nodes) but do want warn."*
> Confirmed 2026-10-03: *"warn only. proposal predates ruling, update it."*

### The Load-Bearing Boundary: Deterministic vs. Judged
The boundary is **deterministic-vs-judged, not blocking-vs-warning**.
- **Deterministic checks (G1, G2, G5, G6, G7, G8)**: Lean formal math compilation, SUSHI/FHIR IG AST compilation, JSON-LD schema verification, and unit test suites answer questions with **one computable truth**. A machine settles them unequivocally. **These MUST BLOCK merge.**
- **Agentic reviews (G3, G4)**: LLM judges answer questions with **unverified and non-zero false-positive rates**. Enforcing a blocking gate on an LLM judge whose error rate is unmeasured halts PR flow over hallucinated objections. **These MUST WARN.**

### The `dependency-advisories` Pattern
Following `dependency-advisories` in `.github/workflows/code-quality-gates.yml`:
1. Exit 0 in every state: the review reports and does not fail CI.
2. Distinctly output three states: `clean` (found nothing), `findings` (found issues), and `could-not-determine` (review tool failed or timed out).
3. **Never use `continue-on-error`**: that keyword collapses unexecutable tools into apparent passes.
4. Record blocking-weight findings as **"would have blocked"**: this creates an empirical audit trail to measure the agent's real-world precision before any future promotion to a blocking gate.

---

## 3. Systematic Attack on CodeAgent's Empirical Claims

While CodeAgent reports impressive headline improvements over baseline zero-shot models, critical
analysis of arXiv:2402.02172v5 reveals four major structural vulnerabilities that must be guarded
against in production SDLC pipelines:

### Attack 1: The 49% False-Positive Trap & Annotation Circularity
CodeAgent's empirical evaluation (§4.1, Table 2) reveals a staggering false-positive rate for standalone LLMs:
- **GPT-4 confirmed only 345 vulnerabilities out of 671 flagged items** — a **48.58% false-positive rate** (nearly half of all warnings were noise!).
- **GPT-3.5 had a 63.31% false-positive rate** (only 36.69% confirmed).
- **CodeBERT had an 80.06% false-positive rate** (only 19.94% confirmed).

Even more concerning is CodeAgent's own methodology for its claimed 92.96% confirmation rate:
> *"We therefore propose a proactive method for data annotation: we execute CodeAgent on the 3,545 samples... and manual verify the identified cases to build a ground truth."* (§4.1)

**This is circular confirmation bias.** The ground truth was constructed by having humans inspect *only the items CodeAgent flagged*. Unflagged commits were never exhaustively audited by human security experts, completely hiding false negatives. In an automated CI gate, an uncalibrated LLM reviewer with a ~49% false-positive rate causes severe "alert fatigue", prompting developers to ignore or rubber-stamp review notices.

### Attack 2: Runaway Iteration Costs and Latency Explosions
CodeAgent's multi-agent dialogues and QA-Checker loops incur substantial computational overhead (Table 12, Appendix Section N):
- **Query latency**: An average review requires **3 minutes** for CodeAgent-3.5 and **5 minutes** for CodeAgent-4.0 per pull request.
- **Financial cost**: CodeAgent-4 costs **$0.122 per review**, driven by multi-turn prompt expansion across six agents and repeated conversational turns.
- **Context saturation**: In large PR diffs spanning multiple files, the concatenation of full source context, dialogue history, and QA adjustment instructions quickly saturates the context window, causing prompt truncation or degraded reasoning.
- **Convergence failure**: If the QA-Checker and Reviewer disagree, the loop oscillates until hitting `max_dialogue_turns`. Running synchronous 5-minute multi-agent loops on every push to a merge train would bottleneck merge throughput.

### Attack 3: Toolchain Substitution vs. Semantic Delusion
CodeAgent includes "Format Analysis" (FA) as one of its four core evaluation pillars, employing multi-turn LLMs to check indentation, trailing whitespace, and line lengths.
- **This is an SDLC antipattern.** Deterministic tools (Prettier, ESLint, `clang-format`, `gofmt`) verify and fix formatting in under **100 milliseconds** with mathematical certainty and zero token cost. Using multi-turn LLM agent conversations to debate indentation is wasteful and error-prone.
- **Tool integration must be external and executable**: An agent should not *pretend* to lint; it must *execute* the project's linter and formatters via deterministic subcommands, parsing the tool's machine-readable exit status.

---

## 4. The Synthesized Pre-Merge SDLC Methodology

To operationalize the valid insights of CodeAgent while insulating the merge queue from its pitfalls,
folio-assistant establishes a four-tier pre-merge verification pipeline:

```
[PR / Merge Candidate]
          │
          ▼
┌───────────────────────────────────────────────┐
│ Tier 1: Fast Deterministic Gates              │
│ (bun run cat gates: linters, types, tests)    │ ──[FAIL]──► BLOCK MERGE (Machine Settled)
└───────────────────────────────────────────────┘
          │ PASS
          ▼
┌───────────────────────────────────────────────┐
│ Tier 2: Path-Scoped Compile Gates             │
│ (Lean formal proofs, SUSHI/FHIR, JSON-LD)     │ ──[FAIL]──► BLOCK MERGE (Domain Compilers)
└───────────────────────────────────────────────┘
          │ PASS
          ▼
┌───────────────────────────────────────────────┐
│ Tier 3: Tool-Integrated Adversarial Review    │
│ (Automated Static Analyzers + Linters)        │ ──[FAIL]──► BLOCK MERGE (Syntax/Types)
└───────────────────────────────────────────────┘
          │ PASS
          ▼
┌───────────────────────────────────────────────┐
│ Tier 4: Supervised Agentic Review (Adversarial)│
│ - Semantic Commit-Code Consistency (CA)       │
│ - Security / Logic Vulnerability Review (VA)  │ ──► WARN ONLY ("Would have blocked")
│ - Supervised by QA-Checker (Convergence Guard)│     Exit 0; Record sidecar verdict
└───────────────────────────────────────────────┘
          │
          ▼
[Merge Train Admission / Human Override]
```

### Operational Rules for Implementers:
1. **Deterministic Precedence**: Never use an LLM for an assertion that a deterministic tool settles. Format, lint, compile, and type-check steps must be executed directly by CLI tools.
2. **Warn-Only Gating**: All Tier 4 agentic reviews emit structured advisories (`warn`), never blocking merge trains automatically.
3. **Structured Finding Sidecars**: Reviews must emit JSON sidecars recording findings categorized by severity:
   - `advisory`: style or non-critical suggestions.
   - `would-have-blocked`: critical logic errors or security vulnerabilities.
4. **Historical Ground-Truth Calibration**: Before any review finding is promoted to a blocking gate, the agent reviewer must be tested against recorded repository defects (`plj1`, `dh4f`, `w4tq`, `7u3g`) that did not exist in base training corpora, demonstrating a measured false-positive rate below 5%.
5. **Bounded Dialogue Budgets**: QA-Checker refinement loops must cap at a maximum of 2 adjustment iterations, falling back to `could-not-determine` if semantic consensus is not reached within 60 seconds.
