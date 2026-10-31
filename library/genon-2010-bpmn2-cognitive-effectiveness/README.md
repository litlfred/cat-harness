<!-- kg:subgraph:begin -->
# Analysing the Cognitive Effectiveness of the BPMN 2.0 Visual Notation

referenced source — recorded, text withheld by licence

Held in the library [`cat-harness/library/`](../README.md) as `genon-2010-bpmn2-cognitive-effectiveness`.

| | |
|---|---|
| document id | `genon-2010-bpmn2-cognitive-effectiveness` |
| source file | `genon-2010-bpmn2-cognitive-effectiveness.pdf` (sha256 `90fa06a357cf…`) |
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
| **Citation** | Genon, N., Heymans, P., & Amyot, D. (2011). *Analysing the Cognitive Effectiveness of the BPMN 2.0 Visual Notation*. In *Software Language Engineering (SLE 2010)*, LNCS 6563, pp. 377–396 (`doi:10.1007/978-3-642-19440-5_25`). Companion technical report: University of Namur PReCISE Research Center (71 pp., 2010). |
| **URL Fetched** | `https://web.archive.org/web/20131228070057id_/http://www.info.fundp.ac.be/~nge/BPMN/BPMN2_PoN_Analysis.pdf` (71-page full PReCISE technical report referenced by the SLE 2010 paper; ResearchGate `221055397` returned HTTP 403 and SpringerLink is paywalled) |
| **Fetch Date** | `2026-10-31` |
| **SHA-256** | `89b79f6a00e178052e90cfda4069f90df60880c82e7985cf134f6e9ed2667502` |
| **Licence** | `LicenseRef-Springer-Copyright` (Copyright 2011 Springer-Verlag Berlin Heidelberg / University of Namur PReCISE) |
| **Ingestion Route** | **Notes only (`referenced.json`)** — full text withheld under publisher copyright |

## Study Design & Empirical Measurements

- **Method:** Complete analytical evaluation of the OMG BPMN 2.0 specification (Process, Collaboration, Choreography, and Conversation diagrams) against all **9 principles of Moody's (2009) Physics of Notations (PoN)** (pp. 1–71).
- **Quantitative Semiotic & Perceptual Audit Across BPMN 2.0 (pp. 49–71):**
  1. **Semiotic Clarity (pp. 49–51):** Maps **242 semantic constructs** in the BPMN 2.0 metamodel against **171 visually distinct graphical symbols** (p. 51):
     - **Symbol Deficit:** **57 constructs (23.6%)** have no visual representation (pp. 50–51).
     - **Symbol Redundancy (Synographs):** **1 construct / 7 synograph families (0.5%)** have multiple visual representations for the same meaning (e.g., Exclusive Gateway diamond with or without internal `X` marker; horizontal vs. vertical pools/lanes; collapsed vs. expanded sub-processes; pp. 50–51).
     - **Symbol Overload (Homographs):** **13 symbols (5.4%)** map to multiple semantic constructs (e.g., thin-border circle for top-level Start Event vs. interrupting Event Sub-Process Start Event; double-border circle for Intermediate Catch Event vs. boundary interrupting event; dotted arrow for Association vs. DataAssociation; pp. 50–51).
     - **Symbol Excess:** **1 symbol (0.5%)** (plus 6 metamodel excess candidates; p. 50).
  2. **Perceptual Discriminability (pp. 51–58):** Most BPMN symbols differ on only **1 visual variable** (internal marker shape or border style: single thin, single thick, double thin, dashed, dotted), yielding a minimal **visual distance = 1**, well below what is required for rapid pop-out perception; 22 event types share the circle shape and differ only by tiny internal monochrome icons.
  3. **Semantic Transparency (pp. 58–61):** Gateways (`X`, `+`, `O`, pentagon, star) and border styles are semantically opaque or perverse to novices (e.g., `+` inside a gateway means parallel `AND` rather than inclusive `OR`).
  4. **Complexity Management & Cognitive Integration (pp. 61–67):** Collapsed subprocesses hide complexity locally, but BPMN 2.0 lacks a zoomable overview ("longshot") diagram or perceptual navigational signposts across decomposed levels.
  5. **Visual Expressiveness (pp. 67–69):** Uses only **4 out of 8 visual variables** (planar horizontal $x$, planar vertical $y$, shape, and black/white fill + border texture); **size, brightness/value, colour/hue, and orientation (4 variables) are unused** (p. 69).
  6. **Dual Coding (p. 70):** Text labels complement activity/event shapes, but gateway markers and event triggers lack hybrid text/graphic reinforcement by default.
  7. **Graphic Economy (pp. 70–71):** **171 distinct visual symbols** vastly exceed the human **span of absolute judgement limit of ~6 perceptually distinct categories** (Miller 1956); even grouping into basic geometric shapes yields **$6 + 3 = 9$ shape families** (p. 71).
  8. **Cognitive Fit (p. 71):** Uses a single monolithic visual notation for both novice business stakeholders and expert execution engineers, violating Cognitive Fit Theory.
