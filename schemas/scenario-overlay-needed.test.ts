import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { checkoutPolicies, neededActors, neededPolicies, scenarioLayersBelow } from "./scenario-overlay";

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

function policy(root: string, inst: string, file: string, uid: string, permission: object[]): void {
  mkdirSync(join(root, inst, "policies"), { recursive: true });
  writeFileSync(
    join(root, inst, "policies", `${file}.jsonld`),
    JSON.stringify({ "@context": "http://www.w3.org/ns/odrl.jsonld", "@type": "Set", uid, profile: "urn:folio-odrl", permission }),
  );
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
  policy(root, "cat-harness", "defaults", "urn:p:defaults", [{ assignee: "admin", action: "role-management" }]);
  policy(root, "mid", "sharing", "urn:p:mid", [{ assignee: "vhl-sharer", action: "content-authoring" }]);
  policy(root, "sibling", "stranger", "urn:p:sibling", [{ assignee: "stranger", action: "content-authoring" }]);
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

describe("policies travel with the actors they grant", () => {
  const PLATFORM = (root: string) => join(root, "cat-harness", "policies");

  test("an instance's own audit reads the platform's, every needed instance's and its own; not a sibling's", () => {
    const root = checkout();
    try {
      expect([...neededPolicies(join(root, "top"), PLATFORM(root)).keys()].sort()).toEqual(["urn:p:defaults", "urn:p:mid"]);
      expect([...neededPolicies(join(root, "mid"), PLATFORM(root)).keys()].sort()).toEqual(["urn:p:defaults", "urn:p:mid"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("the platform's checkout reads every dependent's", () => {
    const root = checkout();
    try {
      const uids = [...checkoutPolicies(join(root, "cat-harness"), PLATFORM(root)).keys()].sort();
      expect(uids).toEqual(["urn:p:defaults", "urn:p:mid", "urn:p:sibling"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("a higher instance redeclaring a lower policy's uid is refused, not merged", () => {
    const root = checkout();
    try {
      policy(root, "top", "takeover", "urn:p:defaults", []);
      expect(() => neededPolicies(join(root, "top"), PLATFORM(root))).toThrow(/already declared below/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
