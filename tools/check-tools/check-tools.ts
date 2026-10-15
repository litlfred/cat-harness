import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The two audits over the `tools` graph itself ──────────────────────
//
// Bean `shzs`. I nearly filed these as a capability-vocabulary question for
// the owner, on the grounds that no skill states "audit the Tool graph's own
// contracts". That was wrong, and wrong in a way worth naming: I searched for
// a skill NAMED for the capability instead of reading the skills'
// descriptions. `code-node-review` states it outright —
//
//   "Review the knowledge graph's CODE nodes — Tool definitions in the
//    `tools` graph and schema definition nodes under `schemas/` — for the
//    joins a reader cannot see: that a node declares what it is, that what it
//    names resolves, and that the mechanism it describes is the one that
//    actually runs."
//
// — and its §"The audits to run" NAMES `bun run cat check:tools` in a fenced
// block. So this is case 1 of `covered-is-not-reachable` in its plainest
// form: a mechanism inlined in its skill's prose, and giving it a node is
// exactly the remedy.
export default toolFactory((t) =>
  defineTool({
    id: "check-tools",
    title: "Do the Tool nodes agree with their skills?",
    description:
      "Check every Tool node's joins: that each `satisfies` resolves to a real skill and agrees with that skill's declared contract, that every io port names a declared type, and that no argv input has a type able to express a shell payload.",
    install: { none: true },
    invoke: { shell: "bun run cat check:tools" },
    io: {
      inputs: [],
      outputs: [{ name: "report", schema: t("Text"), description: "The satisfies map, the count of skills with and without a Tool, then the verdict. Exit 0 every join holds, 1 at least one does not. A skill with NO Tool is reported and is deliberately NOT a failure — many are pure judgement, and failing on them would make the report unusable." }],
    },
    satisfies: ["code-node-review"],
    requires: { runtime: ["bun"], network: false },
    selection: {
      when:
        "Before pushing any change to `tools/`, and as the first of the three audits `code-node-review` lists. It is the check that refuses a contract nobody could satisfy.",
      limits:
        "It checks the JOINS, not the truth. The skill says so itself: \"what no audit can tell you: whether the mechanism a Tool describes is the one that runs\". A node can pass this while its `invoke` names a command that does something else entirely — that is what a reviewer is for, and why the skill exists rather than a check script alone.",
      cost: "Seconds. Loads the Tool graph and the skill corpus in-process.",
    },
  }),
);
