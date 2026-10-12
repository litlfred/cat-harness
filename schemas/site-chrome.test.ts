/**
 * The site CHROME subgraph (proposal semantic-subgraphs-2026-10-09, slice 1;
 * owner, 2026-10-09: "go ahead with the cat-harness chrome subgraph").
 *
 * Pins three things: the site layers are read off the declaration in order,
 * base first; a site file resolves later-wins across them, as compose-docs
 * lays them down; and cat-harness's own chrome is the base, holding the files
 * the slice moved, with its `_config.yml` merging with `docs/`'s to the
 * settings the single file had (ruling D1, parse-equal).
 */
import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";

import { siteChromeDirFor, siteDirFor, siteFileFor, siteLayersFor } from "./cat-harness.js";

const HARNESS = join(import.meta.dir, "..");

function instance(directories: unknown[], files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "site-chrome-"));
  writeFileSync(join(root, "acme.json"), JSON.stringify({ name: "acme", version: "0.1.0", directories }));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), body);
  }
  return root;
}

describe("site layers", () => {
  test("one docs directory: every answer is siteDirFor's", () => {
    const root = instance([{ id: "docs", path: "docs/", graphTypologies: ["docs"] }], { "docs/index.md": "x" });
    try {
      expect(siteLayersFor(root)).toEqual([siteDirFor(root)]);
      expect(siteChromeDirFor(root)).toBe(siteDirFor(root));
      expect(siteFileFor(root, "assets/css/a.css")).toBe(join("docs", "assets/css/a.css"));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("a chrome layer declared first is the base; a file resolves to the top-most layer holding it", () => {
    const root = instance(
      [
        { id: "chrome", path: "chrome/", graphTypologies: ["docs"] },
        { id: "docs", path: "docs/", graphTypologies: ["docs"] },
        { id: "root-docs", path: "../docs/", graphTypologies: ["docs"], scope: "repository" },
      ],
      { "chrome/_includes/head_custom.html": "c", "chrome/_config.yml": "a: 1", "docs/_config.yml": "b: 2" },
    );
    try {
      expect(siteLayersFor(root)).toEqual(["chrome", "docs"]);
      expect(siteChromeDirFor(root)).toBe("chrome");
      expect(siteFileFor(root, "_includes/head_custom.html")).toBe(join("chrome", "_includes/head_custom.html"));
      expect(siteFileFor(root, "_config.yml")).toBe(join("docs", "_config.yml"));
      // Held by no layer: written where the chrome lives.
      expect(siteFileFor(root, "assets/css/new.css")).toBe(join("chrome", "assets/css/new.css"));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("cat-harness's own site chrome", () => {
  test("is declared before docs, so it is the base layer", () => {
    expect(siteLayersFor(HARNESS)).toEqual(["site-chrome", "docs"]);
    expect(siteChromeDirFor(HARNESS)).toBe("site-chrome");
  });

  test("holds the chrome the slice moved, and docs/ no longer does", () => {
    for (const rel of [
      "_includes/head_custom.html",
      "_includes/footer_custom.html",
      "_includes/nav_footer_custom.html",
      "_includes/mermaid_config.js",
      "assets/css/docs-ui.css",
      "assets/js/docs-ui.js",
      "assets/js/navbar.js",
      "Gemfile",
    ]) {
      expect(siteFileFor(HARNESS, rel)).toBe(join("site-chrome", rel));
      expect(existsSync(join(HARNESS, "docs", rel))).toBe(false);
    }
    // Ruling D2: the harness pages' own assets stay with the pages.
    for (const rel of ["assets/js/work-plan.js", "assets/js/process-index.js", "assets/js/slice-sqlite.js", "assets/js/kg-render.js"]) {
      expect(siteFileFor(HARNESS, rel)).toBe(join("docs", rel));
    }
  });

  test("an include the chrome pulls in exists in the chrome alone, so a site with no harness pages builds", () => {
    for (const rel of ["_includes/generated/navbar-footer.html", "_includes/generated/todo-listing.html"]) {
      expect(existsSync(join(HARNESS, "site-chrome", rel))).toBe(true);
    }
  });

  test("the two _config.yml layers merge to a config with the theme keys and the site's identity (D1)", () => {
    const chrome = parseYaml(readFileSync(join(HARNESS, "site-chrome/_config.yml"), "utf-8")) as Record<string, unknown>;
    const docs = parseYaml(readFileSync(join(HARNESS, "docs/_config.yml"), "utf-8")) as Record<string, unknown>;
    expect(chrome.remote_theme).toMatch(/^just-the-docs\/just-the-docs@/);
    expect(docs.remote_theme).toBeUndefined();
    expect(chrome.title).toBeUndefined();
    expect(docs.title).toBeDefined();
    // Lists replace, so the overlay restates what the chrome excludes.
    for (const x of chrome.exclude as string[]) expect(docs.exclude as string[]).toContain(x);
  });
});
