---
name: dispatch-agent
description: Dispatches one or more background subagents against disjoint workstreams with a standardized live progress contract, reactive wakeup plus fallback timer heartbeat, and human-consumable status synthesis through swarm-monitor. Every dispatched worker emits machine-greppable DID/DOING/NEXT/BLOCKERS blocks with live command evidence; the coordinator extracts the latest block on event wakeup or a 2-to-4-minute fallback timer and translates multi-worker state into anti-shorthand queue scoreboards and milestone rollups. Use when asked to dispatch agents, fan out parallel work with monitoring, or launch two or more background workers.
user_invocable: true
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, SendMessage, ScheduleWakeup, ToolSearch, AskUserQuestion
---

# Parallel worker dispatch with live progress telemetry and human-consumable monitoring

The expensive failure modes of multi-agent dispatch are **going dark** (launching $N$ background agents and having no live visibility for twenty minutes) and **dumping opaque telemetry** (pasting bare worker tags or raw `DID/DOING` log fragments that force the human owner to open every pull request and work item by hand). This skill pairs three pieces that MUST be used together whenever $\ge 2$ background workers run (`Process_SwarmDispatchAndMonitor` in [`sdlc/processes/swarm-dispatch-and-monitor.bpmn`](../../processes/swarm-dispatch-and-monitor.bpmn)):

1. **Pre-spawn sizing and permission ([`swarm-management`](swarm-management.md))** — confirm disjoint slices, model tiers, concurrency headroom, and per-swarm owner permission (or a quoted `swarm-spawn` waiver) before spawning.
2. **Worker-side progress contract (§1)** — every dispatched worker emits a consistent, machine-greppable `⟦PROGRESS⟧` / `⟦DONE⟧` block with *live* command evidence (log tails, exit codes, test/gate counts, commit SHAs), never a static *"still working on it"*.
3. **Coordinator-side [`swarm-monitor`](swarm-monitor.md) loop (§3)** — on reactive completion events plus a `2–4 min` fallback timer (`120 s` default for fast subtasks, `180 s` standard swarm cadence), the coordinator extracts each worker's latest block, checks host CPU/disk and compressed/swap memory headroom, hands verified ready pull requests to the merge steward, refills freed slots from `beans`, and reports to the human using [`swarm-monitor`](swarm-monitor.md)'s **Dual Scoreboard + Milestone/Epic Progress Rollups** (never bare worker shorthands).

Do not dispatch without both the worker contract and the monitor loop: a worker that skips the contract cannot be inspected, and a coordinator that skips [`swarm-monitor`](swarm-monitor.md) leaves the owner blind or buried in session jargon.

---

## 0. When to use

- Launching **$\ge 2$ background `Agent` calls** on independent fronts (disjoint modules, validation slices, schema/test migrations, or parallel investigations) — **requires [`swarm-monitor`](swarm-monitor.md)**.
- The user asks for **periodic status** (*"update me every 2 minutes"*, *"keep me posted"*, *"monitor these"*).
- A single long-running background worker whose live progress the user wants tracked.

For a single quick synchronous subagent whose result you need before the next step, skip this and call `Agent(run_in_background: false)`.

---

## 1. Agent-side progress contract (PASTE THIS into every dispatched agent)

Append the block below **verbatim** to every background worker prompt you dispatch through this skill. Fill in `<LABEL>` with a short stable tag ($\le 16$ chars, kebab-case: `link-cache`, `schema-diff`, `pot-extract`) — the coordinator's extractor keys on it internally, while human-facing reports translate `<LABEL>` into plain-language deliverable descriptions per [`swarm-monitor`](swarm-monitor.md).

````text
## PROGRESS REPORTING CONTRACT (STRICT — the coordinator monitors you on this)

Your label is: <LABEL>

Emit a progress block **as a plain-text assistant message** (not a tool
call) at EVERY meaningful step, and **at least once every ~90 seconds of
wall time** even mid-step. Use this EXACT shape so the parent can grep and
synthesize it:

    ### ⟦PROGRESS⟧ <LABEL> · step N
    DID: <what you just finished — CONCRETE evidence only: file paths,
         test/gate exit codes, passing/failing check counts, git SHAs, row
         counts, the tail of a log. NOT "worked on the implementation".>
    DOING: <the step in flight right now. If a command is RUNNING, quote
         the last 3–8 relevant lines of its output / the key live metric
         (elapsed, % done, cases checked, error so far). NEVER a canned
         "still running" — show the live log.>
    NEXT: <the single concrete next action you will take.>
    BLOCKERS: <none | the precise blocker (missing export, 403, ENOSPC,
         corrupt cache, ambiguous spec).>

Rules that keep updates LIVE, not semi-static:
- **Tee every long command to a log and quote its tail** in DOING:
  `<cmd> 2>&1 | tee /tmp/<LABEL>-<step>.log` then put the last lines in
  the block. Any build, test suite, renderer, or git op > ~10 s qualifies.
- **Advance the step counter** every block; never repeat an identical
  block twice — if nothing changed, say what you are still waiting on and
  quote the newest log line.
- **Evidence or it didn't happen**: every DID line names a file / exit
  code / count / SHA. No vague verbs.
- When you finish, emit a final block with marker `### ⟦DONE⟧ <LABEL>`
  carrying the verdict (completed / partial / blocked / split-follow-up),
  the exact touched path(s), verification command exit code and check
  counts, and the branch or PR you pushed.
````

Why this exact shape: the parent's extractor (below) greps for the `⟦PROGRESS⟧` / `⟦DONE⟧` markers and pulls the `DID / DOING / NEXT / BLOCKERS` lines with zero full-transcript reads. Deviating from the marker or the four keys breaks the monitor.

> This contract is **additive** to the task's own verification and quality gates. It governs *how the worker reports internally to the monitor*, never *what counts as done*. A worker still may not weaken a test, bypass a gate, or fake a closure to make its `DID` line look cleaner — honesty over a tidy status.

---

## 2. Dispatch procedure

**Where the work comes from.** A handover report hands its unstarted items over as DISPATCH LINES — one fixed sentence per work item, per [`handover-report`](handover-report.md) rule 7:

```text
Do bean <prefix>-<id> on branch <branch-to-create> of repo <owner>/<repo>.
```

Take the front from that line (or from the shared `beans` queue after claiming via `bun run cat beans:claim <id>`) rather than inventing an untracked scope: the work item carries its own `## Done when`, so the worker's result can be judged objectively. If you are dispatching durable work that has no work item, create and claim the work item in the shared `beans` store first (`todo-manager` and `bean-coordination`, opt-in `cat-harness.work-plan`).

1. **Scope each front** to one independent worker (zero shared writable files between workers — use isolated git worktrees / `isolation: "worktree"` whenever workers mutate the tree, and enforce host CPU/thread caps from [`swarm-management`](swarm-management.md)).
2. **Assign each a `<LABEL>`** and paste the §1 contract block into its prompt, plus the task-specific brief: the claimed work-item ID and `## Done when`, exact verification commands, single-thread/nice resource caps where applicable, and branch/PR handoff rules (workers push their branch and open or update their PR, never merging directly — [`merge-manager-watcher`](merge-manager-watcher.md)).
3. **Name the skills that govern the front** in the brief, by path, and quote the rules they set that the work could touch — rendering, layering, what is forbidden. An agent cannot follow a rule it was never pointed at.
   **Always include [`interaction-modality`](../../../skills/conduct/conduct-core/interaction-modality.md) (and [`hand-back-to-discussion`](../../../skills/conduct/conduct-core/hand-back-to-discussion.md))** in every dispatched brief, and require the child to pass it on to any subagent it spawns: never ask the owner a question in prose alone without a tappable card (`AskUserQuestion`, `request_decision`, `ask_question`, or `post_widget`) after the full chat block ($\le 4$ options, recommended first, stated default on silence), or return the question to the coordinating session in the `hand-back-to-discussion` schema format.
   If the skills are served over MCP and the server is unreachable, read them from the mounted layers (`<layer>/skills/**`) instead: an unreachable server is never a reason to work without them.
4. **Launch the workers** and record each `agentId` $\leftrightarrow$ `<LABEL>` $\leftrightarrow$ `(bean ID, branch, plain-language deliverable)` mapping, keeping the claim itself in the shared `beans` store (`swarm-monitor` §5).
5. **Immediately enter the [`swarm-monitor`](swarm-monitor.md) loop (§3)** and arm the fallback wakeup timer. Never end the dispatch turn without an armed monitor wakeup.

---

## 3. Parent-side heartbeat and Swarm Monitor synthesis

### 3a. The extractor (targeted — never read the full JSONL)

Reading a worker's whole `*.output` transcript overflows context. Extract ONLY the latest progress block per worker. Save this once as `/tmp/agent-progress.py` (or run inline):

```python
#!/usr/bin/env python3
# Usage: agent-progress.py <tasks-dir>
# Prints the latest ⟦PROGRESS⟧/⟦DONE⟧ block from each agent's *.output JSONL.
import json, sys, glob, os
tasks = sys.argv[1]
for f in sorted(glob.glob(os.path.join(tasks, "*.output"))):
    aid = os.path.basename(f)[:-7]
    last = None
    try:
        for line in open(f):
            try: o = json.loads(line)
            except Exception: continue
            for c in (o.get("message", {}).get("content") or []):
                if isinstance(c, dict) and c.get("type") == "text":
                    t = c.get("text", "")
                    if "⟦PROGRESS⟧" in t or "⟦DONE⟧" in t:
                        idx = max(t.rfind("⟦PROGRESS⟧"), t.rfind("⟦DONE⟧"))
                        last = t[t.rfind("###", 0, idx):] if idx >= 0 else t
    except FileNotFoundError:
        continue
    done = last and "⟦DONE⟧" in last
    print(f"===== {aid[:12]} {'[DONE]' if done else '[live]'} =====")
    print((last or "(no progress block yet — agent still spinning up)").strip()[:900])
    print()
```

Run it against the session tasks directory (`python3 /tmp/agent-progress.py "$TASKS_DIR"`).

### 3b. Translating extractor output into human-consumable updates (STRICT)

**Internal extraction vs. human reporting are two separate layers:**

- **For a single background worker** whose progress the user asked to watch live, a concise plain-language progress summary (naming the branch, work item with gloss, concrete completed step, live metric, and blocker) suffices.
- **Whenever $\ge 2$ background workers are active (a swarm)**, raw `label | DID | DOING` tables and internal shorthands (`W2`, `#405..#409`, bare work-item slugs) are **forbidden** as the user-facing status report. Follow [`swarm-monitor`](swarm-monitor.md) §3–§4 on every status turn:
  1. **Check host health and memory/swap saturation** (`top -l 1 -o mem -stats pid,command,mem,cmprs` on macOS or `VmSwap` + `VmRSS` on Linux alongside `df -h /` — never `ps -o rss` alone, which hides compressed/swapped leaks until `ENOSPC`).
  2. **Publish Part A — Live Repository Queue Scoreboard** (`PRs | Work Items (beans) | Issues` across Open total, Ready-to-Merge queue, External/Held, Legacy/Backlog, Preparing, and Closed/Merged today + all-time).
  3. **Publish Part B — Milestone & Epic Progress Rollups** (`Completed / In-Progress / Queued` counts plus plain-prose answers to *(i) Goal of the track, (ii) Landed / verified results + key metrics, (iii) Ready for merge with 1-line summary per PR, and (iv) Currently running & next up*), expanding every PR, branch, and work-item ID so the human reader never has to click a link to learn what happened.
  4. **Re-arm** the one-shot fallback timer (`120 s` when requested for 2-minute ticks; `180 s` default [`swarm-monitor`](swarm-monitor.md) cadence; cancelled early by completion notifications), then end the turn without busy-waiting.

### 3c. Nudging, killing leaks, or pulling the Andon cord

If a worker shows `(no progress block yet)` for $> 3$ minutes, or its step counter has not advanced across two sweeps:

1. Check host memory/swap and disk first ([`swarm-monitor`](swarm-monitor.md) §4a); if a child process is leaking into compressed memory or swapfiles, `SIGKILL` that child process immediately before nudging.
2. Send a targeted `SendMessage` nudge: *"Emit a fresh ⟦PROGRESS⟧ block with the live tail of whatever is running."* A worker blocked on missing inputs or disk/cache state will surface it in `BLOCKERS`; one stuck in a reasoning loop is halted and triaged under [`stalled-agent-triage`](stalled-agent-triage.md).

---

## 4. On worker completion and slot refill

When a worker emits `⟦DONE⟧` (or its completion notification wakes the coordinator):

1. **Verify before trusting the `⟦DONE⟧` claim.** Self-reported `"exit 0"` is a claim, not parent evidence: independently run the governing verification checks (`tsc`, targeted unit tests, diagram/schema gates) on the pushed branch head before handing off.
2. **Hand off to the merge steward, never self-merge** ([`merge-manager-watcher`](merge-manager-watcher.md)): send the six-line merge request (`Process_MergeRequest`) or apply `ready-to-merge` / `needs-repin` as governed by the active merge steward.
3. **Refill freed worker slots from `beans`** ([`swarm-monitor`](swarm-monitor.md) §5): while unblocked `todo` items remain in the shared `beans` epic and host headroom is green, claim the next item, dispatch a fresh isolated-worktree worker, and re-arm the timer.
4. **When all slots and queued `beans` are drained:** cancel any standing wakeup timer, close or hand back the parent work item through `Process_BeanClose`, and post the final Dual Scoreboard + Milestone/Epic Rollup.

---

## 5. Anti-patterns (each is a skill violation)

- **Going dark** — dispatching background workers without arming the reactive + fallback wakeup loop.
- **Opaque session shorthands in human reports** — writing `"W2, W5 merged (#412..#416); W7 on idx4"` instead of [`swarm-monitor`](swarm-monitor.md)'s self-contained Dual Scoreboard + Milestone/Epic Progress Rollups.
- **Checking only `ps -o rss` for memory saturation** — missing compressed/swapfile leaks until root disk hits `ENOSPC` ([`swarm-monitor`](swarm-monitor.md) §4a).
- **Semi-static worker blocks** — *"still running tests"* with no log tail, step counter, or live count.
- **Reading full worker transcripts** — `cat`-ing `*.output` JSONL files into context instead of running the targeted extractor.
- **A brief with no governing skills** — omitting governing skill paths or [`interaction-modality`](../../../skills/conduct/conduct-core/interaction-modality.md) (§2 step 3).
- **Trusting `⟦DONE⟧` without parent verification** — requesting merge on a worker's self-reported pass without running independent verification on the branch head.
