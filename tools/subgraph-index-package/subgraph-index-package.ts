import { toolFactory } from "../../schemas/tools/tool-folders.js";
import { defineTool } from "../../schemas/tools/tool.js";

// Bean `mo75` G2b. Owner, 2026-10-24 (decision card, option A): the subgraph
// index files are published per pin in a package, and a hydrated mount
// fetches them through the Tool its source names. This is the PUBLISH half;
// the fetch half is `remote-mount`, the default `tool` of a `hydrated` source.
// The package's names are `subgraphIndexPackage` in
// `schemas/kg/subgraph-manifest.ts`.
export default toolFactory((t) =>
  defineTool({
    id: "subgraph-index-package",
    title: "Package one pin's subgraph index files for a hydrated mount",
    description:
      "Pack every built `index.jsonld` and `index.hydrated.jsonld` under an instance's `<docs>/subgraph/<harness>/` into ONE npm package for one pin — `<harness>-subgraph-index@0.0.0-pin.<sha>`, with a `folio-subgraph-index/v1` manifest giving each file's sha256 — through `pack-tarball` (`bun pm pack`), which also writes the tarball's `folio-binary-release/v1` record. The reusable workflow `layer-publish-subgraph-index.yml` attaches both to the GitHub release `subgraph-index-<sha>`, where `remote-mount` finds them for a `hydrated` source whose pin's git tree holds no index file (they are `builtAtPublish`, so none does). It builds nothing: run `subgraph:jsonld` first. No subgraph files under the instance is a refusal, never an empty package.",
    install: { none: true },
    invoke: { shell: "bun run cat subgraph-index:pack" },
    io: {
      inputs: [
        { name: "root", schema: t("RepoPath"), required: true, arg: { flag: "--root" }, description: "The instance root whose `<docs>/subgraph/<name>/` is packed." },
        { name: "repository", schema: t("RepoFullName"), required: true, arg: { flag: "--repository" }, description: "owner/name of the repository the pin is a commit of." },
        { name: "ref", schema: t("CommitSha"), required: true, arg: { flag: "--ref" }, description: "The pin: the full 40-character commit the files were built from." },
        { name: "outDir", schema: t("RepoPath"), required: true, arg: { flag: "--out-dir" }, description: "Where the tarball and its release record are written." },
        { name: "builtIn", schema: t("PinnedRepo"), required: false, arg: { flag: "--built-in" }, description: "`<owner/name>@<40-char sha>` of the checkout the files were built in, recorded as provenance." },
      ],
      outputs: [
        { name: "tarball", schema: t("RepoPath"), description: "The package `.tgz`." },
        { name: "release", schema: t("RepoPath"), description: "Its `folio-binary-release/v1` record." },
      ],
    },
    satisfies: ["npm-kg-distribution", "remote-mount"],
    requires: { runtime: ["bun"], network: false },
  }),
);
