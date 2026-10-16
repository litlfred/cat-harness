import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "github",
    title: "GitHub",
    description:
      "Open and drive change proposals on GitHub — branches, pull requests, reviews, checks. One forge among possible others; the skills it satisfies name none.",
    install: { cli: "gh" },
    invoke: {
      shell: "gh",
      // An MCP arm exists where a server is mounted, but it is never the only
      // one: the harness runs `shell`.
      mcp: { tool: "mcp__github__*" },
    },
    io: {
      inputs: [
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--head" } },
        { name: "number", schema: t("ChangeProposalNumber"), required: false, arg: { positional: 0 } },
        // Free prose is NOT a command-line word. `gh` takes it as
        // `--body-file -`, which is why `stdin` exists as an arg kind.
        { name: "body", schema: t("Markdown"), required: false, arg: { stdin: true } },
      ],
      outputs: [{ name: "url", schema: t("Url"), description: "The change proposal or comment created.", render: { as: "url", reason: "a reader follows it to the proposal; the scheme is checked before it reaches an href" } }],
    },
    satisfies: ["prepare-merge-auto", "pickup", "watch", "coordinate"],
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
