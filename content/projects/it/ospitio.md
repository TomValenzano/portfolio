---
title: Ospitio
slug: ospitio
subtitle: Il gestionale per strutture turistiche italiane che automatizza gli adempimenti obbligatori — Alloggiati Web e Paytourist — costruito da chi un B&B lo gestisce davvero.
category: work
role: Fondatore · full-stack
stack:
  - Nuxt 3
  - Nuxt UI v3
  - NestJS 11
  - Prisma 6
  - PostgreSQL
  - TypeScript
  - SOAP
  - REST
period: 2024 → in corso
featured: true
order: 1
---

## Il problema

Ogni struttura ricettiva italiana deve compilare due adempimenti obbligatori per ogni ospite:

1. **Alloggiati Web** — servizio della Polizia di Stato. Le schedine degli ospiti vanno trasmesse entro 24 ore dal check-in. L'unico canale ufficiale è un'interfaccia SOAP che accetta file TXT con record a **larghezza fissa di 168 caratteri**. 15 colonne, ognuna con padding specifico (50 per il cognome, 30 per il nome, 2 per la sigla provincia, 9 per il codice ISTAT del comune di nascita). Un carattere fuori posto = schedina scartata con messaggio `SCHEDINA_CAMPO_NON_CORRETTO`.

2. **Paytourist** — piattaforma comunale per la gestione dell'imposta di soggiorno. API REST, endpoint diverso per provincia (Bari, Roma, Firenze, ognuna con la propria istanza), token struttura con validità 36 mesi.

Un gestore tipico inserisce manualmente gli stessi dati in tre sistemi (il proprio gestionale + Alloggiati + Paytourist), sbaglia una volta ogni 20 soggiorni, perde 15-30 minuti per prenotazione e accumula rischio di sanzioni sulle scadenze.

## Perché l'ho costruito

Gestisco un piccolo B&B. Ho vissuto il problema per mesi prima di decidere che l'automazione era l'unica strada sostenibile. **Ogni scelta di prodotto è stata presa contro un caso d'uso reale vissuto in prima persona** — non contro una *persona* inventata in workshop.

## Architettura

**Frontend** — Nuxt 3 SPA + Nuxt UI v3 + TypeScript, build SSG su Netlify. Niente store Pinia: `useState()` nativo di Nuxt + 11 composables che incapsulano le chiamate API. Un singolo `useApi()` wrappa `$fetch` con iniezione automatica del bearer token e dell'header di impersonation.

**Backend** — NestJS 11 + Prisma 6 + PostgreSQL (Supabase) su Render. 14 moduli di dominio:

```text
auth              ← JWT + registration / login / password reset
users             ← user management
permissions       ← RBAC granulare (admin, export_alloggiati, switch_user, …)
properties        ← strutture + credenziali Alloggiati/Paytourist
rooms             ← camere + mapping verso Paytourist
guests            ← anagrafica ospiti
guest-documents   ← documenti identità per ospite
stays             ← soggiorni (reservation)
stay-guests       ← pivot soggiorno↔ospite con ruolo
exports           ← generatore TXT 168-char per Alloggiati
alloggiati-web    ← client SOAP Polizia di Stato
paytourist        ← client REST imposta di soggiorno
checkin-intake    ← webhook per modulo kiosk di self check-in
audit             ← log completo delle modifiche
```

Tre guard trasversali: `JwtAuthGuard` globale, `PermissionsGuard` per i permessi granulari, `ImpersonationInterceptor` che permette a un admin con permesso `switch_user` di agire come un altro utente passando un codice esadecimale di 8 caratteri nell'header `X-Impersonate-Code`.

## Decisioni tecniche chiave

**1. SOAP dove non vorresti mai vederlo.** La Polizia di Stato espone solo SOAP. Client minimale scritto a mano, nessuna libreria pesante. Gestisce:

- `GenerateToken` con credenziali `user` / `password` / `wsKey` della struttura
- cache in memoria del token (validità ~1h) con refresh automatico
- due coppie di metodi in base al tipo di utente: `Send()`/`Test()` per utenti standard, `GestioneAppartamenti_Send()`/`Test()` per property manager con più appartamenti

**2. Formatter a larghezza fissa come cittadino di prima classe.** `alloggiati.formatter.ts` mappa `Guest + GuestDocument + Stay + StayGuestRole` → riga di 168 caratteri con padding specifico per ogni colonna. Separato da validator e exporter (single responsibility). Il `StayGuestRole` (SINGLE / FAMILY_HEAD / FAMILY_MEMBER / GROUP_HEAD / GROUP_MEMBER) determina il codice "Tipo Alloggiato" (16–20) — regola non banale perché dipende dalla composizione del gruppo.

**3. Multi-tenancy leggera.** Un'istanza backend, N utenti, ognuno con le proprie strutture. Ogni tabella operativa (`Guest`, `Stay`, `Export`, …) ha FK verso `ownerId`: tutti i service filtrano per owner. Più semplice di uno schema-per-tenant, più sicuro del trust cieco nell'app.

**4. Impersonation al posto delle password condivise.** Per assistere un utente, entro nel suo account passando un codice esadecimale di 8 caratteri (`X-Impersonate-Code`) — autorizzato dal permesso `switch_user`. Niente più *"dammi la password un secondo"*. Ogni azione in impersonation viene loggata in `AuditLog` con entrambi gli utenti.

**5. Test mode come gesto di rispetto per l'utente.** Prima di inviare le schedine alla Polizia di Stato, l'utente può cliccare **Test**: il backend chiama il metodo SOAP `Test()` che valida senza committare. Gli errori tornano per-schedina, con il codice originale e una traduzione leggibile. Zero sorprese dopo il Send.

**6. Webhook kiosk-to-stay.** Un modulo esterno di self check-in può creare `Guest + GuestDocument + Stay` via webhook protetto da API key (`CHECKIN_WEBHOOK_API_KEY`). Quando l'ospite compila il form alla porta d'ingresso, i dati arrivano già strutturati nel backend — pronti per essere inviati ad Alloggiati.

## Numeri

- ~**12.000 LOC** totali (6,7k frontend · 5,3k backend)
- **14 modelli** Prisma · **14 moduli** NestJS
- **15 colonne fixed-width** nel formato Alloggiati, con lookup contro le tabelle ISTAT per comuni e stati
- **2 integrazioni regolatorie** con semantiche opposte (SOAP XML fixed-width vs REST JSON)
- **5 permessi granulari** mappati a endpoint specifici
- **1 webhook kiosk** che chiude il loop dal front-desk al backend in un passaggio

## Lezioni che mi porto dietro

Lavorare su dominio pubblico-burocratico italiano insegna una cosa: l'assunzione di *"API decenti"* non tiene. L'astrazione vale solo se la scriviamo noi. Il valore per l'utente finale è proporzionale a quanta complessità regolatoria il software riesce a nascondere — e questa scala **moltiplicativamente**, non additivamente, rispetto alla quantità di codice.

Costruire software per un problema che hai in prima persona ha un vantaggio cheat: sai già dove l'utente si arrende. Non serve user research, serve solo non dimenticare quel momento.
