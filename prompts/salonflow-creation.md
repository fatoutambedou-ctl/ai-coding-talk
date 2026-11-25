# Prompt de création — démo live

Ce prompt est envoyé à Claude Code pendant la démo (slide 8, de 0:20 à 0:40).
Il part d'un projet Next.js vide créé avec `create-next-app` (voir `workshop/demonstration-guide.md`).

## Prompt à copier-coller

```text
Tu travailles dans un projet Next.js 16 déjà installé (App Router, TypeScript, Tailwind).
Lis d'abord AGENTS.md et next.config.ts : l'option cacheComponents est activée.

Crée la page d'accueil de « Salon Aminata », un salon de coiffure à Sacré-Cœur 3, Dakar.

Contraintes :
- N'installe aucune dépendance et ne lance pas npm install.
- Mets les données dans lib/salon-data.ts et l'interface dans components/SalonPage.tsx.
- app/page.tsx affiche SalonPage dans un <Suspense>, car la page utilise la date du jour.
- Pas de base de données : les réservations restent en mémoire (état React).
- Ne touche pas à app/layout.tsx.

La page contient :
1. Un en-tête avec le nom du salon, l'adresse, les horaires (9 h – 19 h, fermé le dimanche) et un bouton « Réserver ».
2. Le catalogue de 6 prestations avec prix en FCFA et durée : box braids 25 000 (4 h), nattes collées 8 000 (1 h 30),
   vanilles 15 000 (2 h 30), soin profond 7 000 (1 h), brushing 5 000 (45 min), coupe homme 3 000 (30 min).
3. Un module de réservation : prestation, date parmi les 7 prochains jours (dimanche désactivé),
   créneau toutes les 30 minutes qui se termine avant 19 h, puis nom et téléphone.
4. Un message de confirmation récapitulatif ; un créneau déjà réservé ce jour-là devient indisponible.

Style : sobre, mobile d'abord, couleur principale indigo, textes en français.
Quand tu as fini, vérifie qu'il n'y a pas d'erreur avec npx tsc --noEmit.
```

## Pourquoi ce prompt est écrit ainsi

- **Les contraintes passent avant les fonctionnalités.** « N'installe rien » évite une installation de plusieurs minutes sur scène.
- **Les fichiers sont nommés.** Le résultat est prévisible, et il correspond à la version de secours (`workshop/demo-backup/`).
- **Le piège de Next.js 16 est signalé.** Avec `cacheComponents`, une page qui lit la date du jour sans `<Suspense>` fait échouer le build. Nous l'avons constaté en testant la version de secours.
- **Les données sont données.** Prix et durées précis : l'IA n'invente rien et la démo est reproductible.
- **Il finit par une vérification.** L'agent contrôle lui-même son travail, c'est la boucle de la slide 5.

## Résultat attendu

Le résultat de référence, testé (build, lint, réservation dans le navigateur), est dans `workshop/demo-backup/`.
La génération de l'IA varie d'une fois à l'autre : la mise en page exacte sera différente, les fonctionnalités doivent être les mêmes.

## Prompt de l'application complète (pour aller plus loin)

L'application complète `project-salonflow-ai/` va plus loin que la démo : un frontend et un backend séparés, stockage persistant, 2 postes, annulation, espace pro.
Pour la reconstruire avec Claude Code dans un nouveau dossier, vous pouvez partir de ce prompt, puis itérer :

```text
Construis SalonFlow AI, une application de réservation pour le « Salon Aminata » à Dakar,
composée de deux programmes séparés qui communiquent par une API HTTP en JSON.

Architecture :
- backend/ : Node.js + Express + TypeScript (tsx en développement), port 4000. Il contient toutes les règles métier et les données.
- application/ : frontend Next.js (App Router, TypeScript, Tailwind), port 3000. Aucune règle métier ni donnée :
  tous les appels passent par un seul fichier lib/api.ts, avec l'adresse de l'API dans NEXT_PUBLIC_API_URL.
- Un package.json racine dont le script « dev » lance les deux avec concurrently, et un script « install:all ».

Données (backend) : catalogue et horaires dans data/seed.json ; réservations persistées dans data/bookings.json (pas de base externe).
Le salon a 2 postes : un créneau est complet quand 2 rendez-vous actifs s'y chevauchent. Créneaux de 30 min. Fuseau horaire : Africa/Dakar.

API (backend) : GET /api/health, GET /api/salon, GET /api/slots, GET et POST /api/bookings, DELETE /api/bookings/:id,
GET /api/pro/agenda, PATCH /api/pro/bookings/:id (PIN dans l'en-tête x-pro-pin, variable PRO_PIN).
Le backend revérifie la disponibilité au moment de réserver et refuse un créneau complet avec un code 409.
Écritures du fichier sérialisées pour éviter les pertes. Validation du nom et du téléphone côté serveur.
CORS limité à l'origine du frontend (CORS_ORIGIN), taille des requêtes limitée, erreurs JSON en français.

Pages (frontend) :
- / : présentation du salon, catalogue par catégorie (prix FCFA, durée), horaires.
- /reserver : prestation → date (14 prochains jours, jours fermés désactivés) → créneau → nom et téléphone → confirmation avec référence.
- /mes-rdv : la cliente saisit son numéro, voit ses rendez-vous et annule ceux à venir.
- /pro : code PIN, agenda d'un jour, nombre de RDV et chiffre prévu, actions « honoré » et « annuler ».
Si le backend ne répond pas, le frontend affiche un message clair qui dit de le lancer.

Ajoute un script de test de bout en bout dans backend/scripts/smoke-test.mjs et des fichiers .env.example sans vraie valeur.
```

> Transparence : l'application complète de ce dépôt a été écrite avec Claude dans une conversation, puis séparée en frontend et backend avec Claude Code, et testée (build et 14 tests de bout en bout). Le prompt ci-dessus en décrit fidèlement le cahier des charges ; il n'a pas été rejoué tel quel dans Claude Code.
