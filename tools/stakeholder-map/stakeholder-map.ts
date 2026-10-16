import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "stakeholder-map",
    title: "Stakeholder map",
    description:
      "Given the paths a proposed change touches, report which skills change, which roles declare them, and who therefore has a stake in the review.",
    install: bundled,
    invoke: { ...inProcess("src/tools/stakeholder-map.ts", "stakeholder_map"), shell: "bun run cat stakeholder-map" },
    io: {
      inputs: [
        {
          name: "paths",
          schema: t("RepoPath"),
          required: true,
          repeated: true,
          arg: { positional: 0 },
          description: "The changed paths. A repeated positional, so it is last on the command line.",
        },
      ],
      outputs: [{ name: "stakeholders", schema: t("Markdown"), description: "Skills, roles and the people each role names." }],
    },
    satisfies: ["role-model", "coordinate"],
    requires: { network: false },
  }),
);
