import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "navbar-include",
    title: "Write the site sidebar's harness navbar include",
    description:
      "Render `_includes/generated/navbar-footer.html` from `docs/_data/harness.json` with the same renderer every railed page uses. With `--instance`, render the navbar of an IG repository's OWN site instead — that instance first, then what it needs; its own pages at this site's root, every other link to the main site at `--link-root` — into the shell that site is built from (#2235).",
    install: { none: true },
    invoke: { shell: "bun run cat navbar:include" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if the committed include is stale; write nothing." },
        { name: "instance", schema: t("Slug"), required: false, description: "The instance whose own site this navbar is for." },
        { name: "link-root", schema: t("RepoPath"), required: false, description: "With `--instance`: the main site's URL, for every link that is not this instance's own." },
        { name: "title", schema: t("Slug"), required: false, description: "With `--instance`: the label the navbar's home row carries." },
        { name: "out", schema: t("RepoPath"), required: false, description: "With `--instance`: where to write the include (the shell's `_includes/generated/navbar-footer.html`)." },
      ],
      outputs: [
        { name: "include", schema: t("RepoPath"), description: "The include written, or `up to date`." },
      ],
    },
    satisfies: ["harness-tiles"],
    requires: { runtime: ["bun"], network: false },
  }),
);
