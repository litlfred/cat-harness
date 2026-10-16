import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "translation-status",
    title: "Translation coverage",
    description: "Per-locale translation coverage, computed from the .po files under the translations directory.",
    install: bundled,
    invoke: inProcess("src/tools/translation.ts", "translation_status"),
    io: {
      inputs: [{ name: "locale", schema: t("Locale"), required: false, arg: { flag: "--locale" }, description: "Absent means every locale." }],
      outputs: [{ name: "coverage", schema: t("Markdown"), description: "Translated, fuzzy and untranslated counts per locale." }],
    },
    satisfies: ["translation-manager"],
    requires: { network: false },
  }),
);
