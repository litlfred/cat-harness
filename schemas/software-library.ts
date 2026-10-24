/**
 * Software libraries — one outside library a layer's code IMPORTS, at the
 * version that layer's lockfile pins, with its licence, who imports it, and
 * the type shim that types it. **Never the bytes.**
 *
 * @module schemas/software-library
 * @graphNode schema
 *
 * Option D of bean `jbvi` (owner, 2026-10-24 08:25Z, "D. Shared core"). The
 * gap it closes: `tool-release` records the outside programs the platform
 * RUNS, and nothing recorded the libraries its code imports — bpmn-moddle,
 * dmn-moddle, katex, playwright, zod. Their range was in each `package.json`,
 * their exact version and integrity in each `bun.lock`, their licence nowhere
 * a gate could read, and the shim that types one (`types/bpmn-moddle.d.ts`)
 * linked to nothing. So no gate or page could ask "which licence does this
 * library carry, which files import it, and which shim types it".
 *
 * ## The core, extended
 *
 * A library is {@link module:schemas/outside-software | `outside-software`}'s
 * core — name, version, digest, source, SPDX licence and `licenceSource` —
 * plus what only an imported library has:
 *
 * - `range` — the version range the layer's `package.json` asks for;
 * - `dev` — whether it is a `devDependencies` entry;
 * - `usedBy` — the layer's files that import it, layer-relative and sorted;
 * - `shim` — the `types/*.d.ts` that declares it, when one exists.
 *
 * It is a NODE KIND (`nodeKind()`, issue #2195) whose one parent is the core's
 * mixin, {@link OutsideSoftwareKind}, so the class it belongs to is declared
 * rather than inferred from a spread. `tool-release` predates node kinds and
 * keeps its `folio-tool-release/v1` tag; it extends the same core with Zod's
 * `.extend()`, which changes none of its files.
 *
 * Two core fields are narrowed. `name` is an npm package name, which may be
 * scoped (`@scope/pkg`), so its ref splits at the LAST `@`. `source` is a URL:
 * a library comes from a registry tarball, never an OCI image. The digest is
 * the core's own, so it may be sha512 — what `bun.lock` records.
 *
 * ## Generated, never hand-written
 *
 * A node is DERIVED from three inputs of the layer that imports it: its
 * `package.json` (range, dev), its `bun.lock` (version, integrity, tarball)
 * and the installed package's own `package.json` (licence). The writer is
 * `libraries:derive` and the gate `libraries:check`, both in the tools layer.
 * Hand-writing them is option A's failure: every `bun update` would churn
 * dozens of files by hand.
 *
 * ## One node per layer per library
 *
 * Each layer keeps its own `libraries/`, declared in its own `<name>.json`,
 * because each layer pins its own version in its own lockfile. A library two
 * layers share has two nodes, one in each, which may disagree on the version
 * — and that disagreement is a fact worth seeing rather than one to hide.
 *
 * ## The file name is not the `name`
 *
 * A node is `<file-stem>.library.json` ({@link libraryFileName}), so its stem
 * never equals its `name` field — the rule `findDeclarationFile` uses to
 * recognise an instance declaration (`directory-conventions`, §"Every other
 * marker"). The version is not in the file name, so a bump rewrites one file
 * rather than renaming it.
 */
import { z } from "zod";

import { nodeKind } from "./node-kind";
import { OutsideSoftwareKind, SoftwareUrlSourceSchema, outsideSoftwareLicenceProblem } from "./outside-software";
import type { SpdxLicenseList } from "./spdx-license-expression";

/**
 * The tag a library node carries, so it is identified by declaration. A short
 * SemVer name, the owner's convention for node kinds since 2026-10-05
 * (`schemas/node-kind.ts`): the name is the kind, the version lives in the tag.
 */
export const SOFTWARE_LIBRARY_SCHEMA_TAG = "software-library/1.0.0";

/** The suffix every library node's file name ends in. */
export const LIBRARY_FILE_SUFFIX = ".library.json";

/**
 * An npm package name: lowercase, optionally scoped. `zod`, `@types/mdast`,
 * `typescript7` (an alias: the name the layer imports it by).
 */
export const LibraryNameSchema = z
  .string()
  .regex(
    /^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/,
    "an npm package name: lowercase letters, digits, `.`, `_` and `-`, optionally scoped as `@scope/name`",
  );

/** A layer-relative POSIX path, never absolute and never above the layer. */
const LayerPathSchema = z
  .string()
  .min(1)
  .refine((p) => !p.startsWith("/") && !p.includes("\\") && !p.split("/").includes(".."), "layer-relative and POSIX, never above the layer");

/**
 * One library a layer imports, as a `software-library/1.0.0` node kind: a
 * SUBCLASS of the {@link OutsideSoftwareKind} mixin, narrowing `name` and
 * `source` (declared in `overrides`, so neither shadows the core by accident)
 * and adding what only an imported library has. Strict, because its writer
 * emits exactly these keys and an extra one is a defect.
 */
export const SoftwareLibraryKind = nodeKind(
  SOFTWARE_LIBRARY_SCHEMA_TAG,
  [OutsideSoftwareKind],
  {
    /** Narrowed from the core: an npm package name, as the layer's `package.json` names it. */
    name: LibraryNameSchema,
    /** Narrowed from the core: the registry tarball the lockfile resolved. */
    source: SoftwareUrlSourceSchema,
    /** The range the layer's `package.json` asks for (`^10.2.0`, `npm:typescript@^7.0.2`). */
    range: z
      .string()
      .min(1)
      .refine((r) => !/[\r\n]/.test(r), "a range is one line"),
    /** A `devDependencies` entry rather than a `dependencies` one. */
    dev: z.boolean(),
    /** The layer's files that import it, layer-relative, sorted and unique. Empty for a library reached another way (a CLI, a `types` entry). */
    usedBy: z.array(LayerPathSchema),
    /** The ambient declaration that types it, when the package ships none of its own. */
    shim: LayerPathSchema.refine((p) => /^types\/[^/]+\.d\.ts$/.test(p), "a shim is a `types/*.d.ts` file").optional(),
  },
  {
    overrides: ["name", "source"],
    strict: true,
    refine: (l, ctx) => {
      const sorted = [...new Set(l.usedBy)].sort();
      if (sorted.length !== l.usedBy.length || sorted.some((p, i) => p !== l.usedBy[i])) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["usedBy"], message: "`usedBy` is sorted and names each file once, so a regeneration diffs cleanly" });
      }
    },
  },
);

/** The schema a `software-library/1.0.0` file is parsed with. */
export const SoftwareLibrarySchema = SoftwareLibraryKind.schema;
export type SoftwareLibrary = z.infer<typeof SoftwareLibrarySchema>;

/**
 * The file a library's node is kept in: `zod.library.json`,
 * `types__mdast.library.json` for `@types/mdast`.
 *
 * The scope's `@` is dropped and its `/` becomes `__`. Two libraries share a
 * file only if a layer depends on both `@a/b` and an unscoped package named
 * `a__b`; the writer refuses that rather than letting one overwrite the other.
 */
export function libraryFileName(name: string): string {
  const stem = name.startsWith("@") ? name.slice(1).replace("/", "__") : name;
  return `${stem}${LIBRARY_FILE_SUFFIX}`;
}

/**
 * Is the library's licence a valid expression over the pinned SPDX License
 * List? The core's check, so a library and a tool release are judged by the
 * one parser `check:source-licence` uses.
 */
export function libraryLicenceProblem(l: Pick<SoftwareLibrary, "licence">, list: SpdxLicenseList): string | undefined {
  return outsideSoftwareLicenceProblem(l, list);
}
