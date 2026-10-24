/**
 * The Tool node for building a bean drain's queue.
 *
 * Bean `n7x7`, skill `bean-drain` step 1. On 2026-10-24 a drain thread built
 * this queue by hand, from two bean copies and a list of who held what, into a
 * shared file, and refreshed it as threads finished. The steps were right; doing
 * them by hand meant each refresh re-derived the exclusions slightly
 * differently. The output contract is `definitions.queue` in
 * `schemas/skills/bean-drain/output.schema.json`.
 *
 * @module tools/drain-queue
 */

import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

export default toolFactory((t) =>
  defineTool({
    id: "drain-queue",
    title: "Build a bean drain queue",
    description:
      "Read every bean copy, keep the drainable open beans (task, bug, feature in todo or in-progress, not blocked, not owner-held), group them by the owner already working in that area, mark the ones another agent touched within the window as skip, and list everything left out with its reason and every bean whose copies disagree. The newest updated_at wins where copies disagree.",
    install: { none: true },
    invoke: {
      inProcess: { module: "scripts/drain-queue.ts" },
      shell: "bun run cat beans:drain-queue",
    },
    io: {
      inputs: [
        {
          name: "copy",
          schema: t("RepoPath"),
          required: false,
          repeated: true,
          arg: { flag: "--copy" },
          description: "A local checkout of a bean copy, fetched by the tool to its bean ref. Repeat once per copy. Defaults to the current checkout.",
        },
        {
          name: "holdings",
          schema: t("RepoPath"),
          required: false,
          arg: { flag: "--holdings" },
          description: "A JSON file mapping each owner to the bean ids it holds (`holdings` in the skill's input schema).",
        },
        {
          name: "agents",
          schema: t("RepoPath"),
          required: false,
          arg: { flag: "--agents" },
          description: "A JSON file of the agents and their commit authors (`agents` in the skill's input schema). Defaults to the table in the bean-drain skill.",
        },
        { name: "window", schema: t("TimeWindow"), required: false, arg: { flag: "--window" }, description: "Another agent's commit within this window marks a bean skip. Defaults to 24h." },
        { name: "json", schema: t("Flag"), required: false, arg: { flag: "--json" }, description: "Emit the queue as JSON matching `definitions.queue`, instead of Markdown." },
      ],
      outputs: [
        {
          name: "queue",
          schema: t("Markdown"),
          description:
            "The queue: sources with the tip each was read at, one section per owner in priority order, the spare pool, the excluded beans with reasons, and the copies that disagree. With --json, the same as `definitions.queue` of schemas/skills/bean-drain/output.schema.json. A copy that cannot be fetched is an error, never an empty queue.",
        },
      ],
    },
    satisfies: ["bean-coordination", "idle-backlog"],
    requires: { runtime: ["bun"], network: true },
    remedies: [{ host: "github.com", none: "With no fetch, the queue is built from the copies as last fetched, and the output says how old each tip is." }],
    selection: {
      when: "Starting or refreshing a drain with more than one agent, or giving an idle drainer its next beans.",
      limits:
        "It proposes; it does not claim. Every bean taken from it still goes through `bean-claim-check`. Owner-held is read from the last note's wording and can miss; a person reviewing the queue is the backstop. For one agent picking one bean, `bean-query` named `safe_drain_candidates` is enough.",
      cost: "One fetch per copy and one `git log` per open bean. No GitHub API calls.",
    },
  }),
);
