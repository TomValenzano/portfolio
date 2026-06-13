---
title: AnimeGen
slug: animegen
subtitle: A diffusion-interpolation pipeline that generates short anime-style transitions between two consecutive manga panels — ToonCrafter adapted to the domain with balloon removal, preprocessing and frame interpolation.
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

## The context

The **Computer Vision** exam posed a concrete challenge: given two consecutive manga panels, generate a short anime-style transition video that connects them. The starting point is **ToonCrafter**, a recent diffusion-based image-to-video model designed for cartoon interpolation, applied to the **Manga109** dataset.

The interesting problem isn't "make the model run" — it's that ToonCrafter is built for Western colour animation, and manga are a different domain. Applied as-is, it produces mediocre results for specific reasons.

## Three domain-specific weaknesses

Before touching the model, I isolated **why** the baseline failed on manga:

1. **Text balloons** — comics contain speech bubbles that don't exist in anime. The generator reads them as objects to animate and gets confused.
2. **Screentone noise** — scanned line-art carries regular textures the model mistakes for semantic structure.
3. **Low frame rate** — generated clips have few frames, with temporal incoherence that's perceptible to the eye.

## The pipeline

A pre/post-processing chain that addresses all three weaknesses:

```text
Manga109
  → balloon removal      (LaMa inpainting, guided by Manga109 ground-truth bounding boxes)
  → LAB preprocessing    (bilateral → CLAHE → unsharp: denoise + edge sharpening)
  → ToonCrafter          (16-frame generation)
  → RIFE 4×              (temporal frame-rate upsampling)
```

## Key technical decisions

**1. Balloon removal with ground-truth, not heuristics.** LaMa inpainting is guided by the speech-bubble bounding boxes already annotated in Manga109 — no custom detector to train, just using the dataset for what it offers.

**2. Preprocessing in LAB colour space.** Denoise and sharpening operate on luminance separated from colour: the `bilateral → CLAHE → unsharp` chain cleans the screentone without destroying the line-work contours.

**3. A rethought style metric.** Prior work used a 3-channel Gram-matrix style metric — uninformative on grayscale manga. I replaced it with a **VGG19**-based formulation, which makes more sense for monochrome line-art.

**4. Manual model-sharding to generate at 16 frames.** The canonical 16-frame configuration didn't fit in the memory of a **Kaggle T4 × 2** environment. I implemented manual model-sharding: OpenCLIP and the VAE on `cuda:0`, the diffusion U-Net on `cuda:1`. A hardware constraint solved with explicit allocation instead of cutting quality.

**5. Evaluation on two axes, quantitative and perceptual.** A **2×2×2 ablation** over N=40 pairs from 5 titles measures each stage's contribution; a **2-AFC pairwise user study** (forced choice between two clips, with a "no preference" option) validates perceptual preference with a two-sided binomial test on the decisive votes.

**6. Interactive demo.** A **Streamlit** web app lets you pick any of the 40 pairs and compare its video under all 8 ablation configurations, with the per-clip metrics alongside.

## By the numbers

- Full pipeline vs vanilla ToonCrafter baseline: **−61.3% LPIPS**, **−34.5% Warping Error**
- The dominant contribution comes from **temporal frame interpolation** — preprocessing and balloon removal interact *non-monotonically* with the downstream metrics
- **2×2×2 ablation** · N=40 pairs · 5 titles
- **2-AFC user study**: 10 respondents, 40 decisive votes per comparison axis
- ~**1,900 lines** of Python (core modules: preprocessing, balloon removal, metrics, panel extraction + pipeline scripts)

## What I took away

Adapting a model outside its domain teaches two things. First: **the biggest gain came from the least glamorous part** — frame interpolation, not fine-tuning the diffusion model. Second: a wrong metric lies with confidence. The 3-channel style metric gave precise, useless numbers on grayscale images; until I replaced it, the ablation was telling a false story.

Project developed at the **University of Bari Aldo Moro**.
