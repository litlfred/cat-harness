import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "beans-cli",
    title: "beans CLI",
    description:
      "Read and write the work plan with the `beans` binary. The normal mechanism when it is installed.",
    install: { cli: "scripts/install-beans.sh" },
    invoke: { shell: "beans" },
    io: {
      inputs: [
        { name: "id", schema: t("BeanId"), required: false, arg: { positional: 0 }, description: "The bean to act on; absent for list/create." },
        { name: "status", schema: t("BeanStatus"), required: false, arg: { flag: "--status" } },
        { name: "body", schema: t("Markdown"), required: false, arg: { stdin: true } },
      ],
      outputs: [{ name: "bean", schema: t("BeanId"), description: "The bean created or updated." }],
    },
    satisfies: [
      "bean-coordination", "todo-manager", "pending-show",
      "session-intent", "continual-progress", "idle-backlog",
    ],
    selection: {
      when:
        "The normal case, once `scripts/install-beans.sh` has run. It is the only arm that can answer what an item IS or what it waits on — the fallback gives titles and statuses and nothing else — so any work that involves choosing, claiming or reasoning about an item wants this one.",
      limits:
        "Absent on a fresh container until installed, and the install can fail. It is third-party, which is why `.beans.yml` is one of the two configuration paths `check:harness-dirs` cannot remove. When it is missing, `beans-manual` writes the same store in the same layout and this reads back everything it wrote.",
      cost: "One install step per container, and it wants network to fetch. Nothing at runtime after that.",
    },
    requires: { runtime: ["go"], network: true },
    remedies: [{ host: "github.com", tool: "beans-manual" }],
  }),
);
