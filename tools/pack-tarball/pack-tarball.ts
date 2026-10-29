import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "pack-tarball",
    title: "Package instance into an npm tarball and record binary release",
    description:
      "Build an npm tarball (.tgz) of an instance using `bun pm pack`, compute its size and SHA-256 digest, and record it as a `folio-binary-release/v1` state node.",
    install: { none: true },
    invoke: { shell: "bun run cat pack:tarball" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "Instance root containing package.json (default: cwd)." },
        { name: "destination", schema: t("RepoPath"), required: false, arg: { flag: "--destination" }, description: "Directory to save the tarball and release record." },
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Path to write the folio-binary-release/v1 JSON record." },
        { name: "repository", schema: t("RepoFullName"), required: false, arg: { flag: "--repository" }, description: "Repository owner/repo for the release origin." },
        { name: "release-url", schema: t("Url"), required: false, arg: { flag: "--release-url" }, description: "Public URL where the tarball is published/hosted." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit the folio-binary-release/v1 JSON record to stdout." },
      ],
      outputs: [
        { name: "release", schema: t("RepoPath"), description: "Path to the created folio-binary-release/v1 record." },
        { name: "tarball", schema: t("RepoPath"), description: "Path to the created .tgz tarball." },
      ],
    },
    satisfies: ["package-release", "npm-kg-distribution"],
    requires: { runtime: ["bun"], network: false },
  }),
);
