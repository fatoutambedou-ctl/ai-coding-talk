# Installation de SalonFlow AI

## Prérequis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | 20.9 ou plus récent (LTS 22 recommandée) | `node -v` |
| npm | fourni avec Node.js | `npm -v` |
| Git | toute version récente | `git --version` |

Aucune base de données ni aucun compte externe n'est nécessaire.

SalonFlow AI est composé de **deux programmes** qui tournent en même temps :

| Programme | Dossier | Port |
|---|---|---|
| Backend (API Express) | `backend/` | 4000 |
| Frontend (interface Next.js) | `application/` | 3000 |

## Étapes

```bash
git clone https://github.com/fatoutambedou-ctl/ai-coding-talk.git
cd ai-coding-talk/project-salonflow-ai
npm run install:all      # installe la racine, backend/ et application/
npm run dev              # lance le backend et le frontend ensemble
```

L'application est disponible sur http://localhost:3000, l'API sur http://localhost:4000 (test : http://localhost:4000/api/health).
`Ctrl+C` arrête les deux.

Pour changer le PIN de l'espace pro, copiez `backend/.env.example` en `backend/.env` et modifiez `PRO_PIN`, puis relancez.
Sous Windows (PowerShell), utilisez `Copy-Item backend/.env.example backend/.env`.

### Lancer les deux programmes séparément

```bash
# Terminal 1
cd ai-coding-talk/project-salonflow-ai/backend
npm run dev              # http://localhost:4000

# Terminal 2
cd ai-coding-talk/project-salonflow-ai/application
npm run dev              # http://localhost:3000
```

Si le backend n'est pas lancé, l'interface affiche : « Le serveur de réservation ne répond pas. Lancez le backend (npm run dev dans backend/). »

## Commandes utiles

Dans `project-salonflow-ai/` :

| Commande | Effet |
|---|---|
| `npm run install:all` | installe toutes les dépendances |
| `npm run dev` | backend et frontend ensemble, avec rechargement automatique |
| `npm test` | lance les tests du backend (le backend doit tourner) |
| `npm run reset-data` | vide l'agenda |

Dans `backend/` :

| Commande | Effet |
|---|---|
| `npm run dev` | API en développement (tsx, rechargement automatique) |
| `npm run build` puis `npm start` | API compilée dans `dist/`, comme en production |
| `npm run typecheck` | vérification TypeScript |
| `npm test` | 14 tests de bout en bout (le backend doit tourner) |
| `npm run reset-data` | vide l'agenda (supprime `data/bookings.json`) |

Dans `application/` :

| Commande | Effet |
|---|---|
| `npm run dev` | interface en développement |
| `npm run build` puis `npm start` | version optimisée, comme en production |
| `npm run lint` | vérification TypeScript |

`npm test` crée de vraies réservations de test : lancez `npm run reset-data` ensuite.
Le test lit `backend/.env` : il utilise automatiquement le même PIN que le serveur.

## Configuration

| Variable | Fichier | Rôle | Valeur par défaut |
|---|---|---|---|
| `PORT` | `backend/.env` | port de l'API | `4000` |
| `PRO_PIN` | `backend/.env` | code d'accès de l'espace pro | `1234` |
| `CORS_ORIGIN` | `backend/.env` | origine du frontend autorisée à appeler l'API (plusieurs : séparées par des virgules) | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | `application/.env.local` | adresse de l'API utilisée par l'interface | `http://localhost:4000` |

Les fichiers `.env.example` donnent le modèle ; les vrais fichiers `.env` et `.env.local` ne sont jamais publiés.

Le salon (nom, adresse, horaires, postes, prestations) se modifie dans `backend/data/seed.json`. Redémarrez le backend après modification.

## Problèmes fréquents

| Symptôme | Solution |
|---|---|
| « Le serveur de réservation ne répond pas » | le backend n'est pas lancé : `npm run dev` dans `project-salonflow-ai/` ou dans `backend/` |
| `Port 3000 is in use` / `EADDRINUSE :4000` | arrêtez l'autre serveur, ou changez de port (`PORT` dans `backend/.env` ; `npx next dev -p 3001` pour le frontend, en mettant à jour `CORS_ORIGIN` et `NEXT_PUBLIC_API_URL`) |
| « Origine non autorisée » (403) | le frontend tourne sur une adresse absente de `CORS_ORIGIN` : ajoutez-la dans `backend/.env` |
| Aucun créneau proposé aujourd'hui | normal en fin de journée : les créneaux passés sont désactivés (heure de Dakar) |
| « Code PIN incorrect » | vérifiez `PRO_PIN` dans `backend/.env` et redémarrez le backend |
| Les réservations disparaissent | `backend/data/bookings.json` a été supprimé (`reset-data`), ou l'API est hébergée sur une plateforme sans disque persistant |
