<!-- kg:subgraph:begin -->
# Cognitive Insights into Business Process Model Comprehension: Preliminary Results for Experienced and Inexperienced Individuals

referenced source — recorded, text withheld by licence

Held in the library [`cat-harness/library/`](../README.md) as `zimoch-2017-cognitive-insights-preliminary`.

| | |
|---|---|
| document id | `zimoch-2017-cognitive-insights-preliminary` |
| source file | `zimoch-2017-cognitive-insights-preliminary.pdf` (sha256 `58836d0484d0…`) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 0 |
| [blocks](blocks/) | 0 |
| images | 0 |

<!-- kg:subgraph:end -->

## Structured Research Notes (Bean `folio-assistant-e0jh`)

- **Citation:** Zimoch, M., Pryss, R., Probst, T., Schlee, W. & Reichert, M. (2017). *Cognitive Insights into Business Process Model Comprehension: Preliminary Findings for Novice and Experienced End-Users.* In: *Enterprise, Business-Process and Information Systems Modeling (BPMDS 2017)*, LNBIP 287, pp. 137–152, Springer.
- **DOI:** `10.1007/978-3-319-59466-8_9`
- **URL Fetched:** `https://dbis.eprints.uni-ulm.de/1509/1/BPMDS_2017_Zimoch.pdf`
- **Fetch Date:** `2026-10-31`
- **SHA-256:** `86e4f286cfeb7cc5b689d9e0f2acaa7bc3cf4c417b09d494b6eb1493d6d29713`
- **Licence & Ingestion Route:** `LicenseRef-Springer-Copyright` (Springer Nature copyright — Notes-only `referenced.json` rung)
- **Study Design:** Eye-tracking experiment with **$n = 36$ participants** ($30$ valid eye-tracking datasets after calibration screening) split at the median of prior process modeling experience (**`20.5 hours`**) into **Novices** ($< 20.5	ext{ h}$, $n = 15$, $14$ valid eye-tracking) and **Intermediates / Experienced** ($\ge 20.5	ext{ h}$, $n = 21$, $16$ valid eye-tracking) (Section 4.3, p. 9). Each participant inspected **3 BPMN 2.0 models** and **3 eGantt models** across **Easy, Medium, and Hard** complexity levels (4 true/false/don't-know comprehension statements per model, scored $+1$ correct, $-1$ wrong, $0$ don't know, normalized to $[-1, +1]$).
- **What Was Measured:**
  - **Comprehension Score (`[-1, +1]` net score):** mean and SD by group (Novice vs. Intermediate) and complexity (Easy, Medium, Hard).
  - **Ocular Parameters:** Number of Fixations, Gaze Path Length (pixels), and Completion Duration (ms) (Table 1 p. 10, Figs. 6–7 p. 11, Table 2 p. 12).
- **Numeric Thresholds & Key Findings (Answers Bean Q3):**
  - **Experience Split Threshold:** Median prior process modeling exposure = **`20.5 hours`** (Section 4.3, p. 9).
  - **BPMN Comprehension & Eye-Tracking by Complexity and Experience (Table 1 p. 10, Figs. 6–7 p. 11, Table 2 p. 12 / LNBIP 287 pp. 146–148):**
    - **Easy BPMN Model:** Intermediates score **$0.50$ (SD $0.50$)** vs. Novices **$0.30$ (SD $0.82$)** ($p = 0.728$); Fixations **$98$ vs. $123$** ($p = 0.085$); Gaze Path **$21,366	ext{ px}$ vs. $25,882	ext{ px}$** ($p = 0.142$); Duration **$29,671	ext{ ms}$ vs. $39,305	ext{ ms}$** ($p = 0.070$).
    - **Medium BPMN Model:** Scores converge — Intermediates **$0.30$ (SD $0.80$)** vs. Novices **$0.33$ (SD $0.82$)** ($p = 0.842$), while Intermediates still require fewer fixations (**$154$ vs. $199$**, $p = 0.064$), shorter gaze path (**$28,539	ext{ px}$ vs. $37,438	ext{ px}$**, $p = 0.077$), and significantly less time (**$47,264	ext{ ms}$ vs. $63,685	ext{ ms}$**, $p = 0.038^*$).
    - **Hard BPMN Model (Both Groups Collapse):** Both groups drop into **negative net comprehension scores** with no significant difference between experienced and novice readers:
      - **Intermediates:** Score **$-0.32$ (SD $0.85$)**, Fixations **$228$ (SD $71$)**, Gaze Path **$40,829	ext{ px}$**, Duration **$65,693	ext{ ms}$**.
      - **Novices:** Score **$-0.17$ (SD $0.92$)** ($p = 0.352$), Fixations **$231$ (SD $88$)** ($p = 0.906$), Gaze Path **$41,904	ext{ px}$** ($p = 0.842$), Duration **$75,406	ext{ ms}$** ($p = 0.361$).
  - **Takeaway for Lint Rules:** High structural complexity overwhelms prior BPMN familiarity — on the Hard BPMN model, experienced users fail at the same rate and expend the same ocular effort (228 vs. 231 fixations) as novices.
