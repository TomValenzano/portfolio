---
title: Ospitio
slug: ospitio
subtitle: A management SaaS for Italian accommodations that automates the two mandatory regulatory workflows — Alloggiati Web and Paytourist — built by someone who actually runs a B&B.
category: work
role: Founder · full-stack
stack:
  - Nuxt 3
  - Nuxt UI v3
  - NestJS 11
  - Prisma 6
  - PostgreSQL
  - TypeScript
  - SOAP
  - REST
period: 2024 → ongoing
featured: true
order: 1
---

## The problem

Every Italian accommodation (hotel, B&B, apartment rental) has to handle two mandatory per-guest workflows:

1. **Alloggiati Web** — run by the Italian State Police. Guest records must be filed within 24 hours of check-in. The only official channel is a SOAP API that accepts TXT files with **fixed-width 168-character records**. 15 columns, each with its own padding (50 for surname, 30 for first name, 2 for the Italian province code, 9 for the ISTAT code of the birth city). One character off position = record rejected with a cryptic `SCHEDINA_CAMPO_NON_CORRETTO` error.

2. **Paytourist** — municipal platform for tourist-tax management. REST API, one instance per province (Bari, Rome, Florence — each with its own endpoint), structure token renewable every 36 months.

A typical owner re-enters the same guest data into three systems (their own bookings tool + Alloggiati + Paytourist), fumbles one record in twenty, loses 15-30 minutes per reservation, and carries the compliance-deadline anxiety on top.

## Why I built it

I run a small B&B. I lived the problem for months before I decided automation was the only sustainable path. **Every product decision was made against a concrete lived use case** — not a persona invented in a workshop.

## Architecture

**Frontend** — Nuxt 3 SPA + Nuxt UI v3 + TypeScript, SSG build on Netlify. No Pinia stores: just Nuxt's native `useState()` plus 11 composables that wrap the API calls. A single `useApi()` layer around `$fetch` handles bearer-token injection and impersonation headers.

**Backend** — NestJS 11 + Prisma 6 + PostgreSQL (Supabase) on Render. 14 domain modules:

```text
auth              ← JWT + registration / login / password reset
users             ← user management
permissions       ← granular RBAC (admin, export_alloggiati, switch_user, …)
properties        ← accommodations + Alloggiati/Paytourist credentials
rooms             ← rooms + Paytourist room mapping
guests            ← guest master data
guest-documents   ← identity documents per guest
stays             ← reservations
stay-guests       ← stay↔guest pivot with role
exports           ← 168-char TXT generator for Alloggiati
alloggiati-web    ← SOAP client for the State Police portal
paytourist        ← REST client for the tourist-tax platform
checkin-intake    ← webhook for an external self-check-in kiosk
audit             ← full audit log of entity changes
```

Three cross-cutting guards: a global `JwtAuthGuard`, a `PermissionsGuard` for granular permissions, and an `ImpersonationInterceptor` that lets an admin with the `switch_user` permission act as another user by passing an 8-character hex code in the `X-Impersonate-Code` header.

## Key technical decisions

**1. SOAP where you never want to see it.** The State Police portal speaks SOAP only. I wrote a minimal SOAP client by hand, no heavy library. It handles:

- `GenerateToken` with the structure's `user` / `password` / `wsKey` credentials
- in-memory token caching (~1h TTL) with automatic refresh
- two method pairs depending on the user type: `Send()`/`Test()` for standard users, `GestioneAppartamenti_Send()`/`Test()` for property managers with multiple apartments

**2. The fixed-width formatter is a first-class citizen.** `alloggiati.formatter.ts` maps `Guest + GuestDocument + Stay + StayGuestRole` to a 168-character line with column-specific padding. Kept separate from validator and exporter (single responsibility). The `StayGuestRole` (SINGLE / FAMILY_HEAD / FAMILY_MEMBER / GROUP_HEAD / GROUP_MEMBER) determines the "Tipo Alloggiato" code (16-20) — a non-trivial rule because it depends on the composition of the party.

**3. Lightweight multi-tenancy.** One backend instance, N users, each with their own accommodations. Every operational table (`Guest`, `Stay`, `Export`, …) carries an `ownerId` FK; all services filter by owner. Simpler than schema-per-tenant, safer than trusting the app layer blindly.

**4. Impersonation instead of shared passwords.** To assist a user, I step into their account by passing an 8-character hex code (`X-Impersonate-Code`) — gated by the `switch_user` permission. No more *"send me your password for a sec"*. Every impersonated action lands in `AuditLog` with both the operator and the target user.

**5. Test mode as a gesture of respect.** Before sending records to the State Police, the user can click **Test**: the backend calls the SOAP `Test()` method which validates without committing. Errors come back per-record with the original code and a human-readable translation. No surprises after Send.

**6. Kiosk-to-stay webhook.** An external self-check-in module can create `Guest + GuestDocument + Stay` via an API-key-protected webhook (`CHECKIN_WEBHOOK_API_KEY`). When a guest fills the form at the front door, the data reaches the backend already structured — ready to be filed with Alloggiati.

## Numbers

- ~**12,000 LOC** total (6.7k frontend · 5.3k backend)
- **14 Prisma models** · **14 NestJS modules**
- **15 fixed-width columns** in the Alloggiati format, with lookups against ISTAT tables for Italian cities and countries
- **2 regulatory integrations** with opposite semantics (SOAP XML fixed-width vs REST JSON)
- **5 granular permissions** wired to specific endpoints
- **1 kiosk webhook** closing the loop from the front desk to the backend in a single hop

## Takeaways

Working on an Italian public-bureaucracy domain teaches you one thing: the *"decent API"* assumption doesn't hold. Abstraction is only worth it when we write it. End-user value scales **multiplicatively** — not additively — with the amount of regulatory complexity the software manages to hide.

Building software for a problem you have yourself carries a cheat code: you already know exactly where the user gives up. No user research needed — you just can't forget that moment.
