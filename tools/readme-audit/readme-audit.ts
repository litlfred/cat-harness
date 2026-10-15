import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "readme-audit",
    title: "Audit README links",
    description:
      "Verify every Markdown link in a folio's README still resolves — relative paths against the tree, repo refs against a real ls-tree, Pages URLs against the publish ref. Writes nothing.",
    install: bundled,
    invoke: { ...inProcess("src/tools/readme-audit.ts", "readme_audit"), shell: "bun run cat readme:audit" },
    io: {
      inputs: [
        { name: "file", schema: t("RepoPath"), required: false, arg: { positional: 0 }, description: "The file to audit; the README by default." },
        { name: "fetch", schema: t("Flag"), required: false, arg: { flag: "--fetch" }, description: "Also dereference external URLs." },
        { name: "dir", schema: t("FilesystemPath"), required: false, description: "The folio root, when not the working directory." },
      ],
      outputs: [
        {
          name: "findings",
          schema: t("Markdown"),
          description: "Resolved, dead, or NOT CHECKED — the third state is never rendered as either of the other two.",
        },
      ],
    },
    satisfies: ["docs-generation"],
    requires: { network: false },
  }),
);
