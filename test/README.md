# test

Part of [C@T Harness](../README.md) 0.1.0. Holds the declared QA, attestation and test-plan subgraphs of [`cat-harness.json`](../cat-harness.json) together with the standalone checkout fixtures used by schema unit tests.

| directory | what it holds |
|---|---|
| [`attestations/`](attestations/README.md) | The judgement half of every QA verdict (`qa-attestations/v1`), declared as `attestations` in [`cat-harness.json`](../cat-harness.json). |
| [`fixtures/`](fixtures/) | Standalone checkout fixtures (`standalone-checkout/`) used by schema unit tests when higher instances are not present in the checkout. |
| [`plans/`](plans/README.md) | Test plans this instance certifies against (`test-plan/v1`), declared as `test-plans` in [`cat-harness.json`](../cat-harness.json). |
| [`results/`](results/) | Derived QA reports, witnesses and KG audit sidecars (`qa-results/v1`, `qa-witness/v1`, `kg-qa/v1`, `kg-qa-manifest/v1`), declared as `qa` in [`cat-harness.json`](../cat-harness.json). |
