/**
 * Tests for scripts/check-qa-witness-hashes.ts.
 *
 * Verifies that QA witnesses and result sidecars have valid and fresh script hashes,
 * distinguishing stale hashes (exit 1) from unreadable/unresolvable scripts (exit 2).
 */
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";

import {
  bareDigest,
  digestsAgree,
  resolveScriptPath,
  checkQaWitnessHashes,
} from "../check-qa-witness-hashes.ts";

describe("check-qa-witness-hashes", () => {
  describe("bareDigest and digestsAgree", () => {
    test("strips algorithm prefix", () => {
      expect(bareDigest("sha256:1234567890ab")).toBe("1234567890ab");
      expect(bareDigest("1234567890ab")).toBe("1234567890ab");
    });

    test("prefix matches full hash", () => {
      const full = "41b7161691f1d00b60a24a9b43ba29116114142f83a52a69bf31706425172430";
      expect(digestsAgree(full.slice(0, 12), full)).toBe(true);
      expect(digestsAgree("sha256:" + full.slice(0, 12), full)).toBe(true);
      expect(digestsAgree("sha256:" + full, full.slice(0, 12))).toBe(true);
      expect(digestsAgree(full.toUpperCase(), full.toLowerCase())).toBe(true);
    });

    test("detects hash mismatches", () => {
      const full = "41b7161691f1d00b60a24a9b43ba29116114142f83a52a69bf31706425172430";
      expect(digestsAgree("000000000000", full)).toBe(false);
      expect(digestsAgree("", full)).toBe(false);
    });
  });

  describe("resolveScriptPath", () => {
    test("resolves direct path, cat-harness/ stripped path, and tools fallback", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-script-resolve-"));
      try {
        mkdirSync(join(dir, "scripts"), { recursive: true });
        writeFileSync(join(dir, "scripts", "test-script.ts"), "console.log('hi');");

        // 1. Direct path
        expect(resolveScriptPath("scripts/test-script.ts", dir)).toBe(
          join(dir, "scripts", "test-script.ts"),
        );

        // 2. cat-harness/ prefix
        expect(resolveScriptPath("cat-harness/scripts/test-script.ts", dir)).toBe(
          join(dir, "scripts", "test-script.ts"),
        );

        // 3. Unresolvable path returns undefined
        expect(resolveScriptPath("scripts/nonexistent.ts", dir)).toBeUndefined();
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  describe("checkQaWitnessHashes against fixtures", () => {
    test("passes (exitCode 0) when all hashes match", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-hashes-pass-"));
      try {
        const scriptsDir = join(dir, "scripts");
        const resultsDir = join(dir, "test", "results");
        mkdirSync(scriptsDir, { recursive: true });
        mkdirSync(resultsDir, { recursive: true });

        const scriptContent = "export const x = 1;\n";
        writeFileSync(join(scriptsDir, "auditor.ts"), scriptContent);
        const hash = createHash("sha256").update(scriptContent).digest("hex").slice(0, 12);

        // Write a qa-results file
        writeFileSync(
          join(resultsDir, "test.qa-results.json"),
          JSON.stringify({
            $schema: "qa-results/v1",
            producer: {
              script: "scripts/auditor.ts",
              script_hash: hash,
            },
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir });
        expect(res.exitCode).toBe(0);
        expect(res.total).toBe(1);
        expect(res.matching).toBe(1);
        expect(res.stale).toHaveLength(0);
        expect(res.unreadable).toHaveLength(0);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    test("fails with exitCode 1 when a hash is stale", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-hashes-stale-"));
      try {
        const scriptsDir = join(dir, "scripts");
        const resultsDir = join(dir, "test", "results");
        mkdirSync(scriptsDir, { recursive: true });
        mkdirSync(resultsDir, { recursive: true });

        const scriptContent = "export const x = 1;\n";
        writeFileSync(join(scriptsDir, "auditor.ts"), scriptContent);

        // Write a qa-results file with a stale hash
        writeFileSync(
          join(resultsDir, "test.qa-results.json"),
          JSON.stringify({
            $schema: "qa-results/v1",
            producer: {
              script: "scripts/auditor.ts",
              script_hash: "000000000000",
            },
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir });
        expect(res.exitCode).toBe(1);
        expect(res.total).toBe(1);
        expect(res.matching).toBe(0);
        expect(res.stale).toHaveLength(1);
        expect(res.stale[0].file).toBe("test/results/test.qa-results.json");
        expect(res.stale[0].recorded).toBe("000000000000");
        expect(res.unreadable).toHaveLength(0);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    test("fails with exitCode 2 when a script cannot be resolved", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-hashes-unreadable-"));
      try {
        const resultsDir = join(dir, "test", "results");
        mkdirSync(resultsDir, { recursive: true });

        // Write a qa-results file pointing to nonexistent script
        writeFileSync(
          join(resultsDir, "test.qa-results.json"),
          JSON.stringify({
            $schema: "qa-results/v1",
            producer: {
              script: "scripts/missing.ts",
              script_hash: "1234567890ab",
            },
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir });
        expect(res.exitCode).toBe(2);
        expect(res.total).toBe(1);
        expect(res.matching).toBe(0);
        expect(res.stale).toHaveLength(0);
        expect(res.unreadable).toHaveLength(1);
        expect(res.unreadable[0].script).toBe("scripts/missing.ts");
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    test("exitCode 2 takes precedence over exitCode 1 when both unreadable and stale occur", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-hashes-precedence-"));
      try {
        const scriptsDir = join(dir, "scripts");
        const resultsDir = join(dir, "test", "results");
        mkdirSync(scriptsDir, { recursive: true });
        mkdirSync(resultsDir, { recursive: true });

        const scriptContent = "export const x = 1;\n";
        writeFileSync(join(scriptsDir, "auditor.ts"), scriptContent);

        // 1 stale, 1 unreadable
        writeFileSync(
          join(resultsDir, "stale.qa-results.json"),
          JSON.stringify({
            $schema: "qa-results/v1",
            producer: {
              script: "scripts/auditor.ts",
              script_hash: "deadbeefcafe",
            },
          }),
        );
        writeFileSync(
          join(resultsDir, "missing.qa-results.json"),
          JSON.stringify({
            $schema: "qa-results/v1",
            producer: {
              script: "scripts/does-not-exist.ts",
              script_hash: "1234567890ab",
            },
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir });
        expect(res.exitCode).toBe(2);
        expect(res.total).toBe(2);
        expect(res.stale).toHaveLength(1);
        expect(res.unreadable).toHaveLength(1);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    test("checks auditor field in manifest files", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-manifest-"));
      try {
        const scriptsDir = join(dir, "scripts");
        const resultsDir = join(dir, "test", "results");
        mkdirSync(scriptsDir, { recursive: true });
        mkdirSync(resultsDir, { recursive: true });

        const scriptContent = "console.log('manifest auditor');\n";
        writeFileSync(join(scriptsDir, "kg-audit.ts"), scriptContent);
        const fullHash = createHash("sha256").update(scriptContent).digest("hex");

        writeFileSync(
          join(resultsDir, "kg-qa.manifest.json"),
          JSON.stringify({
            auditor: {
              script: "scripts/kg-audit.ts",
              script_hash: "sha256:" + fullHash,
            },
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir });
        expect(res.exitCode).toBe(0);
        expect(res.total).toBe(1);
        expect(res.matching).toBe(1);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    test("checks witness scriptHash in .kg.json files", () => {
      const dir = mkdtempSync(join(tmpdir(), "qa-kg-witness-"));
      try {
        const scriptsDir = join(dir, "scripts");
        const resultsDir = join(dir, "test", "results", "witnesses");
        mkdirSync(scriptsDir, { recursive: true });
        mkdirSync(resultsDir, { recursive: true });

        const scriptContent = "console.log('kg auditor');\n";
        writeFileSync(join(scriptsDir, "kg-audit.ts"), scriptContent);
        const fullHash = createHash("sha256").update(scriptContent).digest("hex");

        writeFileSync(
          join(resultsDir, "example.kg.json"),
          JSON.stringify({
            $schema: "qa-witness/v1",
            family: "kg",
            criteria: [
              {
                id: "test-criterion",
                result: "pass",
                witnesses: [
                  {
                    kind: "script",
                    id: "scripts/kg-audit.ts",
                    scriptHash: "sha256:" + fullHash,
                  },
                ],
              },
            ],
          }),
        );

        const res = checkQaWitnessHashes({ root: dir, resultsDir: join(dir, "test", "results") });
        expect(res.exitCode).toBe(0);
        expect(res.total).toBe(1);
        expect(res.matching).toBe(1);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });
});
