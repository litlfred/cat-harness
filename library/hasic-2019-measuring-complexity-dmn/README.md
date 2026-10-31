<!-- kg:subgraph:begin -->
# Measuring the Complexity of DMN Decision Models

referenced source — recorded, text withheld by licence

Held in the library [`cat-harness/library/`](../README.md) as `hasic-2019-measuring-complexity-dmn`.

| | |
|---|---|
| document id | `hasic-2019-measuring-complexity-dmn` |
| source file | `hasic-2019-measuring-complexity-dmn.pdf` (sha256 `09c0dc8a6c8f…`) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 0 |
| [blocks](blocks/) | 0 |
| images | 0 |

<!-- kg:subgraph:end -->

## Structured Research Notes (Bean `folio-assistant-e0jh`)

- **Citation:** Hasić, F., De Craemer, A., Hegge, T., Magala, G. & Vanthienen, J. (2019). *Measuring the Complexity of DMN Decision Models.* In: *Business Process Management Workshops (BPM 2018)*, LNBIP 342, pp. 528–539, Springer.
- **DOI:** `10.1007/978-3-030-11641-5_41`
- **URL Fetched:** `https://lirias.kuleuven.be/retrieve/563607`
- **Copy Used:** Author accepted manuscript (KU Leuven Lirias repository, 12 pages)
- **Fetch Date:** `2026-10-31`
- **SHA-256:** `09c0dc8a6c8f74150c7dbf9f5d732f1e8c89791405537411462360dd92d55f03`
- **Licence & Ingestion Route:** `LicenseRef-Springer-Copyright` (Springer Nature LNBIP copyright — Notes-only `referenced.json` rung)
- **Study Design:** Theoretical metric derivation adapting BPM and software engineering complexity metrics to DMN Decision Requirements Diagrams (DRDs), combined with an exploratory empirical survey of **$n = 22$ master's students** at KU Leuven rating the perceived complexity (`0–10` visual analogue scale) of **11 DRD models** (Section 5, pp. 8–10, Table 2 p. 10).
- **What Was Measured:** Correlation and Sum of Squared Differences (SSD) between the **10 proposed DRD metrics** (`NOD`, `NOE`, `NOBE`, `TNDO`, `SEQ`, `LP`, `AVD`, `CNC`, `KC`, `CC`) and student-rated perceived complexity across 11 DRDs.
- **Numeric Thresholds & Key Findings:**
  - **10 Proposed DRD Metrics (Section 3, pp. 4–7, Table 1 p. 7):**
    - `NOD` (Number of Decisions), `NOE` (Number of Elements), `NOBE` (Number of Basic Elements = `#decisions + #inputs + #informationRequirements`, p. 5), `TNDO` (Total Number of Data Objects / Input Data elements, p. 5), `SEQ` (Sequentiality, p. 5), `LP` (Longest Path, p. 6), `AVD` (Average Vertex Degree, p. 6), `CNC` (Coefficient of Network Connectivity = `#arcs / #nodes`, p. 6), `KC` (Knot Count / arc crossings, p. 6), and `CC` (Cyclomatic Complexity = `E - N + 2`, p. 7).
  - **Empirical Fit Across 11 DRDs ($n = 22$, Table 2 p. 10):** Simple count metrics (`NOE` $\text{SSD} = 11.49$, `NOD` $\text{SSD} = 12.87$, `TNDO` $\text{SSD} = 16.51$) and `CC` ($\text{SSD} = 15.89$) achieved the lowest SSD against perceived complexity (Section 5, p. 9, Table 2 p. 10).
  - **No Numeric Threshold Cutoffs:** Neither this paper nor its journal extension (`hasic-2019-complexity-metrics-dmn`) defines cutoff thresholds such as `"NOBE <= 25"` or `"inputs <= 5"`.
