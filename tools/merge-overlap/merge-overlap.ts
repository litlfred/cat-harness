import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "merge-overlap",
    title: "Merge overlap (conflict prediction)",
    description:
      "For the open PRs (via `gh`, or a list of branches), report which pairs would conflict: pairwise overlap on AUTHORED paths, with generated paths excluded using the merge-conflict-patterns declaration; which PRs touch a shared declaration (an instance's `<instance>.json`, `roles.json`, `package.json`, `bun.lock`, schemas, BPMN/DMN); and which touch the harness layer's directory or its tools layer's. A PR that could not be measured makes no pair independent. JSON (`merge-overlap/v1`), the conflict-prediction input for composing trains.",
    install: { none: true },
    invoke: { shell: "bun run cat merge:overlap" },
    io: {
      inputs: [
        { name: "base", schema: t("Branch"), required: false, arg: { flag: "--base" }, description: "The base each PR is diffed against from its fork point; default `origin/main`." },
        { name: "branches", schema: t("Branch"), required: false, repeated: true, arg: { positional: 0 }, description: "Branches to compare instead of the open PRs; with none, the open PRs come from `gh`." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "`merge-overlap/v1` on stdout: per member `authored_paths`, `region_paths`, `touches_shared`, the two harness flags; every pair that is not independent, with why." }],
    },
    satisfies: ["merge-conflict-patterns", "coordinate"],
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "github.com", none: "It compares the remote's open pull requests." }],
    selection: {
      when: "Before composing a merge train, and whenever deciding which PRs can land together or must be ordered.",
      limits: "Paths, not semantics (requirements T3): two PRs that change different files can still interact, which the shared-declaration list only partly covers. A README counts as authored when its prose changed, as a region when only generated regions did.",
      cost: "One REST listing (`gh api …/pulls`; not `gh pr list`, which is GraphQL) and one `git fetch` of every open head, then a `git diff --name-only` per PR. No working tree is touched.",
    },
  }),
);
