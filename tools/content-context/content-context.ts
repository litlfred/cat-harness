import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "content-context",
    title: "Content JSON-LD context",
    description:
      "Emit the published JSON-LD `@context` that both populations share — authored block siblings and ingested `library/**` nodes reference it by URL — generated from its TypeScript definition rather than hand-kept.",
    install: { none: true },
    invoke: { shell: "bun run cat jsonld:context" },
    io: {
      inputs: [
        // `--check` is the CI arm: it compares against the committed copy and
        // fails rather than writing, like every other generated file here.
        { name: "check", schema: t("Flag"), required: false, arg: { flag: "--check" }, description: "Compare against the committed copy and fail if stale, instead of writing." },
      ],
      outputs: [{ name: "context", schema: t("RepoPath"), description: "`ns/content/v1.jsonld`, the document served at CONTENT_CONTEXT_URL." }],
    },
    satisfies: ["kg-export"],
    // Load-bearing and currently LOSSY, which is bean `ovkk`: the @context
    // declares fewer terms than the graph uses, so a conforming JSON-LD
    // processor silently drops the property occurrences it cannot expand.
    // A node here does not fix that. It makes the artefact's source
    // addressable, which is what a fix has to start from — and it is why this
    // node is worth having before the gap is closed rather than after.
    maintains: [
      {
        source: "schemas/kg/jsonld.ts",
        // declared-path-literal: this Tool node IS the declaration of the artefact it maintains, at the path its published URL fixes.
        artefact: "ns/content/v1.jsonld",
        format: "json-ld",
      },
    ],
    requires: { runtime: ["bun"], network: false },
  }),
);
