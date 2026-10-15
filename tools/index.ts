/**
 * This instance's Tool nodes — the `tools` graph.
 *
 * A **skill** states a capability generically; a **Tool** is one concrete way
 * to exercise it. See `skills/folio-core/skills-and-tools.md`.
 *
 * Authored as TypeScript calling `defineTool`, so a malformed node fails at
 * `tsc` and in the editor rather than at CI — the carrier decision applied to
 * instances as well as to the schema. The JSON-LD and JSON Schema renderings
 * are generated from these.
 *
 * ## The base URL
 *
 * I/O type IRIs are minted against the instance's `canonicalUrl` at load, not
 * written out, so relocating the publication base does not require editing
 * every Tool. `toolTypeIri` is the one place an IRI is formed.
 *
 * @module tools
 *
 * ## One Tool per folder — bean `tdir`
 *
 * Each Tool is declared in `<id>/<id>.ts` beside this file, with its scripts
 * and tests when they are its alone; this file only loads the folders
 * (`toolsFromFolders`, which holds the folder = file = id convention).
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { ToolDefinition } from "../schemas/tool.js";
import { toolsFromFolders } from "../schemas/tool-folders.js";
import { base } from "./lib.js";

export function tools(baseUrl?: string): ToolDefinition[] {
  return toolsFromFolders(dirname(fileURLToPath(import.meta.url)), baseUrl ?? base());
}
