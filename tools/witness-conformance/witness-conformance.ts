import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// Bean `qou-qb6t`, owner 2026-10-04: "all witnesses tools will need to go
// into the KG". The reader of the `computation-witness` kind: which
// witnesses meet the producer contract, and which are malformed.
export default toolFactory((t) =>
  defineTool({
    id: "witness-conformance",
    title: "Witness conformance report",
    description:
      "Check every `*.witness.json` in the folio's declared `computation-witness` directories against the two schemas in `schemas/computation-witness.ts`: the envelope every witness should meet (a failure is a malformed file) and the producer contract (a failure is a finding against the producer, grouped by the fields at fault). Also lists files that are not strict JSON, which Python's reader accepts and every other consumer rejects. Report-only: it never edits a witness, which is generator output.",
    install: { none: true },
    invoke: { shell: "bun run cat witness:conformance" },
    io: {
      inputs: [
        { name: "dir", schema: t("RepoPath"), required: false, arg: { flag: "--dir" }, description: "Check this directory instead of the declared ones, e.g. before a folio declares the kind." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Machine-readable output, every finding group listed." },
        { name: "strict", schema: t("Flag"), required: false, arg: { flag: "--strict" }, description: "Exit 1 when any witness is malformed or not strict JSON. Contract findings never fail the run." },
      ],
      outputs: [
        { name: "report", schema: t("Text"), description: "Counts of witnesses, malformed files, non-strict-JSON files and contract conformance, then the contract findings by field. Exit 2 when no directory declares the kind and no `--dir` was given: a clean report over nothing is not a pass." },
      ],
    },
    satisfies: ["directory-conventions"],
    requires: { runtime: ["bun"], network: false },
  }),
);
