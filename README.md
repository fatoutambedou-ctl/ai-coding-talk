# De l'idée à l'application

### Coder avec l'IA : comment transformer une idée en application sans être expert en code

Talk de 20 minutes par **Fatou Tambedou** (BI & AI Engineer, Club IA de l'ESP Dakar), avec une démonstration live de Claude Code et une application complète : **SalonFlow AI**.

> L'IA ne permet pas seulement de coder plus vite. Elle permet à davantage de personnes de transformer leurs idées en produits numériques.

## Ce que contient ce dépôt

| Ressource | Fichier |
|---|---|
| Slides (PowerPoint modifiable, 12 slides, notes incluses) | [presentation/talk-ia-development.pptx](presentation/talk-ia-development.pptx) |
| Slides (PDF) | [presentation/talk-ia-development.pdf](presentation/talk-ia-development.pdf) |
| Discours complet, slide par slide | [speaker-notes/discours-complet.md](speaker-notes/discours-complet.md) |
| Planning chronométré | [speaker-notes/timing.md](speaker-notes/timing.md) |
| Guide de la démonstration | [workshop/demonstration-guide.md](workshop/demonstration-guide.md) |
| Checklist technique | [workshop/checklist.md](workshop/checklist.md) |
| Guide d'utilisation de SalonFlow AI | [workshop/salonflow-ai-guide.md](workshop/salonflow-ai-guide.md) |
| Prompt de création (démo) | [prompts/salonflow-creation.md](prompts/salonflow-creation.md) |
| Prompt d'amélioration visuelle | [prompts/design-improvement.md](prompts/design-improvement.md) |
| Prompt maître du projet | [prompts/master-prompt.md](prompts/master-prompt.md) |
| Prompt de publication GitHub (Claude Code) | [prompts/github-publication.md](prompts/github-publication.md) |
| Application SalonFlow AI | [project-salonflow-ai/](project-salonflow-ai/) |

## Objectifs pédagogiques

À la fin du talk, le public sait :
1. distinguer autocomplétion, assistant conversationnel et agent de code ;
2. expliquer la boucle d'un agent : comprendre, planifier, écrire, exécuter, vérifier ;
3. appliquer une méthode en cinq étapes : idée, spécification, génération, test, publication ;
4. écrire un prompt utile : contraintes, fichiers nommés, données précises, vérification finale ;
5. reconnaître les limites : sécurité, bugs plausibles, dette technique.

## Structure du dépôt

```
ai-coding-talk/
├── README.md
├── LICENSE
├── presentation/
│   ├── talk-ia-development.pptx
│   ├── talk-ia-development.pdf
│   ├── assets/qr-github-repo.png
│   └── source/               scripts qui génèrent slides et notes depuis un seul fichier de contenu
├── speaker-notes/            discours complet, planning
├── workshop/                 guide de démo, checklist, guide SalonFlow, version de secours de la démo
├── prompts/                  prompts de création, d'amélioration, maître, publication
└── project-salonflow-ai/
    ├── README.md
    ├── package.json          npm run install:all, npm run dev (lance les deux programmes)
    ├── application/          frontend Next.js (interface, port 3000)
    ├── backend/              API Express + TypeScript (règles métier, données JSON, port 4000)
    └── docs/                 installation, architecture
```

## Technologies

| Usage | Outil |
|---|---|
| Agent de code | Claude Code |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend (API) | Node.js, Express 5, TypeScript (tsx en développement) |
| Données (MVP) | fichier JSON local, géré par le backend |
| Slides | PptxGenJS (généré), PowerPoint (édition) |
| Versionnement | Git, GitHub |

Présentés dans le talk comme pistes d'évolution : Expo (mobile), Supabase (base de données et authentification), Softr (no-code).

## Lancer SalonFlow AI

Prérequis : Node.js 20.9+ et Git.

```bash
git clone https://github.com/fatoutambedou-ctl/ai-coding-talk.git
cd ai-coding-talk/project-salonflow-ai
npm run install:all
npm run dev
```

`npm run dev` lance les deux programmes : le frontend sur http://localhost:3000 (ouvrez-le dans le navigateur) et l'API Express sur http://localhost:4000.
Espace pro : PIN `1234` (modifiable via `backend/.env`, voir `backend/.env.example`).
Vérification : dans un second terminal, `npm test` (dans `project-salonflow-ai/`) doit afficher 14 « OK ».

Détails : [installation](project-salonflow-ai/docs/installation.md) · [architecture](project-salonflow-ai/docs/architecture.md).

## Reproduire la démonstration

1. Installez Claude Code : https://code.claude.com/docs
2. Créez un projet vide : `npx create-next-app@16 salon-demo --ts --tailwind --eslint --app --use-npm --yes`
3. Remplacez son `app/layout.tsx` par `workshop/demo-backup/app/layout.tsx` (fonctionne sans Internet).
4. Dans `salon-demo`, lancez `npx next dev -p 3001`, puis `claude` dans un autre terminal.
5. Collez le prompt de [prompts/salonflow-creation.md](prompts/salonflow-creation.md), puis celui de [prompts/design-improvement.md](prompts/design-improvement.md).

Le résultat de référence, testé, est dans [workshop/demo-backup/](workshop/demo-backup/). Le déroulé complet et les plans de secours sont dans le [guide de démonstration](workshop/demonstration-guide.md).

## Comment utiliser ce projet après la conférence ?

**Récupérer tout le dépôt**

```bash
git clone https://github.com/fatoutambedou-ctl/ai-coding-talk.git
```

Sans Git : bouton vert **Code** sur GitHub, puis **Download ZIP**.

**Quelques idées pour continuer**

- Refaites la démo chez vous avec les prompts, puis changez de sujet : boutique, tontine, association.
- Faites évoluer SalonFlow : rappel WhatsApp la veille, comptes avec Supabase, version mobile avec Expo. Les pistes sont dans [l'architecture](project-salonflow-ai/docs/architecture.md#choix-assumés-pour-un-mvp-et-leur-remplacement).
- Réutilisez les slides : modifiez `presentation/source/talk-content.js`, puis `node build-deck.js` et `node build-docs.js` (dépendances : `pptxgenjs`, `react`, `react-dom`, `react-icons`, `sharp`).

## Références

- Vidéo — Créer une application mobile avec Claude Code (réservation de salon de coiffure, Expo, backend, publication) : https://www.youtube.com/watch?v=R0E2st60Hg4
- Vidéo — Claude Code + Softr (création et déploiement d'un CRM) : https://www.youtube.com/watch?v=8GCqVb4c_yQ
- Direction artistique inspirée d'un modèle Canva : https://www.canva.com/templates/EAHK8pROkCA/
- Documentation Claude Code : https://code.claude.com/docs

Le talk s'appuie sur la description de ces vidéos ; leur contenu n'est pas reproduit ici.

## Licence

Code et documentation sous licence MIT : voir [LICENSE](LICENSE). Le Salon Aminata et les personnes citées dans les exemples sont fictifs.
