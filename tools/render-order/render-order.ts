import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";
import { bundled, inProcess } from "../lib.js";

export default toolFactory((t) =>
  defineTool({
    id: "render-order",
    title: "The render pipeline, in dependency order",
    description:
      "Flatten the repository's renders into the order their `needs` imply, and optionally run them. Two stages: the current declared state as json/jsonld and the README derived from it are FATAL; the dynamic renderers (viewers, visualisers, doc pages, diagrams) skip and log; the dynamic-state export closes it. A cycle or a missing dependency yields NO order rather than a partial one.",
    install: bundled,
    invoke: { ...inProcess("src/tools/render-order.ts", "render_order"), shell: "bun run cat render" },
    io: {
      inputs: [
        {
          name: "dry_run",
          schema: t("Flag"),
          required: false,
          arg: { flag: "--dry-run" },
          description: "Print the flattened order and each step's failure policy without running anything.",
        },
      ],
      outputs: [
        {
          name: "report",
          schema: t("Markdown"),
          description:
            "Per step: ran, failed, skipped, or PENDING — declared with no implementation yet, which is never rendered as a pass.",
        },
      ],
    },
    satisfies: ["docs-generation"],
    requires: { network: false },
  }),
);
