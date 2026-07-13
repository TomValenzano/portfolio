---
title: Ghigliottina Solver
slug: ghigliottina
subtitle: Risolutore knowledge-based per il gioco televisivo La Ghigliottina — ranking per copertura su una knowledge base di associazioni lessicali, con un LLM locale usato solo per spiegare la soluzione.
category: studies
role: Natural Language Processing · MSc curriculum AI
stack:
  - Python
  - gensim · scikit-learn
  - PMI · corpus mining
  - Wikipedia · corpus Paisà
  - Qwen2.5-7B · Ollama
  - BERTScore · ROUGE · BLEU
period: 2026
featured: true
order: 9
links:
  github: https://github.com/TomValenzano/ghigliottina-solver
---

## Il contesto

"La Ghigliottina" è il gioco finale de *L'Eredità*: cinque indizi tra loro scollegati, ognuno legato a un'unica parola nascosta. Il legame è quasi sempre lessicale o culturale — la soluzione forma con ogni indizio una parola composta, un modo di dire, una collocazione frequente (*doppio, carta, soldi, pasta, regalo* → **pacco**). Il giocatore ha 60 secondi.

L'esame di **Natural Language Processing** chiedeva un sistema che risolvesse il gioco entro il limite di tempo *e* generasse una descrizione che spiega il legame con ciascun indizio. Dataset: 965 partite di training, 100 di test — e solo il 22% delle soluzioni di test compare nel training. Memorizzare non basta: serve vero ragionamento associativo.

## L'idea di fondo

La scoperta che guida tutto il progetto è empirica: gli LLM generici sono **deboli nel risolvere** questo gioco (GPT-4 si ferma intorno al 4% in letteratura), mentre un **ranker knowledge-based** fondato sulle associazioni tra parole — l'approccio storico al gioco (OTTHO, UNIOR4NLP) — è molto più affidabile e praticamente istantaneo.

Quindi: divisione del lavoro. Un solver knowledge-based trova la soluzione, l'LLM genera solo la descrizione — dove la generazione è il suo punto forte.

## Come funziona

```text
5 indizi ─► [A] generazione candidati ─► [B] scoring per copertura ─► SOLUZIONE
                                                                   └─► descrizione (LLM)
```

**(A) Knowledge base di associazioni.** Tre fonti, tutte indicizzate per co-occorrenza:

1. **Polirematiche e proverbi** forniti dal corso (~36.000 voci, incluso il dizionario De Mauro)
2. **Titoli multi-parola di Wikipedia italiana** trattati come espressioni ("Conquista del West" collega *conquista* e *west*)
3. **Collocazioni estratte dal corpus Paisà** — per ogni indizio, le parole che co-occorrono entro ±3 token con PMI positiva

Dati i cinque indizi, i candidati sono tutte le parole associate ad almeno uno di essi.

**(B) Scoring per copertura.** Ogni candidato riceve `score = W · copertura + forza_MWE / √frequenza`. La copertura — a quanti dei cinque indizi il candidato è collegato — domina: una parola legata a tutti e cinque batte una legata a due, esattamente la logica del gioco. La divisione per √frequenza è una penalità tipo IDF che impedisce alle parole comuni (*dire*, *grande*) di inquinare la classifica. Parametri scelti su un dev set di 200 partite, test intatto fino alla valutazione finale.

**(C) Descrizione.** La genera **Qwen2.5-7B in locale** (via Ollama), con due esempi few-shot dal training, nello stile del gold. Locale perché gratuito, illimitato e non soggetto al limite dei 60 secondi — che vale solo sulla risoluzione.

## Risultati

- **47% accuracy top-1** sulla soluzione, MRR 0.55, gold nei top-50 nell'82% delle partite
- **0.01 s/partita** — zero partite oltre i 60 secondi
- Descrizione: **BERTScore-F1 0.73** (BERT multilingue), ROUGE-1 0.33, BLEU 6.73
- Progressione delle scelte di design: 21% (conteggio MWE grezzo) → 25% (copertura + rarità) → 36% (titoli Wikipedia, recall 63%→89%) → **47%** (collocazioni da corpus)

## Cosa è stato provato e scartato

L'ablation è metà del valore del progetto:

- **Embeddings fastText** — utili per il recall prima dei titoli Wikipedia (25%→31%), ridondanti e leggermente dannosi dopo → fuori dal sistema finale
- **Scorer a grafo (Personalized PageRank)** — la propagazione di attivazione dai cinque indizi non batte il ranking diretto: il collo di bottiglia è la copertura dei dati, non l'algoritmo
- **Selezione della soluzione con LLM** — peggiora il ranker: modelli locali ~0% in un test diagnostico, il 14B sfora i 60 secondi. Conferma che gli LLM non aiutano a *risolvere* questo gioco

## Cosa mi porto dietro

La leva decisiva non è stata l'algoritmo ma **l'ampiezza della knowledge base**: ogni salto di accuracy è arrivato aggiungendo una fonte di associazioni, non raffinando lo scoring. E il risultato negativo vale quanto quello positivo — sapere *dove* un LLM non serve è una competenza di design, non una sconfitta. La pipeline è concettualmente un RAG portato all'estremo: il retrieval decide la risposta, il modello si limita a spiegarla.

Progetto individuale per il corso di NLP all'**Università degli Studi di Bari Aldo Moro**.
