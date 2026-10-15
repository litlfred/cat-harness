import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Bean `ieum`, owner 2026-10-07: "when published, make it unpinned on
// staging". Pins third-party actions in every workflow but the declared
// staging-only ones; `security-gate` blocks on what it leaves unpinned.
export default toolFactory((t) =>
  defineTool({
    id: "pin-actions",
    title: "Pin third-party GitHub Actions to full commit SHAs",
    description:
      "Rewrite every third-party `uses: owner/repo@ref` outside the declared staging-only workflows to `@<full commit SHA> # <ref>`, so Dependabot keeps the pair current. A tag resolves to its PEELED commit (an annotated tag's object is never pinned), else a branch head, by `git ls-remote` with argv. A ref that resolves to nothing, or to more than one commit, is refused and reported, never guessed. This repository's own reusable workflows are first-party and left alone. Idempotent.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/pin-actions.ts" },
    io: {
      inputs: [
        { name: "dry-run", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Report what would be pinned and write nothing." },
      ],
      outputs: [
        { name: "pinned", schema: t("Count"), description: "uses: lines pinned, per workflow, with every refused ref named; exit 1 when any is refused." },
      ],
    },
    satisfies: ["security"],
    requires: { runtime: ["bun", "git"], network: true },
    remedies: [{ host: "github.com", none: "A SHA is read from the action's own repository; offline there is nothing to resolve against. `security-gate` still reports what is unpinned without the network." }],
  }),
);
