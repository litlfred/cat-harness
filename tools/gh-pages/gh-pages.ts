import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── `gh-pages`: ONE way of performing `render-kg-to-cdn`.
//
// Owner, 2026-09-30: "make sure that gh-pages is one specific tool of
// general 'publish to CDN' as part of publication/staging process", and
// "tools can describe their own specific subprocesses if needed to not
// bog down general skills". So the general process names no GitHub step;
// this node carries the GitHub half, and its steps are a diagram in
// bootstrap-tools (below this harness, so the arrow points down).
//
// `manual`, honestly: the mechanism is that subprocess — stage with
// `site.ts`, deploy with the Pages workflow (or, for this repository's own
// site, `docs-site.yml` / `feature-staging.yml` pushing to the `gh-pages`
// branch), then report with bootstrap-tools' `pages-status.ts`. There is
// no single command that is all of it, and declaring one would assert
// machinery that is not there.
export default toolFactory((t) =>
  defineTool({
    id: "gh-pages",
    title: "GitHub Pages (gh-pages)",
    description:
      "Push a rendered Knowledge Graph to GitHub Pages at a publication root URL — a staging preview (`STAGING/<slug>/`) or the release root, the same steps either way — and report the push: a status (pushed, not pushed, could not determine) and one message carrying the commit merged onto `gh-pages` and the QA result. Its steps are bootstrap-tools' `render-kg-to-github-pages` process, which first provisions the target: an orphan `gh-pages` branch, then Pages switched on to serve it.",
    install: { none: true },
    invoke: { manual: true },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: true, description: "The instance root whose Knowledge Graph is rendered, or a tree a caller already rendered and verified." },
        { name: "url", schema: t("Url"), required: false, description: "The publication root URL. Default: the declaration's `iriBase`, else `https://<owner>.github.io/<repo>/`." },
        { name: "subgraph", schema: t("Slug"), required: false, description: "A declared directory id to render; repeatable. Absent: the whole graph." },
        { name: "sha", schema: t("CommitSha"), required: false, description: "The commit that is live: the commit on `gh-pages`." },
      ],
      outputs: [
        { name: "status", schema: t("Text"), description: "`pushed`, `not-pushed` or `could-not-determine` — never `pushed` over a check that could not look." },
        { name: "message", schema: t("Text"), description: "One line: the live commit, the root URL, and the QA of both what was staged and what is served." },
      ],
    },
    satisfies: ["render-kg-to-cdn"],
    // Its own subprocess (ruling 6, 2026-09-30), drawn in bootstrap-tools'
    // declared `processes/` — an instance this one needs, so the arrow points down.
    subprocesses: ["render-kg-to-github-pages"],
    selection: {
      when: "The CDN target is GitHub Pages: this repository's docs site and its review previews, and every instance whose declaration names a GitHub `repository`.",
      limits:
        "GitHub only. Pages cannot serve server-side redirects or custom headers, and a full-replace push to the `gh-pages` branch deletes what the build did not produce unless the caller restores it first (`docs-site-publish`, bean plj1). Another CDN is another Tool satisfying `render-kg-to-cdn`.",
      cost: "Free for a public repository: Pages and the Actions minutes its workflow uses. A deploy takes a minute or two to be served.",
    },
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "github.com", none: "Publishing IS a push to the gh-pages branch; there is no offline arm. To look at a page, build it locally with `bun run cat preview:site`." }],
  }),
);
