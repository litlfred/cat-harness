import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "tool-types-schema",
    title: "Tool I/O type vocabulary",
    description:
      "The zod definitions of the shared types a Tool's inputs and outputs reference by IRI, and the published JSON Schemas those IRIs name: one document per type, `tool-types/<Name>.schema.json`, plus the combined `tool-types.schema.json`.",
    install: { none: true },
    invoke: { shell: "bun run cat kg:schema" },
    io: {
      inputs: [
        { name: "baseUrl", schema: t("Url"), required: false, arg: { flag: "--base-url" } },
      ],
      outputs: [{ name: "schema", schema: t("RepoPath") }],
    },
    satisfies: ["kg-export"],
    maintains: [
      { source: "schemas/tools/tool-types.ts", artefact: "cat-harness/tool-types.schema.json", format: "json-schema" },
    ],
  }),
);
