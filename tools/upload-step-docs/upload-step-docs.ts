import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Third sibling of the two above, and the one whose subject is a JOIN
// rather than a directory. `schema-docs` renders one page per skill
// contract and `skill-docs` one per instruction body — each walks a
// directory and publishes what it finds. This one publishes a RELATION:
// the Tools that implement whichever activity a named process reaches
// first. Nothing about which step, which skill or which Tools is written
// into it, so the page follows the diagram instead of restating it.
export default toolFactory((t) =>
  defineTool({
    id: "upload-step-docs",
    title: "The upload step, from its Tools",
    description:
      "Render document ingestion's FIRST step as a reference page, generated from the Tool nodes that implement it: the step, its lane and role, its skill and every Tool whose `satisfies` names that skill, with each Tool's description, installation, invocation, typed ports and selection triple. Everything but the process file's own path is derived — the start event, the activity its single outgoing flow reaches, and that activity's skill — so a step inserted, renamed or re-pointed moves the page rather than staling a literal. Refuses rather than emitting a partial page when the start event flows nowhere or to more than one place, when the first step is not an activity, when it names no skill or several, or when NO Tool satisfies that skill — the last because an empty page reads as a documented absence of mechanism, which is a finding rather than a document.",
    install: { none: true },
    invoke: { shell: "bun run cat upload-step:docs" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed page and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "page", schema: t("RepoPath"), description: "`docs/reference/upload-step/index.md`, under the instance's declared site directory. Never hand-edited." }],
    },
    satisfies: ["docs-generation"],
    requires: { runtime: ["bun"], network: false },
  }),
);
