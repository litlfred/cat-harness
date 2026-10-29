import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// Bean `3tza`, owner ruling 2 (2026-10-06): stage 11 of `sub-kg-lifecycle`
// ("Verify on a fresh clone") is a command, as `seed:ready` became one.
export default toolFactory((t) =>
  defineTool({
    id: "sub-kg-verify-clone",
    title: "Verify a separated repository from a fresh clone",
    description:
      "Clone a separated sub-KG's repository (with submodules, and any sibling checkouts it needs) into an empty scratch directory, install, and run its gates: its `gates` script, else its `test` script (a person may pass `--gate` on the command line instead; it is not part of this contract because it is a shell command). Reports `green`, `red` or `unknown`; an empty tree, a failed clone or a repository with no gate is `unknown`, never green. Catches what a rehearsal inside this checkout cannot, because a rehearsal shares this checkout's `node_modules` and environment (#2082). Writes only inside the scratch directory.",
    install: { none: true },
    invoke: { shell: "bun run cat sub-kg:verify-clone" },
    io: {
      inputs: [
        { name: "repo", schema: t("RepoFullName"), required: true, arg: { flag: "--repo" }, description: "The separated repository, `owner/name`. (The script also takes a git URL or a local path, for tests.)" },
        { name: "ref", schema: t("Branch"), required: false, arg: { flag: "--ref" }, description: "The branch or tag to clone, e.g. the seeding PR's branch." },
        { name: "sibling", schema: t("RepoFullName"), required: false, arg: { flag: "--sibling" }, description: "A repository to clone beside it, for a platform linked as a sibling checkout. Repeatable." },
        { name: "work", schema: t("RepoPath"), required: false, arg: { flag: "--work" }, description: "Scratch directory, kept afterwards. Absent: a temporary directory, removed afterwards." },
        { name: "text", schema: t("Flag"), required: false, arg: { flag: "--text" }, description: "A report for a person instead of JSON." },
      ],
      outputs: [
        { name: "report", schema: t("Text"), description: "`sub-kg-verify-clone/v1`: the commit cloned, each step with its status and output tail, and the verdict. Exit 0 green, 1 red, 2 unknown." },
      ],
    },
    satisfies: ["sub-kg-lifecycle"],
    selection: {
      when: "After a sub-KG's staged contents are seeded into its new repository and re-pointed, before asking the owner about the cutover.",
      limits: "Runs the repository's own gates as written; a gate that needs credentials or a service the clone cannot reach fails as it would for any new contributor.",
      cost: "A clone plus an install plus the gates: minutes for a small repository.",
    },
    requires: { runtime: ["bun", "git"], network: true },
    remedies: [{ host: "github.com", none: "It verifies a clone of the new repository; with GitHub refused there is nothing to clone." }],
  }),
);
