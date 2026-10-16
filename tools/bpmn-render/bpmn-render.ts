import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "bpmn-render",
    title: "BPMN diagram rendering",
    description:
      "Render each process diagram to SVG for the documentation site. The .bpmn file is the source of truth; the picture is generated from it, so a diagram and its image cannot disagree.",
    install: { none: true },
    invoke: { shell: "bun run cat render:bpmn" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if any committed SVG is stale, instead of writing." },
      ],
      outputs: [{ name: "diagrams", schema: t("RepoPath"), description: "The generated SVG directory. Never hand-edited." }],
    },
    // NOT `bpmn-authoring`, and the refusal is worth recording. That edge was
    // written first and `check:tools` rejected it: the skill's own I/O
    // contract requires `processName`, because AUTHORING a process starts from
    // one. Rendering an existing diagram starts from the corpus and takes no
    // process name, so the edge asserted this Tool was a way to exercise a
    // skill it cannot exercise.
    //
    // That is `covered-is-not-reachable`'s rule enforced by machine rather
    // than by discipline — do not pick a skill to make a node validate — and
    // it is better than the discipline, because it caught the attempt. The
    // honest skill is the one `schema-docs` and `skill-docs` already satisfy:
    // a source in the graph, an artefact on the site, never hand-edited.
    satisfies: ["docs-generation"],
    // Needs a browser: bpmn-js renders through Chromium, which is why this is
    // in `gates --all` rather than the fast set. Stated here so an agent
    // choosing it on a headless box learns before running it, not after.
    requires: { runtime: ["bun", "chromium"], network: false },
  }),
);
