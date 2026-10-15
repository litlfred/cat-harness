import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "agent-memory",
    title: "Agent memory assembler",
    description:
      "Assemble every declared `memory` directory's nodes into each agent's memory, per vendor: Claude Code's `.claude/agent-memory/<agent>/MEMORY.md` (a marked region, injected when the subagent starts) and Antigravity's workspace skill `.agents/skills/<agent>-memory/SKILL.md`. Other vendors (Gemini CLI, Copilot, Codex, Cursor) are beaned under `31ni` and not generated.",
    install: { none: true },
    invoke: { shell: "bun run cat agent-memory" },
    io: {
      inputs: [],
      outputs: [{ name: "memory", schema: t("RepoPath"), description: "Each agent's assembled memory file, per vendor." }],
    },
    satisfies: ["agent-memory"],
    requires: { runtime: ["bun"], network: false },
  }),
);
