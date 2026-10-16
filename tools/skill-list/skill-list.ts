import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "skill-list",
    title: "List skills",
    description: "Every skill this instance can resolve, with its one-line summary. The entry point AGENTS.md sends an agent to first.",
    install: bundled,
    invoke: inProcess("src/tools/skill-fetch.ts", "skill_list"),
    io: {
      inputs: [],
      outputs: [{ name: "skills", schema: t("Markdown"), description: "Name and summary per skill." }],
    },
    satisfies: ["skills-and-tools"],
    requires: { network: false },
  }),
);
