import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The archimate subgraph's two Tools (skill `archimate-models`).
//
// Owner, 2026-10-09: "do not do java 200mb... that's not usable for
// webclients and is too heavy." Neither needs Archi, a JVM or a display:
// the model is read and every view drawn in TypeScript.
export default toolFactory((t) =>
  defineTool({
    id: "archimate-check",
    title: "Check an instance's ArchiMate models against its config",
    description:
      "The gate for the `archimate` graph typology: every model `cat-archimate.config.json` names is held, parses (Archi's native XML or its zipped archive), and resolves — every box in every view draws an element the model holds, every relationship's ends are in the model — and no `.archimate` file is held that the config does not name.",
    install: { none: true },
    invoke: { shell: "bun run cat archimate:validate" },
    io: {
      inputs: [
        { name: "instance", schema: t("RepoPath"), required: true, arg: { flag: "--instance" }, description: "The instance root whose `archimate` directory is checked." },
      ],
      outputs: [
        { name: "problems", schema: t("Text"), description: "One line per problem on stderr, exit 1; or one ✓ line, exit 0." },
      ],
    },
    satisfies: ["archimate-models"],
    selection: {
      when: "Before publishing an instance's ArchiMate models, and in its CI: a model that will not parse, draws an element it does not hold, or is held without being configured.",
      limits: "Archi's native format only; the Open Group exchange format is not read yet.",
      cost: "One parse per model. No network, no JVM.",
    },
    requires: { runtime: ["bun"], network: false },
  }),
);
