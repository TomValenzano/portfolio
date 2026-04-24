---
title: PuppyPad
slug: puppypad
subtitle: App Android multi-ruolo per il welfare animale — utenti, veterinari, enti pubblici collaborano su segnalazioni geolocalizzate e cartella sanitaria condivisa.
category: studies
role: Sviluppo di Mobile Software · triennale in Informatica
stack:
  - Android (Java)
  - Firebase (Auth · Realtime DB · Storage)
  - Google Play Services
  - ZXing (QR code)
  - Glide
  - Multi-lingua (5 locale)
period: 2023
featured: false
order: 20
---

## Il contesto

**PuppyPad** è un'applicazione Android pensata per connettere tre attori del mondo del welfare animale italiano: **utenti privati** (proprietari / persone che incontrano animali in difficoltà), **veterinari**, **enti pubblici** (canili, associazioni, amministrazioni). L'obiettivo è dare una piattaforma unica per segnalare un animale che ha bisogno, instradare la segnalazione al ruolo giusto e tenere traccia della sua storia clinica e sociale nel tempo.

Progetto universitario di gruppo (4 sviluppatori) sviluppato per l'esame di **Sviluppo di Mobile Software** (da cui il nome della repo: *SMS*) durante la triennale in Informatica e Tecnologie per la Produzione del Software.

## Il dominio

Ogni utente registrato appartiene a uno dei tre ruoli con una home dedicata:

- **Utente privato** — registra i propri animali, tiene cartella sanitaria (cure, spese), pubblica segnalazioni (cerco aiuto, cerco stallo, offro stallo, cerco animale, offro animale)
- **Veterinario** — vede gli animali "in carico", risponde alle segnalazioni che riguardano aspetti sanitari, aggiorna cartelle
- **Ente pubblico** — gestisce stalli, prende in custodia animali, risponde a segnalazioni di territorio

Il flusso centrale sono le **segnalazioni** geolocalizzate: un utente posta un caso, il sistema lo rende visibile ai ruoli pertinenti in base al tipo.

## Architettura

**Single-activity multi-fragment** con routing basato sul ruolo utente al login: `LoginActivity` → `HomeActivity` / `HomeVeterinarioActivity` / `HomeEnteActivity`. Navigazione interna via `BottomNavigationView` e Fragment swap.

**Persistenza** interamente su **Firebase**:

- **Auth** — email / password
- **Realtime Database** — utenti, animali, segnalazioni, cure, spese come alberi JSON
- **Storage** — foto di animali, immagini delle segnalazioni, avatar

Nessun Room / SQLite locale: ogni Fragment legge direttamente da Firebase tramite `ValueEventListener` — pattern callback-driven, sincrono, classico dell'ecosistema Android pre-Coroutines.

**Organizzazione del codice**:

```text
com.example.provalogin/
├── Model/        ← 7 POJO (Animal, Utente, Segnalazioni, Cure, Spesa, Image, Follow)
├── Fragment/     ← 20 Fragment (home ruoli, dettagli, form, QR scanner)
├── Adapter/      ← 8 RecyclerView adapter
└── Recycler/     ← utility
```

**Localizzazione**: italiano di default, più 4 locali (EN, FR, ES, DE) via resource qualifiers (`values-en/`, `values-fr/`, …). Persistenza della lingua in `SharedPreferences`.

## Decisioni tecniche chiave

**1. Firebase invece di backend custom.** Scelta voluta: un gruppo di 4 studenti triennali con un semestre di tempo doveva poter iterare sul dominio (3 ruoli, segnalazioni, cartella, QR), non scrivere un backend da zero. Realtime DB dà sincronizzazione cross-device gratis; Auth gestisce password reset e persistence; Storage risolve l'upload immagini. Il cost-benefit è ovvio per un progetto didattico.

**2. Geolocalizzazione delle segnalazioni.** Uso di `FusedLocationProvider` per ottenere la posizione dell'utente al momento della creazione di una segnalazione. Permessi fine/coarse location dichiarati in `AndroidManifest.xml`, richiesta runtime a partire da API 23. Le coordinate finiscono nella Realtime DB insieme al resto del record.

**3. QR code per identificazione animali.** Libreria ZXing + CodeScanner per generare e scansionare QR associati ai singoli animali. Un veterinario può così identificare un animale registrato senza dover cercare manualmente.

**4. Internazionalizzazione seria per un progetto d'esame.** 5 locale supportate non come esercizio performativo ma perché il dominio tocca potenziali utenti non italofoni (turisti, residenti stranieri, volontariato internazionale). Tutte le stringhe UI sono esternalizzate in `strings.xml` — rivedibile da non-developer.

**5. Separation of concerns livello Adapter / Fragment.** 8 adapter RecyclerView specifici per tipo di dato (animali, segnalazioni, cure, spese, immagini, utenti); 20 Fragment ognuno focalizzato su una singola schermata. Niente mega-classi da 2000 righe.

## Cosa non rifarei oggi

- **Niente MVVM / ViewModel / LiveData**: il progetto è del 2023 ma segue pattern del 2019. Oggi userei Jetpack Compose + ViewModel + StateFlow + Kotlin coroutines
- **Niente cache locale**: ogni schermata rifà la query. Room + sync strategy migliorerebbe UX offline
- **Firebase Realtime DB** per dati strutturati è discutibile: Firestore ha query più potenti e costa meno sulle letture frequenti che facciamo

Ma il punto di un progetto universitario non è shippare perfezione — è consegnare qualcosa che funzioni e imparare cosa rifaresti diverso. Questo case study è quel "diverso".

## Numeri

- ~**5.500 righe Java** su 49 file
- **41 layout XML** · **8 activity** · **20+ Fragment** · **7 model** · **8 adapter**
- **3 ruoli utente** con home dedicata
- **5 locale** (IT, EN, FR, ES, DE) · **5 tipi** di segnalazione
- **4 sviluppatori** in un semestre · ~67 commit
