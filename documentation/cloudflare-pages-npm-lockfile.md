---
type: gotcha
project: portfolio
created: 2026-07-28
last_verified: 2026-07-28
tags: [cloudflare-pages, npm, bun, lockfile, deploy, build]
---
# Cloudflare Pages ignora bun.lock e la build npm si rompe senza package-lock.json

## Sintomo
Push su `main` → build Cloudflare Pages **Failure**. Il sito live resta alla versione precedente. Tre errori diversi in cascata:

1. Senza lockfile npm: `npm error Cannot read properties of null (reading 'edgesOut')` durante `npm install` (bug arborist di npm 10.x su questo grafo di dipendenze).
2. Con lockfile generato su macOS contro il `node_modules` installato da bun: `Cannot find module './parser.linux-x64-gnu.node'` (oxc-parser) in `nuxt prepare` — nel lockfile c'erano solo i binding `darwin-arm64`.
3. Con lockfile rigenerato pulito da npm 10.8.2: `npm ci` (che parte quando il lockfile esiste) rifiuta il **suo stesso** lockfile: `Invalid: lock file's commander@11.1.0 does not satisfy commander@14.0.3`.

## Causa
Il repo usa **bun** (`bun.lock` committato), ma il build system di Cloudflare Pages non rileva `bun.lock` (testuale) e ripiega su npm. Senza `package-lock.json` fa una risoluzione fresca a ogni build → non deterministica e soggetta ai bug di npm 10.8.2 (quello del build image, node 20).

## Fix (verificato)
Generare `package-lock.json` con **npm 11** in una directory pulita (senza `node_modules` presente) e committarlo:

```bash
mkdir /tmp/lockgen && cp package.json /tmp/lockgen && cd /tmp/lockgen
npx -y npm@11 install --package-lock-only --ignore-scripts
npm ci --dry-run --ignore-scripts   # validare con npm 10.8.2: deve dire "added N packages"
cp package-lock.json <repo>/
```

Il lockfile di npm 11 è auto-consistente, passa la validazione `npm ci` di npm 10.8.2 e include i binding nativi di **tutte** le piattaforme (linux-x64 compreso).

## Trappole da evitare
- **Mai** generare il lockfile con `node_modules` di bun presente: npm legge l'albero esistente e scrive solo i binding della piattaforma corrente (darwin-arm64).
- npm 10.8.2 (locale e su CF) genera lockfile che il suo stesso `npm ci` rifiuta: serve npm 11.
- Quando si toccano le dipendenze (`package.json`), rigenerare **anche** `package-lock.json` con la procedura sopra, altrimenti `npm ci` su CF fallisce per out-of-sync.
- I log di build si leggono via API: `GET /accounts/{account}/pages/projects/portfolio/deployments/{id}/history/logs` con il token OAuth di wrangler.
