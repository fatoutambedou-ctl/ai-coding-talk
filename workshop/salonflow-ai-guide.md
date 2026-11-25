# Guide de SalonFlow AI

Ce guide décrit l'application complète, du point de vue de ses utilisatrices. Pour l'installation, voir `project-salonflow-ai/docs/installation.md`.

## Côté cliente

### Réserver
1. Ouvrez « Réserver » (ou cliquez sur « Réserver » à côté d'une prestation).
2. Choisissez la prestation : la durée et le prix s'affichent.
3. Choisissez une date parmi les 14 prochains jours. Les jours de fermeture (dimanche) sont barrés.
4. Choisissez un créneau. Les créneaux barrés sont complets ou déjà passés.
5. Indiquez votre nom et votre numéro de téléphone, puis « Confirmer la réservation ».
6. Une référence s'affiche. Gardez votre numéro : il sert à retrouver le rendez-vous.

### Retrouver ou annuler
1. Ouvrez « Mes rendez-vous » et saisissez votre numéro.
2. Vos rendez-vous s'affichent avec leur statut : confirmé, honoré ou annulé.
3. « Annuler » est proposé pour les rendez-vous confirmés et à venir.

## Côté salon (espace pro)

1. Ouvrez « Espace pro » et saisissez le code PIN (variable `PRO_PIN`, `1234` par défaut en démo).
2. L'agenda du jour s'affiche : nombre de rendez-vous actifs, chiffre d'affaires prévu, nombre de postes.
3. Naviguez d'un jour à l'autre avec ‹ et ›, ou revenez à « Aujourd'hui ».
4. Pour chaque rendez-vous confirmé : « Marquer honoré » quand la cliente est venue, « Annuler » sinon.

## Règles de fonctionnement

| Règle | Valeur (modifiable dans `data/seed.json`) |
|---|---|
| Horaires | lundi–vendredi 9 h–19 h, samedi 9 h–17 h, dimanche fermé |
| Postes de travail | 2 : deux clientes peuvent être servies en même temps |
| Pas des créneaux | 30 minutes |
| Fuseau horaire | Africa/Dakar |

Un créneau est complet quand deux rendez-vous actifs le chevauchent. Le serveur revérifie au moment de confirmer : si une autre cliente a réservé entre-temps, un message invite à choisir un autre créneau.

## Limites connues (MVP)

- Le PIN n'est pas une authentification : à remplacer par de vrais comptes (par exemple Supabase Auth) avant tout usage réel.
- Une cliente est identifiée par son numéro de téléphone, sans vérification par SMS.
- Pas de notifications (SMS, WhatsApp) ni de paiement en ligne.
- Le stockage dans un fichier JSON convient à un seul serveur ; il ne convient pas à un hébergement « serverless ».
