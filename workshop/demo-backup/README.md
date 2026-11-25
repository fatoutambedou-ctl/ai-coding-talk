# Version de secours de la démo

Résultat de référence du prompt `prompts/salonflow-creation.md`, à placer dans un projet `create-next-app@16`.
Testé : `npx tsc --noEmit`, `npm run build`, `eslint` et réservation complète dans le navigateur, sans erreur console.

| Fichier | Rôle |
|---|---|
| `app/layout.tsx` | layout sans Google Fonts : la démo démarre même sans Internet |
| `app/page.tsx` | affiche `SalonPage` dans un `<Suspense>` (requis par `cacheComponents` de Next.js 16) |
| `components/SalonPage.tsx` | page du salon, catalogue et réservation en mémoire |
| `lib/salon-data.ts` | données du salon, formats de prix et de durée, calcul des dates et des créneaux |

Installation dans le projet de démo : voir `workshop/demonstration-guide.md`, section 2.3.
