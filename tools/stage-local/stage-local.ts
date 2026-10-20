import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── An IG repository's own site: two Tools, one pair of skills ─────────
//
// Owner, 2026-10-14: "It is up to a human or an agent whether to use a tool
// or not ... Multiple tools can implement the same skill." Both Tools below
// publish an IG repository's own Pages site wearing the harness chrome
// (`harness-tiles`) as a staging or main publish (`feature-staging`). They
// are NOT derived alternatives: their I/O differs (stage-local takes a
// checkout and plan/dry-run flags; the workflow takes a repository and a
// ref), so `deriveAlternatives` keeps them apart, and each says in its
// `selection` when it is the one to reach for.
//
// `stage-local` is the ONE agent publish path (owner, 2026-10-10: "one
// consolidated workflow"; bean n3h9), and until now it had no node: the
// `feature-staging` skill described it and nothing in the graph ran it.
// Owner, 2026-10-14, decision "1": its IG route now applies the chrome.
export default toolFactory((t) =>
  defineTool({
    id: "stage-local",
    title: "Publish a folio's or an IG's site from the agent's own checkout — the one agent publish path",
    description:
      "Build a repository's site in the agent's checkout and push it to the publish branch, as a preview or as the main site, without an Actions runner. Which build is read from the repository: a declared `site.build` recipe (built by `build-instance-site`), else the reusable workflow its own workflow files call — `folio-staging.yml` for a folio, the WHO SMART Base IG's `ghbuild.yml` for a FHIR IG, whose `build` job is planned step by step and run as written. For an IG it then applies the harness chrome over the built output (`sync-docs-harness`, then `rail-standalone-pages --foreign-site --instance <the IG>`): every page gains the rail and the icon row `#fa-navbar-row`, and the IG's own content is left byte for byte. A root publish is REFUSED when the chrome cannot be applied, and a clean root deploy is refused over any root whose `index.html` wears the icon row unless the new output does too, so a chromed root is never replaced by bare IG Publisher pages. Every run prints its plan first, and the plan lists the chrome step; `--plan` stops there, `--dry-run` composes the commit in a temporary worktree and pushes nothing, `--artifact` writes a claude.ai Artifact bundle instead.",
    install: { none: true },
    invoke: { shell: "bun run cat stage:local" },
    io: {
      inputs: [
        { name: "repo", schema: t("RepoPath"), required: false, arg: { flag: "--repo" }, description: "The checkout to publish, with the platform's layers mounted at its root. Default: the working directory." },
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--branch" }, description: "The branch to publish. Default: the checkout's. The default branch publishes the main site; any other a preview." },
        { name: "base", schema: t("Branch"), required: false, arg: { flag: "--base" }, description: "A folio preview's base branch, for its ChangeSet and rendered impact." },
        { name: "main", schema: t("Flag"), required: false, arg: { flag: "--main" }, description: "Publish the main site at the root. Implied on the default branch, refused off it." },
        { name: "plan", schema: t("Flag"), required: false, arg: { flag: "--plan" }, description: "Print what would be built and where, every step named, and stop." },
        { name: "dryRun", schema: t("Flag"), required: false, arg: { flag: "--dry-run" }, description: "Build and compose the commit in a temporary publish-branch worktree; push nothing." },
        { name: "artifact", schema: t("RepoPath"), required: false, arg: { flag: "--artifact" }, description: "Write a claude.ai Artifact bundle here instead of pushing." },
        { name: "workflowSource", schema: t("RepoPath"), required: false, arg: { flag: "--workflow-source" }, description: "An IG: read the reusable workflow from this local checkout instead of fetching it at the ref its caller names." },
        { name: "publisher", schema: t("Slug"), required: false, arg: { flag: "--publisher" }, description: "`folio` or `ig`, when the repository's workflows call both (the folio by default)." },
        { name: "runUrl", schema: t("Url"), required: false, arg: { flag: "--run-url" }, description: "What the commit and render log name as the run. Default: the commit's URL." },
      ],
      outputs: [
        { name: "url", schema: t("Url"), description: "Where the site is served once GitHub's Pages deploy has run, with the commit pushed (or, with --dry-run, the commit composed and discarded).", render: { as: "url", reason: "a reader opens the published site; the scheme is checked before it reaches an href" } },
      ],
    },
    satisfies: ["feature-staging", "harness-tiles"],
    selection: {
      when: "Every agent-run publish of a folio's or an IG's site, preview or main: it is what the current build pipeline uses (the IG repositories' `site-publish.yml` run this same command on a runner).",
      limits:
        "An IG repository's main site is built from its AST, read from the cache branch fhir-harness's `ig-ast-refresh` keeps current, by the steps its `site.build` recipe declares (`profile: ig-repo-site`): the theme side bar and search, the harness rail and icon row, the served directories and the `folio-build.json` stamp, measured against the live root (https://github.com/litlfred/cat-harness-tools/pull/202). A stale AST is refused, never built from Publisher HTML. A root publish is refused when the composed site lacks anything the current root has (`site-parity`), judged on the pages. Without a `site.build` recipe an IG falls back to its own workflow's Publisher steps, which need a Docker daemon and give the rail and icon row only.",
      cost: "An IG: the whole IG Publisher build (tens of minutes), then about two minutes of rail over ~3,600 pages. A folio: its build command. Then one push, and GitHub's own Pages deploy.",
    },
    requires: { runtime: ["bun", "git"], network: true },
    remedies: [{ host: "github.com", none: "The publish is a push to the repository's publish branch; offline, `--plan` and `--dry-run` still say and build what would be published." }],
  }),
);
