/**
 * Materialising remote content — the three states, and the five gates.
 *
 * @module schemas/materialization
 * @graphNode schema
 */
import { z } from "zod";

import {
  SignatureSchema,
  SourceProvenanceSchema,
  type Signature,
  type SourceProvenance,
} from "./source-provenance.ts";

export { SignatureSchema, SourceProvenanceSchema };
export type { Signature, SourceProvenance };

import {
  FixitySchema,
  MATERIALIZATION_STATES,
  type Fixity,
  type MaterializationState,
} from "./materialization-state.ts";
export { FixitySchema, MATERIALIZATION_STATES };
export type { Fixity, MaterializationState };

export const MATERIALIZATION_SCHEMA_TAG = "folio-materialization/v1";

export const MATERIALIZATION_PURPOSES = ["working", "archival", "both", "compiled"] as const;
export type MaterializationPurpose = (typeof MATERIALIZATION_PURPOSES)[number];

export const CompiledInputsSchema = z
  .object({
    toolchain: z.string().min(1),
    sourceRevision: z.string().min(1),
    inputDigest: z.string().regex(/^[0-9a-f]{64}$/, "a sha256 digest is 64 lowercase hex characters").optional(),
  })
  .strict();
export type CompiledInputs = z.infer<typeof CompiledInputsSchema>;

export const GATE_VERDICTS = ["unknown", "refused", "permitted"] as const;
export type GateVerdict = (typeof GATE_VERDICTS)[number];

export const GateSchema = z
  .object({
    verdict: z.enum(GATE_VERDICTS),
    basis: z.string().min(1),
    decidedAt: z.string().min(1).optional(),
    decidedBy: z.string().min(1).optional(),
  })
  .strict();
export type Gate = z.infer<typeof GateSchema>;

export const GatesSchema = z
  .object({
    size: GateSchema,
    restrictions: GateSchema,
    retention: GateSchema,
    sourceLoss: GateSchema,
    copyright: GateSchema,
  })
  .strict();
export type Gates = z.infer<typeof GatesSchema>;

export const MaterializationSchema = z
  .object({
    $schema: z.literal(MATERIALIZATION_SCHEMA_TAG).optional(),
    state: z.enum(MATERIALIZATION_STATES),
    provenance: SourceProvenanceSchema,
    localPath: z.string().min(1).optional(),
    bytes: z.number().int().nonnegative().optional(),
    collectionBytes: z.number().int().nonnegative().optional(),
    gates: GatesSchema.optional(),
    purpose: z.enum(MATERIALIZATION_PURPOSES).optional(),
    fixity: FixitySchema.optional(),
    inputs: CompiledInputsSchema.optional(),
    materializedAt: z.string().min(1).optional(),
    upstreamVersion: z.string().min(1).optional(),
    expiresAt: z.string().min(1).optional(),
    /**
     * When this copy was last read. Absent means 'not recorded'.
     *
     * Recorded by readers or explicit touch helpers (bean 7wgs).
     */
    lastReadAt: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((m, ctx) => {
    if (!m.provenance.upstream && !m.provenance.local && !m.note) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "a record with neither `provenance.upstream` nor `provenance.local` requires a `note`.",
      });
    }
    if (m.state === "materialized") {
      if (!m.localPath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "state `materialized` requires `localPath`: bytes that are here are somewhere",
        });
      }
      if (!m.purpose) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "state `materialized` requires a `purpose`.",
        });
      }
      if ((m.purpose === "archival" || m.purpose === "both") && !m.fixity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "an archival copy requires `fixity`.",
        });
      }
      if ((m.purpose === "working" || m.purpose === "compiled") && m.gates?.sourceLoss.verdict === "permitted") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `a \`${m.purpose}\` materialization cannot discharge \`sourceLoss\``,
        });
      }
      if (m.purpose === "compiled" && !m.inputs) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a `compiled` copy requires `inputs`",
        });
      }
      if (!m.gates) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "state `materialized` requires all five `gates`.",
        });
      }
    }
    if (m.inputs && m.purpose !== "compiled") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "`inputs` belongs to a `compiled` copy only.",
      });
    }
    if (m.state !== "materialized" && m.gates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "gates are recorded only where something was materialized.",
      });
    }
  });
export type Materialization = z.infer<typeof MaterializationSchema>;

export type FreshnessVerdict =
  | "fresh"
  | "expired"
  | "no-expiry"
  | "permanent"
  | "input-bound"
  | "not-materialized";

export function freshness(m: Materialization, now: Date): FreshnessVerdict {
  if (m.state !== "materialized") return "not-materialized";
  if (m.purpose === "compiled" && !m.expiresAt) return "input-bound";
  if (!m.expiresAt) {
    return m.purpose === "archival" || m.purpose === "both" ? "permanent" : "no-expiry";
  }
  return new Date(m.expiresAt).getTime() > now.getTime() ? "fresh" : "expired";
}

export type CompiledValidity =
  | { verdict: "valid" }
  | { verdict: "stale-inputs"; differs: Array<keyof CompiledInputs> }
  | { verdict: "cannot-tell"; why: string };

export function compiledValidity(m: Materialization, current: Partial<CompiledInputs>): CompiledValidity {
  if (m.state !== "materialized" || m.purpose !== "compiled" || !m.inputs) {
    return { verdict: "cannot-tell", why: "not a materialized `compiled` copy with recorded inputs" };
  }
  const want: Array<keyof CompiledInputs> = ["toolchain", "sourceRevision"];
  if (m.inputs.inputDigest) want.push("inputDigest");
  const missing = want.filter((k) => current[k] === undefined);
  if (missing.length) {
    return { verdict: "cannot-tell", why: `the current inputs do not state: ${missing.join(", ")}` };
  }
  const differs = want.filter((k) => current[k] !== m.inputs![k]);
  return differs.length ? { verdict: "stale-inputs", differs } : { verdict: "valid" };
}

export function unansweredGates(g: Gates): Array<keyof Gates> {
  return (Object.keys(g) as Array<keyof Gates>).filter((k) => g[k].verdict === "unknown");
}

export const PUBLICATION_GATES = ["copyright", "restrictions"] as const;
export function publicationBlockers(g: Gates | undefined): Array<(typeof PUBLICATION_GATES)[number]> {
  return PUBLICATION_GATES.filter((k) => g?.[k]?.verdict !== "permitted");
}

export function refusedGates(g: Gates): Array<keyof Gates> {
  return (Object.keys(g) as Array<keyof Gates>).filter((k) => g[k].verdict === "refused");
}

/**
 * Record when a materialized copy was last read (bean 7wgs).
 *
 * Who records a read: explicit touch by a caller or reader helper (e.g. MCP node
 * access, skill_fetch, or renderer). Access time on files is disabled on many
 * mounts (noatime) and reset by a git checkout, so an explicit timestamp in the
 * record is the only reliable signal.
 */
export function recordMaterializationRead(record: Materialization, at?: Date): Materialization {
  const updated: Materialization = {
    ...record,
    lastReadAt: (at ?? new Date()).toISOString(),
  };
  return MaterializationSchema.parse(updated);
}

/** Alias for recordMaterializationRead. */
export const touchMaterializedRead = recordMaterializationRead;
