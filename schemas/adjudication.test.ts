/**
 * The adjudication contract — tests covering core validation and SWE-Debate multi-round debate extensions.
 *
 * @module schemas/adjudication.test
 * @graphNode none — a test
 */
import { describe, expect, it } from "bun:test";

import {
  ADJUDICATION_SCHEMA_TAG,
  ADJUDICATOR_KINDS,
  AdjudicationOutcomeSchema,
  AdjudicationRequestSchema,
  adjudicationDefects,
  type AdjudicationOutcome,
  type AdjudicationRequest,
} from "./adjudication.js";
import { ACTOR_KINDS } from "./role-graph.js";

const REQUEST: AdjudicationRequest = {
  $schema: ADJUDICATION_SCHEMA_TAG,
  id: "adj-1",
  assets: [{ ref: "library/x", state: "referenced" }],
  prompt: "Do the checker and the reviewer disagree about the same thing?",
  codes: [
    { code: "stands", means: "the finding stands" },
    { code: "scope", means: "the criterion does not apply here" },
    { code: "dispensation", means: "it applies, and this is a stated exception" },
  ],
};

const OUTCOME: AdjudicationOutcome = {
  $schema: ADJUDICATION_SCHEMA_TAG,
  request: "adj-1",
  code: "stands",
  codes: ["stands", "scope", "dispensation"],
  reasoning: "Both read the same revision; the finding is about the text, not the version.",
  by: { id: "untainted-adjudicator", kind: "agent", model: "claude-opus-5" },
  at: "2026-09-23",
};

describe("who may adjudicate", () => {
  it("excludes the MECHANICAL kind — the whole reason the step exists", () => {
    expect(ADJUDICATOR_KINDS as readonly string[]).not.toContain("system");
    expect(ADJUDICATOR_KINDS as readonly string[]).not.toContain("external");
  });

  it("uses the HARNESS's spelling, and every excluded kind really exists", () => {
    for (const k of ADJUDICATOR_KINDS) {
      expect(ACTOR_KINDS as readonly string[], `adjudicator kind \`${k}\` is unknown to the harness`).toContain(k);
    }
    for (const k of ["system", "external"]) {
      expect(ACTOR_KINDS as readonly string[], `\`${k}\` is not a harness kind, so excluding it is vacuous`).toContain(k);
    }
  });

  it("an `agent` adjudicator must name its model", () => {
    const noModel = { ...OUTCOME, by: { id: "a", kind: "agent" as const } };
    expect(AdjudicationOutcomeSchema.safeParse(noModel).success).toBe(false);
    const person = { ...OUTCOME, by: { id: "litlfred", kind: "person" as const } };
    expect(AdjudicationOutcomeSchema.safeParse(person).success).toBe(true);
  });
});

describe("the request", () => {
  it("accepts the worked case", () => {
    expect(AdjudicationRequestSchema.safeParse(REQUEST).success).toBe(true);
  });

  it("REFUSES a single permitted answer — that is assent, not a judgement", () => {
    const one = { ...REQUEST, codes: [REQUEST.codes[0]!] };
    expect(AdjudicationRequestSchema.safeParse(one).success).toBe(false);
  });

  it("refuses two codes sharing a token — the outcome could not say which was chosen", () => {
    const dup = {
      ...REQUEST,
      codes: [
        { code: "stands", means: "one thing" },
        { code: "stands", means: "another thing" },
      ],
    };
    expect(AdjudicationRequestSchema.safeParse(dup).success).toBe(false);
  });
});

describe("the outcome", () => {
  it("accepts the worked case", () => {
    expect(AdjudicationOutcomeSchema.safeParse(OUTCOME).success).toBe(true);
  });

  it("REFUSES a chosen code not in the outcome's own codes enum", () => {
    const badCode = { ...OUTCOME, code: "rejected" };
    expect(AdjudicationOutcomeSchema.safeParse(badCode).success).toBe(false);
  });

  it("detects request mismatch and enum drift in adjudicationDefects", () => {
    expect(adjudicationDefects(REQUEST, OUTCOME)).toEqual([]);
    const wrongReq = { ...OUTCOME, request: "other-req" };
    expect(adjudicationDefects(REQUEST, wrongReq)).toContain("outcome answers `other-req` but the request is `adj-1`");
  });
});

describe("SWE-Debate multi-round debate protocol integration", () => {
  const DEBATE_OUTCOME: AdjudicationOutcome = {
    ...OUTCOME,
    debate: {
      protocol: "swe-debate-v1",
      rounds: [
        {
          round: 1,
          name: "objection-ranking",
          participants: ["L1-formalist", "L2-skeptic", "L3-structural"],
          summary: "L1 ranked highest due to direct theorem quantifier mismatch.",
          proposals: [
            {
              agent: "L1-formalist",
              stance: "da-false-claim",
              argument: "Theorem 2.1 fails under boundary condition x = 0.",
            },
            {
              agent: "L2-skeptic",
              stance: "da-overclaim",
              argument: "Asymptotic claim does not hold on finite samples.",
            },
          ],
        },
        {
          round: 2,
          name: "competitive-refinement",
          participants: ["L1-formalist", "L2-skeptic", "L3-structural"],
          summary: "L1 defended hypothesis against L2 critique; invariant cited.",
          proposals: [
            {
              agent: "L1-formalist",
              stance: "da-false-claim",
              argument: "Boundary condition x = 0 is within stated hypothesis H1.",
              critiques: [
                {
                  targetAgent: "L2-skeptic",
                  point: "L2 focuses on empirical sample size but misses the formal impossibility.",
                  severity: "major",
                },
              ],
            },
          ],
        },
        {
          round: 3,
          name: "discriminator-synthesis",
          participants: ["ADJ-adjudicator"],
          summary: "Adjudicator confirms L1 objection survives rebuttal; L2 objection pre-rebutted by Lemma 1.4.",
        },
      ],
      consensus_reached: true,
      resolved_conflicts: [
        "Resolved conflict between L1 and L2: L1 formal falsification is structural; L2 empirical concern is subsumed.",
      ],
    },
  };

  it("accepts a structured 3-round debate outcome", () => {
    expect(AdjudicationOutcomeSchema.safeParse(DEBATE_OUTCOME).success).toBe(true);
    expect(adjudicationDefects(REQUEST, DEBATE_OUTCOME)).toEqual([]);
  });

  it("detects non-sequential debate rounds in adjudicationDefects", () => {
    const nonSeq = {
      ...DEBATE_OUTCOME,
      debate: {
        ...DEBATE_OUTCOME.debate!,
        rounds: [
          { ...DEBATE_OUTCOME.debate!.rounds[0]!, round: 1 },
          { ...DEBATE_OUTCOME.debate!.rounds[1]!, round: 3 },
        ],
      },
    };
    const defects = adjudicationDefects(REQUEST, nonSeq);
    expect(defects.some((d) => d.includes("debate rounds not sequential"))).toBe(true);
  });
});
