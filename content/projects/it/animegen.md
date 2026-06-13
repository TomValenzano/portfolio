---
title: AnimeGen
slug: animegen
subtitle: Pipeline di diffusion interpolation che genera brevi transizioni in stile anime tra due pannelli manga consecutivi — ToonCrafter adattato al dominio con balloon removal, preprocessing e frame interpolation.
category: studies
role: Computer Vision · MSc curriculum AI
stack:
  - Python
  - PyTorch
  - ToonCrafter (diffusion)
  - LaMa inpainting
  - RIFE
  - OpenCV
  - VGG19 · LPIPS
  - Streamlit
period: 2026
featured: true
order: 11
---

## Il contesto

L'esame di **Computer Vision** poneva una sfida concreta: dati due pannelli manga consecutivi, generare un breve video di transizione in stile anime che li colleghi. Il punto di partenza è **ToonCrafter**, un modello diffusion image-to-video recente, pensato per l'interpolazione di cartoni animati, applicato al dataset **Manga109**.

Il problema interessante non è "far girare il modello" — è che ToonCrafter nasce per l'animazione occidentale a colori, e i manga sono un dominio diverso. Applicarlo as-is produce risultati mediocri per ragioni precise.

## Le tre debolezze di dominio

Prima di toccare il modello, ho isolato **perché** la baseline falliva sui manga:

1. **Balloon di testo** — i fumetti contengono nuvolette di testo che negli anime non esistono. Il generatore le interpreta come oggetti da animare e si confonde.
2. **Rumore di retino** (screentone) — il line-art scansionato porta texture regolari che il modello scambia per struttura semantica.
3. **Frame rate basso** — le clip generate hanno pochi frame, con incoerenza temporale percepibile a occhio.

## La pipeline

Una catena pre/post-processing che affronta tutte e tre le debolezze:

```text
Manga109
  → balloon removal      (LaMa inpainting, guidato dai bounding box ground-truth di Manga109)
  → preprocessing LAB    (bilateral → CLAHE → unsharp: denoise + edge sharpening)
  → ToonCrafter          (generazione a 16 frame)
  → RIFE 4×              (upsampling temporale del frame rate)
```

## Decisioni tecniche chiave

**1. Balloon removal con ground-truth, non euristiche.** L'inpainting LaMa è guidato dai bounding box delle nuvolette già annotati in Manga109 — niente detector custom da addestrare, si sfrutta il dataset per quello che offre.

**2. Preprocessing nello spazio colore LAB.** Denoise e sharpening operano sulla luminanza separata dal colore: la pipeline `bilateral → CLAHE → unsharp` pulisce il retino senza distruggere i contorni del tratto.

**3. Metrica di stile ripensata.** Il lavoro precedente usava una style metric basata su matrice di Gram a 3 canali — poco informativa su manga in scala di grigi. L'ho sostituita con una formulazione basata su **VGG19**, più sensata per line-art monocromatico.

**4. Model-sharding manuale per generare a 16 frame.** La configurazione canonica a 16 frame non entrava nella memoria di un ambiente **Kaggle T4 × 2**. Ho implementato uno sharding manuale del modello: OpenCLIP e il VAE su `cuda:0`, la U-Net di diffusione su `cuda:1`. Vincolo hardware risolto con allocazione esplicita invece di ridurre la qualità.

**5. Valutazione su due assi, quantitativo e percettivo.** Un'**ablation 2×2×2** su N=40 coppie da 5 titoli misura il contributo di ogni stadio; uno **user study 2-AFC pairwise** (scelta forzata tra due clip, con opzione "nessuna preferenza") valida la preferenza percettiva con un test binomiale a due code sui voti decisivi.

**6. Demo interattiva.** Una webapp **Streamlit** permette di selezionare una qualsiasi delle 40 coppie e confrontarne il video sotto tutte e 8 le configurazioni dell'ablation, con le metriche per-clip a fianco.

## Numeri

- Pipeline completa vs baseline ToonCrafter vanilla: **−61,3% LPIPS**, **−34,5% Warping Error**
- Il contributo dominante viene dalla **frame interpolation temporale** — preprocessing e balloon removal interagiscono in modo *non-monotono* con le metriche a valle
- **Ablation 2×2×2** · N=40 coppie · 5 titoli
- **User study 2-AFC**: 10 rispondenti, 40 voti decisivi per asse di confronto
- ~**1.900 righe** Python (moduli core: preprocessing, balloon removal, metrics, estrazione pannelli + script di pipeline)

## Cosa mi porto dietro

Adattare un modello fuori dal suo dominio insegna due cose. La prima: **il guadagno più grosso è venuto dalla parte meno glamour** — l'interpolazione di frame, non il fine-tuning del diffusion model. La seconda: una metrica sbagliata mente con sicurezza. La style metric a 3 canali dava numeri precisi e inutili su immagini in scala di grigi; finché non l'ho sostituita, l'ablation raccontava una storia falsa.

Progetto sviluppato all'**Università degli Studi di Bari Aldo Moro**.
