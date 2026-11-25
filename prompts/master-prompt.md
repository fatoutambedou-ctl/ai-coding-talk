# Prompt maître du projet

Ce fichier résume le cahier des charges qui a servi à produire l'ensemble du dépôt (talk, application, documentation, publication).
Il est utile si vous voulez reproduire la démarche pour votre propre talk.

> Le brief original, plus long, est découpé ici par sections. Les exigences sont reprises fidèlement ; seule la mise en forme est condensée.

## Rôle

Tu es une équipe d'experts : direction artistique de présentations tech, storytelling de conférence, développement avec Claude Code, architecture web et mobile, IA et vibe coding, pédagogie.

## Mission

Préparer un talk de **20 minutes exactement** : « De l'idée à l'application — Coder avec l'IA : comment transformer une idée en application sans être un expert en code. »
Public : étudiants, débutants, entrepreneurs, curieux de l'IA.
Message : l'IA ne permet pas seulement de coder plus vite ; elle permet à davantage de personnes de transformer leurs idées en produits numériques.

## Références

- Vidéo : application mobile de réservation pour salon de coiffure avec Claude Code, Expo et un backend Node.js, jusqu'aux stores.
- Vidéo : CRM avec Claude Code et Softr (utilisateurs, permissions, automatisations, déploiement).
- Modèle Canva : fond noir, vert néon, blanc, esthétique terminal.
- Règle : ne jamais prétendre avoir visionné une vidéo dont on n'a que la description.

## Structure imposée (12 slides)

Couverture (0:30) · Accessible à tous ? (1:00) · Révolution IA (2:30) · Outils (2:00) · Fonctionnement de Claude Code (1:30) · Workflow (1:30) · SalonFlow AI (1:00) · Démo live (5:00) · Derrière l'écran (2:00) · Limites (1:00) · Opportunités (1:00) · Conclusion (1:00).

## Projet technique

SalonFlow AI : présentation du salon, catalogue, prix et durées, date, créneau, réservation, consultation, annulation, espace pro, agenda. MVP qui fonctionne en local sans configuration complexe. Ne jamais déclarer terminée une fonctionnalité non implémentée et non testée.

## Démo live (5 min)

Présenter, ouvrir Claude Code, envoyer le prompt, observer la génération, lancer, montrer, demander une amélioration visuelle. Prévoir prompts exacts, commandes, étapes et solution de secours.

## Livrables

PowerPoint modifiable, PDF, discours, notes, planning, application, prompts de création et d'amélioration, guide de démo, checklist, README, documentation d'installation.

## Publication GitHub

Dépôt `fatoutambedou-ctl/ai-coding-talk`. Vérifier Git, GitHub CLI et le compte connecté ; ne jamais demander de mot de passe ou de token dans le chat. Aucun secret publié, `.env.example` avec placeholders, `.gitignore` adapté. Commits clairs, pas de force push, pas de suppression sans accord. Vérifier le résultat après le push.

## Méthode

Phase 1 conception → validation → Phase 2 production et tests → Phase 3 publication et vérification.
