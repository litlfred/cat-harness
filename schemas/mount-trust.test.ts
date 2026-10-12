import { describe, expect, test } from "bun:test";
import { mountTrust, MountTrustBasisSchema, MountTrustSchema, withConsent } from "./mount-trust.ts";

const PIN = "a".repeat(40);
const OTHER = "b".repeat(40);
const consent = (ref: string) => ({ consent: { by: "litlfred", on: "2026-10-07", ref, evidence: "issue #2389" } });

describe("mount trust (H8): signed provenance or explicit consent; staging needs neither", () => {
  test("staging mounts with no signature and no consent", () => {
    expect(mountTrust({ harness: "x", ref: PIN }, "staging")).toMatchObject({ ok: true, basis: "staging" });
  });

  test("unsigned and unconsented is REFUSED", () => {
    expect(mountTrust({ harness: "x", ref: PIN }, "mount")).toMatchObject({ ok: false, state: "refused" });
  });

  test("consent for this exact pin mounts", () => {
    expect(mountTrust({ harness: "x", ref: PIN, trust: consent(PIN) }, "mount")).toMatchObject({ ok: true, basis: "consent" });
  });

  test("consent for a different pin is refused: a moved pin asks again", () => {
    expect(mountTrust({ harness: "x", ref: PIN, trust: consent(OTHER) }, "mount")).toMatchObject({ ok: false, state: "refused" });
  });

  test("a signature with no verifier is could-not-determine, never trusted", () => {
    const trust = { signature: { network: "gdhcn", keyId: "k1", signedDigest: "c".repeat(64), value: "sig" } };
    expect(mountTrust({ harness: "x", ref: PIN, trust }, "mount")).toMatchObject({ ok: false, state: "could-not-determine" });
  });

  test("the record is strict: an unknown trust key does not validate", () => {
    expect(MountTrustSchema.safeParse({ trusted: true }).success).toBe(false);
    expect(MountTrustSchema.safeParse(consent(PIN)).success).toBe(true);
  });

  test("the verdict carries the record the lock keeps: who, when, and whether the approver was checked", () => {
    expect(mountTrust({ harness: "x", ref: PIN, trust: consent(PIN) }, "mount", ["litlfred"])).toMatchObject({
      ok: true,
      approver: "declared",
      record: { basis: "consent", by: "litlfred", on: "2026-10-07", ref: PIN, approver: "declared" },
    });
    expect(mountTrust({ harness: "x", ref: PIN }, "staging")).toMatchObject({ record: { basis: "staging" } });
  });

  test("no declared approvers: consent proceeds but is UNVERIFIED, never plain clean", () => {
    const v = mountTrust({ harness: "x", ref: PIN, trust: consent(PIN) }, "mount");
    expect(v).toMatchObject({ ok: true, approver: "unverified" });
    expect(v.detail).toContain("UNVERIFIED APPROVER");
    expect(mountTrust({ harness: "x", ref: PIN, trust: consent(PIN) }, "mount", [])).toMatchObject({ approver: "unverified" });
  });

  test("declared approvers: consent by anyone else is refused", () => {
    expect(mountTrust({ harness: "x", ref: PIN, trust: consent(PIN) }, "mount", ["someone-else"])).toMatchObject({ ok: false, state: "refused" });
  });

  test("the recorded basis is strict: a consent basis needs who, when, the pin and the approver state", () => {
    expect(MountTrustBasisSchema.safeParse({ basis: "staging" }).success).toBe(true);
    expect(MountTrustBasisSchema.safeParse({ basis: "consent", by: "a", on: "2026-10-07", ref: PIN, approver: "declared" }).success).toBe(true);
    expect(MountTrustBasisSchema.safeParse({ basis: "consent", by: "a", on: "2026-10-07", ref: PIN }).success).toBe(false);
    expect(MountTrustBasisSchema.safeParse({ basis: "signature" }).success).toBe(false);
  });
});

describe("withConsent: seeding writes consent for the pin it writes (task #10, gap c)", () => {
  const grant = { by: "litlfred", evidence: "session X: 'repin as needed'", on: "2026-10-12" };

  test("an unconsented mount gains consent bound to ITS ref, and then mounts", () => {
    const m = withConsent({ harness: "x", ref: PIN }, grant);
    expect(m.trust?.consent).toEqual({ by: "litlfred", on: "2026-10-12", ref: PIN, evidence: grant.evidence });
    expect(mountTrust(m, "mount")).toMatchObject({ ok: true, basis: "consent" });
  });

  test("a consent for a moved pin is replaced by the new grant", () => {
    const m = withConsent({ harness: "x", ref: PIN, trust: consent(OTHER) }, grant);
    expect(m.trust?.consent?.ref).toBe(PIN);
    expect(m.trust?.consent?.evidence).toBe(grant.evidence);
  });

  test("a consent already recorded for this pin is kept, not rewritten", () => {
    const before = { harness: "x", ref: PIN, trust: consent(PIN) };
    expect(withConsent(before, grant)).toBe(before);
  });

  test("a signature is kept beside the new consent", () => {
    const signature = { network: "gdhcn", keyId: "k", signedDigest: "c".repeat(64), value: "v" };
    expect(withConsent({ harness: "x", ref: PIN, trust: { signature } }, grant).trust?.signature).toEqual(signature);
  });

  test("an empty grant throws rather than writing consent nobody can read", () => {
    expect(() => withConsent({ harness: "x", ref: PIN }, { by: "", evidence: "e" })).toThrow();
    expect(() => withConsent({ harness: "x", ref: PIN }, { by: "b", evidence: "" })).toThrow();
  });

  test("`on` defaults to today", () => {
    expect(withConsent({ harness: "x", ref: PIN }, { by: "b", evidence: "e" }).trust?.consent?.on).toBe(new Date().toISOString().slice(0, 10));
  });
});
