import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// ── Is CI actually passing? A different question from "do the gates pass" ──
//
// Bean `6qaq`, found while working `6366`, whose criterion asked the `gates`
// node to satisfy `ci-health`. It must not, and `1xhc` had already recorded
// why in the list of scripts deliberately left OUT of the gate set:
// "check:ci-health (a report, reads the default branch, so on a PR it
// describes main not the diff)". `gates` RUNS the checks; this REPORTS
// whether the workflows passed. Two capabilities, two nodes.
//
// It had no node at all, and was invisible with it: `tools:coverage` triaged
// `ci-health` into tier D — "no evidence. Almost certainly judgement." —
// because that triage tests the SKILL's markdown for a fenced shell block
// and `ci-health.md` states its three reading rules without ever showing the
// command. A real command, documented in AGENTS.md, and an empty evidence
// list. Fixed under `6366` by counting a declared script as evidence too.
export default toolFactory((t) =>
  defineTool({
    id: "ci-health",
    title: "Is CI passing on the default branch?",
    description:
      "Report each workflow's state on the default branch, which a checkout cannot see: a red workflow looks exactly like a green one from in here. One API call over the recent run history, not one request per workflow — fanning out would exhaust the unauthenticated 60/hr limit and make it unusable at session start.",
    install: { none: true },
    invoke: { shell: "bun run cat check:ci-health" },
    io: {
      inputs: [
        { name: "markdown", schema: t("Flag"), required: false, arg: { flag: "--markdown" }, description: "Emit the block the session-start sweep prints. ALWAYS exits 0, deliberately: the sweep runs it as `if ! …; then` and would otherwise print the report AND declare it unchecked every time CI is red." },
        { name: "warn", schema: t("Flag"), required: false, arg: { flag: "--warn" }, description: "Report only, never fail. For a caller that wants the state without a verdict." },
        { name: "out", schema: t("RepoPath"), required: false, arg: { flag: "--out" }, description: "Write the markdown report to a file AND keep the exit code — which `--markdown` cannot do, since it always exits 0. The notifier gets its own flag rather than one API call being spent twice." },
      ],
      outputs: [
        { name: "report", schema: t("Markdown"), description: "One row per workflow. Five verdicts, not two: green, red, `running`, `superseded` (a red whose workflow file changed after the failing run, so the verdict is against code that no longer exists), and possibly-stale (a red that has not re-run in a week). Three exit codes carry them to a caller that reads no rows: 0 nothing is red, 1 something is, 2 COULD NOT LOOK — the API was unreachable, or `--out` could not be written. A caller must never read 2 as either verdict. `--markdown` and `--warn` always exit 0 by design, so a caller wanting the verdict uses neither.", render: { as: "markdown", reason: "a table a reader reads; rendered with raw HTML off" }},
      ],
    },
    satisfies: ["ci-health"],
    // `network: true` is the unusual part, and it is what makes the third
    // state load-bearing rather than decorative — see `selection.limits`.
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "api.github.com", none: "Workflow outcomes are held by GitHub, not the checkout. It reports 'could not check', which is never green." }],
    selection: {
      when:
        "Before trusting ANY workflow's outcome, and at session start. A workflow's result is invisible from a checkout, which is how `docs-site.yml` failed 30 consecutive runs over two months with nothing in the repository saying so (bean `xom7`).",
      limits:
        "It reads the DEFAULT BRANCH, so on a PR it describes `main` and not the diff — which is why it is deliberately not one of the `gates`. `GITHUB_TOKEN`/`GH_TOKEN` is used when present; without one a public repo still works and a private one fails. A REFUSED OR FAILING API CALL EXITS 2 AND IS NEVER GREEN: could-not-look must stay distinguishable from looked-and-it-was-fine, and bean `1xhc` has a case where this printed green while `main` was red because an unsettled newest run was dropped.",
      cost: "One HTTP request. Fast enough for the session-start sweep, which is the constraint the single-call design exists for.",
    },
  }),
);
