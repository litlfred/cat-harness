import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// Owner, 2026-10-12 (task 6): "a check that proves a repo's cutover from
// the monorepo is complete — measure it, do not assume it". The gate after
// kg-separation stage 13 (processes/kg/kg-separation.bpmn, GW_CutoverComplete).
export default toolFactory((t) =>
  defineTool({
    id: "separation-cutover-check",
    title: "Is this repository's cutover from the monorepo complete? Measured, condition by condition",
    description:
      "Run in a separated repository. Six conditions, each decided by an existing gate: `mounts` (every declared layer on disk at its pin — `remote-mount --check`), `declarations` (every path a declaration names resolves — `declaration-resolution`), `monorepo-paths` (no wiring still names the monorepo: `livesAt` on it, a submodule of it, a reusable workflow called from it, a path into its old checkout — the one condition implemented here), `import-direction` and `reference-direction` (no layer reaches a layer above it), and `site` (the site builds from the mounts alone, every link resolving — `build-instance-site --no-mount`, only with `--site`). Findings inside a MOUNTED layer are listed and not counted: a defect in a layer pinned from upstream is fixed upstream and re-pinned. Exit 0 complete, 1 a condition failed, 2 a condition could not be determined or was not run — without `--site` the answer is never 0.",
    install: { none: true },
    invoke: { shell: "bun run cat separation:cutover:check" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: false, arg: { flag: "--root" }, description: "The separated checkout. Default: the working directory." },
        { name: "site", schema: t("Flag"), required: false, arg: { flag: "--site" }, description: "Build the site from the mounts on disk (minutes); without it the `site` condition is not run and the verdict cannot be complete." },
        { name: "monorepo", schema: t("RepoFullName"), required: false, arg: { flag: "--monorepo" }, description: "The repository the separation left, `<owner>/<repo>`. Default: litlfred/folio-assistant." },
        { name: "monorepoDir", schema: t("Slug"), required: false, arg: { flag: "--monorepo-dir" }, description: "Its old checkout directory name, as paths spell it. Default: the repository's name." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Print the report as JSON, mounted-layer findings included." },
      ],
      outputs: [
        { name: "conditions", schema: t("Count"), description: "Per condition: pass, fail, could-not-determine or not-run, the gate that decided it, and its findings." },
      ],
    },
    satisfies: ["kg-separation"],
    selection: {
      when: "Before calling a separation's cutover (kg-separation stage 13) done, and after any re-pin of a separated repository's layers.",
      limits: "It judges ONE repository. A downstream's own CI (lesson 17) and the parent's retirement into fsh-guts are not observed from here.",
      cost: "Seconds without `--site`; a full Jekyll build with it.",
    },
    requires: { runtime: ["bun", "git"], network: false },
  }),
);
