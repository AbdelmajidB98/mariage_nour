# NOUR × HASSENE — invitation digitale

Une invitation de mariage mobile-first, éditoriale et interactive pour le 6 septembre 2026 au Pavillon des Baies de Gammarth.

## Démarrage

```bash
pnpm install
pnpm dev
```

Build et tests :

```bash
pnpm build
pnpm test
```

## Contenu et configuration

Toutes les informations du mariage vivent dans `src/config/wedding.config.ts` :

- noms, monogramme et date ;
- lieu, téléphone et liens ;
- texte d’invitation ;
- programme ;
- FAQ ;
- champs et questions RSVP ;
- timing et assets.

Pour modifier un nom, la date, l’heure, le lieu, le programme ou une question, intervenir uniquement dans ce fichier. Le countdown utilise `wedding.targetIso`; vérifier sa valeur UTC lorsque la date ou le fuseau change.

## Photos

Les originaux restent dans `references/`. Les dérivés WebP de production sont dans `public/media/` :

- `couple-720.webp` pour mobile ;
- `couple-1200.webp` pour desktop ;
- `venue-1200.webp` pour le lieu.

Après remplacement d’une photo, recréer les dérivés aux mêmes noms et dimensions. Le Hero utilise aussi un preload déclaré dans `index.html`.

## RSVP

Le formulaire est piloté par `weddingConfig.rsvp`. Les champs peuvent être activés ou désactivés avec `fields`. Le renderer générique des questions personnalisées accepte `text`, `textarea`, `select`, `radio`, `checkbox`, `number`, `email` et `phone` sans réécrire le composant RSVP.

Sans backend configuré, les réponses sont enregistrées localement dans le navigateur, séparées par token d’invitation. Les routes privées prennent la forme `/invite/{token}`. Une réponse existante peut être modifiée.

### Passage à Supabase

Le frontend ne doit jamais recevoir `SUPABASE_SERVICE_ROLE_KEY`. Utiliser seulement l’URL et la clé anonyme, puis créer un endpoint ou une fonction sécurisée avec validation serveur.

Schéma recommandé :

- `guests` ;
- `invitations` ;
- `rsvp_responses` ;
- `rsvp_guests` ;
- `rsvp_answers` ;
- `wedding_settings`.

Activer Row Level Security, valider le token d’invitation côté serveur, limiter les écritures au RSVP correspondant et protéger le double-submit avec une contrainte/idempotency key. Remplacer `saveResponse` et `readResponse` dans `src/lib/rsvp-storage.ts` par un adapter réseau en conservant la même interface. En cas d’erreur, le formulaire garde toujours les valeurs saisies.

## Calendrier

`src/lib/calendar.ts` génère :

- un lien Google Calendar ;
- un fichier `.ics` téléchargeable.

Les heures de début et de fin viennent de la configuration et restent modifiables.

## Direction artistique et motion

Les tokens principaux se trouvent au début de `src/styles/global.css`. La typographie utilise Cormorant Garamond et DM Sans en fichiers locaux. Les révélations utilisent GSAP/ScrollTrigger et respectent `prefers-reduced-motion`. Aucun son n’est lancé automatiquement ; aucun asset audio n’a été fourni.

## Déploiement et confidentialité

Le build statique `dist/` peut être déployé sur Netlify, Vercel ou tout hébergement statique avec fallback vers `index.html` pour `/invite/{token}`. Ajouter la règle de rewrite correspondante chez l’hébergeur.

Le site contient `noindex,nofollow`. Ne jamais publier ou exposer les réponses RSVP dans le bundle, les logs ou une table accessible publiquement.
