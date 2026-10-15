import { toolFactory } from "../../schemas/tool-folders.js";
import { defineTool } from "../../schemas/tool.js";

// ── The SPDX License List, pinned as a value vocabulary (bean `sd5v`) ──
//
// The owner, 2026-10-03: "go ahead with licence-id validation, that's it
// for now". The List is the authority a `licence.json` id is checked
// against, snapshotted at the pinned edition as `pin-ig-terminology` does
// for an IG — so it satisfies the same skill. No SPDX document is made.
export default toolFactory((t) =>
  defineTool({
    id: "pin-spdx-license-list",
    title: "Snapshot the SPDX License List at its pinned version",
    description:
      "Read `json/licenses.json` and `json/exceptions.json` from a copy of github.com/spdx/license-list-data at the pinned tag and write `cat-harness/external-schemas/spdx-license-list.terminology.json` (`folio-pinned-terminology/v1`): every licence and exception id with its name and deprecated flag — the offline, version-fixed list `check:source-licence` validates a `licence.json` id against.",
    install: { none: true },
    invoke: { shell: "bun run cat spdx:pin --from <license-list-data checkout>" },
    // `network: false` is exact: it reads a local copy and never fetches.
    // The copy is fetched by hand at the pinned tag, for the reason
    // `pin-ig-terminology` gives: a gate that needs the network fails for
    // the wrong reason.
    requires: { runtime: ["bun"], network: false },
    io: {
      inputs: [
        // No `arg` binding, as on `pin-ig-terminology`: the copy lives in a
        // scratch directory, and `FilesystemPath` is refused as a
        // command-line word.
        { name: "licenseListCheckout", schema: t("FilesystemPath"), required: true, description: "A copy of github.com/spdx/license-list-data at tag `v<version>`, passed as `--from`. Named for what it is rather than `from`: with the same name it would share `pin-ig-terminology`'s signature and be DERIVED as its substitute, which it is not — an IG clone and a licence list are different inputs (`deriveAlternatives`). Refused unless both files declare the pin's `licenseListVersion`." },
      ],
      outputs: [
        { name: "snapshot", schema: t("RepoPath"), description: "`folio-pinned-terminology/v1`: the version, the source, and every `spdx-license#<id>` / `spdx-exception#<id>` with its name, sorted; `deprecated: true` where the List marks it." },
      ],
    },
    satisfies: ["vocabulary-authority"],
    selection: {
      when:
        "A licence id must be checked against a fixed, named edition of the SPDX License List rather than against whatever spdx.org serves today.",
      limits:
        "Ids, names and the deprecated flag only — not licence texts, URLs or OSI/FSF flags. The version comes from the pin record, never from this script; refreshing means moving the pin first.",
      cost: "Two JSON files (~380 KB) fetched once by hand; the ~105 KB snapshot is committed, so nothing runs at check time.",
    },
  }),
);
