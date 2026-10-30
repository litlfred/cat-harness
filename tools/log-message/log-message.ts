import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Logging ────────────────────────────────────────────────────────
//
// Declared HERE although the skill and the sub-process it serves live in
// `bootstrap/`, and that is a limitation rather than a decision. Tool
// collection is import-bound — `tools/index.ts` merges what it imports —
// so a Tool node contributed by a nested instance is not reachable from
// the barrel yet. Bean `gn4l`. When it is, this node moves to
// `bootstrap/tools/` unchanged, and nothing that references it by id
// notices.
export default toolFactory((t) =>
  defineTool({
    id: "log-message",
    title: "Log a message to the discussion",
    description:
      "Write a log line where the human actor will read it: the discussion you are already in. Takes the five required fields and the optional body, and renders them as one entry.",
    // The destination is a conversation. There is nothing to install and
    // there could not be — that is the property that makes it the arm an
    // Bootstrapping Agent can always reach.
    install: { none: true },
    // `manual`, and honestly so. The agent composes the entry and sends it;
    // no command runs. Modelling it as an absent `shell` would have made it
    // indistinguishable from an unfinished record — the distinction
    // `beans-manual` established.
    invoke: { manual: true },
    io: {
      // No `arg` on any input: a manual Tool has no command line, so the
      // inputs are the contract rather than argv. That is also why `actor`
      // and `message` may be `Text` and `body` may be `Markdown` here —
      // injection-safety constrains command-line WORDS, and there are none.
      inputs: [
        { name: "timestamp", schema: t("Timestamp"), required: true, description: "When it happened, as an ISO-8601 UTC instant." },
        { name: "actor", schema: t("Text"), required: true, description: "WHO acted. Never the Logger: it receives and records, so it cannot know." },
        { name: "process", schema: t("ProcessId"), required: true, description: "The process the actor was inside, e.g. initialize-harness." },
        { name: "task", schema: t("NodeId"), required: true, description: "The step within it, e.g. A_Install." },
        { name: "message", schema: t("Text"), required: true, description: "What happened, in the one line somebody scanning will read." },
        { name: "body", schema: t("Markdown"), required: false, description: "The detail — a diff, an error, what was not where it should have been." },
      ],
      // The entry as rendered, so a caller can quote what it actually wrote
      // rather than reconstructing it from the six fields.
      outputs: [{ name: "entry", schema: t("Markdown"), description: "The entry as posted.", render: { as: "markdown", reason: "a log entry is prose with formatting; rendered with raw HTML off" } }],
    },
    satisfies: ["log-message"],
    requires: { network: false },
  }),
);
