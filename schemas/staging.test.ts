/**
 * Staging links travel with every request for feedback (owner, 2026-10-14;
 * beans u1os, 28k2, g4dv). The shape is defined once, in
 * `staging-comparison.schema.json`, mirrored by `StagingComparisonSchema`, and
 * copied inline as `definitions.stagingLinks` into each skill contract, since a
 * skill contract is read standalone. These tests keep the copies honest.
 *
 * `definitions`, not `$defs`: the contracts declare draft-07, where `$defs` is
 * not a keyword. A strict reader resolves `#/$defs/...` there to nothing, and
 * Zod's `fromJSONSchema` (the reader cat-harness-tools' test-run-conformance
 * uses) refused every contract carrying the copy with "Reference not found:
 * #/$defs/stagingLinks".
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fromJSONSchema } from "zod";
import { StagingComparisonSchema } from "./staging";

const HERE = import.meta.dir;
const canon = JSON.parse(readFileSync(join(HERE, "staging-comparison.schema.json"), "utf-8"));
const { $schema: _s, $id: _i, ...canonDef } = canon;

function contracts(): { file: string; json: any }[] {
  const root = join(HERE, "skills");
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap((skill) =>
    ["input.schema.json", "output.schema.json"]
      .map((f) => join(root, skill, f))
      .filter((f) => existsSync(f))
      .map((file) => ({ file, json: JSON.parse(readFileSync(file, "utf-8")) })),
  );
}

describe("staging links", () => {
  test("the JSON definition and the zod schema name the same fields", () => {
    expect(Object.keys(canon.properties).sort()).toEqual(Object.keys(StagingComparisonSchema.shape).sort());
  });

  test("every skill output contract carries stagingLinks", () => {
    const without = contracts()
      .filter((c) => c.file.endsWith("output.schema.json") && c.json?.properties?.stagingLinks === undefined)
      .map((c) => c.file);
    expect(without).toEqual([]);
  });

  test("every inline copy is the canonical definition", () => {
    const carrying = contracts().filter((c) => c.json?.properties?.stagingLinks !== undefined);
    // Not vacuous: a copy moved to another key would otherwise drop out of the
    // filter below and read as "no drift".
    expect(carrying.length).toBeGreaterThan(0);
    const drifted = carrying
      .filter((c) => {
        const def = c.json?.definitions?.stagingLinks;
        if (def === undefined) return true;
        const { $comment: _c, ...copy } = def;
        return JSON.stringify(copy) !== JSON.stringify(canonDef);
      })
      .map((c) => c.file);
    expect(drifted).toEqual([]);
  });

  test("a draft-07 contract keeps its definitions under `definitions`, where its dialect reads them", () => {
    const misplaced = contracts()
      .filter((c) => c.json?.$schema === "http://json-schema.org/draft-07/schema#" && c.json?.$defs !== undefined)
      .map((c) => c.file);
    expect(misplaced).toEqual([]);
  });

  test("every skill contract can be read as JSON Schema by Zod, as a test run is checked", () => {
    const unreadable = contracts().flatMap((c) => {
      try {
        fromJSONSchema(c.json);
        return [];
      } catch (e) {
        return [`${c.file}: ${e instanceof Error ? e.message : String(e)}`];
      }
    });
    expect(unreadable).toEqual([]);
  });
});
