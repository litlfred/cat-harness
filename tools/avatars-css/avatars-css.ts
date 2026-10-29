import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "avatars-css",
    title: "Avatar stylesheet",
    description:
      "Render the declared avatar nodes — an actor's glyph and colours, including the overlay states — into the stylesheet the site serves.",
    install: { none: true },
    invoke: { shell: "bun run cat avatars:css" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed copy and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "stylesheet", schema: t("RepoPath"), description: "The generated stylesheet. Never hand-edited." }],
    },
    satisfies: ["site-presentation-assets"],
    maintains: [
      { source: "schemas/avatars.ts", artefact: "assets/css/avatars.css", format: "css" },
    ],
    requires: { runtime: ["bun"], network: false },
  }),
);
