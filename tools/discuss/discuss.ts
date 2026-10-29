import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "discuss",
    title: "discussion",
    description:
      "Put a question to a person or a sibling agent and receive an answer, to determine which harness this repository should become and which repositories are read from and written to. The two facts no file holds.",
    install: { none: true },
    invoke: { manual: true },
    io: {
      inputs: [
        { name: "question", schema: t("Text"), required: true, description: "The question as put, with its candidates named. One question where one will do." },
        { name: "askedOf", schema: t("Text"), required: true, description: "`person` or `agent` — symmetric participants, recorded because the answers are evidence of different weight." },
      ],
      outputs: [
        { name: "answer", schema: t("Text"), description: "The reply as received. Absent is a real result: it routes to `outcome: unsettled`, never to a guess." },
      ],
    },
    satisfies: ["discussion"],
    selection: {
      when:
        "A fact is needed that no file in reach holds — which harness, or which repositories. Narrow the candidates from context first; a repository already carrying `cat-harness/cat-harness.json` is not a blank slate, and a question the agent could have answered itself wastes the one it is entitled to.",
      limits:
        "It cannot manufacture an answer. A participant may decline, and that is `outcome: unsettled` with what is still open — not an error and not a default. An agent that reaches for a documented default because nobody replied has produced a guess.",
      cost: "One round trip through a person's attention, which is the most expensive input in the system and the reason the skill's rule is to ask once.",
    },
    requires: {},
  }),
);
