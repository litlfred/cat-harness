---
name: swarm-management
description: >
  Decide whether to run parallel agents at all, and if so how many, at which
  model level, against which decomposition. Read BEFORE dispatching more than
  one background agent — a swarm spends the author's tokens and the decision
  is theirs.
consulted: true
---

# Swarm management

A swarm is several agents working one goal in parallel. It is the most
expensive tool available and the easiest to reach for, so the first section is
about not using one.

## Ask first — always

**Never start a swarm without explicit permission for that swarm.** It costs
the author's tokens, and the cost is not obvious from the outside: a six-agent
fan-out against a large corpus can spend more in ten minutes than a day of
ordinary work.

Permission is **per swarm**, not standing. "Yes, swarm it" for one task does
not authorise the next one. When you ask, give the author the three numbers
they need to answer: **how many agents, at which model level, and roughly what
it will cost** relative to doing it serially.

**"Not standing" is the agent's constraint, not the owner's.** An agent may
never treat one permission as covering the next swarm. The *owner* may
nevertheless decide in advance that a session or a process run has this gate,
and that decision is theirs to make — it is the same person answering the same
question, earlier. That is a `swarm-spawn` **waiver**, and it is bounded on
exactly the three numbers you would otherwise have asked for: a grant for three
Haiku agents is not a grant for thirty Opus ones, and a scope that does not
plainly cover the swarm in front of you does not cover it.

Acting under one, name it in the turn report and quote its words — a waived
swarm is an announced swarm. And a waiver removes the **asking**, never the
sizing, the decomposition or the stopping condition below.
[`confirmation-waiver.md`](../../../skills/conduct/conduct-core/confirmation-waiver.md).


## First ask whether you need one

| situation | do this instead |
|---|---|
| The work is one file at a time | Serial. A swarm cannot make one edit faster. |
| The parts share state | Serial. Parallel writers to one file is a merge problem you are creating on purpose. |
| You have not decomposed it yet | **Decompose first.** A swarm against an undecomposed task produces N agents discovering the same thing. |
| Two or three independent parts | **Sub-beans, run sequentially.** Most "parallel" work is really "ordered work I have not ordered yet". |
| Many genuinely independent parts, each reading a different corpus slice | A swarm is justified — continue below. |

**The decomposition is the work.** If you cannot write down N independent
units with non-overlapping inputs and separate outputs, you do not have a swarm
shape; you have a task you have not understood yet.

## Sizing

| dimension | guidance |
|---|---|
| **size** | Start at 3. Go above 6 only when the corpus slices are genuinely disjoint and each unit is substantial. Beyond ~10 the coordination cost and the token cost both grow faster than the throughput. |
| **model level** | Match the *hardest* judgement in the unit, not the average. A sweep that only classifies runs small; anything making a call a human would argue with runs large. Mixed swarms are fine and usually right: small workers, one large reviewer. For tasks with uncertain difficulty, use dynamic temporal routing (§"Cost-aware dynamic routing") rather than statically over-allocating frontier models. |
| **CPU / concurrency** | Bounded by what the box can actually run. A swarm that thrashes is slower than half the swarm. If units shell out to a build or a solver, the real limit is that tool's parallelism, not the agent count. |
| **wall-clock** | Give each unit a bound. An unbounded unit in a swarm is an unbounded swarm. |

## Cost-aware dynamic routing (SWE-Router / 2607.00053v1)

Model choice dominates a swarm's token cost, and only a minority of software
engineering subtasks need a frontier model. SWE-Router
([`arxiv-2607.00053v1`](https://arxiv.org/abs/2607.00053v1)) routes on
the agent's partial trajectory rather than the task description alone: a
description cannot tell a one-line fix from a multi-module refactor, but the
first few exploratory turns (grep, reading the tree, reproducing a failure)
can.

1. **Explore cheap.** Assign the subtask to a compact model $m_1$ for a small
   budget of $K$ steps ($K=3$ is the reported sweet spot).
2. **Judge the trajectory.** A value estimator reads the first $K$ turns and
   predicts whether $m_1$ has localised the problem and will solve it.
3. **Continue or escalate.** At or above a cost-adjusted threshold
   $\lambda''$, let $m_1$ finish; below it, escalate to the frontier model
   $m_2$.

**Escalate cleanly:** restart $m_2$ from the original specification, never
from $m_1$'s partial trajectory, which biases $m_2$ toward $m_1$'s false
assumptions. Raising $\lambda''$ trades capability for cost (the paper
reports large savings with most of frontier performance retained).

### When does a swarm need a frontier model?

Apply this matrix when assigning models across swarm sub-beans:

| Task characteristics | Trajectory signals ($T_{\le K}$) | Routing decision |
|---|---|---|
| Repetitive scaffolding, single-file edits, straightforward grep/tests | Clean reproduction in $\le K$ turns, clear localization | **Compact / lightweight worker ($m_1$)** |
| Ambiguous bug description, initially unknown scope | $m_1$ localizes exact file and passes reproducing test in $K$ steps | **Continue with $m_1$** |
| Multi-file architectural refactor, deep semantic reasoning | $m_1$ thrashes in search, fails to reproduce, or loops across modules | **Escalate cleanly to frontier model ($m_2$)** |
| High-stakes adjudication, cross-agent review, security invariant checks | N/A (inherently high-complexity judgement) | **Frontier model ($m_2$) from step 0** |

## Decomposition into sub-beans

One unit, one sub-bean, with:

- a **disjoint input slice** stated explicitly — which files, which blocks;
- a **separate output** — its own file, its own findings list, its own branch
  if it writes;
- the **parent work item** recorded, so the work rolls up;
- the **[`interaction-modality`](../../../skills/conduct/conduct-core/interaction-modality.md)
  contract** included in every worker's brief (and passed on to any subagent a
  worker spawns): a worker with a direct chat surface presents the full question
  in chat first (≤ 4 options, recommended option first and marked
  `(Recommended)`, stated default on silence) followed immediately by the
  tappable card (`AskUserQuestion`, `request_decision`, `ask_question`, or
  `post_widget`), never asking the owner in prose alone and never asking the
  owner to type; a background worker or a sibling beside a live discussion
  returns any owner question to the coordinator in the
  [`hand-back-to-discussion`](../../../skills/conduct/conduct-core/hand-back-to-discussion.md)
  schema format.

This is what `bean-blocking.md` means by preferring sub-beans: the same
decomposition that avoids a spurious block is the one a swarm needs.

## While it runs

- **Run the [`swarm-monitor`](swarm-monitor.md) companion loop (`STRICT`).** Whenever two or more background workers run, supervise them through `Process_SwarmDispatchAndMonitor` ([`sdlc/processes/swarm-dispatch-and-monitor.bpmn`](../../processes/swarm-dispatch-and-monitor.bpmn)) on event-driven wakeups plus a `2–4 min` fallback timer (never busy-polling).
- **Do not block on the swarm.** The parent work item stays in progress in the shared `beans` store (never in a private coordinator scratchpad); as workers complete and pass independent verification, hand ready PRs to the merge steward ([`merge-manager-watcher`](merge-manager-watcher.md)) and refill freed worker slots from unclaimed `beans` items.
- **One writer per file.** Two agents editing one file is not parallelism; isolate mutating workers in separate git worktrees.
- **Monitor total memory + compressed/swap footprint and disk headroom, not `ps -o rss` alone.** Compressed and swapped pages (`top -l 1 -o mem -stats pid,command,mem,cmprs` on macOS, `VmSwap` + `VmRSS` on Linux, alongside `df -h /`) expose runaway subprocess leaks that resident set size hides until root disk hits `ENOSPC` ([`swarm-monitor`](swarm-monitor.md) §4a).
- **Report with the anti-shorthand Dual Scoreboard + Milestone/Epic Rollup ([`swarm-monitor`](swarm-monitor.md) §3).** Report the initial fan-out (how many, at what model tier, against which decomposition) so the author sees what their tokens bought, and make every subsequent human status update self-contained: ban bare worker codes (`W2`), bare PR ranges (`#104..#109`), and unglossed work-item IDs, and include both the Live Repository Queue Scoreboard (`PRs | Work Items (beans) | Issues`) and the four-part Milestone & Epic Progress Rollups.

## Stopping

Stop early when the first two units disagree about something structural: the
decomposition was wrong, and the rest will reproduce the disagreement at full
price. The Andon-cord conditions below list the other stop signals.

## Adaptive reasoning routing and Andon-cord stopping (TCAndon-Router / 2601.04544v1)

TCAndon-Router ([`arxiv-2601.04544v1`](https://arxiv.org/abs/2601.04544v1))
refines two assumptions: **uniform model allocation** and **run-to-completion
fan-out**.

### 1. Adaptive reasoning routing: difficulty-matched depth

Uniform model tiers waste tokens on trivial slices and starve ambiguous ones.

| task regime | swarm strategy |
|---|---|
| **Consultation / extraction** — direct lookups, syntax transforms, single-file edits; one agent's domain | a single worker on a small tier. Do not swarm. |
| **Troubleshooting / diagnosis** — cross-cutting bugs, root-cause analysis; several domains | a small parallel subset of domain experts on a heavy tier, plus a **Refining Agent** |

- **Reason before allocating:** before spawning workers, state why each worker
  and model tier is needed.
- **No uniform budget:** light models with shallow reasoning for deterministic
  checks; deep reasoning or frontier models only for units with genuine
  ambiguity.
- **Controlled candidate subset:** where sub-tasks overlap, dispatch only the
  small relevant subset (typically 1 to 3 workers), never an unconstrained
  fan-out.
- **Refining synthesis:** route overlapping partial answers to one Refining
  Agent (reviewer) that compares, deduplicates and resolves contradictions
  into a single verdict.

### 2. Andon-cord stopping: early termination on defect signals

Any participant may halt the swarm when an abnormality is detected, rather
than run it to completion at $N\times$ the cost of serial work.

**Kill the running subagents and halt the swarm when:**
- **Structural divergence:** the first two completed units produce
  incompatible interfaces, conflicting schema assumptions, or contradictory
  readings of the brief.
- **Out-of-scope / missing prerequisites:** an early worker finds that
  required context, APIs or files do not exist or are underspecified. Stop and
  clarify with the user rather than let the remaining agents invent inputs.
- **Reasoning loop / drift:** a worker deliberates in circles, retries without
  progress, or its rationale does not match its tool actions. Terminate it
  early rather than waiting for a timeout.
- **Deadlock or shared-state collision:** workers wait on each other's
  outputs or attempt conflicting branch updates.

## Agentic SE literature synthesis & cross-paper methodology

For the comprehensive cross-cutting synthesis, epistemic partition (Measured vs. Recommended vs. Claimed), and bidirectional adversarial analysis across all five foundation papers (He et al., SWE-Debate, SWE-Router, TCAndon-Router, CodeAgent), see:
- `research/methodologies/agentic-se-literature-synthesis.md` (opt-in `cat-harness.research`)

## Known gaps

There is no mechanical daemon in this repo that enforces the sizing caps above,
no hard per-unit wall-clock kill timer, and no pre-spawn token cost calculator
to show the author when asking, so those bounds are still applied by the
coordinating agent. Once a swarm is approved, [`dispatch-agent`](dispatch-agent.md)
governs worker briefs and `⟦PROGRESS⟧` telemetry, [`swarm-monitor`](swarm-monitor.md)
governs the reactive supervision loop, compressed/swap resource checks, slot
refill, and human-consumable scoreboard/milestone reporting, and
[`sdlc/processes/swarm-dispatch-and-monitor.bpmn`](../../processes/swarm-dispatch-and-monitor.bpmn)
(`Process_SwarmDispatchAndMonitor`) models the end-to-end process across owner,
coordinator, worker, monitor, and merge-steward lanes.
