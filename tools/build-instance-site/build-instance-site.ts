import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Owner, 2026-10-10: publishing is agent-run, never a GitHub Actions
// workflow, and staging previews are agent-run too (bean `n3h9`). The
// recipe lived only as prose in a publish Routine's prompt; this is it as
// one Tool, the same for an agent, a person or a Routine.
export default toolFactory((t) =>
  defineTool({
    id: "build-instance-site",
    title: "Build, check and (on request) publish an instance's own site, or a STAGING/<branch> preview",
    description:
      "From a checkout whose layers arrive by remote mount: mount the pinned closure, install, run the instance's own gates (`--pre`), compose the harness chrome for THIS instance, run its source steps, build with Jekyll at the base path read from the git remote (`/<repo>`, or `/<repo>/STAGING/<branch>` for a preview), run the post-build steps (mount-instance-docs, pdf-viewer, set-html-lang, publish-id-lookup, rail-standalone-pages), and check that every relative or base-rooted link in every page resolves to a file under the site, reading each page with an HTML parser. Any failing step stops the run; a link that does not resolve means nothing is published. It never decides to publish: only `--publish` does, and then a root publish keeps `STAGING/` and `_render-log/` on the branch, and a preview replaces only its own `STAGING/<branch>/`.",
    install: { none: true },
    invoke: { shell: "bun run cat site:instance" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "The instance checkout (holds `index.config.json`). Default: the working directory." },
        { name: "instance", schema: t("Slug"), required: true, arg: { flag: "--instance" }, description: "The declared instance name; must match the checkout's declaration." },
        { name: "home", schema: t("RepoPath"), required: false, arg: { flag: "--home" }, description: "A page that becomes the site's index.md." },
        { name: "pre", schema: t("ScriptName"), required: false, arg: { flag: "--pre" }, description: "A package script to run in the checkout first, as `bun run <name>` (repeatable): the instance's own gates. Any non-zero exit stops the build." },
        { name: "sourceStep", schema: t("ScriptName"), required: false, arg: { flag: "--source-step" }, description: "A package script that writes into the site source, run as `bun run <name> <site source>` (repeatable)." },
        { name: "siteStep", schema: t("ScriptName"), required: false, arg: { flag: "--site-step" }, description: "A package script that writes finished pages into the BUILT site, run as `bun run <name> <built site>` after Jekyll (repeatable): Jekyll drops `_`-prefixed directories, so a generator whose pages sit under one runs here." },
        { name: "staging", schema: t("Branch"), required: false, arg: { flag: "--staging" }, description: "Build (and with --publish, publish) a preview of this branch at STAGING/<branch>/." },
        { name: "noMount", schema: t("Flag"), required: false, arg: { flag: "--no-mount" }, description: "Use the mounts already on disk." },
        { name: "publish", schema: t("Flag"), required: false, arg: { flag: "--publish" }, description: "Publish after every check passes; needs --remote." },
        { name: "remote", schema: t("Url"), required: false, arg: { flag: "--remote" }, description: "The https git URL the caller can push the pages branch to." },
      ],
      outputs: [
        { name: "site", schema: t("RepoPath"), description: "The built site directory, and its base path." },
        { name: "links", schema: t("Count"), description: "Pages checked, unresolved links (must be 0), files." },
      ],
    },
    satisfies: ["deployment-awareness", "remote-mount"],
    selection: {
      when: "Publishing an instance's site, or a branch preview of it, from an agent or a Routine: the agent-run replacement for a pages workflow.",
      limits:
        "Instance sites only. A FHIR IG's site (the IG pipeline layer's `stage-ig-sites`) is not built here yet; it needs the IG's FHIR packages, which some environments cannot reach (bean `53rv`).",
      cost: "A full mount, install and Jekyll build: minutes, not seconds. `--no-mount` reuses what is on disk.",
    },
    requires: { runtime: ["bun", "git", "ruby"], network: true },
    remedies: [{ host: "github.com", none: "The mount and the publish both need the git host; offline, `--no-mount` still builds and checks from what is on disk." }],
  }),
);
