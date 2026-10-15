import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── Every prefix spoken is bound, and every own prefix is a stub ──────
//
// Bean `zaqn`. `content-context` above proves the published context
// AGREES with its source; it cannot prove the source is right, and it was
// not: twenty terms written `folio:` under a binding spelt `fac`, so 1,737
// documents expanded to IRIs in a URI scheme called `folio`. This node is
// the check that asks the converse of the emission count — the direction
// that corrupts data. The discipline is `kg-export` §"A prefix is the stub".
export default toolFactory((t) =>
  defineTool({
    id: "context-prefixes",
    title: "JSON-LD prefix check",
    description:
      "Check every committed JSON-LD document in both directions: each prefix a context binds is spoken by something (or forward-declared with a reason), each prefix a document SPEAKS as a key or `@type` is bound in its context, each binding onto one of our own namespaces is spelt as that instance's stub, and every plain key in a document on the published content context is a declared term (never descending into an `@json` value). A context it cannot resolve is reported as undetermined, never clean.",
    install: { none: true },
    invoke: { shell: "bun run cat check:context-emission" },
    io: {
      inputs: [
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit both reports as JSON instead of the console summary." },
      ],
      outputs: [{ name: "report", schema: t("Text"), description: "Console (or JSON) report; exit 1 on an unbound prefix, a misspelt own prefix, a silent binding, or an empty corpus." }],
    },
    satisfies: ["kg-export"],
    requires: { runtime: ["bun"], network: false },
  }),
);
