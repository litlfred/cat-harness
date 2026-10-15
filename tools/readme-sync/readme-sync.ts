import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "readme-sync",
    title: "Sync generated README sections",
    description:
      "Rewrite each generated README region, and only where the README already carries that section's marker pair. Nothing outside a marked region is touched.",
    install: bundled,
    invoke: { ...inProcess("src/tools/readme-sync.ts", "readme_sync"), shell: "bun run cat readme:sync" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if any section is stale; write nothing." },
        {
          name: "only",
          schema: t("ReadmeSection"),
          required: false,
          repeated: true,
          arg: { flag: "--only" },
          description: "Restrict to these sections. Repeated: the flag is emitted once per section.",
        },
        { name: "link_style", schema: t("LinkStyle"), required: false, arg: { flag: "--link-style" } },
        { name: "fetch", schema: t("Flag"), required: false, arg: { flag: "--fetch" } },
        { name: "dir", schema: t("FilesystemPath"), required: false },
      ],
      outputs: [{ name: "report", schema: t("Markdown"), description: "Per section: written, unchanged, or skipped because it could not be determined." }],
    },
    satisfies: ["docs-generation"],
    requires: { network: false },
  }),
);
