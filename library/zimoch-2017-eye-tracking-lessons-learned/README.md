<!-- kg:subgraph:begin -->
# Eye Tracking Experiments on Process Model Comprehension: Lessons Learned

referenced source — recorded, text withheld by licence

Held in the library [`cat-harness/library/`](../README.md) as `zimoch-2017-eye-tracking-lessons-learned`.

| | |
|---|---|
| document id | `zimoch-2017-eye-tracking-lessons-learned` |
| source file | `zimoch-2017-eye-tracking-lessons-learned.pdf` (sha256 `18bb5ce57fae…`) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 0 |
| [blocks](blocks/) | 0 |
| images | 0 |

<!-- kg:subgraph:end -->
## Provenance & Ingestion Route (Bean `folio-assistant-e0jh`)

| Field | Value |
|---|---|
| **Citation** | Zimoch, M., Pryss, R., Schobel, J., & Reichert, M. (2017). *Eye Tracking Experiments on Process Model Comprehension: Lessons Learned*. In *Enterprise, Business-Process and Information Systems Modeling (BPMDS 2017 / EMMSAD 2017)*, LNBIP 287, pp. 153–168 (`doi:10.1007/978-3-319-59466-8_10`). |
| **URL Fetched** | `https://web.archive.org/web/20220303111342id_/http://dbis.eprints.uni-ulm.de/1505/1/2017_BPMDS_Zimoch2_dbis.pdf` (Ulm University DBIS ePrint 1505 camera-ready PDF via Wayback Machine; live `dbis.eprints.uni-ulm.de` returned HTTP 502) |
| **Fetch Date** | `2026-10-31` |
| **SHA-256** | `18bb5ce57faef8ead14bc27999ab783f810542c82848fc0f40f6f4155df75f05` |
| **Licence** | `LicenseRef-Springer-Copyright` (Copyright 2017 Springer International Publishing AG) |
| **Ingestion Route** | **Notes only (`referenced.json`)** — full text withheld under publisher copyright |

## Study Design & Empirical Measurements

- **Experimental Design (Section 2, pp. 3–6 / LNBIP 287 pp. 155–158):**
  - **Apparatus:** SMI iView X Hi-Speed stationary eye tracker recording at **240 Hz** with chin rest (p. 3).
  - **Participants & Stimuli:** **$N = 27	ext{–}30$ valid eye-tracking subjects** comprehending **12 flat block-structured process models** across **4 modeling notations** (**BPMN 2.0, eGantt, EPC, Petri Net**) $	imes$ **3 difficulty levels** (**Easy, Medium, Hard**; 3 models per notation), answering **4 true/false/uncertain comprehension questions** per model *from memory* after viewing each diagram (scored $+1$ correct, $-1$ incorrect, $0$ uncertain, normalized to $[-1, +1]$; pp. 3–4).
- **What Was Measured (Table 1 p. 4, Table 2 p. 8):**
  - *Behavioral performance:* Model viewing duration (ms), question response time (ms), and net comprehension answering score ($[-1, +1]$).
  - *Oculomotor / Eye-tracking metrics:* Number of fixations, number of saccades, gaze-path length (pixels), and Area of Interest (AOI) dwell times on start events, activities, XOR gateways, and AND gateways.
- **Quantitative Results Across BPMN 2.0 and Other Notations (Table 1 p. 4, Table 2 p. 8 / LNBIP 287 pp. 156, 160):**
  - **BPMN 2.0 by Difficulty Level:**
    - *Easy ($n = 29$):* Viewing duration **35,270 ms**, response time **6,210 ms**, answering score **0.66**, fixations **112**, saccades **101**, gaze path **19,958 px**.
    - *Medium ($n = 29$):* Viewing duration **53,910 ms**, response time **7,640 ms**, answering score **0.62**, fixations **191**, saccades **180**, gaze path **35,682 px**.
    - *Hard ($n = 28$):* Viewing duration **68,940 ms**, response time **9,170 ms**, answering score **0.27**, fixations **230**, saccades **219**, gaze path **41,438 px**.
  - **Cross-Notation Easy vs. Hard Answering Score (Table 2, p. 8):**
    - *eGantt:* **0.71** (Easy) $	o$ **0.61** (Medium) $	o$ **0.35** (Hard)
    - *EPC:* **0.80** (Easy) $	o$ **0.40** (Medium) $	o$ **0.58** (Hard)
    - *Petri Net:* **0.78** (Easy) $	o$ **0.58** (Medium) $	o$ **0.23** (Hard)
- **Nine Empirical Lesson Categories (C1–C9, Section 3, Fig. 4 p. 7, pp. 7–11):**
  - **C6 (Visual Search & Start Event Placement, p. 8):** Readers immediately scan the **left or upper-left corner** for a start event; when a notation or layout omits a salient left/upper-left start symbol (e.g., eGantt), gaze paths become erratic and directionless.
  - **C7 (Semantics & Gateway Complexity, p. 5 & p. 9):** **XOR gateways** attract significantly more fixations and longer dwell time than **AND gateways**, and the **first routing symbol** encountered along reading direction receives the highest dwell time across all notations.
  - **C8 & C9 (Model Difficulty & Expertise Collapse, pp. 9–10 — Answer to Bean Open Question 3):** As model complexity rises from Easy/Medium to Hard, comprehension accuracy drops sharply across all subjects, and **experienced subjects ($\ge 20.5	ext{ h}$ training) face the same comprehension degradation on hard models as novices ($< 20.5	ext{ h}$)** (pp. 9–10).
