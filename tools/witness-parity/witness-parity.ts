import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Story T4 of the qou tools migration: before a producer is declared as a
// Tool whose output is a witness node, this checks that running it really
// yields that node.
export default toolFactory((t) =>
  defineTool({
    id: "witness-parity",
    title: "Witness reproduction check",
    description:
      "Re-run a computation witness's producer and say whether it reproduces the committed witness. Reads the command from `invocation.reproduce` (else `python3 <scriptFile>`) and the recorded package versions from `environment`; on a version mismatch it stops at `unknown`, since a different environment is not a reproduction test. Otherwise it runs the COMMITTED producer in a scratch git worktree, so the folio's own checkout is never written, and compares the result with the committed witness with run-specific fields (commit, timing, environment) masked at every depth. `pass`, `fail` (with the differing JSON paths), or `unknown` (mismatch, non-zero exit, timeout, no witness written).",
    install: { none: true },
    invoke: { shell: "bun run cat witness:parity" },
    io: {
      inputs: [
        { name: "witness", schema: t("RepoPath"), required: true, description: "One or more `*.witness.json` paths, committed at HEAD." },
        { name: "timeout", schema: t("Count"), required: false, arg: { flag: "--timeout" }, description: "Seconds before a run counts as `unknown`. Default 300." },
        { name: "force", schema: t("Flag"), required: false, arg: { flag: "--force" }, description: "Run despite an environment mismatch; the verdict is then marked advisory." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Machine-readable output." },
      ],
      outputs: [
        { name: "verdicts", schema: t("Text"), description: "One line per witness: pass, fail or unknown, with the reason, any environment mismatch and the differing paths. Exit 1 when any witness fails; `unknown` alone exits 0." },
      ],
    },
    satisfies: ["directory-conventions"],
    requires: { runtime: ["bun", "git", "bash"], network: false },
  }),
);
