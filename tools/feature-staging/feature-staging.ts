import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The preview host: one STAGING/<slug> per open pull request ─────────
//
// Tier A of `tools:coverage` on the strength of a `serviceTask` naming the
// skill, and the workflow IS the whole of what `feature-staging.md` claims —
// "branch creation, staging deployment, commit SHA stamping, and cleanup".
// So `satisfies` is one skill and nothing is stretched to fit.
//
// A node over a workflow rather than a script, on the `pages-publish`
// precedent: the mechanism genuinely is the workflow. It holds the gh-pages
// checkout, the retry and the concurrency group, and a second pusher racing
// those is how a deploy gets lost.
export default toolFactory((t) =>
  defineTool({
    id: "feature-staging",
    title: "Stage a branch's preview",
    description:
      "Publish a branch's built site to `STAGING/<slug>/` on the publish branch, so a reviewer compares a rendered before and after rather than a description of one. Stamps the commit SHA, and removes the preview when its pull request closes.",
    install: { none: true },
    invoke: { shell: ".github/workflows/feature-staging.yml" },
    io: {
      inputs: [
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--branch" }, description: "The branch to stage; blank stages the current one. On a pull request the workflow fires by itself and needs none of these." },
        // The two below are a DELETION trigger, and the node says so where a
        // caller reads it rather than only in the workflow's comments.
        { name: "cleanup_slug", schema: t("Slug"), required: false, arg: { flag: "--cleanup-slug" }, description: "DELETION: the `STAGING/<slug>` to remove, instead of staging anything. It exists because the label path cannot reach the previews the health sweep reports — being findable as an orphan REQUIRES the pull request to be closed, so the close event has already fired with no label (bean `w2g5`)." },
        { name: "cleanup_confirm", schema: t("Slug"), required: false, arg: { flag: "--cleanup-confirm" }, description: "The slug again, exactly. Anything else refuses. A confirmation therefore cannot be carried over from a previous run against a DIFFERENT preview, which a boolean would have allowed." },
      ],
      outputs: [{ name: "preview", schema: t("Url"), description: "Where the preview is served. A reviewer cannot assess a rendered artefact from a description of it, which is what this URL is for.", render: { as: "url", reason: "a reviewer opens the preview; the scheme is checked before it reaches an href" } }],
    },
    satisfies: ["feature-staging"],
    requires: { network: true },
    remedies: [{ host: "github.com", none: "It is a GitHub Actions workflow; to look at a branch's pages locally, use `bun run cat preview:site`." }],
    selection: {
      when:
        "On a pull request touching the docs, schemas, content or skills it fires on its own — reach for the dispatch arm only to stage a branch that has no open pull request, or to remove a preview the close event could not reach.",
      limits:
        "The removal arm is guarded THREE ways, and the guards are the point rather than ceremony: `workflow_dispatch` is available only to an actor with write access; `cleanup_confirm` must repeat the slug exactly; and the removal is preflighted at removal time against the same liveness signals the health sweep uses. That is `deletion-requires-confirmation` applied to the tool most able to break it — bean `plj1` is a workflow whose shape deleted every open pull request's preview without anybody deciding it. This node does not claim that skill, because implementing the discipline once is not the same as stating it.",
      cost: "A full site build plus a push to the publish branch. Concurrency is keyed on the branch or the cleanup slug, NOT the shared ref, so two cleanups of different previews no longer cancel each other (bean `xd1s`).",
    },
  }),
);
