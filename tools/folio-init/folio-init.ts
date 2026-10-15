import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "folio-init",
    title: "Scaffold a folio",
    description:
      "Create a new folio repository that uses this platform — folio/, uploads/, library/, the first manifests, the builder shim, agent files, and the link back to the platform.",
    install: bundled,
    invoke: { ...inProcess("src/tools/folio-init.ts", "folio_init"), shell: "bun run cat init-folio" },
    io: {
      inputs: [
        { name: "title", schema: t("Text"), required: true, description: "The folio's human title." },
        {
          name: "authors",
          schema: t("Text"),
          required: true,
          repeated: true,
          description: "One entry per author. Repeated rather than a joined string: a name may contain the separator.",
        },
        { name: "content_type", schema: t("ContentType"), required: false, arg: { flag: "--content-type" } },
        { name: "slug", schema: t("Slug"), required: false, arg: { flag: "--slug" } },
        // `dir` and `assistant_path` are FilesystemPath, not RepoPath: a new
        // folio is created OUTSIDE this repository and `../folio-assistant`
        // is the ordinary sibling link. Neither is admissible as a
        // command-line word, which is why neither carries an `arg`.
        { name: "dir", schema: t("FilesystemPath"), required: false, description: "Where to create the folio." },
        { name: "link", schema: t("LinkMode"), required: false, arg: { flag: "--link" } },
        { name: "assistant_path", schema: t("FilesystemPath"), required: false, description: "Path to the platform checkout, for a sibling link." },
        { name: "force", schema: t("Flag"), required: false, arg: { flag: "--force" } },
        { name: "dry_run", schema: t("Flag"), required: false, arg: { flag: "--dry-run" } },
      ],
      outputs: [{ name: "report", schema: t("Markdown"), description: "What was written, or what would have been under --dry-run." }],
    },
    satisfies: ["repo-conversion", "getting-started"],
    requires: { network: false },
  }),
);
