import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "npm",
    title: "Package manager and registry client for npm and GitHub Packages",
    description:
      "Package, publish, inspect, and retrieve npm packages and Knowledge Graphs distributed as tarballs or packages from npm registry or GitHub Packages.",
    install: { none: true },
    invoke: { shell: "npm" },
    io: {
      inputs: [
        { name: "args", schema: t("Text"), required: false, description: "Arguments passed to npm (e.g. 'pack', 'publish', 'view')." },
      ],
      outputs: [
        { name: "stdout", schema: t("Text"), description: "Standard output from npm invocation." },
      ],
    },
    satisfies: ["npm-kg-distribution", "remote-mount", "package-release"],
    requires: { runtime: ["node"], network: true },
    remedies: [
      { host: "registry.npmjs.org", tool: "kg-retrieve-npm" },
      { host: "npm.pkg.github.com", tool: "kg-retrieve-npm" },
    ],
  }),
);
