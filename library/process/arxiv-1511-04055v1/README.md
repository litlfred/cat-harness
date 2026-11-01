<!-- kg:subgraph:begin -->
# A Visual Analysis of the Process of Process Modeling

ingested source material — attributed to its document, not folio content

Held in the library [`cat-harness/library/`](../../README.md) as `arxiv-1511-04055v1`.

| | |
|---|---|
| document id | `arxiv-1511-04055v1` |
| source file | `arxiv-1511-04055v1.pdf` (sha256 `8201ed0c0ae7…`) |
| pages | 30 |
| DOI | [10.1007/s10257-014-0245-4](https://doi.org/10.1007/s10257-014-0245-4) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 144 |
| [blocks](blocks/) | 113 |
| images | 41 |

<!-- kg:subgraph:end -->
## Provenance & Ingestion Route (Bean `folio-assistant-e0jh`)

| Field | Value |
|---|---|
| **Citation** | Claes, J., Vanderfeesten, I., Pinggera, J., Reijers, H. A., Weber, B., & Poels, G. (2015). *A Visual Analysis of the Process of Process Modeling*. *Information Systems and e-Business Management* 13(1), 147–190 (`doi:10.1007/s10257-014-0245-4`; `arXiv:1511.04055v1`). |
| **URL Fetched** | `https://arxiv.org/pdf/1511.04055.pdf` (landing page: `https://arxiv.org/abs/1511.04055`) |
| **Fetch Date** | `2026-10-31` |
| **SHA-256** | `8201ed0c0ae78f465193cb260de9c367c620a8ac08f423210b3da253520bf485` |
| **Licence** | `LicenseRef-arXiv-Nonexclusive-Distrib-1.0` (arXiv.org perpetual, non-exclusive license to distribute) |
| **Ingestion Route** | **Full text** (`pdf-structure` rung, 30 pages, 72 sections, 41 raster figures + 1 vector table key) |

## Study Design & Empirical Measurements

- **Tool & Visual Encoding Design:** Introduces the **PPMChart Analysis** plug-in in ProM 6 (Section 3, pp. 5–10), applying Moody's (2009) Physics of Notations principles (Section 3.4, pp. 7–10; Table 2, p. 9) to plot every recorded modeling action (`Create` = green, `Move` = blue, `Delete` = red, `Rename` = orange; `Activity` = rectangle, `Event` = circle, `Gateway` = diamond, `Edge` = triangle) per model element over time or logical operation index.
- **Observational Datasets & Qualitative Evaluation:**
  1. **Exploratory Visual Analysis (Section 4, pp. 10–17):** Analyzes recorded Cheetah Experimental Platform (CEP) modeling logs from two observational modeling sessions at Eindhoven University of Technology: the **2010 Pre-flight process modeling study** and the **2012 Mortgage process modeling study** (BPMN notation), deriving **13 empirical observations** (summarized in Table 3, p. 17).
  2. **Think-Aloud Evaluation ($N = 6$, Section 5, pp. 17–21):** Qualitative 1-hour laboratory evaluation with **$N = 6$ academic BPM researchers** at Eindhoven University of Technology (3 using **PPMChart** vs. 3 using the standard **Dotted Chart** across 5 outlier event logs; Table 4, p. 19).
- **What Was Measured:**
  - Element creation order (*aspect-oriented* vs. *flow-oriented* / *chunked* vs. *chaotic*), gateway creation pairing (split/join pairs vs. single gateway followed by branch), delete timing (scattered vs. simultaneous block deletes), movement timing (few, immediately at creation, end-of-session layout pass, or scattered), and correlation with resulting syntactic/semantic model quality (Section 6.2.2, p. 21).
- **Key Findings & Numeric Thresholds Stated:**
  - Does not propose static node-count lint thresholds; establishes empirically that **shorter total modeling duration** and **structured chunked/flow-oriented creation** correlate with higher syntactic and semantic model quality, whereas **frequent scattered move operations** and **long pauses** indicate high cognitive load and correlate with lower process model quality (Section 6.2.2, p. 21).
