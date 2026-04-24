---
title: Process Mining System
slug: process-mining-system
subtitle: A full-stack process mining system with three classical discovery algorithms, multi-metric evaluation and an LLM reasoning layer on top of the discovered models.
category: studies
role: Formal Methods in Computer Science · MSc AI track
stack:
  - Python
  - Flask
  - PM4Py
  - pandas · scikit-learn
  - Gemini
  - Docker
  - Gunicorn · reverse proxy
period: 2026
featured: true
order: 10
---

## Context

*Process mining* starts from raw event logs (tuples of `case_id`, `activity`, `timestamp`) and tries to reconstruct the underlying process: *"how does work actually flow inside this system?"*. Founded by Wil van der Aalst in the early 2000s, today it's used in finance (compliance), healthcare (patient pathways), manufacturing (bottleneck detection).

The **Formal Methods in Computer Science** exam asked for a complete process-mining implementation: discovery, evaluation, visualisation. We pushed further: we added an LLM reasoning layer that reads the discovered model and produces human-readable considerations on top of it.

## What it does

A web app that takes an event log (three built-in datasets or a custom CSV / Excel / JSON upload) and:

1. **Preprocesses** the data — filter by activity or time range, deduplicate, normalise activity names, remove case-length outliers
2. **Discovers the process model** with three classical algorithms — Alpha Miner, Heuristic Miner, Inductive Miner
3. **Evaluates** the model with five metrics — fitness, precision, generalisation, simplicity, composite F-score
4. **Visualises** the result in four formats — Petri net, BPMN, Directly-Follows Graph, Process Tree
5. **Reasons** over the model via LLM — generates a report, flags anomalies, suggests optimisations, predicts the next event of a partial trace, answers contextual questions in a chatbot

## Architecture

Monolithic **Flask** backend (~1,100 lines in `app.py`) that delegates to specialised modules instead of keeping business logic inline:

```text
app.py                       ← Flask routes + orchestration
dataset_selector.py          ← dataset loading / synthesis
preprocessor.py              ← cleaning + filtering
process_discovery.py         ← wrapper around the 3 miners
pm4py_integration.py         ← evaluation + visual rendering
enhanced_llm_reasoning.py    ← Gemini integration + prompt templates
main.py                      ← CLI runner for offline testing
```

**Single-page HTML + vanilla JS** dashboard: sidebar tabs (Import, Preprocess, Models, Visualise, Analytics, Reasoning, Chatbot, Export), communication via `fetch()` + JSON. Visualisations come back from the backend as base64-encoded SVG / PNG and are inlined directly into `<img>`.

Server-side global state is *in-memory* — enough for a single-user demo. A production-grade app would move per-user session state to Redis or similar; this was an explicit trade-off to keep the focus on the algorithms.

Deployed as a container with a WSGI worker pool (default `2·cpu + 1`, 30s timeout) behind a reverse proxy handling gzip, standard security headers, rate limiting on the health endpoint, and extended timeout (90s) on discovery endpoints.

## Key technical decisions

**1. PM4Py as the engine, not an optional dependency.** The three miners go through PM4Py rather than custom reimplementations. The exam asked us to *understand* the algorithms — not to rewrite them from scratch for production. A conscious decision: the energy went into orchestration, metrics, reasoning. A Petri net obtained via PM4Py is identical to a hand-rolled one, plus years of bug fixes.

**2. Composite scoring to recommend a miner.** The five metrics often conflict: a hyper-simple model has low precision; a model that perfectly fits the log often fails to generalise. We define a **weighted F-score** `fitness·0.4 + precision·0.3 + generalisation·0.2 + simplicity·0.1` that picks the default recommendation. Arbitrary weights but explicit ones — a defensible choice beats a naive average.

**3. LLM as a reasoning layer, not an oracle.** The LLM doesn't discover the process: it receives the already-discovered model + metrics + log statistics and produces natural language on top. Five distinct capabilities:

- structured report (executive summary + risks + recommendations)
- list of anomalies with severity, as structured JSON
- prioritised optimisation suggestions
- next-event prediction from a partial trace, with confidence scores
- contextual chatbot grounded in the current analysis

The prompts inject *real* statistics into the context (case counts, unique activities, average duration). Deterministic fallback when the remote API is unavailable — no hard dependency on the external model.

**4. Analytics decoupled from discovery.** Dedicated endpoints for variant analysis, bottleneck detection, performance metrics, data-quality assessment. Someone who just wants to explore a dataset doesn't have to run a discovery first.

**5. Reverse proxy + worker pool even for a coursework project.** Deliberately didactic: rate limiting, gzip, security headers, worker pool, health checks — production-grade patterns worth learning in a controlled setting rather than improvising after graduation.

## Numbers

- ~**2,800 lines of Python** across 8 modules + a JS/HTML dashboard
- **3 discovery algorithms** · **5 evaluation metrics** · **4 visualisation formats**
- **5 LLM capabilities** (report, anomalies, optimisation, next-event, chatbot)
- **3 bundled synthetic datasets** (CASAS smart-home, e-commerce, daily routines) + custom upload

## Takeaways

Making classical formal methods (Petri-based algorithms) coexist with a generative LLM is less obvious than it sounds. **The value is in the division of labour**: the classical algorithm gives formal guarantees (soundness, completeness), the LLM gives natural language for humans. Trust the LLM with the formal part and you're doing the wrong job. Ignore the classical algorithm when you have an LLM available and you're leaving value on the table.

Developed as a team project at **Università degli Studi di Bari Aldo Moro**.
