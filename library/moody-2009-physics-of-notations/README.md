<!-- kg:subgraph:begin -->
# The 'Physics' of Notations: Toward a Scientific Basis for Constructing Visual Notations in Software Engineering

referenced source — recorded, text withheld by licence

Held in the library [`cat-harness/library/`](../README.md) as `moody-2009-physics-of-notations`.

| | |
|---|---|
| document id | `moody-2009-physics-of-notations` |
| source file | `moody-2009-physics-of-notations.pdf` (sha256 `e0e502d72e6a…`) |
| provenance | ingested |

| holds | count |
|---|---|
| [sections](sections/) | 0 |
| [blocks](blocks/) | 0 |
| images | 0 |

<!-- kg:subgraph:end -->

## Structured Research Notes (Bean `folio-assistant-e0jh`)

- **Citation:** Moody, D. L. (2009). *The "Physics" of Notations: Toward a Scientific Basis for Constructing Visual Notations in Software Engineering.* IEEE Transactions on Software Engineering, 35(6), 756–779.
- **DOI:** `10.1109/TSE.2009.67`
- **URL Fetched:** `https://www.uq.edu.au/sia/content-files/file/events/2010/BPMN2-VisualSyntaxAnalysis.pdf`
- **Fetch Date:** `2026-10-31`
- **SHA-256:** `492796fc13fb40d53fd2b99b6a8ca7627f8c9f8b2d560aa99d51173b3a8bb6f3`
- **Licence & Ingestion Route:** `LicenseRef-IEEE-Copyright` (IEEE copyright — Notes-only `referenced.json` rung)
- **Study Design:** Foundational cognitive theory and evaluation framework defining **9 Principles for Cognitively Effective Visual Notations** grounded in perceptual and cognitive psychology (Bertin's visual variables, Miller's working memory limit, Paivio's dual coding theory, Gestalt grouping laws, and Treisman's feature integration theory), illustrated via a systematic evaluation of **BPMN 2.0 Visual Syntax**.
- **What Was Measured:** Compliance of visual notations (specifically BPMN 2.0) with the **9 Physics of Notations Principles**:
  1. **Semiotic Clarity** (1:1 correspondence between semantic constructs and graphical symbols),
  2. **Perceptual Discriminability** (visual distance between symbols across 8 visual variables),
  3. **Semantic Transparency** (iconicity / intuitive appearance of symbols),
  4. **Complexity Management** (modularization and hierarchy mechanisms to prevent diagram overload),
  5. **Cognitive Integration** (navigation cues across decomposed sub-diagrams),
  6. **Visual Expressiveness** (number of Bertin's 8 visual variables utilized: horizontal/vertical position, shape, size, colour, brightness, orientation, texture),
  7. **Dual Coding** (combining graphics + text annotations rather than relying on one alone),
  8. **Graphic Economy** (keeping symbol vocabulary size within human perceptual span),
  9. **Cognitive Fit** (adapting notation dialects to novice vs. expert audiences and task media).
- **Numeric Thresholds & Key Findings:**
  - **Principle 4 — Complexity Management Threshold (`7 ± 2 elements per diagram`, p. 28 / TSE p. 765):** Driven by Miller's working memory span, a single diagram or subprocess module should contain **$7 \pm 2$ ($5	ext{ to }9$) elements** before hierarchical decomposition is needed.
  - **Principle 8 — Graphic Economy Limit (`~6 perceptually distinct symbol categories`, p. 46 / TSE p. 772):** Human span of absolute perceptual judgement is around **6 distinct symbol categories** on a single visual variable, whereas **BPMN 2.0 defines $171+$ distinct visual symbols** (exceeding perceptual span by $> 28	imes$, p. 46).
  - **Principle 6 — Visual Expressiveness (`8 visual variables`, pp. 38–42 / TSE pp. 768–770):** BPMN is primarily **monochrome and shape-dominated** ($3$ main shapes: rectangle, circle, diamond), leaving **colour** (the most cognitively effective visual variable, detected $3	imes$ faster than shape in pre-attentive vision, p. 41) unused in the official specification.
