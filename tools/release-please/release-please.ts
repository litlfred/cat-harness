import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

/* ── AUDIO TRANSCRIPTION — OPTIONS, DECLARED AND NOT MATERIALIZED ──────
 *
 * Bean `r279`. Owner, 2026-09-23, asked which speech-to-text backend to
 * adopt: *"describe options as Tools fulfilling task but dont need to
 * materialize"*. So the three candidates are declared as Tool nodes —
 * substitutable siblings, each with when/limits/cost — and NONE is in
 * `schemas/python-deps.ts`, `requirements.txt` or CI. There is no audio in
 * `uploads/` or `library/` to transcribe (measured 2026-09-20 and still
 * true); choosing one and installing it is `1r0p`'s first step when the
 * first recording arrives. `install.cli` says how, and is not run. */
// `package-release` (bean `v7bg`, owner 2026-09-24: "Yes, general skill").
// Two mechanisms for the same four steps. release-please is DECLARED, not
// configured here: `.github/workflows/release-please.yml` is dispatch-only
// with no config and zero tags (bean `frq2`), so this node says what it
// would do and what it needs, and claims no release it has made.
export default toolFactory((t) =>
  defineTool({
    id: "release-please",
    title: "release-please (declared, not configured here)",
    description:
      "Propose the next version of each package from conventional-commit messages, open a release PR with the CHANGELOG and version bump, and — when that PR is merged — create the tag and GitHub release. Does not publish to a registry. Declared here, not configured: no config file and no tag exist in this repository (bean `frq2`).",
    install: { cli: "npm install -g release-please (or the GitHub Action googleapis/release-please-action@v4)" },
    invoke: { shell: "release-please release-pr" },
    requires: { runtime: ["node", "release-please"], network: true },
    remedies: [
      { host: "api.github.com", none: "It opens release pull requests on GitHub." },
      { host: "registry.npmjs.org", none: "It installs from npm; no other source is declared." },
    ],
    // The same I/O as `package-release-manual`, stated at the level of the
    // RELEASE (owner, 2026-09-30: "Align I/O, pair"): a package in, its tag
    // out. So `deriveAlternatives` pairs the two (#1168, B9a). The release PR
    // is this mechanism's intermediate step — merging it creates the tag —
    // and the config file is its own setup, in `selection.limits`.
    io: {
      inputs: [
        { name: "package", schema: t("PackageName"), required: true, description: "The package being released. release-please proposes every package it is configured for; this is the one whose tag is wanted." },
        { name: "repo", schema: t("RepoFullName"), required: false, arg: { flag: "--repo-url" }, description: "owner/name of the repository the release is made in; the current one when absent." },
      ],
      outputs: [{ name: "tag", schema: t("Text"), description: "The tag created when the release PR merges, `<package>-v<version>`." }],
    },
    satisfies: ["package-release"],
    selection: {
      when:
        "A repository whose commits follow conventional-commit messages and that releases often enough that doing it by hand is the bottleneck. Several packages in one repository, each with its own tag, is its strength.",
      limits:
        "The bump comes from commit MESSAGES, not from what changed: a `feat:` that removed something gives a minor bump. Check it against the surface diff (skill step 1). With the default token it cannot open PRs unless the repository allows Actions to (bean `frq2`). It needs a config file (`--config-file`); a missing one falls back to defaults that find nothing. The tag appears only when its release PR is merged.",
      cost: "Not configured here. One config file and one manifest per repository; each run is a few seconds of API calls.",
    },
  }),
);
