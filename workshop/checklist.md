# Checklist technique

## J-7

- [ ] Répéter le talk complet à voix haute avec chronomètre (objectif : 19:30 à 20:00).
- [ ] Vérifier que Claude Code est installé et connecté sur l'ordinateur de présentation.
- [ ] Vérifier Node.js 20.9+ (`node -v`) et Git.
- [ ] Cloner ce dépôt et lancer SalonFlow AI dans `project-salonflow-ai` : `npm run install:all`, `npm run dev` (frontend 3000, backend 4000), puis `npm test` dans un second terminal → 14 OK.
- [ ] Préparer `salon-demo` et la branche `demo-backup` (guide, section 2).
- [ ] Demander à l'organisation : format d'écran (16:9 ?), connectique (HDMI/USB-C), Wi-Fi ou partage de connexion.

## J-1

- [ ] Deux répétitions complètes de la démo ; noter la durée de génération.
- [ ] Enregistrer la vidéo de secours.
- [ ] Copier le PDF des slides sur une clé USB (au cas où l'ordinateur change).
- [ ] Vérifier que le QR code de la slide 12 mène au dépôt GitHub **après publication**.
- [ ] Charger l'ordinateur et prévoir le chargeur.

## H-15 min

- [ ] Brancher l'ordinateur, tester l'affichage en mode présentateur.
- [ ] Terminal : police 18 pt minimum, thème sombre lisible depuis le fond de la salle.
- [ ] Lancer les trois terminaux (guide, section 3) : le terminal 1 lance `npm run dev` dans `project-salonflow-ai` (frontend 3000, backend 4000).
- [ ] `npm run reset-data` dans `project-salonflow-ai` pour un agenda vide.
- [ ] http://localhost:4000/api/health répond `{"status":"ok"}`.
- [ ] `git status` propre dans `salon-demo`, branche `main`.
- [ ] Onglets ouverts : localhost:3001 (démo) et localhost:3000 (SalonFlow).
- [ ] Prompts ouverts, prêts à copier.
- [ ] Notifications désactivées, autres applications fermées.
- [ ] Partage de connexion du téléphone prêt en cas de coupure du Wi-Fi.

## Sécurité (avant chaque publication sur GitHub)

- [ ] Aucun fichier `.env` ou `.env.local` suivi par git (`git ls-files | grep -i env` ne montre que `.env.example`).
- [ ] Aucun dossier `node_modules/`, `.next/` ni `dist/` suivi.
- [ ] `backend/data/bookings.json` non suivi (il contient des noms et numéros de téléphone).
- [ ] Recherche de secrets sans résultat : `git grep -nE "sk-|ghp_|github_pat_|AKIA|PRIVATE KEY"`.
- [ ] Aucune donnée personnelle réelle dans les captures ou les exemples.
