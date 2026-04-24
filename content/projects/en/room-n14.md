---
title: Room N14
slug: room-n14
subtitle: A vetrina site for a small Italian lodging business. Nuxt SSG, multilingual, exhaustive structured data, build-time image optimisation — zero runtime.
category: work
role: Design · full-stack · SEO
stack:
  - Nuxt 3 (SSG)
  - Tailwind CSS
  - Sharp
  - JSON-LD
  - Multi-language (4 locales)
period: 2025
featured: true
order: 2
links:
  live: https://roomn14.it
---

## The problem

A small Italian lodging business lives or dies by **direct bookings**. Every night booked through an OTA (Booking, Airbnb) leaves 15-20% commission on the table. To capture organic traffic you need three things together:

- **speed** (decent Core Web Vitals, mobile-first)
- **serious local SEO** (structured data + hreflang + copy in multiple languages)
- **credible aesthetics** on a small budget, without a CMS to patch monthly

No WordPress to maintain, no servers to restart, no plugins breaking during high season.

## Why I built it

I run a small B&B and I wanted full control over the direct channel. The vetrina site was the natural front door for organic traffic — and the perfect excuse to build everything from scratch with the right tools.

## Architecture

**Nuxt 3 in pure SSG mode** → HTML+CSS+JS output, no server-side runtime, hosted on a free global CDN.

```text
5 pages            ← home, services, location, gallery, contact
4 components       ← navbar (with language switcher), footer,
                     ContactIcon (booking channels), PoiIcon (points of interest)
1 layout           ← default, with dynamic LodgingBusiness JSON-LD
4 locales          ← IT (default), EN, ES, FR
```

No Pinia, no stores, no data fetching: 5 content pages, minimal state (current language in a cookie).

## Key technical decisions

**1. Exhaustive, not decorative, structured data.** Every page emits targeted JSON-LD:

- `WebSite` + `Organization` on the home page
- `LodgingBusiness` on every page (address, geo coordinates, amenities, check-in/out, price range)
- `FAQPage` on the services page (each amenity is a Q&A)
- `BreadcrumbList` on every subpage

Google reads the page without having to infer from the copy. Local ranking and rich results are *much* more solid than *"I fill the `meta description` and hope"*.

**2. Multi-language at zero cost.** 4 locales, **one URL per page**: the navbar switcher swaps content client-side via cookie. No `/en/`, `/es/`, `/fr/` doubling the URLs to maintain. `hreflang` tags all point to the same canonical plus `x-default`. Pros: simpler sitemap, copy centralised in `locales/*.json`. Cons: no SEO boost from localised URLs — trade-off accepted for a 5-page site.

**3. Image optimisation as a build step.** Custom Sharp script:

- resize to max 1920px (hero 2000px to keep visual impact)
- *mozjpeg* compression quality 78-82 (82 on heroes)
- parallel `.webp` generation for every source
- `.orig` backup before overwriting — idempotent, safe to re-run

Total image folder **~11 MB**, single images under 300 KB even on heroes. No external image CDN, no `@nuxt/image`: a build-time script is enough at this scale.

**4. Favicon automation.** One script produces the full suite from a parameterised SVG template: multi-res `favicon.ico` (16/32/48), `apple-touch-icon` 180, Android Chrome 192/512, `site.webmanifest`, a scalable SVG. Changing the brand colour = one-line edit.

**5. Centralised LodgingBusiness JSON-LD.** All property data (name, address, coordinates, amenities, hours, price range) lives in a single config file. The layout serialises the JSON-LD once at build time; every page inherits it. Zero duplication, one source of truth.

**6. No backend, no form engine.** The contact page uses **mailto + WhatsApp + direct OTA channel links + Instagram**. No form persisting to a DB, no serverless function for submission. Less attack surface, less to break, zero GDPR overhead on form-submissions.

## Numbers

- **~1,500 LOC** total
- **5 pages** · **4 components** · **1 layout**
- **4 locales** synchronised (IT · EN · ES · FR)
- **~30 image assets** (14 sources + 16 derivatives and favicons)
- **5 JSON-LD** schema types emitted in total

## Takeaways

A well-built static site beats a poorly-built CMS nine times out of ten, especially for small businesses where content changes twice a year. The *"no runtime"* constraint pushes toward simpler design decisions, not poorer ones. A Lighthouse score of 100 isn't a brag — it's the natural consequence of having nothing superfluous to execute.
