import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The publish branch's own history of what it served ───────────────
//
// Bean `ru6i`. This node could not be written at all until `render-log.ts`
// took its prose on stdin: `satisfies` needs a skill, the skill is
// `render-logging`, and `check:tools` refuses a `Text` input that is a
// command-line word. The type system was fail-closed and correct, and the
// script's interface was what had to move.
export default toolFactory((t) =>
  defineTool({
    id: "render-log",
    title: "Record what the publish branch served",
    description:
      "Append one entry to the render log on the publish branch: what was published or taken down, when, from which commit, and — for a removal or a retention — WHY. The log is the only place a preview that vanished leaves a trace.",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/render-log.ts" },
    io: {
      inputs: [
        { name: "dir", schema: t("RepoPath"), required: true, arg: { flag: "--dir" }, description: "A checkout of the publish branch, or a publish directory about to become one. This tool NEVER fetches, commits or pushes: the workflows that call it already hold the checkout with their own retry and concurrency handling, and a second pusher racing those is a new way to lose a deploy." },
        { name: "event", schema: t("RenderEvent"), required: true, arg: { flag: "--event" }, description: "`rendered`, `removed`, `restored` or `retained`. `retained` is the one that makes the log worth reading — a removal CONSIDERED and refused, which otherwise leaves no trace at all." },
        { name: "kind", schema: t("Slug"), required: true, arg: { flag: "--kind" }, description: "What was rendered — `staging-preview`, `site`, `export`. Open on purpose: the publish branch carries more than previews, and a closed enum would put a schema change between somebody and logging what they published." },
        { name: "path", schema: t("RepoPath"), required: true, arg: { flag: "--path" }, description: "The path on the publish branch. Checked as a VALUE, never trusted by provenance: the slug sanitiser can emit `..`, and that is only safe for a slug taken from a git ref — a dispatch input is not one (bean `fuzm`)." },
        { name: "slug", schema: t("Slug"), required: false, arg: { flag: "--slug" }, description: "The staging slug, where the subject has one." },
        { name: "branch", schema: t("Branch"), required: false, arg: { flag: "--branch" }, description: "The branch the render came from." },
        { name: "commit", schema: t("CommitSha"), required: false, arg: { flag: "--commit" }, description: "The commit the artefact was built from." },
        { name: "run", schema: t("Url"), required: false, arg: { flag: "--run" }, description: "The workflow run that wrote this, so a reader can open the log." },
        // The whole reason this node exists, and why it took a change to the
        // script rather than a cleverer type.
        { name: "prose", schema: t("Markdown"), required: true, arg: { stdin: true }, description: "One JSON object on STDIN: `{summary, reason?, detail?, format?}`. `summary` is required and one line. `reason` is required by the SCRIPT for `removed` and `retained` — an entry saying an artefact went and not why is the ambiguity the log exists to prevent. `format` declares how the prose reads (absent means plain text, never sniffed). Build it with `jq -n --arg`, never by concatenation." },
      ],
      outputs: [{ name: "entry", schema: t("RepoPath"), description: "The day's JSONL the entry was APPENDED to. Append is the only verb: there is no `--remove`, no `--edit` and no `--id`, so a takedown is a `removed` ENTRY rather than the erasure of the `rendered` one before it — the never-delete rule made structural instead of a guard three cleanup paths have to remember." }],
    },
    satisfies: ["render-logging"],
    requires: { runtime: ["bun", "jq"], network: false },
    selection: {
      when:
        "Whenever something is published to or removed from the publish branch — including a removal that was refused. Called from `feature-staging.yml` at four points; `staging-render-log.bpmn` is the process.",
      limits:
        "It writes into a directory and does not push, so a caller that forgets to commit the log has written nothing durable. It cannot edit or delete an entry, by design. And `--summary` / `--reason` / `--detail` are REFUSED as flags at exit 2 rather than ignored, so a caller left behind by the stdin migration is told instead of silently logging an entry with no summary.",
      cost: "One appended line. No network.",
    },
  }),
);
