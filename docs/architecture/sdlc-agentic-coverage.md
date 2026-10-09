---
title: "SDLC Agentic Coverage: Mapping Folio-Assistant to the LMA State of the Art"
layout: default
parent: Architecture
nav_order: 10
---

# SDLC Agentic Coverage — Mapping Folio-Assistant to the State of the Art

This architectural analysis cross-examines **folio-assistant** against the state of the art in Large Language Model-Based Multi-Agent (LMA) systems for Software Engineering, synthesizing findings from the comprehensive 30-page systematic survey by He, Treude, and Lo (arXiv:2404.04834v4, 2025; ingested at [`library/arxiv-2404.04834v4`](../../library/arxiv-2404.04834v4/)).

Corresponding methodology node: [`methodologies/sdlc-agentic-landscape.md`](../../methodologies/sdlc-agentic-landscape.md).

---

## 1. Executive Summary

He, Treude, and Lo categorize multi-agent software engineering into six core lifecycle phases:
1. **Requirements Engineering**
2. **Software Design**
3. **Code Generation & Implementation**
4. **Software Quality Assurance**
5. **Software Maintenance**
6. **Software Management & End-to-End Collaboration**

Folio-assistant implements **69 formal BPMN 2.0.2 executable processes** and DMN 1.5 decision tables across six process groups (`content/`, `kg/`, `library/`, `process/`, `sdlc/`, `ui/`). 

### Core Architectural Alignment
- **Strengths**: Folio-assistant exhibits exceptionally strong formalization in **Requirements Engineering (CRDM suite)**, **Software Design (BPMN/DMN models and MADR ADRs)**, **Gated Quality Assurance (automated CI health, multi-voice adversarial reviews, signed QA attestations)**, and **Management Coordination (git-backed bean claims and serialized merge queue)**.
- **Identified Gaps**: As a document, guideline, and platform engineering harness, folio-assistant currently has gaps in **post-deployment runtime monitoring (live APM/log diagnosis)**, **continuous runtime telemetry feedback**, and **reverse-engineering of legacy codebases**.

---

## 2. SDLC Phase Comparison Matrix

| SDLC Phase | Survey Concepts & State of the Art (arXiv:2404.04834v4) | Folio-Assistant Architecture & Process Mapping | Coverage Verdict |
|---|---|---|---|
| **1. Requirements Engineering** | Elicitation (Elicitron), modeling & specification (MARE), testable requirements via Gherkin (AgileGen). | CRDM process suite (`processes/process/crdm-*.bpmn`), requirement signoff DMN (`requirement-signoff-recorded.dmn`), specification-compiled agents (`methodologies/specification-compiled-agents.md`). | **Full / Mature** |
| **2. Software Design** | Architecture decomposition (MetaGPT Architect), interface definition, UML/class modeling (ChatDev). | Formal BPMN 2.0.2 / DMN 1.5 diagrams (`processes/`), MADR architecture decision records (`methodologies/madr.md`, `options-analysis.bpmn`), RACI role swimlanes (`processes/process/actor-role-administration.bpmn`, `methodologies/raci.md`), wireframe design reviews (`processes/ui/wireframe-design-review.bpmn`, `methodologies/wiregen.md`). | **Full / Formalized** |
| **3. Code Generation & Implementation** | Multi-agent pair programming, student-teacher self-repair (INTERVENOR), test feedback iterations (TGen, Self-repair). | Authoring adapters (`folio-document-adapter`, `folio-paper-adapter`), formal mathematical proof generation (Lean 4 formalization), hybrid LLM/deterministic program generation (`methodologies/hybrid-llm-deterministic.md`), monitored dispatch with 2-minute heartbeats (`skills/sdlc/sdlc-core/dispatch-agent.md`). | **Controlled / High Precision** |
| **4. Software Quality Assurance & Testing** | Automated test generation, static analysis bug detection (ICAA), root-cause analysis (RCAgent), fault localization (AgentFL). | Fast & full CI quality gates (`processes/sdlc/code-quality-gates.bpmn`, `bun run cat gates`), CI health watchdogs (`ci-health-watch.bpmn`), verifiable AI guideline evaluation (`methodologies/verifiable-ai-guideline-evaluation.md`), signed QA attestations on orphan branches (`qa-report-signing.bpmn`, `signing-route.dmn`), L1 completeness audits (`scripts/check-l1-complete.ts`). | **Rigorous / Evidence-Backed** |
| **5. Software Maintenance** | Automated program repair (MASAI, MarsCode), code review, test case maintenance (Lemner et al.). | Multi-voice adversarial code reviews (`processes/sdlc/code-change-review.bpmn`, `narrative-code-review.bpmn`, `processes/content/voice-review.bpmn`), upstream dependency & pin stewardship (`upstream-pin-watch.bpmn`, `upstream-version-adoption.bpmn`), defect adjudication (`adjudication.bpmn`, `criterion-adjudication.bpmn`). | **High / Review-Driven** |
| **6. Software Management & Collaboration** | Waterfall vs. Agile multi-agent models (ChatDev, AgileCoder, MetaGPT), dynamic process generation (Think-on-Process). | Git-backed work-plan coordination via `beans` (`processes/sdlc/bean-lifecycle.bpmn`, `skills/sdlc/sdlc-core/bean-coordination.md`), serialized merge train & steward (`processes/sdlc/merge-train.bpmn`, `merge-base.bpmn`, `decisions/merge-priority.dmn`), stalled agent triage (`processes/sdlc/stalled-agent-triage.bpmn`). | **Industrial-Grade / Serialized** |

---

## 3. Detailed Gap Checklist

### Gap 1: Post-Deployment Monitoring & Production Observability
- **The Survey Landscape**: Advanced multi-agent systems such as RCAgent (Section 3.3) perform real-time root-cause analysis in production cloud environments. Agents collect streaming logs, monitor metrics, diagnose live anomalies, and issue incident reports.
- **Folio-Assistant Gaps**: Folio-assistant monitors repository health and CI/build health (`ci-health-watch.bpmn`, `repository-health-watch.bpmn`), but has no active processes for monitoring runtime microservices, container health, or live production APIs.
- **Remediation Path**: For deployments exposing HTTP/MCP servers or live guideline portals, introduce a `processes/sdlc/runtime-telemetry-watch.bpmn` process linked to Prometheus / OpenTelemetry alerts.

### Gap 2: Continuous Runtime Telemetry Ingestion Loop
- **The Survey Landscape**: LMA systems close the loop by automatically translating production crashes and operational telemetry into actionable bug tickets, triggering automated test synthesis and candidate patches.
- **Folio-Assistant Gaps**: Folio-assistant's `beans` work-tracking graph is updated by human developers, CI gate runs, and agent sessions, but lacks automated webhooks or synthetic telemetry ingestion.
- **Remediation Path**: Define an ingest adapter that converts external incident payloads (e.g. Sentry, GitHub Security Alerts) into structured, pre-triaged `beans` with reproducible test fixtures.

### Gap 3: Legacy Software Reverse-Engineering
- **The Survey Landscape**: Modern LMA research emphasizes extracting architectural abstractions, class diagrams, and documentation from unstructured legacy codebases (100k+ lines of legacy C/Java) without tests.
- **Folio-Assistant Gaps**: Folio-assistant is optimized for greenfield and forward-engineering (generating verified documents, Lean proofs, and structured code from formal schemas and CRDM requirements). It does not maintain reverse-engineering agents to infer schemas from raw legacy repositories.
- **Remediation Path**: Implement a reverse-engineering skill in `skills/sdlc/` that parses ASTs, detects implicit business rules, and outputs candidate DMN decision tables and BPMN process skeletons.

---

## 4. Architectural Lessons from Empirical Case Studies

In Section 4, He et al. conduct case studies with ChatDev generating a Snake game and a Tetris game:
- **Snake Game (Moderate Complexity)**: ChatDev succeeded on the 2nd attempt in 76 seconds at $0.019 cost, producing playable code and a manual.
- **Tetris Game (High State Complexity)**: ChatDev failed across the first 9 attempts. On the 10th attempt, it produced playable blocks but **failed to implement line clearing**, a core game requirement.

### Why Folio-Assistant Avoids This Trap
ChatDev's failure on Tetris illustrates the inherent limit of unstructured multi-agent natural language chat for complex state machines:
1. **Unbounded Hallucination & Drift**: Unconstrained role-playing agents agree on superficial interfaces while omitting subtle state transition invariants.
2. **Folio-Assistant's Defense**: In folio-assistant, state machines and business rules are compiled into **DMN decision tables** (`methodologies/dmn.md`) and verified by deterministic gates or Lean 4 formalization. Rather than hoping an agent pair implements row-clearing correctly, the rule is captured as a deterministic decision table and verified against edge-case witnesses.
