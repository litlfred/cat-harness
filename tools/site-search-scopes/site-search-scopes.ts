import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "site-search-scopes",
    title: "Site search scopes",
    description:
      "The site search index cut into one index per scope — each declared instance, each target locale, and the platform — plus `assets/js/search/manifest.json` naming them, so a reader's search loads its own scope rather than the whole site (issue #1972, bean `m7mn`). Run on the assembled site after the index is written or borrowed.",
    install: { none: true },
    invoke: { shell: "bun run cat search:split --dir _site" },
    io: {
      inputs: [
        // input-site: inert #a9ab302b — prose naming the directory, in a message or a description
        { name: "index", schema: t("RepoPath"), required: true, description: "`_site/assets/js/search-data.json`, as the theme wrote it or as staging borrowed it." },
      ],
      outputs: [
        // input-site: inert #37afab82 — prose naming the directory, in a message or a description
        { name: "scopes", schema: t("RepoPath"), description: "`_site/assets/js/search/` — `manifest.json` and one `<scope>.json` per scope." },
      ],
    },
    satisfies: ["docs-generation"],
    requires: { runtime: ["bun"], network: false },
    downstream: {
      output: "assets/js/search/manifest.json",
      inputs: ["the site search index (`assets/js/search-data.json`)", "the declared instances and target locales"],
      judgedAt: "published",
      verifier: "search-scopes",
    },
  }),
);
