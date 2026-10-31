<!-- kg:subgraph:begin -->
# DMN-Guided Prompting: A Framework for Controlling LLM Behavior

ingested source material — attributed to its document, not folio content

Held in the library [`cat-harness/library/`](../README.md) as `arxiv-2505.11701v2`.

| | |
|---|---|
| document id | `arxiv-2505.11701v2` |
| source file | `arxiv-2505-11701v1.pdf` (sha256 `e05cd1965def…`) |
| pages | 15 |
| arXiv | [2505.11701v2](https://arxiv.org/abs/2505.11701v2) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 2 |
| [blocks](blocks/) | 3 |
| images | 2 |

<!-- kg:subgraph:end -->

## Structured Research Notes (Bean `folio-assistant-e0jh`)

- **Citation:** Abedi, S. & Jalali, A. (2025). *DMN-Guided Prompting: A Framework for Controlling LLM Behavior.* arXiv preprint `arXiv:2505.11701v2`.
- **DOI / arXiv:** `10.48550/arXiv.2505.11701` / `arXiv:2505.11701v2`
- **URL Fetched:** `https://arxiv.org/pdf/2505.11701.pdf`
- **Copy Used:** arXiv preprint (15 pages)
- **Fetch Date:** `2026-10-31`
- **SHA-256:** `e05cd1965defcdd468eccbb4ae63d275af9133854a3c93d2fb78b1fd71da1936`
- **Licence & Ingestion Route:** `LicenseRef-arXiv-Nonexclusive-Distrib-1.0` (Full-text `pdf-structure` rung)
- **Study Design:** Case study and empirical evaluation in a graduate Business Process Management course (**24 student groups**, **14 evaluated BPMN redesign submissions** checked against **9 Business Process Redesign [BPR] decision rules** encoded as DMN triples of `<Input Data, Decision Table, Literal Expression>`), comparing **DMN-Guided Prompting** against **Chain-of-Thought (CoT)** prompting across **GPT-4o** and **Gemini 1.5 Pro**, plus a student **Technology Acceptance Model (TAM) Perceived Usefulness survey** (`1–7` Likert scale, 6 items `PU1–PU6`) (Sections 4.1–4.6, pp. 7–12).
- **What Was Measured:** Precision, Recall, F1-score, and Accuracy of automated BPMN redesign feedback against instructor ground truth (**Table 1, p. 10**), rule-by-rule detection accuracy across Rules 1–9 (**Fig. 8 p. 9, Section 4.5 pp. 10–11**), and student Perceived Usefulness (**Fig. 11, p. 12**).
- **Numeric Thresholds & Key Findings:**
  - **DMN-Guided Prompting vs. Chain-of-Thought Performance (Table 1, p. 10):**
    - **GPT-4o + DMN:** **Precision `0.91`, Recall `0.90`, F1-score `0.91`, Accuracy `0.87`**.
    - **GPT-4o + CoT:** Precision `0.36`, Recall `1.00`, **F1-score `0.53`**, Accuracy `0.41` (CoT suffers from severe false positives without DMN decision-table constraints).
    - **Gemini 1.5 Pro + DMN:** Precision `0.62`, Recall `0.84`, **F1-score `0.71`**, Accuracy `0.64` (vs. **Gemini 1.5 Pro + CoT:** Precision `0.51`, Recall `0.79`, **F1-score `0.62`**, Accuracy `0.52`).
  - **Student Perceived Usefulness (Section 4.6 & Fig. 11, p. 12):** Aggregated Perceived Usefulness (`PU`) and all 6 individual TAM items (`PU1–PU6`) achieved **medians $\ge 5.5$ out of $7$** on the 7-point Likert scale.
