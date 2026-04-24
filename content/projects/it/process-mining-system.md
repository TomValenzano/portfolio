---
title: Process Mining System
slug: process-mining-system
subtitle: Sistema full-stack di process mining con tre algoritmi classici di discovery, valutazione multi-metrica e un layer di reasoning LLM sopra i modelli scoperti.
category: studies
role: Formal Methods in Computer Science · MSc curriculum AI
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

## Il contesto

Il *process mining* parte da log di eventi grezzi (tuple `case_id`, `activity`, `timestamp`) e cerca di ricostruire il processo sottostante: *"come si snoda davvero il lavoro, dentro questo sistema?"*. È una disciplina fondata da Wil van der Aalst a inizio anni 2000 e oggi usata in finance (compliance), sanità (patient pathways), manifatturiero (bottleneck detection).

L'esame di **Formal Methods in Computer Science** chiedeva un'implementazione completa di un sistema di process mining: discovery, valutazione, visualizzazione. Abbiamo spinto oltre: ci abbiamo aggiunto un layer di reasoning LLM che legge il modello scoperto e produce considerazioni leggibili per un umano.

## Cosa fa

Un'app web che prende un event log (tre dataset predefiniti o upload custom in CSV / Excel / JSON) e:

1. **Preprocessa** i dati — filtro per attività/periodo, rimozione duplicati, normalizzazione nomi, outlier removal per lunghezza dei casi
2. **Scopre il modello di processo** con tre algoritmi classici — Alpha Miner, Heuristic Miner, Inductive Miner
3. **Valuta** il modello con cinque metriche — fitness, precision, generalization, simplicity, F-score composito
4. **Visualizza** il risultato in quattro formati — Petri net, BPMN, Directly-Follows Graph, Process Tree
5. **Ragiona** sul modello via LLM — genera report, rileva anomalie, suggerisce ottimizzazioni, predice il prossimo evento di un trace parziale, risponde in chat

## Architettura

Backend **Flask** monolitico (~1100 righe in `app.py`) che delega a moduli specializzati invece di tenere business logic inline:

```text
app.py                       ← routes Flask + orchestrazione
dataset_selector.py          ← caricamento / sintesi dataset
preprocessor.py              ← cleaning + filtering
process_discovery.py         ← wrapper attorno ai 3 miners
pm4py_integration.py         ← evaluation + rendering visuale
enhanced_llm_reasoning.py    ← integrazione Gemini + prompt template
main.py                      ← runner CLI per test offline
```

Frontend **dashboard single-page HTML + vanilla JS**: sidebar a tab (Import, Preprocess, Models, Visualize, Analytics, Reasoning, Chatbot, Export), comunicazione via `fetch()` + JSON. Le visualizzazioni arrivano dal backend come SVG / PNG in base64 e vengono inlineate direttamente in `<img>`.

Stato globale lato server *in-memory* — sufficiente per una demo single-user. Un'app production-grade richiederebbe una sessione per utente in Redis o simili; scelta esplicita per mantenere il focus sugli algoritmi.

Deploy in container con WSGI worker pool (default `2·cpu + 1`, timeout 30s) dietro reverse proxy che gestisce gzip, security header standard, rate limit sull'health check, timeout esteso (90s) sugli endpoint di discovery.

## Decisioni tecniche chiave

**1. PM4Py come motore, non come dipendenza opzionale.** I tre miner passano attraverso PM4Py invece di reimplementazioni custom. L'esame chiedeva di capire gli algoritmi — non di rifarli da zero in produzione. Abbiamo scelto consapevolmente: l'energia è andata su orchestrazione, metriche, reasoning. Una Petri net ottenuta con PM4Py è identica a una fatta a mano, con anni di bug-fix in più.

**2. Scoring composito per raccomandare un miner.** Le cinque metriche sono spesso in conflitto: un modello iper-semplice ha precision bassa, un modello che fitta il log perfettamente spesso non generalizza. Definiamo un **F-score pesato** `fitness·0.4 + precision·0.3 + generalization·0.2 + simplicity·0.1` che raccomanda il modello di default. Pesi arbitrari ma espliciti — meglio una scelta difendibile di una media naive.

**3. LLM come reasoning layer, non come oracolo.** L'LLM non scopre il processo: riceve il modello già scoperto + le metriche + statistiche del log e produce linguaggio naturale sopra. Cinque capability distinte:

- report strutturato (executive summary + rischi + raccomandazioni)
- lista di anomalie con severità in JSON strutturato
- suggerimenti di ottimizzazione prioritizzati
- predizione del next event di un trace parziale con confidence
- chatbot contestuale sulle analisi in corso

Il prompt engineering inserisce statistiche *reali* nel contesto (numero di case, attività uniche, durata media). Fallback deterministico se l'API remota non è disponibile — nessuna dipendenza hard dal modello esterno.

**4. Analytics disaccoppiati dalla discovery.** Endpoint separati per variant analysis, bottleneck detection, performance metrics, data-quality assessment. Chi vuole solo esplorare un dataset non è costretto a lanciare prima una discovery.

**5. Reverse proxy + worker pool anche su un progetto d'esame.** Scelta volutamente didattica: rate limiting, gzip, security header, worker pool, health check — pattern production-grade che valeva imparare in un contesto controllato invece di improvvisare al primo lavoro.

## Numeri

- ~**2.800 righe Python** su 8 moduli + dashboard JS/HTML
- **3 algoritmi** di discovery · **5 metriche** di valutazione · **4 formati** di visualizzazione
- **5 capability LLM** (report, anomalie, ottimizzazione, next-event, chatbot)
- **3 dataset** sintetici bundled (smart home CASAS, e-commerce, daily routines) + upload custom

## Cosa mi porto dietro

Far convivere formal methods classici (algoritmi Petri-based) e LLM generativo è meno ovvio di quanto sembri. **Il valore è la divisione del lavoro**: l'algoritmo classico dà garanzie formali (soundness, completezza), l'LLM dà linguaggio naturale per umani. Se ti fidi del secondo per la parte formale, stai sbagliando lavoro. Se ignori il primo quando hai un LLM a portata, stai lasciando valore sul tavolo.

Progetto sviluppato in gruppo all'**Università degli Studi di Bari Aldo Moro**.
