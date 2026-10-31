<!-- kg:subgraph:begin -->
# Tackling the DMN Challenges with cDMN: A Tight Integration of DMN and Constraint Reasoning

ingested source material — attributed to its document, not folio content

Held in the library [`cat-harness/library/`](../README.md) as `arxiv-2005.09998v1`.

| | |
|---|---|
| document id | `arxiv-2005.09998v1` |
| source file | `arxiv-2005-09998v1.pdf` (sha256 `7d932034e53a…`) |
| pages | 15 |
| arXiv | [2005.09998v1](https://arxiv.org/abs/2005.09998v1) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 2 |
| [blocks](blocks/) | 7 |
| images | 6 |

<!-- kg:subgraph:end -->

## Structured Research Notes (Bean `folio-assistant-e0jh`)

- **Citation:** Aerts, B., Vandevelde, S. & Vennekens, J. (2020). *Tackling the DMN Challenges with cDMN: A Tight Integration of DMN and Constraint Reasoning.* arXiv preprint `arXiv:2005.09998v1` (published in *Rules and Reasoning — RuleML+RR 2020*, LNCS 12173, pp. 23–38, Springer, `doi:10.1007/978-3-030-57977-7_2`; journal extension in *Theory and Practice of Logic Programming* 22(1):1–27, 2022, `arXiv:2110.02610`).
- **DOI / arXiv:** `10.1007/978-3-030-57977-7_2` / `arXiv:2005.09998v1`
- **URL Fetched:** `https://arxiv.org/pdf/2005.09998.pdf`
- **Copy Used:** arXiv preprint (15 pages)
- **Fetch Date:** `2026-10-31`
- **SHA-256:** `7d932034e53ae5c09d88485809486429020717c395b52e2d6826539c78ae7e6b`
- **Licence & Ingestion Route:** `LicenseRef-arXiv-Nonexclusive-Distrib-1.0` (Full-text `pdf-structure` rung)
- **Study Design:** Comparative expressiveness and compactness benchmark evaluating **cDMN** (Constraint DMN — extending DMN with constraint tables `E*`, n-ary relations/functions, quantification, data tables, and optimization) against standard DMN-like tools (**OpenRules** and **Corticon**) across **21 Decision Management Community (DM Community) challenges** (Section 7, pp. 10–14, Table 2 p. 13).
- **What Was Measured:** Number of DM Community challenges solved (out of 21) and total number of table cells required across all decision/constraint tables (**Table 2, p. 13**).
- **Numeric Thresholds & Key Findings:**
  - **Expressiveness Coverage (Section 7.4, p. 12):** **cDMN solves 19 of 21 challenges (90.5%)**, compared to **12 of 21 (57.1%)** for OpenRules and **12 of 21 (57.1%)** for Corticon.
  - **Table Compactness / Cell Count Comparison (Table 2, p. 13):**
    - Through universal quantification (`E*` constraint tables), rules that require $O(n)$ or $O(n^2)$ rows in standard DMN / OpenRules / Corticon (such as pairwise distinctness across $n$ entities, requiring $\frac{n!}{(n/2)! \cdot 2^{n/2}}$ rows in Corticon, Section 7.2 p. 11) require only **1 row** in cDMN.
    - Across the benchmark challenges (**Table 2, p. 13**), cDMN reduces cell counts dramatically on relational/quantified problems (e.g., *Monkey Business*: **27 cells in cDMN** vs. **68 in Corticon** and **130 in OpenRules**; *Balanced Assignment*: **35 cells in cDMN** vs. **90 in OpenRules**; *Map Coloring*: **11 cells in cDMN** vs. **62 in Corticon** and **99 in OpenRules**).
