import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "themes-css",
    title: "Theme stylesheet",
    description:
      "Render the declared theme nodes into the stylesheet the site serves. The nodes are the source: a colour has one home, and light and dark are two valuations of one token set rather than two hand-kept blocks.",
    install: { none: true },
    invoke: { shell: "bun run cat themes:css" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed copy and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "stylesheet", schema: t("RepoPath"), description: "The generated stylesheet. Build output that happens to be committed, so it is readable on the forge — never hand-edited." }],
    },
    satisfies: ["site-presentation-assets"],
    maintains: [
      { source: "schemas/themes.ts", artefact: "assets/css/themes.css", format: "css" },
    ],
    requires: { runtime: ["bun"], network: false },
  }),
);
