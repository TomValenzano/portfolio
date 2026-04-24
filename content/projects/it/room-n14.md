---
title: Room N14
slug: room-n14
subtitle: Sito vetrina per una piccola struttura ricettiva italiana. Nuxt SSG multilingue, structured data esaustivo, immagini ottimizzate in build — zero runtime.
category: work
role: Design · full-stack · SEO
stack:
  - Nuxt 3 (SSG)
  - Tailwind CSS
  - Sharp
  - JSON-LD
  - Multi-lingua (4 locale)
period: 2025
featured: true
order: 2
links:
  live: https://roomn14.it
---

## Il problema

Una piccola struttura ricettiva italiana vive o muore di **prenotazioni dirette**. Ogni notte prenotata via OTA (Booking, Airbnb) lascia 15-20% di commissione sul tavolo. Per intercettare il traffico organico servono tre cose insieme:

- **velocità** (Core Web Vitals decenti, mobile-first)
- **SEO locale serio** (structured data + hreflang + copy in più lingue)
- **estetica credibile** a budget ristretto, senza CMS da patchare

Nessun WordPress da manutenere, nessun server da riavviare, nessun plugin che si rompe la settimana della stagione alta.

## Perché l'ho costruito

Gestisco un piccolo B&B e volevo il controllo completo sul canale diretto. La vetrina era la porta d'ingresso naturale per il traffico organico — e una scusa perfetta per costruire tutto dallo zero con gli strumenti giusti.

## Architettura

**Nuxt 3 in modalità SSG puro** → output HTML+CSS+JS, nessun runtime server-side, hosting su CDN globale gratuito.

```text
5 pagine           ← home, servizi, posizione, galleria, contatti
4 componenti       ← navbar (con language switcher), footer,
                     ContactIcon (canali prenotazione), PoiIcon (punti d'interesse)
1 layout           ← default, con JSON-LD LodgingBusiness dinamico
4 locali           ← IT (default), EN, ES, FR
```

Niente Pinia, niente store, niente data-fetching: 5 pagine di contenuto, stato minimo (lingua corrente in cookie).

## Decisioni tecniche chiave

**1. Structured data esaustivo, non decorativo.** Ogni pagina emette JSON-LD mirato:

- `WebSite` + `Organization` sulla home
- `LodgingBusiness` su ogni pagina (indirizzo, coordinate geo, amenities, check-in/out, fascia prezzo)
- `FAQPage` sulla pagina servizi (ogni amenity è una Q&A)
- `BreadcrumbList` su ogni sottopagina

Google interpreta la pagina senza doverlo inferire dal copy. Ranking locale e rich results *molto* più solidi di "compilo `meta description` e spero".

**2. Multi-lingua a costo zero.** 4 locale, **una sola URL per pagina**: lo switcher in navbar cambia il contenuto lato client via cookie. Niente `/en/`, `/es/`, `/fr/` che raddoppiano le URL da mantenere. Tag `hreflang` puntano tutti alla stessa canonical + un `x-default`. Pro: manutenzione sitemap più semplice, copy centralizzato in `locales/*.json`. Contro: nessun boost da URL localizzate — trade-off accettato volontariamente per una struttura di 5 pagine.

**3. Ottimizzazione immagini come build step.** Script custom (Sharp):

- resize a max 1920px (hero 2000px per non perdere impatto)
- compressione *mozjpeg* quality 78-82 (82 sugli hero)
- generazione `.webp` parallela per ogni sorgente
- backup `.orig` prima di sovrascrivere — idempotente, eseguibile più volte

Cartella immagini totale **~11 MB**, singole immagini sotto 300 KB anche sugli hero. Niente CDN immagini esterno, niente `@nuxt/image`: uno script che gira in build è sufficiente per questa scala.

**4. Favicon automation.** Uno script produce la suite completa partendo da un template SVG parametrizzato: `favicon.ico` multi-resolution (16/32/48), `apple-touch-icon` 180, Android Chrome 192/512, `site.webmanifest`, SVG scalabile. Cambiare il colore del brand = modifica in un punto solo.

**5. LodgingBusiness JSON-LD centralizzato.** Dati della struttura (nome, indirizzo, coordinate, amenities, orari, range prezzo) in un singolo file config. Il layout serializza il JSON-LD una volta in build, tutte le pagine lo ereditano. Zero duplicazione, un solo punto di verità.

**6. Nessun backend, nessun form-engine.** La pagina contatti usa **mailto + WhatsApp + link diretti ai canali OTA + Instagram**. Niente form che salva in un DB, niente serverless function per l'invio. Meno superficie d'attacco, meno cose che si rompono, zero GDPR su form-submission.

## Numeri

- **~1.500 LOC** totali
- **5 pagine** · **4 componenti** · **1 layout**
- **4 locali** sincronizzate (IT · EN · ES · FR)
- **~30 asset immagine** (14 sorgenti + 16 derivate e favicon)
- **5 schema** JSON-LD emessi in totale

## Lezioni

Un sito statico fatto bene batte un CMS fatto male nove volte su dieci, specie per piccole realtà dove il contenuto cambia due volte all'anno. Il vincolo *"nessun runtime"* spinge a decisioni di design più semplici, non più povere. Un Lighthouse a 100 non è un vanto — è una conseguenza naturale del non avere nulla di superfluo da eseguire.
