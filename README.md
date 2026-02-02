# Roomo

App Next.js (TypeScript) pour gérer les achats en colocation : qui achète quoi, rotation équitable, gestion du stock. Auth Google, persistance Vercel KV, prête pour Vercel.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (mobile-first)
- NextAuth v5 (Google)
- Vercel KV (Redis)

## Développement

1. Copier `.env.example` vers `.env.local`
2. Renseigner les variables (voir ci-dessous)
3. `npm install` puis `npm run dev`

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Secret pour NextAuth (générer avec `npx auth secret`) |
| `AUTH_GOOGLE_ID` | Client ID Google OAuth (Google Cloud Console) |
| `AUTH_GOOGLE_SECRET` | Client Secret Google OAuth |
| `KV_REST_API_URL` | URL REST du store Vercel KV |
| `KV_REST_API_TOKEN` | Token du store Vercel KV |

En local, crée un projet dans [Google Cloud Console](https://console.cloud.google.com/), active l’API Google+ et crée des identifiants OAuth 2 (type « Application Web »), avec URI de redirection `http://localhost:3000/api/auth/callback/google`.

Pour Vercel KV : dans le dashboard Vercel, Storage → Create Database → KV, puis lie le projet ; les variables `KV_*` sont ajoutées automatiquement.

## Tester avec des faux utilisateurs (dev)

- **Google** : en mode "Testing" sur l’écran de consentement OAuth, seuls les comptes ajoutés dans "Test users" peuvent se connecter. Les alias Gmail (`toi+test@gmail.com`) restent le même compte → même nom/avatar dans l’app.
- **Mode dev intégré** : ajoute dans `.env.local` :
  - `ALLOW_DEV_CREDENTIALS=true`
  - `NEXT_PUBLIC_DEV_CREDENTIALS=true`
  Puis sur `/auth/signin` un bloc "Mode dev" apparaît : tu choisis un faux user (Alice Dev, Bob Test, Charlie Test) et le mot de passe `dev`. Chaque user a un nom distinct. À ne pas activer en prod.

## Déploiement (Vercel)

1. Push sur GitHub / GitLab
2. Importer le projet sur [Vercel](https://vercel.com)
3. Ajouter les variables d’environnement (Auth + KV)
4. Déployer

Sur Vercel, configure l’URI de redirection Google : `https://ton-domaine.vercel.app/api/auth/callback/google`.

## Routes

- `/` – Landing (redirige vers dashboard si connecté)
- `/auth/signin` – Connexion Google
- `/dashboard` – Liste des colocs
- `/coloc/new` – Créer une coloc
- `/coloc/join` – Rejoindre avec un code
- `/coloc/join/[code]` – Rejoindre via lien d’invitation
- `/coloc/[id]` – Achats (qui achète quoi)
- `/coloc/[id]/stock` – Gestion stock (épuisé / OK)
- `/coloc/[id]/settings` – Admin (membres, items, lien d’invitation)

# STORY 
Born in Flatmates.
