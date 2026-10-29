import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "tool-schema",
    title: "Tool node schema",
    description:
      "The zod definition of a Tool node — what `defineTool` accepts — and the published JSON Schema generated from it.",
    install: { none: true },
    invoke: { shell: "bun run cat kg:schema" },
    io: {
      inputs: [
        { name: "baseUrl", schema: t("Url"), required: false, arg: { flag: "--base-url" } },
      ],
      outputs: [{ name: "schema", schema: t("RepoPath") }],
    },
    satisfies: ["kg-export"],
    maintains: [{ source: "schemas/tools/tool.ts", artefact: "cat-harness/tool.schema.json", format: "json-schema" }],
  }),
);
