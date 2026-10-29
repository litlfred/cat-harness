import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "library-viewer",
      title: "Library viewer",
      description:
        "Render each declared library directory — its entries, intakes and avatars — as a page per subject instance, and give every entry its own path IRI (<library>/<instance>/<id>/): a materialized thin shell that loads the entry from the published projection, with its JSON-LD manifest as the alternate.",
      script: "library:viz",
      renders: ["library"],
    }),
  ),
);
