import { defineTool } from "../../schemas/tool.js";
import { toolFactory } from "../../schemas/tool-folders.js";
import { viewerTool } from "../lib.js";

// A viewer generator (`viewerTool` in `../lib.ts` holds the ports every viewer shares).
// It reads the site's CDN branch with git, so unlike its siblings it needs the network.
export default toolFactory((t) =>
  defineTool({
    ...viewerTool(t, {
      id: "site-viewer",
      title: "Published site viewer",
      description:
        "List the published site's top-level routes and staging previews, with the pages and files under each, as read from the branch that keeps the site — saying so when the branch is empty or could not be read, never drawing zeros in its place.",
      script: "site:viz",
      renders: ["basic-cdn-site"],
    }),
    requires: { runtime: ["bun", "git"], network: true },
    remedies: [{ host: "github.com", none: "The routes are the remote branch's tree; offline, the page says it could not read the branch rather than listing nothing." }],
  }),
);
