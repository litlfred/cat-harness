# cat/cat-harness/fsh-guts

The kept trashcan of `cat-harness`: deprecated or relocated material that is never rendered or published. It is a named-subgraph special branch, declared in `cat-harness/scripts/special-branches.json` on `main`.

- **Layout:** paths mirror the checkout (`fsh-guts/**`), and the root `manifest.json` (`state-manifest/v1`, `keyedBy: tip`) is what makes this a state branch.
- **Status:** a SEED. `main`'s `fsh-guts/` is still the source of truth until bean `folio-assistant-9c7h` moves every reader and writer onto this branch, through `scripts/branch-store.ts`.
- **Writes:** spliced onto the tip and never force-pushed. This branch is never merged into `main`.
