# Architecture de SalonFlow AI

## Vue d'ensemble

```
Navigateur ──► Frontend Next.js (application/, port 3000) ──HTTP/JSON──► API Express (backend/, port 4000) ──► data/bookings.json
                pages, composants React, lib/api.ts             validation, PIN, revérification du créneau        réservations
```

SalonFlow AI est composé de **deux programmes séparés** qui communiquent par une API HTTP en JSON :

- le **frontend** (`application/`) affiche les pages et envoie les demandes ; il ne contient aucune règle métier ni aucune donnée ;
- le **backend** (`backend/`) applique les règles (créneaux, capacité, PIN), lit le catalogue dans `data/seed.json` et écrit les réservations dans `data/bookings.json` (créé au premier enregistrement, ignoré par git).

Toutes les adresses de l'API passent par un seul fichier côté frontend : `application/lib/api.ts`.

## Arborescence

```
project-salonflow-ai/
├── package.json              npm run install:all, npm run dev (lance les deux programmes)
├── application/              frontend Next.js
│   ├── app/
│   │   ├── page.tsx          accueil : salon, catalogue, horaires
│   │   ├── reserver/page.tsx parcours de réservation
│   │   ├── mes-rdv/page.tsx  consultation et annulation
│   │   └── pro/page.tsx      espace professionnel
│   ├── components/           BookingFlow, MyBookings, ProAgenda, BackendDown
│   └── lib/
│       ├── api.ts            adresse de l'API (NEXT_PUBLIC_API_URL) et appels
│       ├── format.ts         prix, durées, dates en français
│       ├── time.ts           dates au fuseau Africa/Dakar (affichage)
│       └── types.ts          types partagés avec l'API
└── backend/                  API Express + TypeScript
    ├── src/
    │   ├── server.ts         démarrage (port, .env)
    │   ├── app.ts            CORS, limite de taille, erreurs JSON
    │   ├── routes/           salon, créneaux, réservations, espace pro
    │   └── lib/
    │       ├── slots.ts      calcul des créneaux et de la disponibilité
    │       ├── store.ts      lecture/écriture du fichier JSON, écritures sérialisées
    │       ├── time.ts       dates et heures au fuseau Africa/Dakar
    │       ├── validation.ts nom et téléphone
    │       ├── pro-auth.ts   contrôle du PIN
    │       └── types.ts
    ├── data/seed.json        salon, horaires, prestations
    └── scripts/              smoke-test.mjs, reset-data.mjs
```

## API

| Méthode | Route | Rôle | Protection |
|---|---|---|---|
| GET | `/api/health` | état du serveur : `{ "status": "ok" }` | — |
| GET | `/api/salon` | salon et catalogue | — |
| GET | `/api/slots?serviceId=&date=` | créneaux d'un jour, libres ou non | — |
| POST | `/api/bookings` | crée une réservation (409 si le créneau est complet) | validation serveur |
| GET | `/api/bookings?phone=` | rendez-vous d'une cliente | numéro de téléphone |
| DELETE | `/api/bookings/:id?phone=` | annulation par la cliente (à venir uniquement) | numéro de téléphone |
| GET | `/api/pro/agenda?date=` | agenda d'un jour et statistiques | en-tête `x-pro-pin` |
| PATCH | `/api/pro/bookings/:id` | statut `honore` ou `annule` | en-tête `x-pro-pin` |

Les erreurs sont toujours renvoyées en JSON, en français, sous la forme `{ "error": "…" }` :
400 (données invalides ou requête illisible), 401 (PIN), 403 (origine non autorisée), 404 (route ou rendez-vous introuvable), 409 (créneau complet), 413 (requête de plus de 10 Ko), 500 (erreur interne).

## Sécurité de l'API

- **CORS** : seule l'origine du frontend (`CORS_ORIGIN`) est autorisée. Un navigateur sur un autre site reçoit un refus 403. Les requêtes sans en-tête `Origin` (rendu serveur de Next.js, curl, tests) sont acceptées.
- **Taille des requêtes** : corps JSON limité à 10 Ko.
- **Espace pro** : PIN vérifié avant toute lecture de la requête.

## Variables d'environnement

| Variable | Programme | Fichier | Défaut |
|---|---|---|---|
| `PORT` | backend | `backend/.env` | `4000` |
| `PRO_PIN` | backend | `backend/.env` | `1234` |
| `CORS_ORIGIN` | backend | `backend/.env` | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | frontend | `application/.env.local` | `http://localhost:4000` |

## Règle de disponibilité

Un créneau de début `t` pour une prestation de durée `d` est libre si :
- il est dans les horaires du jour (`t + d ≤ fermeture`) ;
- il n'est pas passé (heure de Dakar) ;
- le nombre de rendez-vous actifs qui chevauchent `[t, t + d[` est inférieur au nombre de postes (2).

Le backend recalcule cette règle **dans la même opération d'écriture** que l'enregistrement : deux réservations simultanées ne peuvent pas dépasser la capacité. Le frontend n'est jamais cru sur parole.

## Choix assumés pour un MVP, et leur remplacement

| Choix actuel | Limite | Évolution proposée |
|---|---|---|
| Fichier JSON | un seul serveur, pas d'hébergement serverless | Supabase (PostgreSQL) |
| PIN partagé | pas de comptes, PIN transmis à chaque requête | Supabase Auth, rôles salon / cliente |
| Identification par téléphone | n'importe qui connaissant le numéro voit les RDV | code de vérification par SMS ou WhatsApp |
| Pas de notification | oublis de rendez-vous | rappel WhatsApp la veille |
| Web uniquement | pas d'application installable | application Expo réutilisant la même API |
