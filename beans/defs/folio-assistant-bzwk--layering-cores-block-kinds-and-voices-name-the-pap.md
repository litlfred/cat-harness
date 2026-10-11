---
# folio-assistant-bzwk
title: 'LAYERING: core''s block kinds and voices name the ''paper'' content adapter, which only folio-assistant-sci declares; without sci BLOCK_KINDS is empty and no voice loads'
status: todo
type: bug
priority: high
created_at: 2026-10-11T05:50:58Z
updated_at: 2026-10-11T05:50:58Z
---

Found 2026-10-11 while moving litlfred/smart-ra onto remote mounts (bean n3h9).

## Measured
- Mounted closure: smart-base, fhir-harness, folio-assistant-core, cat-harness, cat-harness-tools, bootstrap, bootstrap-tools, each at its main of 2026-10-10. In it, `cat-harness-tools/content/pipeline/qa-sweep.ts folio` stops before sweeping with: `VoiceLoadError: voice technical-writer/voice.json: appliesTo.0: Invalid input`.
- The cause:
  - **Core** declares the block kinds (`folio-assistant-core/block-kinds/prose.json` and the rest, `adapter: "paper"`) and the voices that name them (`skills/voices/technical-writer/voice.json`, `appliesTo: [prose, …]`).
  - **folio-assistant-sci** declares the `paper` content adapter (`content-adapters/paper.json`, `typed: true`).
  - **cat-harness** keeps a discovered kind only if its adapter is a TYPED adapter it discovers (`schemas/block-kinds.ts`: `BLOCK_KIND_NODES`, `CONTENT_ADAPTERS`). With sci absent, `BLOCK_KINDS` is EMPTY and no voice loads.
- folio-assistant does not hit this because it mounts sci.

## Why it is a defect
A layer's kinds are not usable without a layer that does not sit beneath it: sci is not in core's `needs`. Any downstream mounting core without sci (every smart-* IG, who-iris, smart-ra) gets an empty block-kind vocabulary.

## Workaround in place
smart-ra#37 mounts folio-assistant-sci explicitly.

## Done when
- [ ] the `paper` content adapter is declared where its block kinds are (core), or core's kinds name an adapter core declares, or core `needs` the layer that declares it. Owner to pick.
- [ ] qa-sweep runs from a closure without folio-assistant-sci
- [ ] smart-ra drops the sci mount
