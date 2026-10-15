import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Bean `l4ay`, owner 2026-10-03: "A sub graph declares where it's getting
// its content". The ONE resolver, from a shell — `branch-store
// mount`/`push` call the same function and dispatch on its `kind`.
// Bean `mftp`, owner 2026-10-05: "make sure scripts you use go into Tools".
// Bean `ieum`, owner 2026-10-07: "security check before release", and
// "tools may be in place but not utilized fully". The checks it runs were
// already gated in CI; no release process step named any of them.
export default toolFactory((t) =>
  defineTool({
    id: "security-gate",
    title: "Run every existing security check as one named release step",
    description:
      "Run the repository's security checks — workflow injection, secret leaks, lockfile pinning, the toolchain pin, QA reviewer permission, materialised-asset fixity — plus two advisories (dependency advisories, third-party action SHA pinning), each by name as argv. Every check is reported as pass, fail or unknown; a blocking check that fails OR could not be run refuses the release, because could-not-check is never clean. Advisories are reported and never block. Called by `prepare-merge` before a push that will merge, and by any publish process before it publishes.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/security-gate.ts" },
    io: {
      inputs: [
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Print a `folio-security-gate/v1` result on stdout instead of the human report." },
      ],
      outputs: [
        { name: "blocked", schema: t("Flag"), description: "Whether a blocking check failed or could not be run; also the exit status (1 when blocked)." },
      ],
    },
    satisfies: ["security"],
    requires: { runtime: ["bun"], network: false },
  }),
);
