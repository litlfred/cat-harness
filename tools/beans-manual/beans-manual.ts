import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "beans-manual",
    title: "beans, by hand",
    description:
      "Read and write the same work plan without the CLI — `scripts/beans-fallback.ts`, or editing a bean's front matter directly. Equal standing to the CLI, not a degraded mode.",
    // Nothing to install: the store is files in the repository. Stated
    // explicitly so "no install step" is distinguishable from "unfinished
    // record" — the distinction the `none` flag exists for.
    install: { none: true },
    invoke: { shell: "bun run cat beans:fallback", manual: true },
    io: {
      inputs: [
        { name: "id", schema: t("BeanId"), required: false, arg: { positional: 0 } },
        { name: "status", schema: t("BeanStatus"), required: false, arg: { flag: "--status" } },
        { name: "body", schema: t("Markdown"), required: false, arg: { stdin: true } },
      ],
      outputs: [{ name: "bean", schema: t("BeanId") }],
    },
    // The SAME six skills as beans-cli. That is the point of the pair: an
    // agent in a fresh container with no `beans` on PATH must still find a
    // mechanism, which is the 2026-09-18 failure where a session read the
    // plan and touched nothing.
    satisfies: [
      "bean-coordination", "todo-manager", "pending-show",
      "session-intent", "continual-progress", "idle-backlog",
    ],
    selection: {
      when:
        "When the CLI is not installed and cannot be — not a rare case: a fresh container has no `beans` on PATH. Equal standing, not a degraded mode. An agent that knows only the CLI reads the plan and touches nothing, which is exactly the 2026-09-18 session that completed two merged PRs' worth of durable work UNCLAIMED.",
      limits:
        "Titles and statuses only. It cannot say what an item is, what it depends on, or what it waits on — enough to CLAIM and to record, not enough to CHOOSE. Install `beans-cli` when the choice is the point.",
      cost:
        "None. The store is files in the repository, so this needs a filesystem and nothing else — which is also why it is the arm that survives an air-gapped or sovereign-compute instance.",
    },
    requires: { network: false },
  }),
);
