---
name: translation-candidate-source
description: >
  The one interface every candidate-translation engine meets: given a locale
  and a catalogue, append candidate translations per string to the
  `translation-candidates/v1` sidecar, each carrying its source, and seed an
  empty `msgstr` with the first candidate marked fuzzy. An agent model, an
  open machine-translation model (OPUS-MT) and a web service or offline
  engine (LibreTranslate / Argos) are interchangeable Tools of this skill.
  Use when adding an engine, choosing one, or producing candidates for review.
graph-typologies:
  - translation-sources
---

# Translation candidate source — one interface, many engines

> Skill id: `translation-candidate-source` · Package: `library-core`

A **candidate** is a translation somebody or something proposes for one
string. This skill states what producing candidates means, independent of
the engine; each engine is a Tool that `satisfies` it. Which engine produced
a candidate is recorded on the candidate, and the reviewer's choice among
them is a step of
[`translation-adjudication`](translation-adjudication.md).

## The contract

Every Tool of this skill has the same inputs and the same output, so the
harness derives that they are alternatives (a shared skill and an identical
I/O signature) and asks each for its `selection` — when to reach for it,
where it stops, what it costs.

| | |
|---|---|
| **input** `locale` | the target locale tag (`--locale`) |
| **input** `catalogue` | the `.po` catalogue to propose for (positional) |
| **output** `candidates` | `translations/<locale>/<catalogue>.candidates.json`, `translation-candidates/v1` |

The sidecar holds, per string (`msgid`, with `msgctxt` when there is one), a
list of `{ text, source }`. `source.kind` is one of `agent`, `open-mt`,
`web-service`, `human`; `source.id` names the model or service
(`opus-mt-en-fr`, a model id, a GitHub login); `version` and `at` when known.

## The rules every engine keeps

1. **Append, never overwrite.** Another engine's candidates stay.
2. **Seed an empty `msgstr`, marked fuzzy.** Candidates are never a barrier to
   having a translation: when a string has no translation, the first
   candidate also goes into the `.po` as its `msgstr` with `#, fuzzy`. An
   existing `msgstr` is never replaced.
3. **Keep what must not be translated.** Placeholders, code, math, URLs and
   tags shielded by extraction must survive; the deterministic gates of
   [`translation-manager`](translation-manager.md) judge the `.po` after any
   engine has written to it.
4. **Say what you are.** A candidate without a `source` is refused by the
   sidecar's schema; an engine that cannot name its model and version names
   what it can.
5. **A candidate is never a verdict.** Nothing an engine writes makes a
   catalogue reviewed or official.

## Adding an engine

A new engine is a new Tool node under `tools/<id>/<id>.json` that satisfies
this skill with the I/O above, a `selection`, and — when it reaches a host —
`requires.network: true` with a `remedies` entry naming what to do when that
host is refused. Nothing in the process changes: the process names this
skill, never an engine.
