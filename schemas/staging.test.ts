/**
 * Staging links travel with every request for feedback (owner, 2026-10-14;
 * beans u1os, 28k2, g4dv). The shape is defined once, in
 * `staging-comparison.schema.json`, mirrored by `StagingComparisonSchema`, and
 * copied inline as `$defs.stagingLinks` into each skill contract, since a skill
 * contract is read standalone. These tests keep the copies honest.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
    const drifted = contracts()
      .filter((c) => c.json?.$defs?.stagingLinks !== undefined)
      .filter((c) => {
        const { $comment: _c, ...copy } = c.json.$defs.stagingLinks;
        return JSON.stringify(copy) !== JSON.stringify(canonDef);
      })
      .map((c) => c.file);
    expect(drifted).toEqual([]);
  });
});
