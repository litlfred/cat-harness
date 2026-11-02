---
name: work-plan-store
description: >
  The contract the work plan (beans) keeps as a data store, as operations any
  Tool must provide: get, list, create, update with ifMatch, note, history,
  and where a bean is in its processes. Give back a bean exactly as written,
  keep ids unique and links whole, keep status and type to their closed lists,
  lose nothing to concurrent writers, and answer a bean's history. A
  mechanical Actor plays this Role through whichever Tool the deployment names.
---

# The work plan's contract

**The work plan is a data store, and this is its contract** (owner,
2026-11-01, Q-DS-1 A and Q-DS-2 A). `work-plan` in
[`scenarios/roles.json`](../../../scenarios/roles.json) is a mechanical Role
with a `store` block: what it holds, and how it is reached. This skill is the
other half, what it must do. How an agent USES the plan is
[`todo-manager`](todo-manager.md); this file says what the plan promises back.

**This contract names no Tool** (owner, 2026-11-02, cat-harness#991). A
process or skill that touches the work plan says which operation below it
performs ("note the bean", "claim it"), never which command does it. How one
Tool performs an operation belongs on that Tool's page, listed in §"Tools".
The Tool in use is chosen by the deployment description, per checkout
(Q-BSD-2 A).

A diagram draws the store as a data store, never a lane (Q-BR-3 A): a
`dataStoreReference` with `dataStoreRef="work-plan"`, declared once in
[`processes/global-tasks.bpmn`](../../../processes/global-tasks.bpmn). A task
that opens or closes a bean writes to it with a `dataOutputAssociation`; a
task that reads the plan has a `dataInputAssociation` from it. The task sits
in the lane of whoever does it.

## What it holds

| Kind | What |
|---|---|
| `bean-defs` | beans (`$schema: bean/1.0.0`), shaped by [`schemas/kinds/bean-defs.schema.json`](../../../schemas/kinds/bean-defs.schema.json) |
| `bean-notes` | addenda to a bean, one per writer, never rewritten |
| `workflow-state` | running and finished BPMN instances (`folio-workflow-instance/v1`) |

## Operations

Every Tool provides these. Each line says what a caller can rely on.

| Operation | Guarantee |
|---|---|
| `get(id)` | the bean as last written, or "none". A short id resolves to exactly one bean or to none |
| `list(filter)` | beans by status, type, tag or parent |
| `create(bean)` | the id is unique; the bean is readable by `get` once `create` returns |
| `update(id, change, ifMatch)` | refused when `ifMatch` names a version that is no longer current; a retry on the current version lands |
| `note(id, text, by)` | appended to the bean's notes, never rewriting earlier ones |
| `history(id)` | every change to the bean, oldest first: when, by whom, what changed, and which process step made it when one did |
| `positions(id)` | every workflow instance that names the bean: process, step(s), instance status, last move |
| `beansAt(process, step?)` | the beans with a token at that process (and step) |

**A bean's position lives only in the workflow instances** (owner,
2026-11-02, Q-BSD-1 B). The bean records no process or step of its own;
`positions` and `beansAt` read the instances the store holds. A tag such as
`process:code-change-review` may label a bean for people, and is never read
as its position.

## Responsibilities

Each line is something a test can check against any Tool.

1. **Give back what was written.** `get` after `create` or `update` returns,
   byte for byte, the bean written.
2. **Keep ids unique.** No two beans share an id.
3. **Keep links whole.** `parent`, `blocking` and `blocked_by` name beans that
   exist.
4. **Keep the lists closed.** `status` and `type` take only the values the
   schema declares.
5. **Lose nothing to a race.** Two writers at once both land: the second
   `update` with a stale `ifMatch` is refused, retried on the current version,
   and lands. Nothing is overwritten unread.
6. **Keep the history.** `history(id)` answers who changed what and when, and
   which process step did it.
7. **Know where a bean is.** `positions` and `beansAt` agree with the
   instances the store holds.

## Tools

| Tool | Backed by | Page |
|---|---|---|
| git state branch | a branch per graph (`cat/<harness>/beans`), mounted at `beans/`, written with the `beans` CLI (`beans-cli`) or by hand (`beans-manual`), read with `bean-query` | [`work-plan-store-git-branch`](work-plan-store-git-branch.md) |
| beans server | `beans-serve` GraphQL ([schema](https://github.com/litlfred/beans/blob/main/internal/graph/schema.graphqls)); its mutations already take `ifMatch` | proposed, cat-harness#991 |
| MCP service | an MCP server over the same operations | proposed, cat-harness#991 |
| run-scoped store | in memory or a scratch branch, one per benchmark run, never the real plan (`req:model-benchmark`) | proposed, cat-harness#991 (Q-BSD-5 A) |

## Tests

None yet. Until a conformance suite names each responsibility above and runs
against each Tool, `kg-audit` reports this role as `mechanical-role-untested`,
which is the truth. The suite belongs with the toolset (cat-harness#991,
step 2), and this file gains a `tested-by:` line when it exists.

## Not its responsibility

Deciding what to work on, who claims a bean, or whether work is done. Those
are judgements made in the lanes of the people and agents who read and write
the plan.
