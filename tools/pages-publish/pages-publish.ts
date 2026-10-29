import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "pages-publish",
    title: "GitHub Pages publish",
    description:
      "Push a built directory to the `gh-pages` branch, where it is served. How the knowledge graph and its schema reach a URL.",
    install: { none: true },
    invoke: { shell: ".github/workflows/docs-site.yml" },
    io: {
      inputs: [
        { name: "directory", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The built tree to publish." },
        { name: "baseUrl", schema: t("Url"), required: false, arg: { flag: "--base-url" }, description: "Publication base; a preview passes its own." },
      ],
      outputs: [{ name: "url", schema: t("Url"), description: "Where the tree is served.", render: { as: "url", reason: "a reader opens it; the scheme is checked before it reaches an href" } }],
    },
    // `docs-generation` too (owner, 2026-10-05, bean lehh): this is the CI
    // build of the site, and `site-build-local` is the same build on a
    // developer's machine — two Tools, one skill.
    satisfies: ["kg-export", "docs-generation"],
    requires: { network: true },
    remedies: [{ host: "github.com", none: "It is a GitHub Actions workflow; it runs on GitHub or not at all." }],
  }),
);
