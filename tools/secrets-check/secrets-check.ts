import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// Bean `jzba` (credentials proposal §6.2): the MCP and CLI parity of axis
// 6 — this node is what `src/mcp/project.ts` projects onto MCP, so the CLI
// and the MCP tool are one declaration with one argv.
export default toolFactory((t) =>
  defineTool({
    id: "secrets-check",
    title: "Check declared credential needs against workflow use and expiry, by name",
    description:
      "Compare each repository's declared credential needs (`credentials/needs.json`, profile and registry) with the `secrets.NAME` expressions its workflows reference (GitHub Actions' dollar-and-double-brace form, said in words because this text is rendered on a Jekyll page), with the secret names GitHub lists when a token allows it, and with any recorded expiry. NAMES ONLY — no value is ever read. Findings per §6.2: used-not-declared, declared-not-used, declared-not-present, present-not-declared (reported, never deleted), naming advisories, and expiry (≤30 days minor, ≤7 major, expired critical). Exits 2 when anything could not be determined, which outranks clean; else 1 on a major or critical finding; else 0.",
    install: { none: true },
    invoke: { shell: "bun run cat secrets:check" },
    io: {
      inputs: [
        { name: "repos", schema: t("RepoPath"), required: false, repeated: true, arg: { positional: 0 }, description: "Repository checkouts to check. Default: every repository the index mounts." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Print the result as JSON instead of the human report." },
      ],
      outputs: [
        { name: "verdict", schema: t("Flag"), description: "The exit status: 0 clean, 1 a major or critical finding, 2 could not determine." },
      ],
    },
    satisfies: ["security"],
    selection: {
      when: "Before relying on a workflow's credentials, or to see which secrets a repository needs, uses and lacks.",
      limits: "Presence on GitHub is judged only when a token may list secret names (`list-secret-names`); without one that half is could-not-determine, never clean.",
      cost: "Reads workflow and declaration files; one API call per repository when a token is present.",
    },
    requires: { runtime: ["bun"], network: false },
  }),
);
