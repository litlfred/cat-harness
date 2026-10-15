import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The step BEFORE ingestion, and it had no Tool until 2026-09-30.
//
// Owner, 2026-09-29: "generate documentation from Tool documentation of
// the upload Task/Skill as first step of document ingestion process."
// The chain could not be built, because its first link was missing:
// `document-ingestion.bpmn` began at an EVENT ("a file lands in
// uploads/"), the ingest Tools below both type their first input as a
// file already present, and nothing named the act of putting it there.
// `Task_Place` is that step, `upload-routes` governs it, and this is its
// one mechanism.
export default toolFactory((t) =>
  defineTool({
    id: "upload-url",
    title: "Where to drop a file — the queue's upload URL",
    description:
      "Compose the forge URL a person can drop a file at, from the instance's own declaration: the `uploads` graph's directory, resolved against the ROOT its scope names, expressed relative to the repository, and appended to the origin remote as GitHub's `/upload/<branch>/<path>`. Every failure is NAMED and no URL is guessed — no declaration, no declared `uploads` graph, a declared queue absent from disk, no `origin` remote, and a non-github.com remote each return a reason and a remedy instead. It exists because the obvious composition mints a live 404: the declared path `uploads/` is relative to the INSTANCE and a forge URL needs it relative to the REPOSITORY, so pasting the declared path drops the `cat-harness/` segment. Owner, 2026-09-20, on the hand-written form: \"were it to exist, but it doesmt on main!!!!!\"",
    install: { none: true },
    invoke: { shell: "bun run cat-harness-tools/scripts/upload-url.ts" },
    requires: { runtime: ["bun"], network: false },
    io: {
      inputs: [
        { name: "branch", schema: t("Branch"), required: false, arg: { positional: 0 }, description: "The branch the upload form targets. Defaults to `main`, which is what a forge's web upload form targets when nobody says otherwise — pass the working branch to send somebody at a pull request's head instead, which is the difference between a commit CI judges and one it never sees." },
      ],
      outputs: [
        { name: "url", schema: t("Text"), description: "The upload URL on stdout, exit 0 — or, on stderr and exit 1, the reason it could not be composed and the remedy for that reason. Never a guessed URL: a URL is believed, and somebody sent to a wrong one cannot tell it from an empty directory." },
      ],
    },
    satisfies: ["upload-routes", "content-acquisition"],
    selection: {
      when:
        "You are about to tell somebody where to put a file, in any channel. Reach for it every time rather than when you are unsure — a hand-written path is right until a directory moves, and the failure is silent on the writing side and a 404 on the reading side. It is also the resolver for the question \"which queue\": this repository declares TWO, `uploads/` at the root (the `folio-assistant` instance) and `cat-harness/uploads/` (the `cat-harness` instance), and the answer is whichever instance root you pass, never a literal.",
      limits:
        "It answers WHERE, and nothing else. It does not upload, does not check whether the person has write access, and cannot tell you which of the two declared queues should own a given file — that is undecided and `upload-routes` says so rather than picking. The `/upload/<branch>/<path>` form is GitHub's, so another forge gets a named refusal rather than a guess. And the URL it hands back opens the route with the FEWEST guarantees: the web form has no working tree, so no pre-commit hook and no generator run happen on it, and everything `upload-routes` lists has to be discharged afterwards from a checkout.",
      cost:
        "One read of the declaration and one of the git remote; no network at run time and nothing installed. Measured over `origin/main` on 2026-09-30, the cost of NOT using it: of 16 `Add files via upload` commits, 10 put their files at the repository root, outside any declared queue, where every consumer that resolves the queue from the declaration reads them as absent.",
    },
  }),
);
