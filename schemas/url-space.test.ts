/**
 * The three URL-space cases and the `enabled` default (bean `nbal`).
 *
 * @module schemas/url-space.test
 */
import { describe, expect, test } from "bun:test";

import { isPublished, publishedPath } from "./url-space.ts";

describe("publishedPath: the three cases", () => {
  test("the root has no segment", () => {
    expect(publishedPath({ case: "root" })).toBe("/");
    expect(publishedPath({ case: "root", path: "guides/agent-onboarding.html" })).toBe("/guides/agent-onboarding.html");
  });

  test("an instance is addressed by its name", () => {
    expect(publishedPath({ case: "instance", instance: "who-iris" })).toBe("/who-iris/");
    expect(publishedPath({ case: "instance", instance: "who-iris", path: "catalogue/" })).toBe("/who-iris/catalogue/");
  });

  test("a viewer is owner, then graph, then subject", () => {
    expect(publishedPath({ case: "viewer", owner: "cat-harness", graph: "docs", subject: "who-iris" })).toBe(
      "/cat-harness/docs/who-iris/",
    );
    expect(publishedPath({ case: "viewer", owner: "cat-harness", graph: "library" })).toBe("/cat-harness/library/");
  });

  test("two renderable graphs of one instance do not collide", () => {
    const a = publishedPath({ case: "viewer", owner: "cat-harness", graph: "docs", path: "index.html" });
    const b = publishedPath({ case: "viewer", owner: "cat-harness", graph: "folio", path: "index.html" });
    expect(a).not.toBe(b);
  });

  test("a base prefixes every case, with or without its trailing slash", () => {
    const base = "https://litlfred.github.io/folio-assistant/";
    expect(publishedPath({ case: "root" }, base)).toBe("https://litlfred.github.io/folio-assistant/");
    expect(publishedPath({ case: "instance", instance: "bootstrap", path: "bootstrap.jsonld" }, base.slice(0, -1))).toBe(
      "https://litlfred.github.io/folio-assistant/bootstrap/bootstrap.jsonld",
    );
  });

  test("a segment or path that steps outside is refused, not normalised", () => {
    expect(() => publishedPath({ case: "instance", instance: "" })).toThrow(/not a path segment/);
    expect(() => publishedPath({ case: "instance", instance: "../x" })).toThrow(/not a path segment/);
    expect(() => publishedPath({ case: "viewer", owner: "a", graph: "b/../c" })).toThrow(/not a path segment/);
    expect(() => publishedPath({ case: "root", path: "../secret" })).toThrow(/steps outside/);
  });
});

describe("isPublished: enabled is a declaration, defaulting to enabled", () => {
  test("absent is enabled; only an explicit false disables", () => {
    expect(isPublished({})).toBe(true);
    expect(isPublished({ enabled: true })).toBe(true);
    expect(isPublished({ enabled: false })).toBe(false);
  });
});
