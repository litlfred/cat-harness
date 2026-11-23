---
name: swarm-monitor
description: >
  Supervises an active multi-agent swarm on an event-driven wakeup and 2-to-4-minute
  fallback timer: extracts live worker progress, checks CPU load, disk headroom, and
  compressed or swapped memory footprint, enforces shared work-plan state, hands
  verified pull requests to the merge steward, refills freed worker slots, and
  publishes self-contained human status reports with a dual queue scoreboard and
  substantive milestone rollups free of internal session shorthands. Use whenever
  two or more background workers are dispatched, when asked to monitor or report on
  parallel agents, or when draining a work-plan epic across worker slots.
user_invocable: true
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, SendMessage, ScheduleWakeup, ToolSearch, AskUserQuestion
---

# Supervising active swarms, translating worker state for humans, and refilling slots

- [1. Role separation and reactive lifecycle](#1-role-separation-and-reactive-lifecycle)
- [2. Dependencies and three-state measurement](#2-dependencies-and-three-state-measurement)
- [3. Human-consumable status reporting contract (STRICT)](#3-human-consumable-status-reporting-contract-strict)
- [4. Worker health, memory/swap saturation, and Andon-cord triage](#4-worker-health-memoryswap-saturation-and-andon-cord-triage)
- [5. Merge-steward handoff and shared `beans` slot refill](#5-merge-steward-handoff-and-shared-beans-slot-refill)
- [6. Worked example — compliant vs. shorthand report](#6-worked-example--compliant-vs-shorthand-report)

Three skills govern a multi-agent run, and each owns a distinct question:

- [`swarm-management`](swarm-management.md) decides **whether** to spawn parallel workers, at what count and model tier, and under which `swarm-spawn` permission or waiver;
- [`dispatch-agent`](dispatch-agent.md) defines **how** each worker is briefed in an isolated worktree and emits machine-greppable `⟦PROGRESS⟧` / `⟦DONE⟧` blocks;
- **this skill** runs the **Swarm Monitor** companion loop (`Process_SwarmDispatchAndMonitor` in [`sdlc/processes/swarm-dispatch-and-monitor.bpmn`](../../processes/swarm-dispatch-and-monitor.bpmn)) from the moment the workers launch until the queue drains or halts.

Never run a swarm of two or more background workers without an active Swarm Monitor loop.

---

## 1. Role separation and reactive lifecycle

The Swarm Monitor lane (`swarm-monitor` role) sits between the worker agents (`authoring-agent`), the coordinator (`session-coordinator`), and the merge steward ([`merge-manager-watcher`](merge-manager-watcher.md)). One coordinator session normally holds both the `session-coordinator` and `swarm-monitor` lanes; in a large multi-session run, a dedicated monitor session may hold `swarm-monitor` while reading the same shared stores.

**Default cadence — reactive wakeup plus a 180-second fallback timer (range: 120–240 s).**

1. **Event-driven primary wakeup:** Worker completion notifications, sibling messages (`ready`, `hold`, `blocked`), and CI completion events wake the monitor immediately. Treat each arrival as an off-cadence sweep and cancel or reset the pending fallback timer.
2. **Fallback timer (`180 s` default; `120 s` when fast subtasks or an owner request asks for 2-minute ticks; up to `240 s` when every live worker is inside a verified multi-minute build or test suite):** Arm a one-shot timer (`ScheduleWakeup` or the host's one-shot timer tool with early-cancel on message arrival) before ending every turn while any worker remains live.
3. **Zero busy-polling:** Never loop inside a turn or run a shell `sleep` to wait on workers. Complete the sweep, re-arm one fallback timer, and end the turn.

Each wake executes five steps in order:

1. **Extract live worker blocks** using the targeted JSONL extractor from [`dispatch-agent`](dispatch-agent.md) §3a — never read full `*.output` transcripts into context.
2. **Measure host headroom and repository queues live** (§2 and §4): CPU load, root disk free space, **total memory plus compressed/swap footprint**, open/merged pull requests, issues, and the shared `beans` store.
3. **Triage stalls, drift, collisions, or resource leaks** (§4): nudge silent workers, kill runaway subprocesses, or pull the Andon cord when structural defects appear.
4. **Publish the human-consumable status update** (§3) when reporting on cadence, on milestone transitions, or on an owner check-in — translating internal worker telemetry into the Dual Scoreboard and Milestone/Epic Progress Rollups.
5. **Verify, hand off, and refill** (§5): independently verify any `[DONE]` worker's branch, send a six-line merge request to the merge steward, claim the next unblocked `beans` item into the freed slot, and re-arm the timer (or close out through `Process_BeanClose` once drained).

---

## 2. Dependencies and three-state measurement

This loop assumes:

- the work-plan CLI (`beans`, or `scripts/beans-fallback.ts` when `beans` is absent) mounted against the current branch store (`bun run cat state:mount`);
- forge REST access (`gh api …` rather than GraphQL `gh pr list`, which can return `403` in scoped agent tokens) and `git fetch origin <default-branch>` (never a stale local `main`, per [`goal-review`](goal-review.md));
- `python3` for the targeted `⟦PROGRESS⟧` / `⟦DONE⟧` JSONL extractor;
- host process and filesystem tools (`df -h /`, `uptime`, plus `top` on macOS or `/proc/<pid>/status` and `free` on Linux).

**Could not determine is never rendered as zero or clean.** If an API endpoint, remote branch ref, or host metric cannot be read, report `could not determine` with the reason rather than inventing a count or assuming healthy headroom.

---

## 3. Human-consumable status reporting contract (STRICT)

### Why raw coordinator telemetry fails the human reader

Worker labels (`a3-parser`, `W2`, `W7`), bare pull-request lists (`#402, #405..#409`), raw work-item slugs (`idx4`, `cfg9`), and pasted `DID / DOING` log tables are **internal session shorthands**. To a human reader who was not inside the worker transcripts, `"W2 merged (#405), W4 green (#408), W7 running step 4 on idx4"` says nothing about what capability was built, whether it actually works, or how close the milestone is to done — forcing the owner to open every pull request and work item by hand.

**The standalone reader test (`STRICT`):**

> **Can a reader who has never opened the worker sessions understand what was accomplished, what is ready to land, what is running now, and what needs a decision — without clicking a single link?**

### Rule 1 — Ban naked shorthands (STRICT)

Never emit bare worker tags (`W2`, `worker-3`), bare pull-request numbers or ranges (`#104..#109`), or unglossed work-item IDs (`fa-idx4`) anywhere in a human-facing status report, PR comment, or turn summary:

- **Every referenced pull request, work item, or active worker MUST carry a plain-language statement of what concrete deliverable, fix, or finding it achieves AND its key measured outcome or verification state** (for example: passing test/gate counts, latency or size delta, coverage figure, or the exact blocker).
- Expand every PR range: if five PRs are ready, either give each PR its one-line content and verification summary, or group them under a named epic with the concrete deliverables and verified metrics stated in plain prose and each PR glossed.
- Keep `⟦PROGRESS⟧` labels inside the extractor. When naming an active worker in prose or a table, pair its branch or work item with the plain-language task it is performing (*"Incremental link-checker cache (`idx4`, branch `claude/link-cache`) — running full 48-case regression shard, 41/48 passed"*).
- Follow [`turn-reporting`](turn-reporting.md) rule 1 (two sentences and a link per work item when proposing or closing work) and [`interaction-modality`](../../../skills/conduct/conduct-core/interaction-modality.md) §4.1 whenever a report surfaces an owner decision: full context, options with trade-offs, recommendation first, stated default on silence, and a tappable card — never a teaser such as *"2 items waiting on your call"*.

### Rule 2 — Dual Scoreboard + Substantive Milestone/Epic Rollup (Mandatory)

Every swarm status report to the human owner MUST contain **both** Part A and Part B, in this order:

#### Part A — Live Repository Queue Scoreboard (`PRs | Work Items (beans) | Issues`)

Measure live from the forge and the synced `beans` store (never from memory or a stale local branch) and present one compact table across all three queues:

| Queue slice | Pull Requests | Work Items (`beans`) | Issues |
|---|---:|---:|---:|
| **Open total** | `<n>` | `<n>` | `<n>` |
| ├─ **Ready-to-Merge queue** (verified green, handed to merge steward) | `<n>` | `<n>` *(done in branch, awaiting PR merge)* | `<n>` *(linked to ready PR)* |
| ├─ **External / Held (hands-off)** (`content` PRs, owner-held, outside session) | `<n>` | `<n>` | `<n>` |
| ├─ **Legacy / Backlog queue** (unclaimed `todo` / unscheduled open items) | `<n>` | `<n>` | `<n>` |
| └─ **Preparing (active worker branches)** (claimed `in-progress` / draft or CI running) | `<n>` | `<n>` | `<n>` |
| **Closed / Merged today** (current UTC date or stated window) | `<n>` | `<n>` | `<n>` |
| **Closed / Merged all-time** | `<n>` | `<n>` | `<n>` |

State the measurement window and host headroom on one line directly beneath the table (for example: *"Window: since 14:00Z · Host headroom: load 2.4 / 8 cores, memory 11.2 GB used + 0 MB swap compressed, `/` 64 GB free"*).

#### Part B — Milestone & Epic Progress Rollups

For **each** active milestone and session epic, report its `(Completed / In-Progress / Queued)` work-item counts alongside its verbatim title, followed by a **substantive plain-prose summary answering four questions**:

1. **Goal of the track:** What user-visible or architectural outcome this milestone or epic achieves (preserving the owner's verbatim goal wording where recorded, per [`goal-review`](goal-review.md)).
2. **Landed / verified results:** What concrete functionality, schema invariants, or fixes have merged or passed independent parent verification in this window, **with their key measured metrics** (test counts, gate pass counts, error reductions, runtime or size figures) — never a bare list of PR numbers.
3. **Ready for merge:** One plain-language line per ready PR naming the PR link, what it changes, and its verified check state with the merge steward.
4. **Currently computing / verifying & next up:** What each active worker is executing right now (with live progress evidence rather than *"still running"*), followed by the next concrete `beans` deliverables queued to refill freed slots.

---

## 4. Worker health, memory/swap saturation, and Andon-cord triage

Every sweep checks four defect classes before reporting or refilling slots:

### 4a. Runaway memory, compressed pages, and swapfile disk exhaustion (STRICT)

**Never rely on `ps -o rss` alone to judge worker memory health.** On macOS and swap-backed Linux, the kernel compresses inactive pages and pages them out to swap files (for example `/System/Volumes/VM/swapfile*` on macOS or swap partitions/files on Linux). A leaking build, solver, browser renderer, or test process can allocate tens of gigabytes while its resident set (`rss`) stays under `3 GB` — silently filling the root volume with swapfiles until every agent and git operation fails with `ENOSPC`.

Each monitor sweep MUST inspect **total memory footprint plus compressed/swap usage alongside root disk headroom**:

- **macOS:** Run `top -l 1 -o mem -stats pid,command,mem,cmprs | head -n 20` alongside `df -h /` (and `ls -lh /System/Volumes/VM/ 2>/dev/null` when swap grows). `mem` + `cmprs` exposes compressed regions that `ps -o rss` omits.
- **Linux:** Inspect `free -h`, `df -h /`, and per-worker `/proc/<pid>/status` (`VmRSS` + `VmSwap` + `VmPeak`).
- **CPU concurrency:** Check 1-minute load average (`uptime`) and active build/test subprocess counts against physical cores and any single-thread environment caps ([`swarm-management`](swarm-management.md) §"Sizing").

**Immediate action on ceiling breach:** When any worker subprocess exceeds its per-worker memory+swap ceiling or drives free root disk toward the host safety floor (default: `< 10 GB` free on `/` or swap growth `> 50%` of physical RAM):

1. Immediately `SIGKILL` (`kill -9 <pid>`) the runaway child subprocess so swap/disk space is reclaimed at once.
2. Send an urgent `SendMessage` to the owning worker explaining which command was killed, its measured `mem + cmprs` / `VmSwap` footprint, and forbidding an unbounded retry.
3. If two workers breach headroom or root disk remains below floor after reclamation, pull the **Andon cord** (halt new dispatches and pause remaining heavy builds) until headroom recovers.

### 4b. Silent stalls and reasoning drift

- **Silent worker:** No `⟦PROGRESS⟧` block after 3 minutes of wall time, or an identical step counter across two consecutive sweeps. Send a targeted one-line `SendMessage` nudge ([`dispatch-agent`](dispatch-agent.md) §3c). If the next sweep still shows no live command progress or surfaces a reasoning loop (retrying the same failing command without changing inputs, or rationale contradicting tool calls), terminate the worker early and route its footprint through [`stalled-agent-triage`](stalled-agent-triage.md).
- **Shared-file or branch collision:** Two workers touching the same path or pushing conflicting updates violate the disjoint-slice precondition ([`swarm-management`](swarm-management.md)). Halt the later writer immediately and re-scope in `beans` before restarting.

### 4c. Structural Andon-cord halt

Pull the Andon cord and halt the swarm ([`swarm-management`](swarm-management.md) §"Andon-cord stopping") when the first completed units reveal incompatible interface/schema assumptions or missing prerequisites across the remaining sub-beans. Present any blocking architectural choice once in full to the owner ([`interaction-modality`](../../../skills/conduct/conduct-core/interaction-modality.md) §4.1) rather than letting $N$ workers invent $N$ incompatible answers.

---

## 5. Merge-steward handoff and shared `beans` slot refill

### Independent verification and merge handoff

1. **Never trust a worker's self-reported `⟦DONE⟧` verdict unverified.** Re-run the governing fast/targeted verification checks (`tsc`, targeted unit tests, `bpmn:detangle --check`, or gate checks) on the worker's pushed branch head before marking or requesting merge.
2. **Respect single-merge-steward discipline ([`merge-manager-watcher`](merge-manager-watcher.md) STRICT):** Neither workers nor the Swarm Monitor merge PRs directly unless this session is the elected/lone merge steward following the full batch-card rule. Send each verified ready PR to the active merge steward using the six-line merge request (`Process_MergeRequest` / `merge-manager-watcher` §"The merge request: six lines"), or apply `ready-to-merge` / `needs-repin` when operating across sessions without direct chat.

### Shared `beans` queue discipline and continuous slot refill

- **Zero private queue state:** Every sub-bean creation, claim (`bun run cat beans:claim <id>` recording holder and branch), deferral, blocker note, and completion MUST be written to the shared `beans` store and synced (`bun run cat state:push`), never held only in a `/tmp` scratchpad or coordinator memory, and never committed to a state branch from a sparse checkout ([`merge-manager-watcher`](merge-manager-watcher.md) §"Merging across dependent repositories" rule 7).
- **Slot refill:** Whenever a worker completes (or is parked on a documented blocker) and host CPU/memory/swap/disk headroom is healthy, claim the highest-priority unblocked item from the shared `beans` queue (`bean-coordination` and `idle-backlog`, opt-in `cat-harness.work-plan`), verify no sibling branch or open PR already holds it, dispatch a fresh isolated-worktree worker with the [`dispatch-agent`](dispatch-agent.md) progress contract, and re-arm the fallback timer.

---

## 6. Worked example — compliant vs. shorthand report

**✗ Violation (naked shorthands, unglossed IDs, no scoreboard, no substantive rollup):**

> Swarm tick 4: W1, W3 merged (#412..#413). W2, W5 ready (#415..#416). W4 running tests on `idx4`; W6 started `cfg9`. Refilling W1 with `lnk2`.

**✓ Compliant Swarm Monitor status report:**

> ### A. Live Repository Queue Scoreboard
>
> | Queue slice | Pull Requests | Work Items (`beans`) | Issues |
> |---|---:|---:|---:|
> | **Open total** | 6 | 14 | 9 |
> | ├─ **Ready-to-Merge queue** | 2 | 2 | 2 |
> | ├─ **External / Held (hands-off)** | 2 | 3 | 4 |
> | ├─ **Legacy / Backlog queue** | 0 | 6 | 2 |
> | └─ **Preparing (active worker branches)** | 2 | 3 | 1 |
> | **Closed / Merged today (since 00:00Z)** | 2 | 2 | 1 |
> | **Closed / Merged all-time** | 411 | 286 | 194 |
>
> *Window: 16:00Z–16:18Z · Host headroom: load 2.1 / 8 cores, memory 9.8 GB resident + 128 MB compressed (`0` swapfiles), `/` 71 GB free.*
>
> ### B. Milestone & Epic Progress Rollups
>
> #### Milestone: "Deterministic incremental site builds under 30 seconds" — `4 Completed / 2 In-Progress / 3 Queued`
> - **Goal:** Cut incremental documentation site rebuilds below 30 seconds by caching unchanged knowledge-graph slices and link tables without weakening stale-link gates.
> - **Landed / verified results:** Content-hash manifest diffing ([#412](https://github.com/example/repo/pull/412)) and incremental glossary slice caching ([#413](https://github.com/example/repo/pull/413)) merged to `main`; warm rebuild time on the 420-page fixture dropped from `74.2 s` to `26.8 s` (`18/18` cache-invalidation tests passing, `0` stale outputs).
> - **Ready for merge (handed to merge steward):**
>   - [#415](https://github.com/example/repo/pull/415) (`idx4` — Incremental cross-reference link table): Recomputes anchor targets only for modified pages and their inbound referrers; full gate tier green (`34/34` link-integrity tests pass).
>   - [#416](https://github.com/example/repo/pull/416) (`cfg9` — Strict cache-key invalidation on config schema bumps): Adds config-schema digest to the slice cache header so layout flag edits force a clean rebuild (`12/12` unit tests pass).
> - **Currently running & next up:**
>   - **Active branch `claude/bpmn-svg-digest`** (`svg7` — Skip headless browser SVG re-render when `.bpmn` bytes and renderer version match): Running headless browser parity suite (`19/24` diagrams verified byte-identical, elapsed `68 s`).
>   - **Active branch `claude/locale-pot-cache`** (`pot3` — Incremental `.pot` extraction check across 5 locales): Newly claimed into freed worker slot; running baseline `translate-bpmn --check` (`step 2`, exit `0` on fixture).
>   - **Next queued in `beans`:** `lnk2` (Emit machine-readable cache-hit summary in CI job summary) and `doc8` (Document cache-key inputs in architecture reference).
