import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "translation-signoff",
    title: "Sign off a translation",
    description:
      "Record a translation as official — who signed off, when, and the hash of the source it was signed against, so a later source edit is detectable.",
    install: bundled,
    invoke: inProcess("src/tools/translation.ts", "translation_signoff"),
    io: {
      inputs: [
        { name: "locale", schema: t("Locale"), required: true, arg: { flag: "--locale" } },
        { name: "source", schema: t("RepoPath"), required: true, arg: { positional: 0 } },
        // A person's name, so `Text` and no `arg`: it is not a command-line
        // word, and the sign-off is an in-process call anyway.
        { name: "signed_off_by", schema: t("Text"), required: true, description: "Who is signing off." },
        { name: "level", schema: t("TranslationLevel"), required: false, arg: { flag: "--level" } },
      ],
      outputs: [{ name: "record", schema: t("Markdown"), description: "The sign-off recorded, including the source hash." }],
    },
    satisfies: ["translation-manager", "decision-audit"],
    requires: { network: false },
  }),
);
