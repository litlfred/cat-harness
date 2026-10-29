import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "transcribe-vosk",
    title: "Transcribe audio — vosk (option, not installed)",
    description:
      "Transcribe an audio file with vosk (Kaldi-based), offline, from Python, with small per-language models. A declared OPTION: not installed in this repository.",
    install: { cli: "pip install vosk, plus a per-language model (small ≈ 40–50 MB)" },
    invoke: { shell: "vosk-transcriber" },
    requires: { runtime: ["python3", "vosk"], network: false },
    io: {
      inputs: [
        { name: "file", schema: t("RepoPath"), required: true, arg: { flag: "-i" } },
        { name: "language", schema: t("Locale"), required: false, arg: { flag: "-l" } },
      ],
      outputs: [{ name: "transcript", schema: t("RepoPath"), description: "Written where `-o` names." }],
    },
    satisfies: ["library-ingestion"],
    selection: {
      when:
        "When size and speed matter more than accuracy: the lightest offline option, with a separate small model per language.",
      limits:
        "Noticeably lower accuracy than the Whisper family on varied recordings; one model per language to fetch and keep.",
      cost: "Not installed. Small wheel; ≈ 40–50 MB per language model.",
    },
  }),
);
