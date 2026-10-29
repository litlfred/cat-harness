import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "compose-docs",
    title: "Compose the site's documentation tree from its declared docs layers",
    description:
      "Write the Jekyll source the docs site is built from: the base docs layer, the repository overlay on top (an overlay's `_config.yml` merged, every override reported), and each `composed` instance under its own name. `--staging` keeps staging-only visualisations; `--changed-files` stubs instances a branch does not reach. `--shell` writes the CHROME only — the layers' Jekyll machinery and assets, no page, no instance, and the host's generated includes empty — which an IG repository composes its IG into so its own site wears the main site's chrome (#2235).",
    install: { none: true },
    invoke: { shell: "bun run cat compose:docs" },
    io: {
      inputs: [
        { name: "out", schema: t("RepoPath"), required: true, description: "The Jekyll source to write (replaced)." },
        { name: "staging", schema: t("Flag"), required: false, arg: { flag: "--staging" }, description: "A local build or a staging preview: staging-only visualisations are included." },
        { name: "changed-files", schema: t("RepoPath"), required: false, description: "The branch's changed paths, one per line: instances it does not reach are stubbed." },
        { name: "shell", schema: t("Flag"), required: false, arg: { flag: "--shell" }, description: "The chrome only: Jekyll machinery and assets, no page and no composed instance; generated includes written empty." },
      ],
      outputs: [
        { name: "files", schema: t("Count"), description: "Files composed, with every override, merge, withheld file and carried or stubbed instance named." },
      ],
    },
    satisfies: ["harness-tiles"],
    requires: { runtime: ["bun"], network: false },
  }),
);
