import { afterAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { blockKindsRoot } from "./block-kinds.ts";
import { PLATFORM_ROOT, declaredDirectories } from "./declared-nodes.ts";

const base = mkdtempSync(join(tmpdir(), "declared-nodes-"));
afterAll(() => rmSync(base, { recursive: true, force: true }));

describe("one platform root (cat-harness#181)", () => {
  test("PLATFORM_ROOT is the directory above cat-harness/, the root block kinds are scanned from", () => {
    expect(PLATFORM_ROOT).toBe(resolve(dirname(fileURLToPath(import.meta.url)), "..", ".."));
    expect(blockKindsRoot()).toBe(PLATFORM_ROOT);
  });

  test("a fixture that is the same checkout (through a symlink) is not scanned twice", () => {
    const root = join(base, "co");
    mkdirSync(join(root, "lay", "nodes"), { recursive: true });
    writeFileSync(join(root, "lay", "lay.json"), JSON.stringify({ name: "lay", directories: [{ id: "n", path: "nodes/", graphTypologies: ["probe-kind"] }] }));
    symlinkSync(root, join(base, "same"));
    const before = process.env.FOLIO_FIXTURE_CHECKOUT;
    process.env.FOLIO_FIXTURE_CHECKOUT = join(base, "same");
    try {
      expect(declaredDirectories(root, "probe-kind")).toHaveLength(1);
    } finally {
      if (before === undefined) delete process.env.FOLIO_FIXTURE_CHECKOUT;
      else process.env.FOLIO_FIXTURE_CHECKOUT = before;
    }
  });
});
