/**
 * Where an instance publishes one subgraph's two files (bean `mo75` G2).
 *
 * @module schemas/subgraph-manifest.test
 */
import { describe, expect, test } from "bun:test";

import { publishedSubgraphDir } from "./subgraph-manifest";

describe("publishedSubgraphDir", () => {
  test("is <docs>/subgraph/<HARNESS>/<PATH>, with no trailing slash", () => {
    expect(publishedSubgraphDir("docs/", "cat-harness", "tools/")).toBe("docs/subgraph/cat-harness/tools");
    expect(publishedSubgraphDir("./site/docs", "h", "skills/sdlc")).toBe("site/docs/subgraph/h/skills/sdlc");
  });

  test("refuses the root (the f233 monolith) and a climbing path", () => {
    expect(() => publishedSubgraphDir("docs/", "h", "")).toThrow(/root/);
    expect(() => publishedSubgraphDir("docs/", "h", ".")).toThrow(/root/);
    expect(() => publishedSubgraphDir("docs/", "h", "a/../b")).toThrow(/climbs/);
  });
});
