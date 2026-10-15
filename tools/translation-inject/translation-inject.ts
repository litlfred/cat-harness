import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "translation-inject",
    title: "Inject translations",
    description: "Produce a translated copy of a source markdown file from a .po, using the same segmentation the extractor used.",
    install: bundled,
    invoke: inProcess("src/tools/translation.ts", "translation_inject"),
    io: {
      inputs: [
        { name: "source", schema: t("RepoPath"), required: true, arg: { positional: 0 } },
        { name: "po_file", schema: t("RepoPath"), required: true, arg: { positional: 1 } },
        { name: "locale", schema: t("Locale"), required: true, arg: { flag: "--locale" } },
      ],
      outputs: [{ name: "translated", schema: t("RepoPath"), description: "The translated copy written." }],
    },
    satisfies: ["translation-manager"],
    requires: { network: false },
  }),
);
