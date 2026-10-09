/**
 * The adjudication contract — what a judgement is ASKED and what it ANSWERS.
 *
 * Bean `5vo9` (contract definition) and bean `o57z` (SWE-Debate multi-round debate integration).
 *
 * ## The core contract
 *
 * > input = {set of content assets, question/prompt (markdown), list of
 * > judgement codes}, make a judgement, output = {decision-code (dependent on
 * > context), reasoning = markdown, [debate] = structured multi-round debate record}.
 * > IO is materialized or by reference. ONLY agentic/human actor.
 *
 * ## Competitive multi-agent debate and structured adjudication (SWE-Debate / 2507.23348v1)
 *
 * Li et al. ("SWE-Debate: Competitive Multi-Agent Debate for Software Issue Resolution",
 * arXiv:2507.23348v1, 2025) demonstrate that single-pass and uncoordinated agent exploration
 * suffer from "limited observation scope", falling into local solutions and superficial symptom-patching
 * when multiple modification points appear plausible. Purely collaborative multi-agent consensus
 * systems further suffer from thought degeneration and premature convergence.
 *
 * SWE-Debate resolves this through a three-stage competitive paradigm:
 *   1. Graph-guided fault propagation traces (dependency graph traversal up to optimal depth L=5);
 *   2. Structured three-round competitive debate (Round 1: ranking of candidate paths;
 *      Round 2: independent proposals + cross-agent competitive critique;
 *      Round 3: discriminator synthesis);
 *   3. Guided downstream execution based on a concrete, actionable plan.
 *
 * In the adjudication contract, {@link AdjudicationDebateSchema} formalizes these debate rounds
 * before referee verdict on {@link AdjudicationOutcomeSchema.debate}:
 *   - Captures candidate proposal hypotheses and ranking (Round 1);
 *   - Records structured cross-agent critique and counter-arguments (Round 2);
 *   - Documents discriminator/adjudicator conflict resolution and synthesis (Round 3)
 *     prior to emitting the final decision code and markdown reasoning.
 *
 * @module schemas/adjudication
 * @graphNode schema
 */
import { z } from "zod";

import { MATERIALIZATION_STATES } from "./materialization-state.js";
import { ModelIdSchema } from "../../bootstrap-tools/schemas/model-registry.ts";

export const ADJUDICATION_SCHEMA_TAG = "folio-adjudication/v1";

/**
 * Who may adjudicate — **the harness's spelling, not a second one.**
 *
 * The owner: *"ONLY agentic human actor."* In this repository's vocabulary
 * that is `person` and `agent`; `system` is the mechanical kind and `external`
 * a participant outside the instance. Both are excluded.
 */
export const ADJUDICATOR_KINDS = ["person", "agent"] as const;
export type AdjudicatorKind = (typeof ADJUDICATOR_KINDS)[number];

/**
 * One thing the adjudicator is shown.
 *
 * `state` is {@link MATERIALIZATION_STATES} (`referenced | materialized | unknown`).
 */
export const AdjudicationAssetSchema = z
  .object({
    /** Stable identifier — a bib-slug, a block id, a path. */
    ref: z.string().min(1),
    state: z.enum(MATERIALIZATION_STATES),
    /**
     * Where the bytes are, when they are anywhere. Required when
     * `materialized`: a materialized asset with no locator is a claim that
     * something is here without saying where.
     */
    at: z.string().min(1).optional(),
    /** What it is, in a few words, so a reader of the record can follow it. */
    note: z.string().min(1).optional(),
  })
  .strict()
  .refine((a) => a.state !== "materialized" || a.at !== undefined, {
    message: "a `materialized` asset must say where — otherwise it asserts presence without location",
    path: ["at"],
  });
export type AdjudicationAsset = z.infer<typeof AdjudicationAssetSchema>;

/**
 * One answer the adjudicator is allowed to give.
 */
export const JudgementCodeSchema = z
  .object({
    code: z.string().min(1),
    /** What choosing this code means. Required. */
    means: z.string().min(1),
  })
  .strict();
export type JudgementCode = z.infer<typeof JudgementCodeSchema>;

/**
 * What an adjudicator is given.
 */
export const AdjudicationRequestSchema = z
  .object({
    $schema: z.literal(ADJUDICATION_SCHEMA_TAG),
    /** Stable id, so an outcome can point back at the exact question asked. */
    id: z.string().min(1),
    /**
     * Everything the adjudicator is shown, and nothing else is.
     */
    assets: z.array(AdjudicationAssetSchema),
    /** The question, as markdown. */
    prompt: z.string().min(1),
    /**
     * The permitted answers — at least two. A single permitted answer is assent,
     * not a judgement.
     */
    codes: z.array(JudgementCodeSchema).min(2, "a single permitted answer is assent, not a judgement"),
  })
  .strict()
  .refine((r) => new Set(r.codes.map((c) => c.code)).size === r.codes.length, {
    message: "two permitted answers share a code — the outcome could not say which was chosen",
    path: ["codes"],
  });
export type AdjudicationRequest = z.infer<typeof AdjudicationRequestSchema>;

/**
 * A structured critique raised by one agent against another's proposal during a debate round.
 * Formalized from SWE-Debate (arXiv:2507.23348v1 §3.3).
 */
export const DebateCritiqueSchema = z
  .object({
    targetAgent: z.string().min(1),
    point: z.string().min(1),
    severity: z.enum(["critical", "major", "minor"]).optional(),
  })
  .strict();
export type DebateCritique = z.infer<typeof DebateCritiqueSchema>;

/**
 * A participant's stance and argument within a debate round.
 */
export const DebateProposalSchema = z
  .object({
    agent: z.string().min(1),
    stance: z.string().min(1),
    argument: z.string().min(1),
    critiques: z.array(DebateCritiqueSchema).optional(),
  })
  .strict();
export type DebateProposal = z.infer<typeof DebateProposalSchema>;

/**
 * One structured round in a multi-agent debate before referee adjudication.
 * Following SWE-Debate:
 *   - Round 1: candidate proposal & ranking (hypothesis selection);
 *   - Round 2: competitive strategy refinement & cross-agent critique;
 *   - Round 3: discriminator synthesis.
 */
export const DebateRoundSchema = z
  .object({
    round: z.number().int().positive(),
    name: z.string().min(1),
    participants: z.array(z.string().min(1)).min(1),
    summary: z.string().min(1),
    proposals: z.array(DebateProposalSchema).optional(),
  })
  .strict();
export type DebateRound = z.infer<typeof DebateRoundSchema>;

/**
 * The structured multi-agent debate record formalizing debate rounds
 * before an adjudicator reaches a final verdict (SWE-Debate, arXiv:2507.23348v1).
 */
export const AdjudicationDebateSchema = z
  .object({
    protocol: z.literal("swe-debate-v1").or(z.string().min(1)),
    rounds: z.array(DebateRoundSchema).min(1),
    consensus_reached: z.boolean().optional(),
    resolved_conflicts: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type AdjudicationDebate = z.infer<typeof AdjudicationDebateSchema>;

/**
 * What an adjudicator answers.
 *
 * Carries `codes` as well as `code`. An outcome that carried only its code would
 * make divergence undetectable when the caller's enum drifts.
 *
 * Optionally carries `debate` when structured multi-agent debate rounds were executed
 * prior to the final verdict (SWE-Debate / 2507.23348v1).
 */
export const AdjudicationOutcomeSchema = z
  .object({
    $schema: z.literal(ADJUDICATION_SCHEMA_TAG),
    /** The request this answers. */
    request: z.string().min(1),
    /** The chosen code. Must be one of `codes`. */
    code: z.string().min(1),
    /** The enum in force when this was adjudicated. */
    codes: z.array(z.string().min(1)).min(2),
    /**
     * Why, as markdown. REQUIRED, and never empty.
     */
    reasoning: z.string().min(1),
    /**
     * Who adjudicated, and of which kind. An outcome with no adjudicator is
     * indistinguishable from a default.
     */
    by: z
      .object({
        id: z.string().min(1),
        kind: z.enum(ADJUDICATOR_KINDS),
        /** An `agent` adjudicator must name its model, so a verdict can be re-examined. */
        model: ModelIdSchema.optional(),
      })
      .strict()
      .refine((b) => b.kind !== "agent" || b.model !== undefined, {
        message: "an `agent` adjudicator must name its model",
        path: ["model"],
      }),
    at: z.string().min(1),
    /**
     * Optional structured debate record formalizing debate rounds
     * conducted prior to the adjudicator's verdict (SWE-Debate / 2507.23348v1).
     */
    debate: AdjudicationDebateSchema.optional(),
  })
  .strict()
  .refine((o) => o.codes.includes(o.code), {
    message: "the chosen code is not in the enum it was adjudicated against",
    path: ["code"],
  });
export type AdjudicationOutcome = z.infer<typeof AdjudicationOutcomeSchema>;

/**
 * Why an outcome does not answer its request. Empty means it does.
 */
export function adjudicationDefects(
  request: AdjudicationRequest,
  outcome: AdjudicationOutcome,
): string[] {
  const out: string[] = [];
  if (outcome.request !== request.id) {
    out.push(`outcome answers \`${outcome.request}\` but the request is \`${request.id}\``);
  }
  const permitted = request.codes.map((c) => c.code);
  if (!permitted.includes(outcome.code)) {
    out.push(`\`${outcome.code}\` is not a permitted answer (${permitted.join(", ")})`);
  }
  // The drift check the two-layer split exists to make possible. Compared as
  // SETS: the order an enum is written in is not part of the contract.
  const a = [...new Set(permitted)].sort();
  const b = [...new Set(outcome.codes)].sort();
  if (a.join("\u0000") !== b.join("\u0000")) {
    out.push(
      `the enum drifted: adjudicated against (${b.join(", ")}), the request now permits (${a.join(", ")}). ` +
        `The outcome is not wrong — it was adjudicated under a different contract, and that is why it records one.`,
    );
  }
  if (outcome.debate) {
    const rounds = outcome.debate.rounds;
    for (let i = 0; i < rounds.length; i++) {
      if (rounds[i]!.round !== i + 1) {
        out.push(`debate rounds not sequential: expected round ${i + 1}, found ${rounds[i]!.round}`);
      }
    }
  }
  return out;
}
