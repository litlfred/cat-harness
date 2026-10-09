---
# folio-assistant-1yd7
title: 'LANDING STICKIES: each instance''s sticky lives in its own folio/, not in cat-harness/folio/'
status: in-progress
type: task
priority: normal
created_at: 2026-10-07T21:46:20Z
updated_at: 2026-10-09T19:00:00Z
parent: folio-assistant-7x5n
---

## What

`cat-harness/folio/` holds the landing stickies (`folio-landing-sticky/v1`) for
other instances, beside its own `cat-harness.json`:
`who-iris.json`, `bootstrap.json`, `folio-assist-core.json` and `folio-assistant.json`.
Measured on main 33bf3d2, 2026-10-07.

Each sticky belongs in the `folio/` directory of the instance it describes.

## Why now

The separation (ar1s) moves instances to their own repositories and remote-mounts them.
With the stickies left where they are:
- who-iris's sticky would ship in the cat-harness repository, not in who-iris;
- cat-harness, the platform, would carry content about the layers above it.
That points upward, the direction the separation exists to remove.

Note also: `ensure-landing-sticky.ts:393` says `cat-harness/folio/folio-assistant.json`
was pruned on 2026-09-30, but the file is present on main. Find out which is right.

## Done when

- Each instance's sticky sits in its own declared `folio/` directory, declaring one where
  missing, and only if the instance renders a landing.
- The landing composition (`gen-landing-data`, `ensure-landing-sticky`) reads stickies from
  every instance's `folio/`, mounted ones included, and not from cat-harness's only.
- For a mounted instance, the sticky arrives with the mount.
- The route `<base>/cat-harness/folio/` (the folio graph viewer) still shows cat-harness's
  own folio graph.

## Provenance

Owner, 2026-10-07, in session https://claude.ai/code/session_01EcBv3uwKYcnNbCC6BcPG92, asked
whether `<base>/folio/` and `<base>/cat-harness/folio/` were duplicates. They are not: only
the second is published. The answer surfaced the misplaced stickies, and the owner chose to
open this bean and tell the separation session.


## 2026-10-09 — the who-iris half (session https://claude.ai/code/session_017fFnGmbJcfqqrHXz9oqxdG)

\`54826e6e\` emptied \`cat-harness/folio/\` of other instances' cards; who-iris never took its own. Two defects, both fixed:
- **cat-harness** (\`ensure-landing-sticky\`, branch \`claude/mount-render-md\`): run from a separated instance's repository the script resolved its root from its own location — the REMOTE MOUNT — so it wrote cards into gitignored mounts and never declared a folio graph in who-iris. It now takes an instance directory, and a mounted layer's card is reported \`mounted\`: never written, not counted by \`--check\`. Tests watched red on the old script.
- **who-iris** (\`c211186\`): \`folio/\` declared (surgical splice) and \`folio/who-iris.json\` written by that tool; \`landing:sticky[:check]\` scripts. Declaring \`folio\` changes no mount route (checked).
- Done-when 2 and 3 (landing reads every instance's folio, mounted ones arrive with the mount) hold through \`stickyPathForContribution\`; 4 (\`/cat-harness/folio/\` shows cat-harness's own) is cat-harness's site, untouched.
- Remaining: merge, then the who-iris pin move.
