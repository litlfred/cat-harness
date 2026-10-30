import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";
import { bundled, inProcess } from "../lib.js";

// folio-assistant#875: a skill edit goes through a governed Tool node, not a
// raw file write. The spec is the spec-kit comment on #875, Adjudicated by
// the owner 2026-10-29. Implemented in cat-harness-tools.
export default toolFactory((t) =>
  defineTool({
    id: "skill-update",
    title: "Edit a skill",
    description:
      "Change one existing local skill's instruction file through a gate: it must resolve as skill-fetch serves it, be tracked in the working repository, not be generated, be granted `skill-update` to the actor by a policy, be unchanged since it was read, keep its name and parse, and add only links that resolve. A gate that cannot decide refuses. Writes the working tree; the caller commits.",
    install: bundled,
    invoke: inProcess("src/tools/skill-update.ts", "skill_update"),
    io: {
      inputs: [
        { name: "skill", schema: t("SkillName"), required: true },
        { name: "package_name", schema: t("PackageName"), required: false },
        { name: "new_content", schema: t("Markdown"), required: true, arg: { stdin: true }, description: "The whole new file: front matter and body." },
        { name: "base_sha256", schema: t("Text"), required: true, description: "SHA-256 hex of the file as the caller read it." },
        { name: "reason", schema: t("Text"), required: true, description: "Why the skill changes." },
        { name: "actor", schema: t("Text"), required: false, description: "The declared actor making the write; a policy must grant it skill-update." },
        { name: "process", schema: t("ProcessId"), required: false, description: "The BPMN process the write is a step of, for the PROV-O activity." },
        { name: "task", schema: t("NodeId"), required: false, description: "The task in that process." },
        { name: "role", schema: t("Text"), required: false, description: "The role the lane binds." },
      ],
      outputs: [{ name: "verdict", schema: t("Markdown"), description: "Written or not, every gate's verdict with its reason, findings, and the PROV-O activity of an accepted write when a step was named." }],
    },
    satisfies: ["skills-and-tools"],
    requires: { network: false },
  }),
);
