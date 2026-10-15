import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "tool-coverage",
    title: "Which uncovered skills warrant a Tool?",
    description:
      "Triage the skills that have no Tool by EVIDENCE rather than by grep: a serviceTask naming it or an I/O contract puts it in tier A, a userTask only in B, a shell block or a declared script in C, and nothing in D. The answer to \"which of these still have their mechanism inlined in their prose\".",
    install: { none: true },
    invoke: { shell: "bun run cat tools:coverage" },
    io: {
      inputs: [],
      outputs: [{ name: "triage", schema: t("Text"), description: "Four tiers with A, B and C listed by name and their evidence, D as a count. Always exit 0: this REPORTS a judgement queue and never gates — an uncovered skill is not a defect, and failing on one would make stubbing a gap turn CI red." }],
    },
    satisfies: ["code-node-review"],
    requires: { runtime: ["bun"], network: false },
    selection: {
      when:
        "When choosing what to give a Tool node next. Tier C is the read: its own label says THE READ GOES HERE, and tier A is the list to act on.",
      limits:
        "It enumerates SKILLS and asks which lack Tools, so a capability nobody has stated generically is absent from the list it walks — that blindness is structural, not an oversight, and bean `yean` is the case that proved it. It also cannot see a folio's entry points: `pipeline/*.ts` are invoked from a FOLIO's package.json, which is not readable from the platform.",
      cost: "Seconds, plus loading every BPMN diagram to read task types.",
    },
  }),
);
