import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "check-dependencies",
    title: "Dependency probe",
    description:
      "Report which of the harness's optional and required dependencies are present on this machine, and what each unmet one blocks.",
    install: bundled,
    invoke: { ...inProcess("src/tools/check-deps.ts", "check_dependencies"), shell: "bun run cat check-deps" },
    io: {
      inputs: [
        {
          name: "required_only",
          schema: t("Flag"),
          required: false,
          arg: { flag: "--required-only" },
          description: "Report only the dependencies without which the harness cannot run.",
        },
      ],
      outputs: [{ name: "report", schema: t("Markdown"), description: "Per-dependency: present, absent, or could not be determined." }],
    },
    satisfies: ["verify-local-substrate"],
    requires: { network: false },
  }),
);
