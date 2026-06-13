---
type: security-audit
project: portfolio
created: 2026-06-13
last_verified: 2026-06-13
tags: [security, headers, csp, supply-chain, audit]
---

# Security Audit — portfolio (tvalenzano.it)

**Data:** 2026-06-13 · **Auditor:** Claude (per Tommaso) · **Commit base:** `faf1427`

## Scope e modello di minaccia

Sito **Nuxt 3 SSG puramente statico**, servito dietro **Cloudflare** su `tvalenzano.it`, repo pubblica (`github.com/TomValenzano/portfolio`).

Caratteristiche che definiscono la superficie d'attacco:
- **Nessun backend / API route / Nitro server runtime** — output = HTML/CSS/JS statici.
- **Nessun input utente** — niente form, niente query param processati, niente `v-html`, niente `eval`/`new Function`.
- **Nessuno script di terze parti** — niente analytics/tag manager/iframe. Font self-hostati da `@nuxt/fonts` a build time.

Conseguenza: i vettori classici (SQLi, XSS stored/reflected da input, SSRF, auth bypass, CSRF) **non si applicano**. L'audit si concentra su header HTTP, supply chain, segreti nel repo pubblico, information disclosure e igiene dei link.

## Riepilogo findings

| # | Finding | Severità | Stato |
|---|---------|----------|-------|
| F1 | Header di sicurezza mancanti (CSP, HSTS, X-Frame-Options, Permissions-Policy) | **Media** | ✅ Risolto |
| F2 | `access-control-allow-origin: *` su asset statici | Info | ⚠️ Accettato (vedi nota) |
| F3 | Link esterni `target="_blank"` con solo `rel="noopener"` | Bassa | ✅ Risolto (`noreferrer` aggiunto) |
| F4 | Dipendenze con CVE note (build/dev tooling + Nuxt) | Bassa* | 📋 Raccomandazione |
| F5 | Information disclosure nei case study | Info | ✅ Nessuna azione (vedi analisi) |
| F6 | Segreti nella git history | — | ✅ Nessuno trovato |

\* Bassa *per questo deployment* (SSG senza runtime). Vedi triage in F4.

---

## F1 — Header di sicurezza mancanti → RISOLTO

**Stato pre-audit** (verificato live con `curl -sSI https://tvalenzano.it/`):
- Presenti: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`.
- **Assenti:** `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`.

**Fix:** creato **`public/_headers`** (copiato da Cloudflare Pages nell'output root — verificato in `.output/public/_headers` dopo `bun run generate`). Aggiunge:

- **CSP**: `default-src 'self'` con `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`. Validato contro l'output reale: nessuna risorsa esterna caricata (font self-hostati, 37× woff2 locali; unica URL esterna è `og:image` same-origin in un meta tag).
- **HSTS**: `max-age=31536000; includeSubDomains; preload`.
- **X-Frame-Options: DENY** (+ `frame-ancestors 'none'` per i browser moderni).
- **Permissions-Policy**: camera/microfono/geolocation/USB/payment ecc. disabilitati + `interest-cohort=()` (no FLoC).
- **COOP/CORP**: `same-origin`.

**Tradeoff CSP — `'unsafe-inline'` su `script-src` e `style-src`:** Nuxt inietta 1 `<script>` inline (`window.__NUXT__`, contiene un `buildId` che cambia ad ogni build) e blocchi `<style>` inline (critical CSS Tailwind). Un hash statico nel file `_headers` si romperebbe ad ogni rebuild, quindi è necessario `'unsafe-inline'`. **Il rischio residuo è basso**: il sito renderizza solo contenuto statico e autorizzato, senza input utente né sink XSS (`v-html`/`eval` assenti). Per una CSP hash/nonce-based più stretta (e un punteggio pieno su Mozilla Observatory) si può adottare il modulo **`nuxt-security`**, che genera hash/SRI per build — opzionale, non bloccante.

⚠️ **Verifica post-deploy richiesta:**
```bash
curl -sSI https://tvalenzano.it/ | grep -iE 'content-security|strict-transport|x-frame|permissions-policy'
```
Aprire poi la console del browser sul sito live e confermare **zero violazioni CSP** durante la navigazione tra le pagine.

> Nota: `_headers` funziona se il deploy è **Cloudflare Pages**. Se Cloudflare è solo un proxy davanti a un altro host statico, gli stessi header vanno replicati nella config di quell'host o via Cloudflare Transform Rules / Response Header Transform.

---

## F2 — `access-control-allow-origin: *` → ACCETTATO

Cloudflare risponde con `access-control-allow-origin: *` sugli asset. Per un sito statico **interamente pubblico** (nessun dato sensibile, nessun cookie di sessione, nessuna API autenticata) questo è **innocuo**: non c'è nulla che il CORS protegga. Nessuna azione. Documentato per completezza.

---

## F3 — Link esterni → RISOLTO

Tutti i link `target="_blank"` avevano già `rel="noopener"` (no reverse-tabnabbing). Aggiunto **`noreferrer`** per non perdere l'header `Referer` verso domini esterni (LinkedIn, Instagram, roomn14.it, caprettiguesthouse). File modificati:
- `app/layouts/default.vue`, `app/pages/about.vue`, `app/pages/studio.vue` (×4), `app/pages/work/[slug].vue`.

---

## F4 — Dipendenze (supply chain) → RACCOMANDAZIONE

`bun audit` riporta diverse advisory. **Triage per impatto reale su questo deployment SSG:**

| Pacchetto | Via | Tipo | Impatto reale |
|-----------|-----|------|---------------|
| `nuxt` ≤3.21.5 | diretta | XSS in `navigateTo()` redirect; `__nuxt_island` cache poisoning / middleware bypass | **Nullo a runtime**: nessun Nitro server, nessun endpoint `__nuxt_island`, nessun `navigateTo` con input utente. Patchato in **3.21.8**. |
| `esbuild`, `vite`, `shell-quote`, `brace-expansion` | build tooling (vite, devtools, vue-tsc) | RCE/DoS in dev-server/build | **Solo dev-time**, non nell'artefatto pubblicato. |
| `minimist`, `qs`, `request`, `form-data`, `tough-cookie`, `uuid`, `url-regex`, `jimp`, `to-ico` | `scripts/generate-favicons.mjs` + `better-sqlite3` install | Prototype pollution / SSRF / ReDoS | **Solo script dev eseguiti a mano**, mai in produzione né in CI. |

**Nessuna di queste raggiunge l'utente finale del sito statico.** Raccomandazioni (per igiene, non urgenti):
- Bump `nuxt` → `3.21.8` quando si rigenera l'environment. ⚠️ **Tentato durante l'audit: fallisce con bun** (`oxc-parser`/`oxc-walker` non risolto nel `postinstall` → build rotta). Va fatto con cautela, eventualmente fissando `oxc-parser` o passando a `pnpm`/`npm` per l'install. **Non applicato** per non lasciare il repo in stato non-buildabile.
- Le dipendenze vulnerabili dei `scripts/generate-*.mjs` (jimp/to-ico/sharp) si possono ignorare o isolare: sono utility one-shot per generare favicon/og-image, non parte del deploy.

Stato attuale verificato: **Nuxt 3.21.2 intatto e buildabile** (`bun run generate` ✓).

---

## F5 — Information disclosure nei case study → NESSUNA AZIONE

Revisione di `content/projects/{it,en}/*.md` contro le regole di contenuto pubblico:
- **Nessun segreto reale**: niente API key, env var, hostname interni, URL di endpoint privati, credenziali.
- I nomi `user`/`password`/`wsKey` e i metodi SOAP (`GenerateToken`, `Send`, `Test`) in `ospitio.md` appartengono alla **spec pubblica dell'API governativa Alloggiati Web** (Polizia di Stato), non al sistema di Tommaso.
- Province (Bari/Roma/Firenze) e TTL token 36 mesi descrivono la piattaforma terza **Paytourist**, non infrastruttura privata.
- Nomi di moduli/guard/file interni (`JwtAuthGuard`, `alloggiati.formatter.ts`, i 14 moduli NestJS) sono **storytelling architetturale intenzionale** del portfolio — generici, nulla di sfruttabile.
- `roomn14.it` è un sito pubblicato (link `live` intenzionale).

**Opzionale (editoriale, non sicurezza):** se si vuole essere conservativi, generalizzare i nomi di classi/file interni. Non necessario.

---

## F6 — Segreti nella git history → NESSUNO

- Scan dell'intera cronologia commit (`git log --all -p` con pattern per chiavi/token/private key/JWT): **0 segreti reali**. I match erano falsi positivi (nomi di pacchetti nel lockfile: `comma-separated-tokens`, `@azure/keyvault-secrets`).
- **`clone-repo/`** (le 6 repo private sorgente) **mai committato** — confermato su tutta la history.
- Nessun `.env`, `.sqlite`, `.DS_Store` tracciato (`git ls-files` pulito). `.gitignore` copre correttamente `.env*`, `.data/`, `clone-repo/`.

---

## Azioni eseguite

1. ✅ `public/_headers` con CSP/HSTS/X-Frame/Permissions-Policy/COOP/CORP.
2. ✅ `noreferrer` su tutti i link esterni (5 file).
3. ✅ Build verificata: `bun run generate` OK, `_headers` nell'output, CSP coerente con le risorse reali.

## Azioni raccomandate (non applicate)

1. 📋 Post-deploy: verificare gli header live con `curl` + console browser per violazioni CSP.
2. 📋 Confermare che il deploy sia Cloudflare **Pages** (altrimenti replicare gli header via Transform Rules).
3. 📋 Bump `nuxt` → 3.21.8 risolvendo il problema `oxc-parser` con bun (o switch install manager).
4. 📋 (Opzionale) Modulo `nuxt-security` per CSP hash-based senza `'unsafe-inline'`.
