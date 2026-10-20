/**
 * `source` and `narrative` on a CSVW record (bean `urat`): accepted, still
 * optional, and never leaked into the derived CSVW document.
 */
import { describe, expect, it } from "bun:test";

import { CSVW_KEYS, TabularCsvwSchema, toCsvw } from "./tabular-csvw";

const base = {
  $schema: "folio-tabular-csvw/v1",
  doc_id: "p",
  tables: [
    {
      url: "p.csv",
      tableSchema: { columns: [{ name: "a", titles: "a", datatype: "string", datatypeSource: "measured" }] },
      "fac:anchor": null,
      "fac:headerRow": 1,
      "fac:extent": { rows: 1, columns: 1, source: "measured" },
    },
  ],
};

describe("provenance on a CSVW record", () => {
  it("is optional, so records written before it still validate", () => {
    expect(TabularCsvwSchema.safeParse(base).success).toBe(true);
  });

  it("carries the same source and narrative blocks v1 does", () => {
    const r = TabularCsvwSchema.parse({
      ...base,
      source: { file: "p.csv", sha256: "0".repeat(64), mimetype_sniffed: null },
      narrative: { text: null, state: "not-authored" },
    });
    expect(r.source?.file).toBe("p.csv");
    expect(r.narrative?.state).toBe("not-authored");
  });

  it("rejects a narrative that breaks its own state machine", () => {
    expect(TabularCsvwSchema.safeParse({ ...base, narrative: { text: null, state: "confirmed" } }).success).toBe(false);
  });

  it("never reaches the CSVW document a standard reader is handed", () => {
    const out = toCsvw(TabularCsvwSchema.parse({ ...base, source: { file: "p.csv" }, narrative: { text: null, state: "not-authored" } }));
    for (const k of Object.keys(out)) expect(CSVW_KEYS.has(k)).toBe(true);
    expect(JSON.stringify(out)).not.toContain("sha256");
  });
});
