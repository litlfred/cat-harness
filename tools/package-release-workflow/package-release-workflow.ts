import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "package-release-workflow",
    title: "Release package via GitHub Actions release workflow",
    description:
      "Build, tag, and publish an npm package tarball to GitHub Releases and GitHub Packages registry via workflow_dispatch across any repository.",
    install: { none: true },
    invoke: { shell: "gh workflow run release-npm.yml" },
    io: {
      inputs: [
        { name: "package", schema: t("PackageName"), required: false, description: "The package being released. Default: root package in the target repository." },
        { name: "version", schema: t("Text"), required: true, description: "The semver version string to release (e.g. '0.1.0')." },
        { name: "repo", schema: t("RepoFullName"), required: false, arg: { flag: "-R" }, description: "Target repository full name (e.g. 'litlfred/cat-harness', 'litlfred/bootstrap-tools'). If omitted, runs in the current repository." },
        { name: "workflow", schema: t("Text"), required: false, description: "The workflow file to trigger (default: 'release-npm.yml')." },
      ],
      outputs: [
        { name: "tag", schema: t("Text"), description: "The tag created by the workflow, e.g. `<package>-v<version>` or `v<version>`." },
        { name: "status", schema: t("Text"), description: "Workflow dispatch status and run URL." },
      ],
    },
    satisfies: ["package-release", "npm-kg-distribution"],
    requires: { runtime: ["gh"], network: true },
    remedies: [
      { host: "api.github.com", tool: "package-release-manual" },
    ],
  }),
);
