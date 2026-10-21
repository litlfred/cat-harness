import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { neededActors, scenarioLayersBelow } from "./scenario-overlay";

/**
 * An instance audit resolves actors from the platform, every instance the
 * audited one `needs`, and its own `scenarios/actors/` — never from a sibling
 * or a dependent. Built as throwaway trees, never the live repository.
 */
const SCENARIOS = [{ id: "scenarios", path: "scenarios/", graphTypologies: ["scenarios"] }];

function actor(root: string, inst: string, file: string, body: object): void {
  mkdirSync(join(root, inst, "scenarios", "actors"), { recursive: true });
  writeFileSync(join(root, inst, "scenarios", "actors", `${file}.json`), JSON.stringify(body));
}

function checkout(): string {
  const root = mkdtempSync(join(tmpdir(), "needed-actors-"));
  const decl = (name: string, needs: string[]): void => {
    mkdirSync(join(root, name), { recursive: true });
    writeFileSync(join(root, name, `${name}.json`), JSON.stringify({ name, ...(needs.length ? { needs } : {}), directories: SCENARIOS }));
  };
  decl("cat-harness", []);
  decl("mid", ["cat-harness"]);
  decl("top", ["mid"]);
  decl("sibling", ["cat-harness"]);
  actor(root, "cat-harness", "admin", { id: "admin", title: "Administrator", kind: "person", roles: ["administrator"], capabilities: [] });
  actor(root, "mid", "vhl-sharer", { id: "vhl-sharer", title: "VHL Sharer", kind: "system", roles: ["sharer"], capabilities: [] });
  actor(root, "top", "vhl-receiver", { id: "vhl-receiver", title: "VHL Receiver", kind: "system", capabilities: [] });
  actor(root, "top", "sharer-ext", { extends: "vhl-sharer", roles: ["key-holder"] });
  actor(root, "sibling", "stranger", { id: "stranger", title: "Stranger", kind: "person", capabilities: [] });
  return root;
}

describe("neededActors — the actors one instance may name", () => {
  test("the platform's, every needed instance's and its own; not a sibling's", () => {
    const root = checkout();
    try {
      const ids = neededActors(join(root, "top"), join(root, "cat-harness", "scenarios", "actors")).map((a) => a.id).sort();
      expect(ids).toEqual(["admin", "vhl-receiver", "vhl-sharer"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("an extension in the audited instance adds roles to an actor a needed instance declares", () => {
    const root = checkout();
    try {
      const sharer = neededActors(join(root, "top"), join(root, "cat-harness", "scenarios", "actors")).find((a) => a.id === "vhl-sharer");
      expect(sharer?.roles).toEqual(["sharer", "key-holder"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("a needed instance sees nothing of the instance above it", () => {
    const root = checkout();
    try {
      const ids = neededActors(join(root, "mid"), join(root, "cat-harness", "scenarios", "actors")).map((a) => a.id).sort();
      expect(ids).toEqual(["admin", "vhl-sharer"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("the layers are deepest first, the audited instance last", () => {
    const root = checkout();
    try {
      const names = scenarioLayersBelow(join(root, "top")).map((l) => l.instance);
      expect(names).toEqual(["cat-harness", "mid", "top"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
