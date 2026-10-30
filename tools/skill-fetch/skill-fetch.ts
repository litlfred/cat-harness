import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "skill-fetch",
    title: "Fetch a skill",
    description: "Load one skill's instruction body for the agent to follow, from the local packages or an external bundle.",
    install: bundled,
    invoke: inProcess("src/tools/skill-fetch.ts", "skill_fetch"),
    io: {
      inputs: [
        { name: "skill", schema: t("SkillName"), required: true, arg: { positional: 0 } },
        { name: "package_name", schema: t("PackageName"), required: false, arg: { flag: "--package" } },
      ],
      outputs: [{ name: "instructions", schema: t("Markdown"), description: "The skill's instruction body." }],
    },
    satisfies: ["skills-and-tools"],
    requires: { network: false },
  }),
);
