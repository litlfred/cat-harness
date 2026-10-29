import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── The narrative review queue — what is waiting on a PERSON ──────────
//
// Bean `7ajt`, and the node almost did not get written. I had it filed as a
// capability-vocabulary question for the owner — the `yean` shape, "no skill
// states this, so authoring one is a design act" — on the grounds that
// `Task_SmeReview` refs `content-review`, whose contract REQUIRES
// `reviewType` and `contentRef`, and this script takes a queue index and a
// numbered preset.
//
// That was wrong for the THIRD time in one session, and always the same way:
// I searched skill NAMES instead of reading skill BODIES.
// `library-ingestion` §"Reviewing: `bun run cat narratives`" named these exact
// commands in a fenced block (the section moved up a layer with the rest of
// the L1 method in placement PR6, bean `apcg`), and states the rule this
// node exists to make reachable:
//
//   "Two attributions, because they are two acts. `drafted_by` is who wrote
//    the words; `confirmed_by` is who accepted them. … AN AGENT CANNOT
//    CONFIRM ITS OWN DRAFT — `confirmed_by.kind` must be "human",
//    structurally. … without it, `confirmed` degrades into 'an agent said so
//    twice'."
//
// So: case 1 of `covered-is-not-reachable` in its plainest form, a mechanism
// inlined in its skill's prose, and the remedy is a node rather than a new
// skill. `interaction-modality` carries the other half — the `low-dexterity`
// profile's "every question is a selection, options numbered" — and is cited
// rather than restated.
//
// THE INVOKE IS THE LISTING, AND THAT IS THE DESIGN. `reviewer()` throws
// outside a TTY — "Confirming is a PERSON's act; an agent running this would
// be recorded as one" — because `git config user.name` in an agent container
// recorded the agent as the reviewer and the schema could not see it. So an
// agent CANNOT confirm or reject, and a node whose `invoke` were
// `narratives:confirm` would declare a capability the caller reading it does
// not have. What an agent can do, and the thing that was missing, is FIND
// the queue and read what is waiting on a person.
export default toolFactory((t) =>
  defineTool({
    id: "narrative-queue",
    title: "What narratives are waiting on a person",
    description:
      "List the agent-drafted narratives awaiting human confirmation, numbered, with the numbered rejection reasons beside them. The queue is the only place a draft's state is visible before someone accepts it.",
    install: { none: true },
    invoke: { shell: "bun run cat narratives" },
    io: {
      inputs: [],
      outputs: [
        { name: "queue", schema: t("Text"), description: "Every narrative awaiting a person, NUMBERED, with its subject, its text and its file — then the two commands that act on a number, then the rejection reasons, also numbered. Numbered throughout because the person this is for has very limited hand function and every action must be a selection rather than a typed sentence; `interaction-modality`'s `low-dexterity` profile is the general rule." },
      ],
    },
    satisfies: ["library-ingestion"],
    requires: { runtime: ["bun"], network: false },
    selection: {
      when:
        "To find out what is waiting on a person, or to discover that this queue exists at all — which was the actual gap. Before this node, `grep narrative tools/*.ts` returned nothing, so an agent asking the graph how a person confirms a narrative got no answer, and that is exactly the population the command is for.",
      limits:
        "IT ONLY LISTS. Acting on a number is `bun run cat narratives:confirm <n>` or `bun run cat narratives:reject <n> --why <r>`, and both REFUSE outside a terminal: `reviewer()` throws with \"Confirming is a PERSON's act; an agent running this would be recorded as one\". That refusal is load-bearing rather than defensive — driving the CLI in an agent container once wrote `\"rejected_by\": {\"kind\": \"human\", \"id\": \"Claude\"}`, because `git config user.name` is the agent's and the schema could not tell. So this node deliberately does not offer the confirming arms: an agent may read the queue and must not answer it. A rejection with no reason is refused too, not defaulted, because one lets the next agent redraft the identical thing.",
      cost: "Reads the narrative-bearing files under the declared graph. No network.",
    },
  }),
);
