import { defineTool } from "../../schemas/tools/tool.js";
import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
// Not `openapi-ingest-*`: those copy a document in. This draws what was copied,
// at the visualiser's route, because the main site serves an instance's
// `openapi/` graph verbatim, as the document and its provenance, and renders no page of it.
export default toolFactory((t) =>
  defineTool(
    viewerTool(t, {
      id: "openapi-pages",
      title: "OpenAPI viewer",
      description:
        "Render every OpenAPI document an instance's `openapi` graph holds at the visualiser's route: a hub, a page per instance listing its documents, and a page per document and per operation, drawn from the document copied beside them.",
      script: "openapi:viz",
      renders: ["openapi"],
    }),
  ),
);
