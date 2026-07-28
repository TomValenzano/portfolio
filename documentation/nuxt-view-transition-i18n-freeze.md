---
type: gotcha
project: portfolio
created: 2026-07-28
last_verified: 2026-07-28
tags: [nuxt, view-transitions, i18n, performance, freeze, chrome]
---
# View transition appesa al load di /studio → rendering congelato 4s su Chrome/Brave

## Sintomo
Aprendo o ricaricando `tvalenzano.it/studio/` su desktop (Chrome, Brave), la pagina appare ma **scroll e input restano bloccati ~4 secondi**. Su iOS non si blocca. Lighthouse dà score 0.96 con blocking time 0 ms — tutto "pulito".

## Perché le metriche non lo vedono
Il main thread è libero: il blocco è del **compositor/rendering**. Lighthouse, TBT, long task e i trace headless non lo catturano. Serve un browser headed con GPU reale e un detector di gap tra frame rAF (>100 ms).

## Causa
1. `studio.vue` usa `defineI18nRoute({ locales: false })`: al hydration il modulo i18n **ri-naviga la rotta** (due navigazioni back-to-back).
2. `nuxt.config.ts` ha `experimental: { viewTransition: true }`: ogni navigazione client-side avvia `document.startViewTransition`.
3. Due transizioni consecutive → la seconda resta appesa e Chrome **congela il rendering fino al suo timeout interno di 4 secondi esatti** (freeze da 4004-4008 ms nei test, sempre uguale — il numero rotondo è la firma del timeout).

La home non è affetta (nessuna ri-navigazione al load).

## Fix (verificato live)
```ts
// app/pages/studio.vue
definePageMeta({
  layout: 'studio',
  viewTransition: false, // Brain: nuxt-view-transition-i18n-freeze
})
```

## Come riprodurre/verificare
Script `scroll-test.mjs` (puppeteer-core, Chrome headed, deviceScaleFactor 2): hook su `document.startViewTransition` + loop rAF che logga gap >100 ms, scroll con `mouse.wheel` subito dopo `domcontentloaded`. Prima del fix: 2 chiamate VT a ~1.5s e gap di 4008 ms. Dopo: zero chiamate, zero gap.

## Trigger per il futuro
- Freeze di durata **sospettosamente rotonda** (4s) con main thread libero → view transition appesa.
- Qualsiasi pagina con `defineI18nRoute({ locales: false })` + viewTransition attivo rischia lo stesso problema.
- "Lighthouse dice che è tutto ok ma la pagina si blocca" → misurare i gap rAF in un browser headed, non headless.
