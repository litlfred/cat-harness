import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "skill-docs",
    title: "Skill instruction reference",
    description:
      "Render the skill instruction bodies — the prose an agent actually loads — as browsable pages with an index, so a reader can see what an agent is told without cloning the repository.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/gen-skill-docs.ts" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed pages and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "skillInstructions", schema: t("RepoPath"), description: "The generated instruction directory. Never hand-edited." }],
    },
    // Sibling of `schema-docs`, not an alternative to it: one renders a
    // skill's CONTRACT and the other its INSTRUCTIONS, and a reader wanting
    // either is not served by the other. Complementary: the output ports
    // are named for what each writes, so `deriveAlternatives` does not pair
    // them on a shared skill (#1168, B9a).
    satisfies: ["docs-generation"],
    requires: { runtime: ["bun"], network: false },
  }),
);
