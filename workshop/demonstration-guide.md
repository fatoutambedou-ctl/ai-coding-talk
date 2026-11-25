# Guide de la démonstration live (5 minutes)

Objectif : montrer en direct qu'une instruction en français devient une interface qui fonctionne, puis qu'on l'améliore par une deuxième instruction.

La démo utilise **deux projets** :

| Projet | Rôle | Port |
|---|---|---|
| `salon-demo` | projet vide dans lequel Claude Code génère la page en direct | 3001 |
| `project-salonflow-ai` | application complète, montrée à la fin : frontend Next.js + backend Express | 3000 (frontend), 4000 (backend) |

## 1. Prérequis sur l'ordinateur de présentation

- Node.js 20.9 ou plus récent (LTS 22 recommandée) : `node -v`.
- Git : `git --version`.
- Claude Code installé et connecté à votre compte. Installation (macOS, Linux, WSL) : `curl -fsSL https://claude.ai/install.sh | bash` ; Windows PowerShell : `irm https://claude.ai/install.ps1 | iex`. Documentation officielle : https://code.claude.com/docs
- Un navigateur avec deux onglets prêts, un terminal à grande police (18 pt minimum).

## 2. Préparation (la veille)

### 2.1 Créer le projet de démo

```bash
npx create-next-app@16 salon-demo --ts --tailwind --eslint --app --use-npm --yes
cd salon-demo
```

### 2.2 Rendre la démo indépendante du Wi-Fi

Le projet généré télécharge ses polices sur Google Fonts : sans Internet, il peut refuser de démarrer.
Remplacez `app/layout.tsx` par la version hors ligne fournie :

```bash
cp ../ai-coding-talk/workshop/demo-backup/app/layout.tsx app/layout.tsx
git add -A && git commit -m "starter: layout hors ligne"
```

(Adaptez le chemin `../ai-coding-talk` à l'endroit où vous avez cloné ce dépôt.)

### 2.3 Préparer la branche de secours

```bash
git checkout -b demo-backup
mkdir -p lib components
cp ../ai-coding-talk/workshop/demo-backup/lib/salon-data.ts lib/
cp ../ai-coding-talk/workshop/demo-backup/components/SalonPage.tsx components/
cp ../ai-coding-talk/workshop/demo-backup/app/page.tsx app/
npm run build          # doit réussir
git add -A && git commit -m "demo: version de secours"
git checkout main      # revenir au projet vide
```

### 2.4 Répéter la démo deux fois en entier

Chronométrez. Si la génération dépasse 2 min 15 sur votre connexion, prévoyez d'utiliser le plan B plus tôt.
Après chaque répétition : `git checkout -- . && git clean -fd` pour revenir au projet vide (attention, cela efface les fichiers générés).

### 2.5 Enregistrer une vidéo de la démo réussie

Avec l'outil de capture de votre système. C'est le plan C si l'ordinateur ou le réseau lâche.

## 3. Le jour J, 15 minutes avant

```bash
# Terminal 1 — application complète (frontend + backend)
cd ai-coding-talk/project-salonflow-ai
npm run reset-data
npm run dev                       # frontend http://localhost:3000, backend http://localhost:4000

# Terminal 2 — projet de démo
cd salon-demo
git status                        # doit être propre, sur la branche main
npx next dev -p 3001              # http://localhost:3001

# Terminal 3 — Claude Code, police agrandie
cd salon-demo
```

Ouvrez `http://localhost:3001` (page par défaut de Next.js) et `http://localhost:3000` (SalonFlow) dans deux onglets.
Ouvrez `prompts/salonflow-creation.md` et `prompts/design-improvement.md` pour copier les prompts.
Coupez les notifications.

## 4. Déroulé minute par minute

| Chrono | Action | Ce que vous dites |
|---:|---|---|
| 0:00 | Montrer l'onglet 3001 : page Next.js par défaut | « Un projet vide, rien d'autre. » |
| 0:10 | Terminal 3 : taper `claude` | « Une seule commande pour ouvrir l'agent. » |
| 0:20 | Coller le prompt de création, Entrée | « Je décris ce que je veux, en français, avec mes contraintes. » |
| 0:40 – 2:15 | Accepter les demandes de permission, commenter | « Il lit le projet… il crée le fichier de données… il vérifie que ça compile. » |
| 2:15 | Recharger l'onglet 3001, faire une réservation | « Prestation, date, créneau, nom… confirmé. » |
| 2:30 | Question au public | « Quelle couleur pour le salon d'Aminata : indigo, bordeaux ou vert ? » |
| 2:45 | Coller le prompt d'amélioration avec la couleur | « Je ne dis pas comment coder, je dis ce que je veux voir. » |
| 3:45 | Recharger, montrer le résultat | « Deuxième version, une minute plus tard. » |
| 4:00 | Onglet 3000 : réserver, « Mes rendez-vous », « Espace pro » (PIN) ; terminal 1 : les deux programmes, backend (4000) et frontend (3000) | « Voici ce que devient ce premier jet avec quelques heures d'itérations. » |
| 5:00 | Retour aux slides (slide 9) | « Regardons ce qui s'est passé derrière l'écran. » |

## 5. Plans de secours

| Problème | Réaction (moins de 10 secondes) |
|---|---|
| La génération dépasse 2:45 | Interrompre Claude Code (Échap), puis `git stash -u && git checkout demo-backup` dans le terminal 2, recharger. Dire : « Voici le résultat qu'on obtient habituellement. » |
| Erreur de compilation persistante | Même manœuvre. Mentionner que c'est exactement la limite de la slide 10. |
| Pas d'Internet du tout | Claude Code ne peut pas fonctionner : lancer la vidéo (plan C), puis montrer en direct l'application complète, qui fonctionne hors ligne. |
| Le port 3000 ou 3001 est occupé | Lancer sur un autre port (`npx next dev -p 3002`) et changer l'URL de l'onglet. |
| L'espace pro refuse le PIN | Le PIN est la valeur de `PRO_PIN` dans `project-salonflow-ai/backend/.env`, ou `1234` si le fichier n'existe pas. |
| « Le serveur de réservation ne répond pas » sur l'onglet 3000 | Le backend est arrêté : relancer `npm run dev` dans `project-salonflow-ai` (terminal 1), puis recharger. |

Après le talk, pour revenir au projet vide : `git checkout main && git stash drop`.

## 6. Ce qu'il ne faut pas faire sur scène

- Lancer `npm install` ou créer le projet en direct : plusieurs minutes d'attente.
- Taper le prompt au clavier : toujours copier-coller.
- Montrer un fichier `.env` ou `.env.local` à l'écran.
