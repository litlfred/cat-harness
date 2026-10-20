import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// `gh` has no command for this: it is the GraphQL mutation `resolveReviewThread`,
// whose text carries `$id`, which a shell would expand. So the command is a
// script key, and the script (in cat-harness-tools) calls `gh` with an argument
// array. No query text is ever typed into a shell.

export default toolFactory((t) =>
  defineTool({
    id: "github-pr-resolve-thread",
    title: "Resolve a review thread on a pull request (GitHub)",
    description: "Mark one review thread on a pull request as resolved. A GitHub thread id names its pull request, so no number is needed.",
    install: { cli: "gh" },
    invoke: { shell: "bun run cat github:resolve-thread" },
    io: {
      inputs: [
        { name: "thread", schema: t("ReviewThreadId"), required: true, description: "The review thread's node id, e.g. PRRT_kwDO…", arg: { positional: 0 } },
      ],
      outputs: [],
    },
    satisfies: ["coordinate"],
    requires: { network: true },
    remedies: [{ host: "api.github.com", none: "No declared Tool reaches the GitHub API another way. A session that provides the GitHub MCP server can use it instead." }],
  }),
);
