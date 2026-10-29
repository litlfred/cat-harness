import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Every key a content document writes is a declared term ────────────
//
// Beans `yh6u` and `589f`. This node was `check:context-emission`, which
// also asked the two PREFIX questions of the shared content context (bean
// `zaqn`): is each bound prefix spoken, and each spoken prefix bound. Once
// every emitter names its own instance's generated context (bean
// `folio-assistant-63q4`) both are answered by `jsonld:contexts --check`:
// a context generated from use binds nothing unused, and it fails on a
// prefix used and bound nowhere. What a generated context cannot answer
// is a KEY the content context never declared — dropped by a processor
// without a word — or a file path under an `@id` term, so those stay here.
export default toolFactory((t) =>
  defineTool({
    id: "context-prefixes",
    title: "JSON-LD content-key check",
    description:
      "Check every committed JSON-LD document that names the content context, or an instance's own generated context: every plain key is a declared term (never descending into an `@json` value), and no file path sits under an `@id`-coerced term. An empty corpus is a finding, never a clean run. Prefixes are checked by `jsonld:contexts --check`.",
    install: { none: true },
    invoke: { shell: "bun run cat check:content-keys" },
    io: {
      inputs: [
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit both reports as JSON instead of the console summary." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "Console (or JSON) report; exit 1 on an undeclared key, a path under an `@id` term, or an empty corpus." }],
    },
    satisfies: ["kg-export"],
    requires: { runtime: ["bun"], network: false },
  }),
);
