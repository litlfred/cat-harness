import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The round-trip RECORDER, and the two dispatch points it did not need ─
//
// Bean `vo9d`, and the owner's answer to it: "1 2 3 are all triggers", then
// "all for triggers or tools as appropriate". One mechanism, several dispatch
// points, each a trigger or a Tool. Reading the mechanism then showed which
// of the three was actually missing — and it was this one.
//
// **It does not perform the round trip; it RECORDS one.** `--payload
// <file.json>` carries a verdict a pair of translation agents produced, and
// `recordRoundTrip` writes it into the block's existing
// `<block>.<locale>.translation-qa.json` under the criterion
// `translation-semantic-roundtrip`. It REFUSES when no sidecar is there, and
// the refusal states the principle: *"a round trip cannot be the thing that
// decides this block is translated"* — `translation-block-qa.ts` decides that,
// and this adds a judgement on top of it.
//
// So of the three dispatch points the bean proposed:
//
//   · the BPMN trigger ALREADY EXISTS — `Task_RoundTripQA` carries
//     `<bootstrap.processes:skill ref="translation-manager"/>`, so `workflow_next` already
//     hands an agent the skill. (A `folio:skill` names a SKILL, never a
//     script; the mechanism is what this node is for.)
//   · a `qa-sweep` axis would be WRONG, not merely awkward: the sweep cannot
//     back-translate, and the verdict originates outside it. A sweep-side
//     criterion would be a different question — "does this block HAVE a
//     round-trip verdict" — not this mechanism under another trigger.
//   · the Tool node is the one that was missing, and it is this.
//
// Which is why the node exists and the other two are recorded as done and as
// refused. Not an alternative (their I/O differs): a recorder and a decider
// are not two ways to do one thing.
export default toolFactory((t) =>
  defineTool({
    id: "translation-roundtrip-record",
    title: "Record a round-trip translation verdict",
    description:
      "Write a back-translation verdict, produced by a pair of translation agents, into a block's existing translation-QA sidecar. It records a judgement rather than making one, and refuses where no sidecar exists — a round trip cannot be what decides a block is translated.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/pipeline/translation-roundtrip.ts" },
    io: {
      inputs: [
        { name: "payload", schema: t("RepoPath"), required: true, arg: { flag: "--payload" }, description: "JSON carrying the block, locale, verdict and the agent pair. Absent, the command exits 2 with its usage — measured, not assumed." },
      ],
      outputs: [
        { name: "sidecar", schema: t("RepoPath"), description: "The `<block>.<locale>.translation-qa.json` written, under criterion `translation-semantic-roundtrip`. An AGENT entry replaces a previous agent entry — a re-run is a re-measurement of the same pair on the same text, not another line in a log — while a human ruling already recorded is kept, because this process does not supersede one." },
      ],
    },
    // `translation-manager`, which is what `Task_RoundTripQA` itself refs. That
    // skill carries NO input contract, so `check-tools` cannot verify this edge
    // against one: the clean run does not mean the edge was tested, and saying
    // so here is cheaper than somebody later reading agreement into silence.
    satisfies: ["translation-manager"],
    requires: { runtime: ["bun"], network: false },
  }),
);
