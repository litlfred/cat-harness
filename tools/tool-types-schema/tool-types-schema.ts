import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "tool-types-schema",
    title: "Tool I/O type vocabulary",
    description:
      "The zod definitions of the shared types a Tool's inputs and outputs reference by IRI, and the published JSON Schema whose `$defs` those IRIs point into.",
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
      { source: "schemas/tool-types.ts", artefact: "tool-types.schema.json", format: "json-schema" },
    ],
  }),
);
