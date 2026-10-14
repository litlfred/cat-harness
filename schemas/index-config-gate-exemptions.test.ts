/**
 * An index declares the gate exemptions of its OWN workflows
 * (`gateExemptions` in `index.config.json`), in the shape an instance
 * declaration uses, and every rewrite of the index keeps them.
 */
import { describe, expect, test } from "bun:test";

import { GateExemptionsSchema } from "./cat-harness";
import { INDEX_CONFIG_SCHEMA, IndexConfigSchema, formatIndexConfig } from "./index-config";

const base = { $schema: INDEX_CONFIG_SCHEMA, instances: [{ name: "a" }] };
const exemptions = { steps: [{ match: "bun run cat state:push -- --id health", kind: "ci-only", reason: "a write, not a check" }] };

describe("an index's own gate exemptions", () => {
  test("parse in the shape an instance declaration uses", () => {
    expect(IndexConfigSchema.safeParse({ ...base, gateExemptions: exemptions }).success).toBe(true);
    expect(GateExemptionsSchema.safeParse(exemptions).success).toBe(true);
  });

  test("are refused when malformed — no reason, an unknown kind, an unknown key", () => {
    for (const bad of [
      { steps: [{ match: "x", kind: "ci-only", reason: " " }] },
      { steps: [{ match: "x", kind: "slow", reason: "r" }] },
      { steps: [], extra: true },
    ]) expect(IndexConfigSchema.safeParse({ ...base, gateExemptions: bad }).success).toBe(false);
  });

  test("survive formatIndexConfig, last, and are absent when not declared", () => {
    const parsed = IndexConfigSchema.parse({ ...base, site: { landing: "a" }, gateExemptions: exemptions });
    const text = formatIndexConfig(parsed);
    const back = JSON.parse(text) as Record<string, unknown>;
    expect(back.gateExemptions).toEqual(exemptions);
    expect(Object.keys(back).at(-1)).toBe("gateExemptions");
    expect("gateExemptions" in (JSON.parse(formatIndexConfig(IndexConfigSchema.parse(base))) as object)).toBe(false);
  });
});
