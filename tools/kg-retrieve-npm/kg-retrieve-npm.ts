import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "kg-retrieve-npm",
    title: "Retrieve a remote Knowledge Graph via npm package or tarball",
    description:
      "Retrieve and inspect a remote Knowledge Graph packaged as an npm package or tarball (.tgz), supporting both unhydrated source graph views (authored declarations, skills, schemas) and hydrated materialized graph views (subgraph JSON-LD, metadata indexes, dereferenced graph projections).",
    install: { none: true },
    invoke: { shell: "bun run cat kg:retrieve:npm" },
    io: {
      inputs: [
        { name: "package", schema: t("Text"), required: true, description: "Package name, npm tarball (.tgz) path, or URL." },
        { name: "destination", schema: t("RepoPath"), required: false, arg: { flag: "--destination" }, description: "Directory to unpack or install into." },
        { name: "view", schema: t("Slug"), required: false, arg: { flag: "--view" }, description: "Graph view to inspect/retrieve: 'unhydrated' (source graph), 'hydrated' (materialized JSON-LD/indexes), or 'both'." },
        { name: "release", schema: t("RepoPath"), required: false, arg: { flag: "--release" }, description: "Optional `folio-binary-release/v1` record to verify digest and size against." },
      ],
      outputs: [
        { name: "status", schema: t("Text"), description: "Retrieval status: 'retrieved', 'verified', or 'could-not-determine'." },
        { name: "summary", schema: t("Text"), description: "Summary of retrieved graphs, nodes, and assets." },
      ],
    },
    satisfies: ["npm-kg-distribution", "remote-mount"],
    requires: { runtime: ["bun"], network: true },
    remedies: [
      { host: "registry.npmjs.org", none: "Retrieves packages from npm registry; local tarballs work offline via direct path." },
      { host: "npm.pkg.github.com", none: "Retrieves packages from GitHub Packages registry; local tarballs work offline via direct path." },
    ],
  }),
);
