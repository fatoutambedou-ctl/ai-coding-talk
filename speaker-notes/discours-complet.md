# Discours complet — « De l'idée à l'application »

Talk de 20 minutes, 12 slides. Oratrice : Fatou Tambedou.
Les indications entre crochets sont des didascalies (à ne pas lire). Aminata est un personnage fictif qui sert de fil rouge.

> Ce fichier est généré depuis `presentation/source/talk-content.js`. Pour modifier le discours, éditez ce fichier source, puis relancez `node build-docs.js` et `node build-deck.js` : les notes du PowerPoint resteront identiques au texte ci-dessous.

---

## Slide 1 — De l'idée à l'application

**Temps prévu :** 0:30 (de 0:00 à 0:30)

**Contenu affiché :** Titre « <idée/> → application. », sous-titre, nom de l'oratrice, Club IA ESP.

**Visuel :** Couverture terminal : invite `$ ./from-idea --to-app`, titre néon, indicateurs « connected / online ».

### Discours

Bonjour à toutes et à tous. Je m'appelle Fatou Tambedou. Je suis ingénieure BI et IA chez GSIE Technology, et j'anime le Club IA de l'ESP.

Pendant les vingt prochaines minutes, je vais vous montrer comment une idée peut devenir une application qui fonctionne. Pas en théorie : en direct, sur cet écran.

**Message essentiel :** On va voir une idée devenir une application, pour de vrai.

**Transition :** « Mais avant ça, une petite question… »

---

## Slide 2 — Et si coder devenait accessible à tous ?

**Temps prévu :** 1:00 (de 0:30 à 1:30)

**Contenu affiché :** Fenêtre terminal `$ ideas --list` : trois idées d'app, toutes au statut « jamais lancée ».

**Visuel :** Terminal à gauche, question en grand à droite.

**Interaction avec le public :** Mains levées (2 questions, 15 secondes maximum).

### Discours

Levez la main si vous avez déjà eu une idée d'application. [Pause, laisser lever les mains.]

Gardez la main levée si cette application existe aujourd'hui. [Pause.]

Voilà. Presque toutes les mains sont retombées. Et ce n'est pas parce que les idées étaient mauvaises. Une application de réservation pour le salon du quartier, un outil pour suivre les cotisations d'une tontine, un catalogue pour la boutique qui vend sur WhatsApp : ce sont de vrais besoins. Ce qui manquait, c'était le passage de l'idée au code.

Prenons l'exemple d'Aminata. Aminata tient un salon de coiffure à Sacré-Cœur. Ses clientes réservent par WhatsApp, les rendez-vous se chevauchent, les annulations se perdent dans les messages. Elle sait exactement ce qu'il lui faut. Mais elle ne sait pas coder. Pendant longtemps, l'histoire s'arrêtait là.

**Message essentiel :** Les idées ne manquent pas ; c'est le passage au code qui bloquait.

**Transition :** « Ce qui a changé ces dernières années, c'est justement ce passage. »

---

## Slide 3 — La révolution du développement IA

**Temps prévu :** 2:30 (de 1:30 à 4:00)

**Contenu affiché :** Frise en trois vagues : autocomplétion (2021), assistants conversationnels (fin 2022), agents de code (2025).

**Visuel :** Trois cartes reliées par une ligne de temps, la troisième mise en avant en vert.

### Discours

Ce qui a changé, c'est la manière d'écrire du logiciel. Et ça s'est passé en trois vagues très rapides.

Première vague, vers 2021 : l'autocomplétion. Des outils comme GitHub Copilot proposent la fin de la ligne que vous êtes en train d'écrire. C'est utile, mais il faut déjà savoir coder : l'IA termine vos phrases, elle n'écrit pas le livre.

Deuxième vague, fin 2022 : les assistants conversationnels. ChatGPT, Claude. On décrit ce qu'on veut en français, l'IA répond avec du code. C'est déjà une révolution, mais il reste un problème : c'est vous qui copiez, qui collez, qui lancez. Et quand ça plante, c'est vous qui retournez demander pourquoi. Vous êtes devenu le facteur entre l'IA et votre ordinateur.

Troisième vague, depuis 2025 : les agents de code. Et là, tout change. L'agent travaille directement dans votre projet. Il lit vos fichiers, écrit le code, lance les commandes, lit les erreurs et corrige. Vous ne copiez plus rien. Vous décrivez, vous vérifiez, vous décidez.

Début 2025, le chercheur Andrej Karpathy a donné un nom à cette façon de travailler : le vibe coding. On décrit l'intention, on laisse l'IA écrire, on juge le résultat. Le terme est un peu provocateur, et on verra tout à l'heure ses limites. Mais il dit quelque chose de vrai : la compétence centrale se déplace. Elle passe de « savoir écrire la syntaxe » à « savoir expliquer clairement ce qu'on veut, et vérifier qu'on l'a obtenu ».

Et ça, ce n'est plus réservé aux développeurs. C'est la compétence d'un entrepreneur, d'une gérante de salon, d'un étudiant qui connaît bien son problème.

Retenez ceci : l'IA ne permet pas seulement de coder plus vite. Elle permet à plus de personnes de construire.

**Message essentiel :** L'IA ne permet pas seulement de coder plus vite : elle permet à plus de personnes de construire.

**Transition :** « Concrètement, avec quels outils ? »

---

## Slide 4 — Les outils qui changent la donne

**Temps prévu :** 2:00 (de 4:00 à 6:00)

**Contenu affiché :** Six cartes : Claude Code, Softr, Expo, Next.js, Supabase, GitHub, chacune avec son rôle en une ligne.

**Visuel :** Grille 3 × 2 de cartes avec icônes, bordures vertes et bleues alternées.

### Discours

En voici six, et chacun joue un rôle précis.

Claude Code, d'abord : c'est l'agent dont je viens de parler. Il s'utilise dans le terminal, dans un éditeur comme VS Code, ou dans l'application Claude pour ordinateur. C'est lui qu'on verra en démo.

Softr, c'est l'approche no-code : on part de ses données et on construit un CRM ou un portail client, avec des utilisateurs et des permissions. Associé à Claude Code, on peut y ajouter des fonctions sur mesure.

Expo, c'est pour le mobile. On écrit l'application une fois, en React Native, et elle tourne sur Android et sur iPhone. On la teste sur son propre téléphone, puis on prépare la publication sur les stores.

Next.js, c'est pour le web : les pages et le serveur dans le même projet. C'est ce qu'on utilise aujourd'hui.

Supabase, c'est une base de données hébergée, avec l'authentification incluse. C'est l'étape naturelle quand votre prototype doit accueillir de vrais utilisateurs.

Et GitHub, pour garder l'historique de votre code, le partager et collaborer. Tout ce que je vous montre aujourd'hui y est publié.

Le point important : vous n'avez pas besoin de maîtriser les six. Vous avez besoin de savoir lequel répond à votre problème. L'IA écrit le code, mais le choix de l'outil reste le vôtre.

**Message essentiel :** Pas besoin de tout maîtriser : il faut choisir l'outil adapté au problème.

**Transition :** « Regardons de plus près le cœur du système : l'agent. »

---

## Slide 5 — Comment fonctionne Claude Code ?

**Temps prévu :** 1:30 (de 6:00 à 7:30)

**Contenu affiché :** Boucle en cinq étapes : comprendre, planifier, écrire, exécuter, vérifier. Au centre : « Toi : l'intention + la validation ».

**Visuel :** Diagramme circulaire à droite, extrait de terminal illustratif à gauche.

### Discours

Un agent comme Claude Code fonctionne en boucle. C'est important de la comprendre, parce que c'est elle qui fait la différence avec un simple chatbot.

Un : il comprend. Il lit les fichiers de votre projet pour savoir ce qui existe déjà.
Deux : il planifie. Il découpe votre demande en étapes.
Trois : il écrit. Il crée ou modifie les fichiers.
Quatre : il exécute. Il lance des commandes, comme la vérification du code ou les tests.
Cinq : il vérifie. S'il y a une erreur, il la lit et repart dans la boucle. Il n'avance pas les yeux fermés.

Et au centre de la boucle, il y a vous. Par défaut, Claude Code vous demande la permission avant de modifier un fichier ou de lancer une commande. Vous gardez la main. Votre rôle, c'est l'intention au départ et la validation à la fin.

**Message essentiel :** L'agent boucle jusqu'à ce que ça marche ; vous restez au centre.

**Transition :** « De cette boucle, on peut tirer une méthode. »

---

## Slide 6 — De l'idée au produit : le workflow

**Temps prévu :** 1:30 (de 7:30 à 9:00)

**Contenu affiché :** Pipeline en cinq étapes : 01 Idée, 02 Spécifier, 03 Générer, 04 Tester, 05 Publier. L'étape 03 est marquée « IA ».

**Visuel :** Cinq blocs alignés reliés par des flèches ; seule l'étape Générer est en vert.

### Discours

Voici une méthode en cinq étapes, que vous pouvez appliquer dès demain.

Un : l'idée. Formulez le problème en une phrase. Pour Aminata : « mes clientes doivent pouvoir réserver sans m'écrire sur WhatsApp ».

Deux : spécifier. Avant de parler à l'IA, décrivez les écrans : ce que la cliente voit, ce qu'elle choisit, ce qu'elle reçoit. Plus votre description est précise, plus le résultat l'est.

Trois : générer. C'est le prompt. On va le voir en direct.

Quatre : tester. Sur un vrai téléphone, avec de vraies personnes. C'est l'étape qu'on oublie, et c'est celle qui révèle tout ce que l'IA n'avait pas deviné.

Cinq : publier. Sur GitHub, puis en ligne. Un projet qui reste sur votre ordinateur n'aide personne.

Remarquez une chose : sur ces cinq étapes, une seule demande vraiment l'IA. Les quatre autres, c'est votre jugement.

**Message essentiel :** Une étape sur cinq est faite par l'IA ; les quatre autres demandent votre jugement.

**Transition :** « Appliquons cette méthode à Aminata. »

---

## Slide 7 — SalonFlow AI

**Temps prévu :** 1:00 (de 9:00 à 10:00)

**Contenu affiché :** Capture de l'app sur téléphone + cinq fonctionnalités + pile technique (Next.js, Express, TypeScript, Tailwind, JSON).

**Visuel :** Téléphone à gauche avec une capture réelle de l'application, liste des fonctionnalités à droite.

### Discours

Voici SalonFlow AI.

La cliente voit le salon, ses prestations, les prix en francs CFA et la durée de chaque soin. Elle choisit une prestation, une date, un créneau libre, laisse son nom et son numéro : c'est réservé. Elle retrouve ses rendez-vous avec son numéro, et peut annuler.

Aminata a son espace professionnel : l'agenda du jour, le chiffre prévu, et elle marque chaque rendez-vous comme honoré ou annulé.

Côté technique, deux programmes : un frontend Next.js pour l'affichage, et un backend Express qui applique les règles et enregistre les réservations dans un fichier JSON. Une seule commande lance tout. C'est un MVP : le minimum qui prouve que l'idée fonctionne.

Assez parlé. On passe à l'écran.

**Message essentiel :** Un MVP : le minimum qui prouve que l'idée fonctionne.

**Transition :** Basculer sur le terminal (Alt/Cmd + Tab, préparé à l'avance).

---

## Slide 8 — Démo live

**Temps prévu :** 5:00 (de 10:00 à 15:00)

**Contenu affiché :** Slide d'appui : terminal plein écran avec le minutage de la démo et le plan B.

**Visuel :** Grande fenêtre terminal ; jalons 0:00 / 2:30 / 4:00.

**Interaction avec le public :** Le public choisit la couleur du design.

### Discours

[0:00 – 0:20] « Je suis dans un projet Next.js vide, créé avant le talk. Le serveur tourne déjà à gauche. J'ouvre Claude Code avec une seule commande : claude. »

[0:20 – 0:40] Coller le prompt de création (prompts/salonflow-creation.md). « Voici ma demande, en français : la page du salon d'Aminata, le catalogue, et la réservation. Remarquez que je lui donne aussi des contraintes : ne rien installer, où mettre les fichiers. »

[0:40 – 2:15] Pendant la génération, commenter ce qu'on voit : « Il lit d'abord le projet… il crée le fichier de données… il écrit la page… il me demande la permission, j'accepte… il vérifie que ça compile. » Si la génération dépasse 2:45, passer au plan B (voir workshop/demonstration-guide.md).

[2:15 – 2:30] Recharger le navigateur. Faire une réservation complète devant le public.

[2:30 – 2:45] Interaction : « Quelle couleur pour le salon d'Aminata : indigo, bordeaux ou vert ? » Prendre la première réponse claire.

[2:45 – 4:00] Coller le prompt d'amélioration avec la couleur choisie. Commenter : « Je ne lui dis pas comment coder, je lui dis ce que je veux voir. » Recharger, montrer le résultat.

[4:00 – 5:00] Basculer sur la version complète de SalonFlow AI (onglet déjà ouvert sur le port 3000) : réserver, ouvrir « Mes rendez-vous », puis l'espace pro avec l'agenda. Montrer le terminal 1 : le backend (port 4000) et le frontend (port 3000) tournent ensemble. « Ce que vous venez de voir en deux minutes, c'est le premier jet. Voici ce qu'il devient avec quelques heures d'itérations. »

**Message essentiel :** Une instruction en français devient une interface qui fonctionne.

**Transition :** « Regardons maintenant ce qui s'est passé derrière l'écran. »

---

## Slide 9 — Ce qui se passe derrière l'écran

**Temps prévu :** 2:00 (de 15:00 à 17:00)

**Contenu affiché :** Arborescence des fichiers à gauche (application/ et backend/) ; parcours d'une réservation à droite (navigateur → frontend Next.js → API Express → bookings.json) ; « 14/14 tests ».

**Visuel :** Arbre de fichiers en police mono + schéma d'architecture en blocs.

### Discours

Revenons sur ce qu'on vient de voir, parce qu'il ne faut pas confondre « ça marche » et « c'est magique ».

À gauche, les fichiers. Dans application, le frontend : les pages, l'accueil, la réservation, mes rendez-vous, l'espace pro, et des composants réutilisables. Dans backend, l'API : les routes, et la logique, c'est-à-dire le calcul des créneaux, la validation des numéros, le stockage.

Le frontend et le backend sont deux programmes séparés : l'un affiche les pages, l'autre applique les règles et garde les données, et ils communiquent par une API.

À droite, le chemin d'une réservation. Le navigateur affiche la page. Quand la cliente choisit une date, la page demande à l'API les créneaux libres. Quand elle confirme, l'API revérifie que le créneau est toujours libre avant d'écrire dans bookings.json.

Pourquoi revérifier ? Parce que deux clientes peuvent cliquer sur le même créneau à la même seconde. Le salon a deux postes : la troisième réservation sur le même créneau est refusée. Ce genre de détail, l'IA l'implémente très bien… à condition qu'on le lui demande, ou qu'on vérifie qu'elle l'a fait.

Justement, pour vérifier, le projet contient un test automatique : quatorze vérifications, de la création d'une réservation au refus d'un créneau complet. Elles passent toutes.

Voilà la vraie leçon : l'IA écrit le code, mais ce sont la structure et les tests qui vous permettent de lui faire confiance.

**Message essentiel :** Ce sont la structure et les tests qui permettent de faire confiance au code généré.

**Transition :** « Et maintenant, soyons honnêtes sur ce que l'IA ne fait pas. »

---

## Slide 10 — Les limites de l'IA

**Temps prévu :** 1:00 (de 17:00 à 18:00)

**Contenu affiché :** Encadré d'alerte rouge « WARNING — L'IA PEUT SE TROMPER » : sécurité, bugs plausibles, dette technique ; règle : ne publiez jamais un code que vous ne pouvez pas expliquer.

**Visuel :** Bloc d'avertissement rouge avec trois chiffres-clés du projet.

### Discours

L'IA a des limites, et les ignorer, c'est dangereux.

Première limite : la sécurité. L'espace pro de SalonFlow est protégé par un simple code PIN. Pour une démo, ça suffit. Pour un vrai salon, non : il faudrait une vraie authentification. L'IA ne vous le signalera pas forcément si vous ne posez pas la question.

Deuxième limite : les bugs plausibles. Le code généré a toujours l'air propre. Ça ne veut pas dire qu'il est juste.

Troisième : la dette technique. Générer vite, c'est aussi accumuler vite du code que personne ne comprend.

Et une règle qui résume tout : ne publiez jamais un code que vous ne pouvez pas expliquer.

**Message essentiel :** Ne publiez jamais un code que vous ne pouvez pas expliquer.

**Transition :** « Mais ces limites ne doivent pas cacher l'essentiel. »

---

## Slide 11 — Les opportunités

**Temps prévu :** 1:00 (de 18:00 à 19:00)

**Contenu affiché :** Quatre cartes : entrepreneurs, étudiants, commerces locaux, développeurs.

**Visuel :** Grille 2 × 2 avec icônes.

### Discours

Les opportunités sont immenses, et particulièrement ici.

Pour les entrepreneurs : tester une idée en quelques jours, avant d'investir des mois.

Pour les étudiants : construire un portfolio de vrais projets, qui résolvent de vrais problèmes.

Pour nos commerces, les salons, les boutiques, les tontines, les associations : des outils pensés pour eux, en francs CFA, adaptés à leurs habitudes, au lieu de logiciels conçus pour un autre marché.

Et pour les développeurs : moins de temps sur le code répétitif, plus de temps sur l'architecture et sur les utilisateurs.

Les personnes qui connaissent le mieux ces problèmes sont celles qui les vivent. Pour la première fois, elles peuvent construire les solutions elles-mêmes.

**Message essentiel :** Ceux qui vivent les problèmes peuvent désormais construire les solutions.

**Transition :** « Pour terminer… »

---

## Slide 12 — Le code n'est plus la barrière

**Temps prévu :** 1:00 (de 19:00 à 20:00)

**Contenu affiché :** « Le code n'est plus la barrière. La barrière, c'est de commencer. » + QR code vers le dépôt GitHub.

**Visuel :** Fond noir, phrase en grand avec halo vert, QR code à droite.

### Discours

On a commencé avec des mains levées pour des idées jamais réalisées. Aujourd'hui, vous avez vu une idée devenir une application en quelques minutes.

Tout ce que je vous ai montré est en ligne : les slides, le discours, les prompts exacts, le guide de la démo et le code complet de SalonFlow. Scannez ce QR code, clonez le projet, et refaites la démo chez vous.

Je vous laisse avec une phrase. Le code n'est plus la barrière. La barrière, c'est de commencer.

Alors, quelle sera votre première application ? Merci.

**Message essentiel :** Le code n'est plus la barrière. La barrière, c'est de commencer.

**Transition :** Applaudissements, puis questions si le format le prévoit.

