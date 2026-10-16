import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "work-plan-prime",
    title: "Prime the work plan",
    description:
      "Load the current work plan for this session — the same committed beans store the CLI reads, so a fresh container starts from the plan rather than from nothing.",
    install: bundled,
    invoke: { ...inProcess("src/tools/beans-prime.ts", "work_plan_prime"), shell: "beans prime" },
    io: {
      inputs: [],
      outputs: [{ name: "priming", schema: t("Markdown"), description: "Open items, the roadmap, and what each is waiting on." }],
    },
    // The same skills `beans-cli` and `beans-manual` satisfy for reading, and
    // for the same reason: an agent must be able to reach the plan by
    // whichever mechanism this container actually has.
    satisfies: ["todo-manager", "bean-coordination", "session-intent", "pending-show"],
    requires: { network: false },
  }),
);
