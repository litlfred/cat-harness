import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "uml-object-model",
    title: "Harness object model as PlantUML",
    description:
      "Draw the harness object model (Actor, Role, Skill, Process, Task, Todo, Bean, tests, schemas) with every attribute read from the schema behind it. Each relationship names the field that carries it, and the generator refuses to write if that field is gone.",
    install: { none: true },
    invoke: { shell: "bun run cat uml:object-model" },
    io: {
      inputs: [
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Fail if the committed diagram is stale. Needs the beans CLI; without it the result is could-not-check (exit 2)." },
      ],
      outputs: [{ name: "diagram", schema: t("RepoPath"), description: "The object-model diagram, in the instance's declared uml directory." }],
    },
    satisfies: ["uml-overview"],
    requires: { runtime: ["bun"], network: false },
  }),
);
