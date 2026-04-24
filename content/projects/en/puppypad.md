---
title: PuppyPad
slug: puppypad
subtitle: Multi-role Android app for animal welfare — pet owners, vets and public entities collaborate on geolocated reports and a shared animal health record.
category: studies
role: University project · BSc in Computer Science
stack:
  - Android (Java)
  - Firebase (Auth · Realtime DB · Storage)
  - Google Play Services
  - ZXing (QR)
  - Glide
  - Multi-language (5 locales)
period: 2023
featured: false
order: 20
---

## Context

**PuppyPad** is an Android app designed to connect three actors in the Italian animal-welfare ecosystem: **private users** (pet owners and passers-by who encounter animals in distress), **veterinarians**, and **public entities** (shelters, associations, local authorities). The goal: a single platform to report an animal in need, route that report to the right role, and track the animal's clinical and social history over time.

Group university project (4 developers) built during the BSc in Computer Science.

## The domain

Each registered user belongs to one of three roles, with a dedicated home screen:

- **Private user** — registers their own animals, maintains their health record (cures, expenses), posts reports (looking for help, looking for a foster home, offering a foster home, looking for an animal, offering an animal)
- **Veterinarian** — sees assigned animals, responds to reports involving clinical matters, updates health records
- **Public entity** — manages foster homes, takes custody of animals, responds to territory-level reports

The central flow is the **geolocated report**: a user posts a case, and the system surfaces it to the relevant roles based on type.

## Architecture

**Single-activity multi-fragment** with role-based routing at login: `LoginActivity` → `HomeActivity` / `HomeVeterinarioActivity` / `HomeEnteActivity`. Internal navigation via `BottomNavigationView` and fragment swapping.

Persistence is entirely on **Firebase**:

- **Auth** — email / password
- **Realtime Database** — users, animals, reports, cures, expenses as JSON trees
- **Storage** — animal photos, report images, avatars

No local Room / SQLite: each Fragment reads from Firebase via `ValueEventListener` — a callback-driven, synchronous pattern, classic pre-Coroutines Android.

**Code layout**:

```text
com.example.provalogin/
├── Model/        ← 7 POJOs (Animal, Utente, Segnalazioni, Cure, Spesa, Image, Follow)
├── Fragment/     ← 20 Fragments (role homes, details, forms, QR scanner)
├── Adapter/      ← 8 RecyclerView adapters
└── Recycler/     ← utilities
```

**Localisation**: Italian by default, plus 4 more locales (EN, FR, ES, DE) via resource qualifiers (`values-en/`, `values-fr/`, …). Language preference persisted in `SharedPreferences`.

## Key technical decisions

**1. Firebase instead of a custom backend.** Deliberate choice: a team of 4 undergrads with one semester to ship needed to iterate on the domain (3 roles, reports, health record, QR), not write a backend from scratch. Realtime DB gives cross-device sync for free; Auth handles password reset and session persistence; Storage solves image uploads. The cost/benefit is obvious for a coursework setting.

**2. Geolocated reports.** `FusedLocationProvider` is used to capture the user's position at the moment a report is created. Fine / coarse location permissions declared in `AndroidManifest.xml`, requested at runtime from API 23 onward. Coordinates are stored alongside the rest of the report record.

**3. QR codes for animal identification.** ZXing + CodeScanner libraries to generate and scan QR codes tied to individual animals. A vet can identify a registered animal without having to search manually.

**4. Serious i18n for a university project.** 5 supported locales — not as performative busywork, but because the domain touches non-Italian-speaking users (tourists, foreign residents, international volunteering). All UI strings externalised in `strings.xml` so non-developers can review them.

**5. Adapter / Fragment separation of concerns.** 8 RecyclerView adapters specialised by data type (animals, reports, cures, expenses, images, users); 20 Fragments each focused on a single screen. No mega-classes creeping past 2,000 lines.

## What I wouldn't do the same way today

- **No MVVM / ViewModel / LiveData**: the project is from 2023 but follows 2019 patterns. Today I'd use Jetpack Compose + ViewModel + StateFlow + Kotlin coroutines
- **No local cache**: every screen refetches. Room + a sync strategy would improve offline UX
- **Firebase Realtime DB** for structured data is debatable: Firestore has more powerful queries and costs less on the frequent reads we do

But the point of a university project isn't to ship perfection — it's to ship something that works and learn what you'd do differently. This case study *is* that "differently".

## Numbers

- ~**5,500 lines of Java** across 49 files
- **41 XML layouts** · **8 activities** · **20+ Fragments** · **7 models** · **8 adapters**
- **3 user roles** with dedicated homes
- **5 locales** (IT, EN, FR, ES, DE) · **5 report types**
- **4 developers** · one semester · ~67 commits
