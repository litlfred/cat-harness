import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Bean `ieum`, owner 2026-10-07: "mounting remote KG needs trusted
// provenance sources (digitally signed e.g. verifiable via GDHCN), or
// explicit user consent", and "staging doesnt need signature". This script
// had no Tool node until then, so no agent could find it as a tool.
export default toolFactory((t) =>
  defineTool({
    id: "remote-mount",
    title: "Mount remote harnesses at a pinned commit, only when trusted",
    description:
      "Lay down each declared remote mount — a `source.remote` instance in the root `index.config.json`, or, in a folio with no index, a `remoteMounts` entry on its declaration (both at once is refused) — and its dependency closure, from another repository at a full commit SHA. Write the lock, `index.lock.json` (a legacy `<name>.mount-lock.json` is read, and renamed onto it when rewritten), and, with an index, regenerate the root `.gitignore` block that ignores each mount path. It READS the declared mounts and never writes them: a tool that changes a mount writes through `writeDeclaredMounts` into `index.config.json`. Before anything is checked out, each mount must pass the trust gate (`schemas/mount-trust.ts`, rule H8): a person's consent recorded for THIS pin, or a signature in a declared trust network. No signature verifier exists yet, so a signature alone is could-not-determine and does not mount. Unsigned and unconsented is refused. `--staging` mounts for a preview and needs neither, by the owner's ruling. A directory id an override or `mountDefaults` names may be one the instance declares in its `<name>.json` or one it declares FROM WITHIN a declared directory (`skills/skills.json` naming `voices`), resolved at the pin through `instanceDirectories` (bean `mo75` G3); an id in neither is refused at plan time. A `hydrated` mount (bean `mo75`) lays each chosen directory down as its published `index.hydrated.jsonld` only: read from the pin's git tree when a commit carries it, otherwise fetched from the pin's subgraph index package (the `subgraph-index-<sha>` release asset `subgraph-index-package` publishes), its tarball checked against its `folio-binary-release/v1` record, its manifest against the repository, pin and harness asked for, and each file against its sha256, `SubgraphHydratedSchema` and the subgraph IRI; the lock records the package's URL and sha256 so a replay fetches the same bytes. `--check` compares the disk against the lock and never fetches. When a run CHANGES the lock, it then re-renders the agent surface (`skill:commands` → `.claude/commands/`, `agent-memory` → `.claude/agent-memory/` and `.agents/`) from the checkout root, so a re-pin commit carries the skills and memory the new layers define; a generator that fails fails the run, and `--no-agent-surface` opts out.",
    install: { none: true },
    invoke: { shell: "bun run cat mount:remote" },
    io: {
      inputs: [
        { name: "instance", schema: t("RepoPath"), required: false, arg: { flag: "--instance" }, description: "The downstream instance root; omitted, every declaring instance in the checkout." },
        { name: "staging", schema: t("Flag"), required: false, arg: { flag: "--staging" }, description: "Mount for a staging preview: no signature or consent required." },
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare the disk against the lock; fetch nothing." },
        { name: "noAgentSurface", schema: t("Flag"), required: false, arg: { flag: "--no-agent-surface" }, description: "Do not re-render `.claude/commands/` and the agent memory after a mount that changed the lock." },
        { name: "noInstall", schema: t("Flag"), required: false, arg: { flag: "--no-install" }, description: "Lay the pinned bytes down without `bun install` in each mounted instance that carries a `package.json`. By default the install runs (`--production`; `--install-all` keeps devDependencies), so the mounted tools run; it writes only `node_modules/`, which no mount digest covers, so `--check` still passes." },
        { name: "seed", schema: t("MountSeed"), required: false, arg: { flag: "--seed" }, description: "`<name>=<owner/repo>@<40-char sha>`: create or re-pin that remote instance in `index.config.json` instead of mounting, writing its `trust.consent` for that pin in the same write (needs `consentBy` and `evidence`; repeatable; `--whole` mounts every tracked file)." },
        { name: "consentBy", schema: t("Login"), required: false, arg: { flag: "--consent-by" }, description: "With `seed`: who consented, as `consent.by`." },
        { name: "evidence", schema: t("Text"), required: false, arg: { stdin: true }, description: "With `seed`: where the consent was given, readable (a session, an issue comment), as `consent.evidence`. On stdin because it is free prose: it quotes what was said." },
      ],
      outputs: [
        { name: "outcomes", schema: t("Count"), description: "Per instance: mounted, local, skipped, missing (including refused by the trust gate) or could-not-determine." },
      ],
    },
    satisfies: ["security", "agent-memory"],
    requires: { runtime: ["bun", "git", "curl", "tar"], network: true },
    remedies: [{ host: "github.com", none: "A remote mount IS a fetch of another repository at a pin; offline there is nothing to mount. `--check` still reports the lock without the network." }],
  }),
);
