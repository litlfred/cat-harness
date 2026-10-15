import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "kg-validate",
    title: "Validate a node in the graph",
    description:
      "Check one file against the schema for its graph typology. ONE tool rather than one per schema: the declaration already says which directory holds which kind, so the kind is the parameter and the lookup does the rest.",
    install: { none: true },
    invoke: { shell: "bun run cat kg:validate" },
    io: {
      inputs: [
        { name: "path", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The node to check. Its graph typology is resolved from the declared directory that contains it." },
        { name: "lenient", schema: t("Flag"), required: false, arg: { flag: "--lenient" }, description: "Accept partial coverage knowingly: downgrade could-not-determine from an error to a warning." },
      ],
      // `Text`, not a bespoke verdict type: the tool's answer is the exit
      // code plus one line per file, and minting a type for "three states
      // and a reason" would be a vocabulary entry with one user.
      outputs: [{ name: "report", schema: t("Text"), description: "One line per file — valid, invalid with the failing paths, or could-not-determine with the reason. Exit 0 valid, 1 invalid or undetermined, 2 misuse." }],
    },
    // The FIRST tool bound to this skill. Measured 2026-09-20: of ten Tool
    // nodes, none validated anything and none named `kg-navigation`, while
    // 199 Zod schemas sat unreachable from the graph (bean `3lbz`).
    satisfies: ["kg-navigation"],
    requires: { runtime: ["bun"], network: false },
    selection: {
      when:
        "Whenever a node's shape matters and you are not in this repository's CI. That is the case the tool exists for: `tools/` is an INHERITED declaration and `.github/workflows/` is not, so a downstream instance gets this and gets none of the 41 gates. #363's self-sovereign topology has no CI to inherit from at all.",
      limits:
        "It can only check a kind that declares a validator — 2 of 16 today, so most nodes come back UNDETERMINED and it exits non-zero saying so. That is the honest state rather than a gap to paper over: `qa`, the largest generated graph here, has no Zod schema anywhere. `bun run cat check:kind-validators` reports the coverage.",
      cost: "One module import per kind. Nothing to install, no network.",
    },
  }),
);
