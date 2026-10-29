import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { stub } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "cat-harness-schema",
    title: "Instance declaration schema",
    description:
      "The zod definition of `<name>.json` — what an instance may declare about itself — and the published JSON Schema generated from it.",
    install: { none: true },
    invoke: { shell: "bun run cat kg:schema" },
    io: {
      inputs: [
        { name: "baseUrl", schema: t("Url"), required: false, arg: { flag: "--base-url" }, description: "Publication base; a preview passes its own." },
      ],
      outputs: [{ name: "schema", schema: t("RepoPath"), description: "The written JSON Schema." }],
    },
    satisfies: ["kg-export"],
    maintains: [
      { source: "schemas/cat-harness.ts", artefact: `cat-harness/${stub()}.schema.json`, format: "json-schema" },
    ],
  }),
);
