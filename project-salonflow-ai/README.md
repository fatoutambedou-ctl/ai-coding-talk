# SalonFlow AI

Application de réservation pour salon de coiffure, construite comme démonstration du talk « De l'idée à l'application ».
Le salon fictif est le **Salon Aminata**, à Sacré-Cœur, Dakar.

## Fonctionnalités

| Fonctionnalité | Page | État |
|---|---|---|
| Présentation du salon, horaires | `/` | ✅ testée |
| Catalogue, prix en FCFA, durées | `/` | ✅ testée |
| Choix de la date et du créneau | `/reserver` | ✅ testée |
| Réservation avec revérification serveur | `/reserver` | ✅ testée |
| Consultation des rendez-vous par téléphone | `/mes-rdv` | ✅ testée |
| Annulation par la cliente | `/mes-rdv` | ✅ testée |
| Espace professionnel (PIN de démo) | `/pro` | ✅ testée |
| Agenda du jour, statut honoré / annulé | `/pro` | ✅ testée |
| Notifications SMS / WhatsApp | — | ❌ non implémentée |
| Application mobile Expo | — | ❌ non implémentée (piste d'évolution) |

« Testée » signifie : couverte par `npm test` dans `backend/` (14 vérifications d'API) et vérifiée dans un navigateur, sur ordinateur et en vue mobile.

## Démarrage rapide

```bash
npm run install:all
npm run dev
```

Ouvrez http://localhost:3000 (interface). L'API tourne sur http://localhost:4000. Espace pro : PIN `1234` par défaut (voir `backend/.env.example`).

Installation détaillée : [docs/installation.md](docs/installation.md) · Architecture : [docs/architecture.md](docs/architecture.md)

## Pile technique

| Partie | Dossier | Technologies | Port |
|---|---|---|---|
| Frontend | `application/` | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 | 3000 |
| Backend | `backend/` | Node.js, Express 5, TypeScript (tsx en développement) | 4000 |
| Données | `backend/data/` | fichier JSON local | — |

Le frontend et le backend sont deux programmes séparés qui communiquent par une API HTTP en JSON. `npm run dev` lance les deux en même temps.
