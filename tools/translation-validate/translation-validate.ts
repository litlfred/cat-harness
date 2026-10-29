import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "translation-validate",
    title: "Validate a translation",
    description: "Check a .po against its .pot — every msgid present, none obsolete, placeholders preserved.",
    install: bundled,
    invoke: inProcess("src/tools/translation.ts", "translation_validate"),
    io: {
      inputs: [
        { name: "pot_file", schema: t("RepoPath"), required: true, arg: { positional: 0 } },
        { name: "po_file", schema: t("RepoPath"), required: true, arg: { positional: 1 } },
        { name: "source", schema: t("RepoPath"), required: false, arg: { flag: "--source" }, description: "Also check the .pot is current for this source." },
      ],
      outputs: [{ name: "findings", schema: t("Markdown"), description: "Missing, obsolete and malformed entries." }],
    },
    // NOT `content-validate`: that edge was here and `check:tools` now
    // refuses it. The skill's contract requires `targetPath` — it validates
    // a folio's content — while this validates a .po against its .pot. Two
    // things called validation are not one skill.
    satisfies: ["translation-manager"],
    requires: { network: false },
  }),
);
