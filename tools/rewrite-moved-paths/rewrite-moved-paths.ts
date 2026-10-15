import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// The 70lx sweep's rewrite rule, as a Tool (owner, 2026-10-10: "any
// generalizations to add to skills/can we reuse in future subgraph
// separation?"). Skill `kg-separation` §"After a move lands".
export default toolFactory((t) =>
  defineTool({
    id: "rewrite-moved-paths",
    title: "Rewrite paths that still name a moved file's old layer — never in a record",
    description:
      "After a move between two layers lands, find every mention `<from>/<prefix>/<rest>` in the scanned tree's tracked files and rewrite it to `<to>/<prefix>/<rest>` only when the file exists under the destination root and not under the source root. Records are never read: beans, todos, memory, proposals, wireframes, QA results, upstream pins, vocab mappings, provenance figures and terminologies, and test fixtures (`DEFAULT_RECORD_GLOBS`; the CLI's `--keep <glob>` adds more, generated trees among them, which their generators rewrite — a glob is not a shell-safe argument type, so it is not a declared input). Reports by default with file and line; `--write` applies; `--check` exits 1 while a rewrite is owed.",
    install: { none: true },
    invoke: { shell: "bun run cat paths:rewrite-moved" },
    io: {
      inputs: [
        { name: "fromName", schema: t("Slug"), required: true, arg: { flag: "--from-name" }, description: "The moved files' old layer, as paths spell it (e.g. the harness)." },
        { name: "fromRoot", schema: t("RepoPath"), required: true, arg: { flag: "--from-root" }, description: "That layer's root on disk." },
        { name: "toName", schema: t("Slug"), required: true, arg: { flag: "--to-name" }, description: "The layer the files moved to." },
        { name: "toRoot", schema: t("RepoPath"), required: true, arg: { flag: "--to-root" }, description: "That layer's root on disk." },
        { name: "prefix", schema: t("RepoPath"), required: true, arg: { flag: "--prefix" }, description: "A moved directory, repeatable (e.g. `scripts`, `pipeline`)." },
        { name: "scan", schema: t("RepoPath"), required: false, arg: { flag: "--scan" }, description: "The git checkout whose tracked files are read; default the source root." },
        { name: "write", schema: t("Flag"), required: false, arg: { flag: "--write" }, description: "Apply the rewrites." },
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Exit 1 while any rewrite is owed; write nothing." },
      ],
      outputs: [
        { name: "rewrites", schema: t("Count"), description: "Rewrites made or owed, each with file and line; mentions left alone; record files not read." },
      ],
    },
    satisfies: ["kg-separation"],
    requires: { runtime: ["bun", "git"], network: false },
  }),
);
