import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// The MCP server's image is part of THIS Tool (bean `ar1s`, phase 2):
// `install.container` is its build line, which `deps:python:check` reads
// to find the image whose Python set it checks. Manual, not `container`,
// on invoke: running it starts a SERVER, and a container invoke arm would
// be projected as an MCP tool that launches the server it is served by.
export default toolFactory(() =>
  defineTool({
    id: "mcp-server-image",
    title: "folio MCP server, as a container",
    description:
      "Build and run the folio MCP server as one image carrying Bun, TeX Live, Lean, lean-lsp-mcp and the generated Python set — the image `deploy/` serves behind the auth gateway. Run it with `docker run -i --rm paper-assistant --stdio`, or `--http` on port 8080.",
    install: {
      container:
        "docker build -t paper-assistant -f cat-harness-tools/adapters/mcp-server/Dockerfile .",
    },
    invoke: { manual: true },
    io: { inputs: [], outputs: [] },
    satisfies: ["deployment-auth"],
    requires: { runtime: ["docker"], network: true },
    remedies: [{ host: "archive.ubuntu.com", none: "The image build installs its toolchain from apt, cli.github.com, bun.sh and astral.sh; with any refused the image does not build. Run the server from a checkout instead: `bun run cat-harness-tools/src/index.ts --stdio`." }],
    selection: {
      when: "Deploying the MCP server, or running it where its toolchain (TeX, Lean, Bun) is not installed.",
      limits: "The build context still COPYs a content repository's Lean packages and hecke-engine (see `.github/workflows/build-lean-mcp.yml`), so it builds from a folio checkout, not from this platform alone.",
      cost: "A multi-GB image; the first build takes tens of minutes.",
    },
  }),
);
