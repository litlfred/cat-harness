import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Owner, 2026-10-07: "go ahead and start the migration NOW to
// index.config.json". The converter is kept rather than run once, because
// each separated repository needs the same conversion. It writes mounts, so
// it is a Tool node beside the one that reads them.
export default toolFactory((t) =>
  defineTool({
    id: "index-config-migrate",
    title: "Convert a checkout to a root index.config.json",
    description:
      "Write the root `index.config.json` (`folio-index-config/v1`) that says which instances the checkout instantiates, where each comes from (`source.local` or `source.remote`) and which owns `/` (`site.landing`), from the root `*.config.json` files and the declaration's `remoteMounts`. With `--write` it moves `remoteMounts` off the declaration into `source.remote` entries, writes the generated `.gitignore` block, and renames a legacy `<name>.mount-lock.json` to `index.lock.json`. Without a flag it prints the index it would write. Idempotent: a re-run merges what the declaration gained, and refuses an entry the index already holds differently. A root config naming no instance is reported as `unmatched-config` and not imported, because what to do with it is a person's decision.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/index-config-migrate.ts" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "The checkout to convert; omitted, this one." },
        { name: "write", schema: t("Flag"), required: false, arg: { flag: "--write" }, description: "Write the index, move the mounts, write the ignore block and rename the lock." },
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Exit 1 when --write would change anything; write nothing." },
      ],
      outputs: [
        { name: "findings", schema: t("Count"), description: "The index it would write or wrote, and each finding (`unmatched-config`, `unreadable-config`, `landing-undetermined`). Exit 0 written, up to date or planned; 1 stale under --check; 2 could not convert." },
      ],
    },
    satisfies: ["index-config", "remote-mount"],
    requires: { runtime: ["bun"], network: false },
  }),
);
