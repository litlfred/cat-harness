import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The other publication host ────────────────────────────────────────
//
// `pages-publish` above is one value of the `publication host` axis in
// `docs/proposals/deployment-topologies.md`. Four topologies in #363 do
// not have it at all — local git only, private repo, developer and
// self-sovereign — and before this node they had no publication
// mechanism, only a skill saying what one would have to do.
//
// TWO tools satisfy `serving-renderings` (discharging bean `0hi8` Done-when
// item 2: "at least two tools satisfy it, because one is an assertion and
// two is a demonstration"):
// 1. `serve-rendering` (Bun / TypeScript)
// 2. `serve-rendering-py` (Python 3 standard library)
//
// Both conform to `skills/requirements/serving-a-rendering.json` and share
// the same signature, so they are derived alternatives with explicit
// `selection` records.
export default toolFactory((t) =>
  defineTool({
    id: "serve-rendering",
    title: "Local rendering server",
    description:
      "Serve an instance's renderings over local HTTP with their declared media types. The publication host wherever GitHub Pages is absent, and the only host that can enforce `application/ld+json` at all.",
    install: { none: true },
    invoke: { shell: "bun run cat serve:rendering" },
    io: {
      inputs: [
        { name: "directory", schema: t("RepoPath"), required: false, arg: { flag: "--dir" }, description: "Tree to serve; defaults to the built site when present." },
        { name: "port", schema: t("Port"), required: false, arg: { flag: "--port" }, description: "0 binds a free port, which is what the tests use." },
      ],
      outputs: [{ name: "url", schema: t("Url"), description: "Where the tree is being served.", render: { as: "url", reason: "a reader opens it; the scheme is checked before it reaches an href" } }],
    },
    satisfies: ["serving-renderings"],
    selection: {
      when: "Serving renderings in a Bun / JavaScript / TypeScript runtime environment.",
      limits: "Requires Bun runtime. For Python-only environments without Bun, use `serve-rendering-py`.",
      cost: "Zero install cost when Bun is already present.",
    },
    // No network: it BINDS one, it does not reach out. `requires.network`
    // means "needs egress", and conflating the two would mark this
    // unavailable on exactly the air-gapped topology it exists for.
    requires: { runtime: ["bun"], network: false },
  }),
);
