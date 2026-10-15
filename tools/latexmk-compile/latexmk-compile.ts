import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "latexmk-compile",
    title: "LaTeX compilation (latexmk)",
    description:
      "Compile LaTeX source documents into PDF using latexmk with safe shell-escape isolation across CI events.",
    install: { none: true },
    invoke: { shell: "bun run cat latex:compile" },
    io: {
      inputs: [
        { name: "tex", schema: t("RepoPath"), required: true, arg: { positional: 0 }, description: "The TeX source file to compile (e.g. main.tex)." },
        { name: "args", schema: t("Text"), required: false, description: "Additional arguments to forward to latexmk." },
      ],
      outputs: [
        { name: "pdf", schema: t("RepoPath"), description: "The compiled PDF document. Exits 2 if the source file is missing (could-not-determine)." },
      ],
    },
    satisfies: ["latex-compilation"],
    requires: { runtime: ["bash", "latexmk", "pdflatex"], network: false },
  }),
);
