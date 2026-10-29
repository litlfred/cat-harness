import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "pages-index",
    title: "Published-paper index page",
    description:
      "Write the gh-pages `index.html` for a built paper: a Paper tab embedding the PDF and, when given, a Visualizer tab, with download links and the build's branch and commit.",
    install: { none: true },
    invoke: { shell: "python3 .github/scripts/generate-index.py" },
    io: {
      inputs: [
        { name: "outputHtml", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "Where to write index.html." },
        { name: "paperEmbed", schema: t("RepoPath"), required: true, arg: { positional: 1 }, description: "The file the Paper tab embeds, typically the PDF." },
        { name: "pdf", schema: t("RepoPath"), required: true, arg: { flag: "--pdf" }, description: "The PDF filename used in download links." },
        { name: "md", schema: t("RepoPath"), required: false, arg: { flag: "--md" }, description: "A Markdown rendering to link, when there is one." },
        { name: "visualizer", schema: t("RepoPath"), required: false, arg: { flag: "--visualizer" }, description: "The visualizer page for the second tab." },
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--branch" }, description: "The branch the build is from." },
        { name: "repo", schema: t("RepoFullName"), required: false, arg: { flag: "--repo" }, description: "owner/repo, for links back to the source." },
        { name: "sha", schema: t("CommitSha"), required: false, arg: { flag: "--sha" }, description: "The commit the build is from." },
      ],
      outputs: [
        { name: "index", schema: t("RepoPath"), description: "The written index.html." },
      ],
    },
    satisfies: ["docs-generation"],
    requires: { runtime: ["python3"], network: false },
  }),
);
