# SalonFlow AI — frontend

Interface Next.js de l'application. Elle lit et écrit toutes ses données via l'API du dossier [`../backend`](../backend), dont l'adresse est définie par `NEXT_PUBLIC_API_URL` (par défaut `http://localhost:4000`, voir `.env.example`).

Documentation : [../README.md](../README.md), [installation](../docs/installation.md), [architecture](../docs/architecture.md).

```bash
npm install
npm run dev     # http://localhost:3000 (le backend doit tourner sur le port 4000)
```

Pour lancer le frontend et le backend ensemble : `npm run dev` dans `project-salonflow-ai/`.
