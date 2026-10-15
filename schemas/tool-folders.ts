/**
 * One Tool per folder: `<tools dir>/<id>/<id>.ts`, and the loader that reads them.
 *
 * Bean `tdir`. The owner, 2026-10-15: *"why are they not each in their own
 * folder like smart-base/tools/extract-dak"* — and, on how: *"make sure the
 * Tool schema is used and conventions of dirname and declaration like
 * `<tool>/<tool>.ts` are followed. dont externalize the json on main, only
 * when rendered in gh-pages."*
 *
 * ## The convention, held here rather than in prose
 *
 * | rule | refused with |
 * |---|---|
 * | every folder in the tools directory is one Tool | a folder with no `<folder>/<folder>.ts` |
 * | the folder, the file stem and the Tool's `id` are one string | a Tool whose `id` differs from its folder |
 * | the file default-exports a {@link ToolFactory} | a module with no default export, or one that is not a function |
 * | what it returns is a Tool node | `defineTool`'s own parse, which the factory calls |
 *
 * The source stays TypeScript, so a malformed Tool still fails at `tsc` and in
 * the editor (the carrier decision, `tool.ts`). The JSON-LD of each Tool and
 * the JSON Schema of each of its types are RENDERINGS, written when the site is
 * published, never committed beside the source.
 *
 * ## Why a factory, not a constant
 *
 * A Tool's I/O type IRIs are minted against the publication base at load
 * (`toolTypeIri`), so relocating the base edits no Tool. A constant would have
 * to know the base when its module is first evaluated; a factory is handed it.
 *
 * ## Why `require`, synchronously
 *
 * `tools()` is synchronous and every consumer calls it that way
 * (`cat-harness-tools/tools/discover.ts`). The module path is a variable read
 * from the directory, so it adds no import edge (`repo-partition` counts only
 * a literal specifier), which is the same reason discovery itself is safe.
 *
 * @module schemas/tool-folders
 */
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

import type { ToolDefinition } from "./tool.js";
import { toolTypeIri, type ToolTypeName } from "./tool-types.js";

/** Mint the IRI of one shared I/O type against the publication base. */
export type TypeIri = (name: ToolTypeName) => string;

/**
 * What `<tools dir>/<id>/<id>.ts` default-exports: given the type minter and
 * the base, the Tool node.
 */
export type ToolFactory = (t: TypeIri, base: string) => ToolDefinition;

/** Identity, for the type: `export default toolFactory((t) => defineTool({ … }))`. */
export function toolFactory(f: ToolFactory): ToolFactory {
  return f;
}

/**
 * Every Tool under `dir`, one per folder, in folder order.
 *
 * Throws on the first folder that breaks the convention: a partial list would
 * read as "this instance has fewer Tools", which is the clean-run-over-nothing
 * defect (`dh4f`) for one Tool at a time. `check:tools` runs discovery, so a
 * broken folder fails CI in the same pull request.
 */
export function toolsFromFolders(dir: string, base: string): ToolDefinition[] {
  const t: TypeIri = (n) => toolTypeIri(base, n);
  const req = createRequire(join(dir, "index.ts"));
  const out: ToolDefinition[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const file = join(dir, entry.name, `${entry.name}.ts`);
    if (!existsSync(file)) {
      throw new Error(`${join(dir, entry.name)}: a folder in a tools directory is one Tool, declared in ${entry.name}/${entry.name}.ts — that file is missing`);
    }
    const f = (req(file) as { default?: unknown }).default;
    if (typeof f !== "function") {
      throw new Error(`${file}: must \`export default toolFactory((t) => defineTool({ … }))\``);
    }
    const tool = (f as ToolFactory)(t, base);
    if (tool.id !== entry.name) {
      throw new Error(`${file}: declares Tool \`${tool.id}\`, but its folder is \`${entry.name}\` — the folder, the file and the id are one name`);
    }
    out.push(tool);
  }
  return out;
}

/**
 * Files in a tools directory that DECLARE Tools inline instead of in a folder:
 * a `defineTool(` outside `<id>/<id>.ts`. `check:tools` reports each one, since
 * a Tool declared in a barrel has no folder of its own to hold its scripts,
 * tests and QA.
 */
export function inlineToolDeclarations(dir: string, read: (file: string) => string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".ts") && !e.name.endsWith(".test.ts"))
    .map((e) => join(dir, e.name))
    .filter((f) => /\bdefineTool\(/.test(read(f)));
}
