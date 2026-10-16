import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "rail-standalone-pages",
    title: "Give every page Jekyll did not lay out the folio-assistant navbar",
    description:
      "A LAST pass over the finished site: inject the shared navbar (`lib/navbar.ts`, the same component the site sidebar draws) into every page that carries none — standalone viewers, generated instance pages, and each IG site built by `stage-ig-sites`. A page under an `igSite` instance's route is railed as THAT instance's page (its name, mark and graphs); a page may declare its own section (`data-fa-visualiser-nav`) and its label (`fa-visualiser-label`). Mount routes are left to the mount pass, and a page that declines (`folio-navbar: none`) is left bare.",
    install: { none: true },
    invoke: { shell: "bun run cat rail:standalone-pages" },
    io: {
      inputs: [
        { name: "site", schema: t("RepoPath"), required: true, description: "The finished site directory." },
        { name: "built", schema: t("Slug"), required: true, description: "The instance whose site this is (`cat-harness`)." },
        { name: "foreign-site", schema: t("Flag"), required: false, arg: { flag: "--foreign-site" }, description: "The site is a folio's, not the platform's: platform links point at the platform's published site." },
        { name: "instance", schema: t("Slug"), required: false, description: "With `--foreign-site`: the instance whose own site this is. Its name, mark and graphs head the navbar, and Harnesses lists it (linking to this site's root) and the harnesses it is built on." },
      ],
      outputs: [
        { name: "railed", schema: t("Count"), description: "Pages given the navbar, beside those already navigated, redirect stubs, pages that declined, and pages with no <body> — each counted, none silently." },
      ],
    },
    satisfies: ["harness-tiles"],
    requires: { runtime: ["bun"], network: false },
  }),
);
