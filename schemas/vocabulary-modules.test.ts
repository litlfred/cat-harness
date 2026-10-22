/**
 * A typed vocabulary's module supplies its kinds' schemas and rules; with none,
 * every kind is parsed by `BlockSchema` as before.
 */
import { describe, expect, test } from "bun:test";
import { z } from "zod";

import { BlockBaseSchema, typedBlockKinds } from "./constraints.ts";
import { allConstraintRules, allTypedBlockKinds, blockSchemaFor, readVocabulary, vocabularies } from "./vocabulary-modules.ts";

const Widget = BlockBaseSchema.extend({ kind: z.literal("widget"), size: z.number() });
const rule = { id: "widget-size", description: "a widget is small", appliesTo: ["widget"], check: () => null };

describe("readVocabulary holds a module to the contract", () => {
  test("a module typing a declared kind loads, with its rules and builders", () => {
    const v = readVocabulary("gadgets", "g.ts", { blockSchemas: [Widget], constraintRules: [rule], builders: { widget: () => ({}) } }, ["widget"]);
    expect([...v.schemas.keys()]).toEqual(["widget"]);
    expect(v.constraintRules.map((r) => r.id)).toEqual(["widget-size"]);
    expect(Object.keys(v.builders)).toEqual(["widget"]);
  });

  test("it names the module and what is wrong, never types nothing silently", () => {
    expect(() => readVocabulary("gadgets", "g.ts", {}, ["widget"])).toThrow(/g\.ts\) exports no `blockSchemas`/);
    expect(() => readVocabulary("gadgets", "g.ts", { blockSchemas: [Widget] }, [])).toThrow(/types kind "widget", which no block-kind node of "gadgets" declares/);
    expect(() => readVocabulary("gadgets", "g.ts", { blockSchemas: [Widget, Widget] }, ["widget"])).toThrow(/twice/);
    expect(() => readVocabulary("gadgets", "g.ts", { blockSchemas: [z.object({ kind: z.string() })] }, ["widget"])).toThrow(/literal `kind`/);
  });
});

describe("allConstraintRules", () => {
  test("a module's rule replaces a built-in rule with the same id, so it never runs twice", async () => {
    const { CONSTRAINT_RULES } = await import("./constraints.ts");
    const id = CONSTRAINT_RULES[0]!.id;
    const ids = allConstraintRules().map((r) => r.id);
    expect(ids.filter((x) => x === id)).toHaveLength(1);
  });
});

describe("with no vocabulary module discovered", () => {
  test("every kind is BlockSchema's, and the rule list is the built-in one", () => {
    // No typed adapter in this checkout names a module yet.
    expect(vocabularies()).toEqual([]);
    expect(allTypedBlockKinds().sort()).toEqual(typedBlockKinds().sort());
    expect(allConstraintRules().length).toBeGreaterThan(0);
    expect(blockSchemaFor("prose")).toBe(blockSchemaFor("no-such-kind"));
  });
});
