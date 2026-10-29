import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The BPMN engine's checklist projection — bean `folio-assistant-cy4p`,
// owner ruling 2026-10-10 ("both"). The engine itself, `bpmn-engine`, is
// declared in `cat-harness-tools/tools/index.ts`, beside its in-process
// module (owner, 2026-10-14: "Move the node to tools"): declared here, the
// module path had to climb into the tools layer by a relative path, which
// cat-harness's `needs` does not reach (`check:import-direction`). This one
// is invoked by a script key, like every Tool whose command the tools layer
// implements (owner, 2026-10-15, J2), so it stays.
export default toolFactory((t) =>
  defineTool({
    id: "bpmn-checklist",
    title: "BPMN checklist projection",
    description:
      "Generate, per diagram, a checklist that walks the BPMN as a state machine: each task names the `workflow_complete` call that records it and ends with `next:` by node id; each decision lists its labelled branches (or the DMN that computes it); parallel forks name every branch and joins wait for all; start/end events are entry and exit lines. A rendering, never an authority: it says it is generated, and `--check` fails when one is stale.",
    install: { none: true },
    invoke: { shell: "bun run cat bpmn:checklist" },
    io: {
      inputs: [
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Write every `<stem>.checklist.md` into this one directory instead. Default: each beside its diagram, in the instance that owns it; the harness site's `assets/workflows/checklists` holds those of the instances below the harness." },
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Verify instead of write: exit 1 on a stale, missing or orphaned checklist." },
      ],
      outputs: [
        { name: "checklists", schema: t("RepoPath"), description: "One committed `<stem>.checklist.md` per diagram in every instance, beside its `.bpmn` (owner, 2026-10-14: commit them)." },
      ],
    },
    satisfies: ["docs-generation"],
    selection: {
      when: "A coding agent needs a process in a form it can follow without reading BPMN XML, or without the engine's MCP server.",
      limits: "Conditions are the flows' labels or the DMN's id; a condition expression the model does not carry is not reproduced. The engine stays the authority.",
      cost: "One diagram load per process; no network.",
    },
    requires: { runtime: ["bun"], network: false },
  }),
);
