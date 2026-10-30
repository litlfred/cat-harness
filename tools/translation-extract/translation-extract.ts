import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "translation-extract",
    title: "Extract translatable strings",
    description: "Segment a folio's prose into a GNU gettext .pot template, leaving code, math and identifiers untranslated.",
    install: bundled,
    invoke: inProcess("src/tools/translation.ts", "translation_extract"),
    io: {
      inputs: [
        { name: "path", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "A markdown file or a directory of them." },
        { name: "locale", schema: t("Locale"), required: false, arg: { flag: "--locale" } },
        { name: "project_name", schema: t("Text"), required: false, description: "Recorded in the .pot header." },
      ],
      outputs: [{ name: "pot", schema: t("RepoPath"), description: "The template written." }],
    },
    satisfies: ["translation-manager"],
    requires: { network: false },
  }),
);
