#!/usr/bin/env bun
/**
 * Verify that QA witnesses and QA result sidecars record current script hashes.
 *
 * Bean `folio-assistant-7uao`.
 *
 * ## The failure this prevents
 *
 * A QA result or witness records `script_hash` or `scriptHash` to establish
 * provenance: WHICH version of an auditor or producer generated this verdict.
 * If an auditor script is modified without regenerating the witnesses, the
 * witness claims `freshness: "fresh"` while recording a hash from a version
 * that no longer exists on disk.
 *
 * This check scans `test/results/` for:
 *   - `producer.script` and `producer.script_hash` in `*.qa-results.json` and manifests
 *   - `auditor.script` and `auditor.script_hash` in QA manifests
 *   - `witnesses[].scriptHash` for script witnesses in `.kg.json` and related witness files
 *
 * It distinguishes:
 *   - Exit 0: all recorded script hashes match current file hashes
 *   - Exit 1: at least one recorded hash is STALE (mismatched)
 *   - Exit 2: at least one script could not be read or resolved ("could not determine is a third state")
 *
 * @module scripts/check-qa-witness-hashes
 * @graphNode tool
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { createHash } from "node:crypto";

export interface QaWitnessHashFinding {
  file: string;
  role: string;
  script: string;
  recorded: string;
  computed?: string;
  reason?: string;
}

export interface CheckQaWitnessHashesResult {
  total: number;
  matching: number;
  stale: QaWitnessHashFinding[];
  unreadable: QaWitnessHashFinding[];
  exitCode: number;
}

export interface CheckQaWitnessHashesOptions {
  root?: string;
  resultsDir?: string;
  json?: boolean;
}

/**
 * Strip an algorithm prefix like `sha256:` so digests are comparable.
 */
export function bareDigest(h: string): string {
  const colon = h.indexOf(":");
  return colon === -1 ? h : h.slice(colon + 1);
}

/**
 * Compare two digests, supporting prefix matching (e.g. 12-char prefix vs 64-char full SHA256).
 */
export function digestsAgree(recorded: string, computed: string): boolean {
  const rec = bareDigest(recorded).trim().toLowerCase();
  const comp = bareDigest(computed).trim().toLowerCase();
  const n = Math.min(rec.length, comp.length);
  if (n === 0) return false;
  return rec.slice(0, n) === comp.slice(0, n);
}

/**
 * Resolve a script path recorded in a QA result or witness to an absolute path on disk.
 */
export function resolveScriptPath(script: string, rootDir: string): string | undefined {
  // 1. Direct path relative to root
  const direct = resolve(rootDir, script);
  if (existsSync(direct)) return direct;

  // 2. If starts with "cat-harness/", strip prefix
  if (script.startsWith("cat-harness/")) {
    const stripped = resolve(rootDir, script.slice("cat-harness/".length));
    if (existsSync(stripped)) return stripped;
  }

  // 3. Sibling or nested cat-harness-tools directory candidates
  const scriptBase = basename(script);
  const potentialToolsDirs = [
    resolve(rootDir, "cat-harness-tools"),
    resolve(rootDir, "../cat-harness-tools"),
    resolve(rootDir, "../../cat-harness-tools"),
    resolve(rootDir, "../../../cat-harness-tools"),
  ];

  for (const toolsDir of potentialToolsDirs) {
    if (script.startsWith("cat-harness-tools/")) {
      const fromTools = resolve(toolsDir, script.slice("cat-harness-tools/".length));
      if (existsSync(fromTools)) return fromTools;
    }
    const inToolsScripts = resolve(toolsDir, "scripts", scriptBase);
    if (existsSync(inToolsScripts)) return inToolsScripts;
  }

  // 4. Climb upward to find enclosing monorepo / coordinator root
  let curr = resolve(rootDir);
  while (true) {
    const candidate = resolve(curr, script);
    if (existsSync(candidate)) return candidate;
    const toolsInCurr = resolve(curr, "cat-harness-tools", "scripts", scriptBase);
    if (existsSync(toolsInCurr)) return toolsInCurr;
    const parent = dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  return undefined;
}

/**
 * Recursively find all JSON files in a directory.
 */
function findJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findJsonFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Check all QA results and witness files in resultsDir for script hash freshness.
 */
export function checkQaWitnessHashes(opts: CheckQaWitnessHashesOptions = {}): CheckQaWitnessHashesResult {
  const root = resolve(opts.root ?? resolve(import.meta.dir, ".."));
  const resultsDir = resolve(opts.resultsDir ?? join(root, "test", "results"));

  const files = findJsonFiles(resultsDir);
  const stale: QaWitnessHashFinding[] = [];
  const unreadable: QaWitnessHashFinding[] = [];
  let matching = 0;
  let total = 0;

  const scriptHashCache = new Map<string, string>();

  function checkEntry(filePath: string, role: string, script: string, recorded: string) {
    total++;
    const relFile = relative(root, filePath);
    const resolved = resolveScriptPath(script, root);

    if (!resolved) {
      unreadable.push({
        file: relFile,
        role,
        script,
        recorded,
        reason: `Could not resolve script path: "${script}"`,
      });
      return;
    }

    let currentHash = scriptHashCache.get(resolved);
    if (!currentHash) {
      try {
        currentHash = createHash("sha256").update(readFileSync(resolved)).digest("hex");
        scriptHashCache.set(resolved, currentHash);
      } catch (err) {
        unreadable.push({
          file: relFile,
          role,
          script,
          recorded,
          reason: `Could not read script file: ${(err as Error).message}`,
        });
        return;
      }
    }

    if (!digestsAgree(recorded, currentHash)) {
      stale.push({
        file: relFile,
        role,
        script,
        recorded,
        computed: currentHash.slice(0, bareDigest(recorded).length),
        reason: `Recorded script hash does not match current script content`,
      });
    } else {
      matching++;
    }
  }

  for (const filePath of files) {
    let doc: Record<string, unknown>;
    try {
      doc = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (err) {
      unreadable.push({
        file: relative(root, filePath),
        role: "json",
        script: "n/a",
        recorded: "n/a",
        reason: `Invalid JSON: ${(err as Error).message}`,
      });
      continue;
    }

    if (!doc || typeof doc !== "object") continue;

    // Check producer
    if (doc.producer && typeof doc.producer === "object") {
      const prod = doc.producer as Record<string, unknown>;
      const s = prod.script;
      const h = prod.script_hash ?? prod.scriptHash;
      if (typeof s === "string" && typeof h === "string") {
        checkEntry(filePath, "producer", s, h);
      }
    }

    // Check auditor
    if (doc.auditor && typeof doc.auditor === "object") {
      const aud = doc.auditor as Record<string, unknown>;
      const s = aud.script;
      const h = aud.script_hash ?? aud.scriptHash;
      if (typeof s === "string" && typeof h === "string") {
        checkEntry(filePath, "auditor", s, h);
      }
    }

    // Check criteria witnesses for whole-file auditors (e.g. .kg.json files or kg-audit witnesses)
    if (doc.$schema === "qa-witness/v1" && Array.isArray(doc.criteria)) {
      for (const c of doc.criteria) {
        if (!c || typeof c !== "object") continue;
        const crit = c as Record<string, unknown>;
        if (Array.isArray(crit.witnesses)) {
          for (const w of crit.witnesses) {
            if (!w || typeof w !== "object") continue;
            const wit = w as Record<string, unknown>;
            if (
              wit.kind === "script" &&
              (doc.family === "kg" || wit.id === "scripts/kg-audit.ts") &&
              typeof wit.id === "string" &&
              typeof wit.scriptHash === "string"
            ) {
              checkEntry(filePath, `witness:${crit.id ?? "unknown"}`, wit.id, wit.scriptHash);
            }
          }
        }
      }
    }
  }

  const exitCode = unreadable.length > 0 ? 2 : stale.length > 0 ? 1 : 0;

  return {
    total,
    matching,
    stale,
    unreadable,
    exitCode,
  };
}

// ── CLI Execution ────────────────────────────────────────────────────────────

if (import.meta.main) {
  const args = process.argv.slice(2);
  const isJson = args.includes("--json");

  const result = checkQaWitnessHashes();

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.exitCode === 0) {
      console.log(`✓ All ${result.matching} QA witness script hashes match current script contents.`);
    } else {
      if (result.unreadable.length > 0) {
        console.error(`✗ ${result.unreadable.length} QA witness script(s) could not be read or resolved:`);
        for (const item of result.unreadable) {
          console.error(`  - ${item.file} [${item.role}]: script "${item.script}" (${item.reason})`);
        }
      }
      if (result.stale.length > 0) {
        console.error(`✗ ${result.stale.length} QA witness script hash(es) are stale:`);
        for (const item of result.stale) {
          console.error(
            `  - ${item.file} [${item.role}]: script "${item.script}" recorded "${item.recorded}", current is "${item.computed}"`,
          );
        }
      }
    }
  }

  process.exit(result.exitCode);
}
