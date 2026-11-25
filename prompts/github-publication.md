# Prompt de publication — Phase 3 (à donner à Claude Code)

Ce prompt sert à publier ce dossier sur GitHub depuis **votre ordinateur**, avec **votre** authentification.
Ouvrez un terminal dans le dossier `ai-coding-talk/` décompressé, lancez `claude`, puis collez :

```text
Tu publies ce dossier sur GitHub. Travaille étape par étape et demande-moi avant toute action qui crée ou pousse quelque chose.

1. Vérifications : git --version, gh --version, gh auth status.
   Le compte connecté doit être fatoutambedou-ctl. Si je ne suis pas connecté, lance « gh auth login » (connexion par navigateur)
   et laisse-moi la terminer. Ne me demande jamais de mot de passe ni de token dans le chat.
2. Vérifie si le dépôt fatoutambedou-ctl/ai-coding-talk existe (gh repo view).
   - S'il existe : clone-le dans un dossier temporaire, liste son contenu, et montre-moi ce qui serait ajouté ou remplacé avant de continuer.
     Ne supprime aucun fichier existant sans mon accord.
   - S'il n'existe pas : demande-moi l'autorisation, puis crée-le en public avec la description
     « Talk de 20 min : De l'idée à l'application — coder avec l'IA (slides, discours, démo, SalonFlow AI) ».
3. Sécurité avant tout commit :
   - aucun fichier .env réel (seuls les .env.example sont autorisés) ;
   - aucun node_modules/, .next/, data/bookings.json ;
   - recherche de secrets : clés API (sk-, ghp_, github_pat_, AKIA), clés privées (BEGIN … PRIVATE KEY), mots de passe.
   Montre-moi le résultat de la recherche.
4. Si le dossier n'est pas encore un dépôt git : git init -b main, puis ajoute le remote.
5. Crée ces commits, dans cet ordre, en n'ajoutant que les fichiers concernés :
   - docs: add talk documentation      → README.md, LICENSE, .gitignore, speaker-notes/, workshop/*.md
   - feat: create SalonFlow AI          → project-salonflow-ai/, workshop/demo-backup/
   - design: add presentation slides    → presentation/
   - docs: add workshop prompts         → prompts/
   Montre-moi git status avant chaque commit.
6. Pousse sur main sans jamais utiliser --force. En cas de refus (historique divergent), arrête-toi et explique-moi.
7. Vérification finale : gh repo view --web n'est pas nécessaire ; liste plutôt les fichiers distants
   (gh api repos/fatoutambedou-ctl/ai-coding-talk/contents) et donne-moi :
   l'URL du dépôt, la liste des fichiers publiés, le dernier commit, la commande de clonage,
   et ce qui reste éventuellement à configurer.
```

## Pourquoi passer par Claude Code pour cette étape

La publication demande d'agir avec votre compte GitHub. Depuis votre ordinateur, `gh auth login` ouvre une connexion par navigateur : aucun secret ne transite par une conversation, et vous validez chaque action.
