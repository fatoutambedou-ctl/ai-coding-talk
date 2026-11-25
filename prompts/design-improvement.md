# Prompt d'amélioration visuelle — démo live

Envoyé à Claude Code à 2:45 dans la démo, juste après que le public a choisi la couleur.
Remplacez `[COULEUR]` par la réponse du public avant d'appuyer sur Entrée.

## Prompt à copier-coller

```text
Améliore le design de la page sans changer son fonctionnement :
- Couleur principale : [COULEUR] (remplace l'indigo partout, garde un bon contraste).
- En-tête plus marquant : un motif géométrique discret inspiré du tissu wax en arrière-plan.
- Catalogue sur deux colonnes à partir de la taille tablette, une colonne sur mobile.
- Le créneau et la date sélectionnés doivent se voir immédiatement.
- Focus clavier visible sur tous les boutons.
Ne modifie que components/SalonPage.tsx et app/globals.css.
Vérifie ensuite qu'il n'y a pas d'erreur avec npx tsc --noEmit.
```

## Couleurs proposées au public

Proposez trois choix pour obtenir une réponse rapide :

| Choix | Ce qu'il faut taper à la place de `[COULEUR]` |
|---|---|
| Indigo | `indigo profond (#33308C)` |
| Bordeaux | `bordeaux (#7A1F3D)` |
| Vert | `vert émeraude (#0F6E56)` |

## Ce que le public doit retenir

On ne dit pas à l'IA **comment** coder (« ajoute une classe bg-… »). On lui dit **ce qu'on veut voir** et **ce qu'elle ne doit pas casser**. C'est le cœur du message du talk.

## Si l'amélioration ne s'affiche pas

1. Rechargez la page (Cmd/Ctrl + Maj + R).
2. Regardez le terminal du serveur : une erreur de compilation s'affiche en rouge.
3. Si l'erreur ne se corrige pas en 20 secondes, dites « l'IA se trompe aussi, c'est la slide 10 » et passez à la version complète. C'est un bon moment pédagogique, pas un échec.
