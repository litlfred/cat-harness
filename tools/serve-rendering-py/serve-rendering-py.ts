import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "serve-rendering-py",
    title: "Local rendering server (Python)",
    description:
      "Serve an instance's renderings over local HTTP with their declared media types using Python 3 standard library. The publication host wherever GitHub Pages is absent, and the only host that can enforce `application/ld+json` at all.",
    install: { none: true },
    invoke: { shell: "bun run cat serve:rendering:py" },
    io: {
      inputs: [
        { name: "directory", schema: t("RepoPath"), required: false, arg: { flag: "--dir" }, description: "Tree to serve; defaults to the built site when present." },
        { name: "port", schema: t("Port"), required: false, arg: { flag: "--port" }, description: "0 binds a free port, which is what the tests use." },
      ],
      outputs: [{ name: "url", schema: t("Url"), description: "Where the tree is being served.", render: { as: "url", reason: "a reader opens it; the scheme is checked before it reaches an href" } }],
    },
    satisfies: ["serving-renderings"],
    selection: {
      when: "Serving renderings in a Python runtime environment without requiring Bun or Node.",
      limits: "Requires Python 3. For Bun runtime environments, use `serve-rendering`.",
      cost: "Zero external dependencies beyond standard library Python 3.",
    },
    requires: { runtime: ["python3"], network: false },
  }),
);
