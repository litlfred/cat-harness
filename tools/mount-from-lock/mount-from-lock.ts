import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// `mount-from-lock.ts` had no Tool node, so the one step every CI job and
// every folio's staging build runs FIRST was invisible to an agent looking
// for tooling — and when the cat-harness cutover (2026-10-09) took it out
// of the parent's tree, every job failed at that step with nothing to say
// what the step was (skill `kg-separation`, lessons 16–17).
export default toolFactory((t) =>
  defineTool({
    id: "mount-from-lock",
    title: "Replay a committed mount lock with nothing but Node",
    description:
      "Lay down every remote mount `index.lock.json` records — each instance fetched at the lock's full SHA (sparse, blob-filtered), each directory verified against its `treeDigest`, a mismatch undone and reported — importing only `node:*`, so it runs on a fresh clone before any layer is present. It never decides what to mount: `remote-mount` writes the lock (and checks trust); this only replays it. Refuses to write over a path with tracked files or bytes that no longer hash to the lock. Exit 0 mounted/current, 1 missing, 2 could-not-determine.",
    install: { none: true },
    invoke: { shell: "bun run cat mount:lock" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "The instance root whose lock is replayed. Default: the working directory." },
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "No network: is every locked mount on disk and intact?" },
      ],
      outputs: [
        { name: "outcomes", schema: t("Count"), description: "Per instance: mounted, current, missing or could-not-determine." },
      ],
    },
    satisfies: ["remote-mount", "kg-separation"],
    selection: {
      when: "First step of a CI job or session on a checkout whose layers arrive by remote mount, after the lock is committed.",
      limits:
        "It lives in cat-harness, which is itself a mounted layer once separated, so it cannot bootstrap a checkout that does not already hold cat-harness. The parent must carry its own dependency-free entry point that fetches this script at the pin (folio-assistant's `.github/mount-from-lock.sh`, #2518) — never call this path directly from a workflow in a repository that mounts cat-harness.",
      cost: "One shallow, blob-filtered fetch per locked instance; a few seconds each. `--check` needs no network.",
    },
    requires: { runtime: ["bun", "git"], network: true },
    remedies: [{ host: "github.com", none: "Replaying a lock IS fetching the pinned repositories; offline, `--check` still reports what is on disk." }],
  }),
);
