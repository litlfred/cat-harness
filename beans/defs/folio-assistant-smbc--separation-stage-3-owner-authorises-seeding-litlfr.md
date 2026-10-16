---
# folio-assistant-smbc
title: 'Separation stage 3: owner authorises seeding litlfred/cat-harness and litlfred/cat-harness-tools'
status: scrapped
type: task
created_at: 2026-10-01T06:58:02Z
updated_at: 2026-10-16T06:30:00Z
parent: folio-assistant-iirv
blocked_by:
    - folio-assistant-ho66
---

Stage 3 of the split plan: authorise. Report what moves, the sizes and what breaks (plan §1–§2, updated with the stage 0–2 measurements) in this bean and the PR, and **wait for the owner's go** (`deletion-requires-confirmation`). An agent does not discharge this bean's first box.

Also before asking: confirm both target repositories exist and are empty — `litlfred/cat-harness-tools` measured empty 2026-09-30; `litlfred/cat-harness` not yet checked. Placement PR9 should have landed (zero upward references before the cut — placement §5).

Plans (session scratchpad, 2026-10-01; to be committed with stage 0): `cat-harness-split-plan.md` (stages 0–6, decisions D1–D6, "Owner rulings, 2026-10-01") and `placement-proposal.md` (PR0–PR9, §6 "Owner rulings, 2026-09-30").

## Done when
- [ ] the owner's explicit go is quoted here with its date
- [ ] both repositories measured empty, with the command and date recorded

## Measured 2026-10-04 — `litlfred/cat-harness` is empty

`git clone --depth 1 https://github.com/litlfred/cat-harness` → *"warning: You appear to have cloned an empty repository"*; `git rev-parse HEAD` fails (no commits). Same result for `litlfred/cat-harness-test`, which the `zmdo` proof then used. Recorded by session https://claude.ai/code/session_01Ga3HjmX3ag9vTgZWDSmsFi. (`litlfred/cat-harness-tools` is not re-measured here.)

## Reasons for Scrapping

Superseded by `iai8` (Owner ruling 2026-10-16, item 8: "8b"). What this stage was to authorise has happened: `iai8` seeded litlfred/cat-harness and litlfred/cat-harness-tools (PR #2517, merged 2026-10-08), and the owner has since consented to pins past the seed (`trust.consent` in `index.config.json`, 2026-10-09). The owner chose to scrap this bean rather than to supply the dated quote its first box asks for, so the box stays unticked and the bean closes as superseded, not completed. Session https://claude.ai/code/session_01Pc8vSeXCwp5Ckvmz56cMDs.
