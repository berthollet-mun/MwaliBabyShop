# MWALI Baby Shop

Boutique en ligne responsive pour MWALI Baby Shop à Goma : maternité, layette, mode enfant, chaussures et produits de beauté. Le catalogue public privilégie la prise de commande sur WhatsApp; l’espace d’administration permet de gérer les contenus et les accès.

## Fonctionnalités

- vitrine responsive avec recherche, catégories, fiches produit et carrousel;
- images différées, skeleton loaders et transitions respectant `prefers-reduced-motion`;
- commandes et demandes de prix préremplies sur WhatsApp;
- administration des produits, catégories, bannières, paramètres et utilisateurs;
- rôles serveur `ADMIN` et `RESPONSABLE`;
- API Express avec validation Zod, PostgreSQL, journal d’audit et métriques;
- session JWT en cookie `HttpOnly`, protection CSRF, CORS strict et limitation de débit;
- configuration prête pour Vercel (frontend) et Render (API + PostgreSQL).

## Stack

- React 19, TypeScript, Vite 8 et Tailwind CSS 4;
- Motion et Lucide React;
- Node.js, Express, Zod, Helmet et `express-rate-limit`;
- PostgreSQL avec migrations SQL versionnées;
- bcrypt pour les mots de passe et JWT pour les sessions.

## Architecture

```text
src/                         application React
  components/                pages, composants publics et administration
  context/                   état catalogue, authentification et notifications
  lib/api.ts                 client HTTP centralisé
server/
  index.ts                   API, validation, autorisations et CRUD
  auth.ts                    sessions, CSRF et rôles
  db/
    migrations/              schéma PostgreSQL versionné
    migrate.ts               exécuteur de migrations
    seed.ts                  données et comptes initiaux
public/                      ressources statiques
render.yaml                  infrastructure Render
vercel.json                  build du frontend Vercel
```

## Prérequis

- Node.js 22 ou version LTS compatible;
- npm 10+;
- PostgreSQL 15+ (local ou Render).

## Installation locale

```bash
npm install
copy .env.example .env
```

Renseigner ensuite `.env` avec une base de développement et un secret de session aléatoire d’au moins 32 caractères. Ne jamais committer `.env`.

Créer le schéma et les données initiales :

```bash
npm run db:migrate
npm run db:seed
```

Lancer l’API puis le frontend dans deux terminaux :

```bash
npm run dev:api
npm run dev
```

Le frontend est disponible sur `http://localhost:3000` et l’API sur `http://localhost:4000`.

## Variables d’environnement

| Variable | Service | Usage |
| --- | --- | --- |
| `VITE_API_URL` | Vercel | URL publique de l’API Render, sans `/api` final |
| `API_PROXY_TARGET` | local | cible du proxy Vite |
| `DATABASE_URL` | Render API | chaîne PostgreSQL |
| `DATABASE_SSL` | Render API | `false` avec l’URL interne Render; selon le fournisseur autrement |
| `APP_ORIGIN` | Render API | origine(s) frontend autorisée(s), séparées par des virgules |
| `SESSION_SECRET` | Render API | secret aléatoire, minimum 32 caractères |
| `SESSION_HOURS` | Render API | durée d’une session, 8 par défaut |
| `ADMIN_EMAIL` | seed | email du premier administrateur |
| `ADMIN_INITIAL_PASSWORD` | seed | mot de passe initial, minimum 12 caractères |
| `RESPONSABLE_EMAIL` | seed | email du responsable |
| `RESPONSABLE_INITIAL_PASSWORD` | seed | mot de passe initial, minimum 12 caractères |

`.env.example` contient uniquement des valeurs factices.

## Base PostgreSQL

Les migrations sont idempotentes et enregistrées dans `schema_migrations`.

```bash
npm run db:migrate
```

Le seed insère les contenus de départ et crée les comptes seulement si les quatre variables de comptes sont fournies. Les mots de passe sont hashés avec bcrypt et ne sont jamais retournés par l’API.

```bash
npm run db:seed
```

Le seed utilise `ON CONFLICT DO NOTHING`; un redéploiement ne remplace donc pas les contenus ou mots de passe déjà présents.

## Rôles

- `ADMIN` : catalogue, paramètres, utilisateurs et journal d’audit;
- `RESPONSABLE` : catalogue, catégories, bannières et paramètres, sans gestion des comptes.

Les vérifications sont faites côté serveur. Cacher un onglet dans l’interface ne constitue jamais la protection principale.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | frontend Vite |
| `npm run dev:api` | API Express avec rechargement |
| `npm run lint` | analyse TypeScript frontend + serveur |
| `npm test` | tests de sécurité unitaires |
| `npm run build` | build frontend + serveur |
| `npm run build:web` | build Vercel |
| `npm run build:server` | compilation API |
| `npm start` | démarrage API compilée |
| `npm run db:migrate` | migrations PostgreSQL |
| `npm run db:seed` | données initiales |

## CRUD et permissions

| Entité | Create | Read | Update | Delete | Permission |
| --- | --- | --- | --- | --- | --- |
| Produits | oui | public/admin | oui | oui | Admin, Responsable |
| Catégories | oui | public/admin | oui | oui, si inutilisée | Admin, Responsable |
| Bannières | oui | public/admin | oui | oui | Admin, Responsable |
| Paramètres | seed | public/admin | oui | non | Admin, Responsable |
| Utilisateurs | oui | admin | oui | oui, sauf soi-même | Admin |
| Audit/métriques | automatique | admin | non | non | Admin |

## Sécurité

- mots de passe bcrypt (coût 12 au seed et dans les CRUD);
- JWT signé limité à l’audience et à l’émetteur attendus;
- cookie de session `HttpOnly`, `Secure` et `SameSite=None` en production;
- jeton CSRF sur les mutations authentifiées;
- CORS limité à `APP_ORIGIN`;
- validation stricte et requêtes SQL paramétrées;
- rate limiting global, renforcé sur la connexion;
- Helmet et suppression de l’en-tête Express;
- messages serveur génériques sans stack trace en production.

Pour une production à fort trafic, déplacer les images vers un stockage objet (Cloudinary, S3 ou Render Object Storage) au lieu de conserver de gros Data URLs dans PostgreSQL.

## Déploiement Render

1. Connecter le dépôt dans Render et appliquer `render.yaml`.
2. Définir `APP_ORIGIN` avec l’URL Vercel exacte.
3. Définir les emails et mots de passe initiaux dans les secrets Render.
4. Vérifier que le pre-deploy exécute migrations et seed.
5. Tester `/api/health` puis la connexion admin.

La base et l’API utilisent de préférence l’URL PostgreSQL interne Render.

## Déploiement Vercel

1. Importer le même dépôt dans Vercel.
2. Vercel détecte `vercel.json` et publie `dist`.
3. Définir `VITE_API_URL=https://votre-api.onrender.com`.
4. Ajouter l’URL Vercel dans `APP_ORIGIN` côté Render.
5. Redéployer le frontend après tout changement de variable `VITE_*`.

## Vérifications avant livraison

```bash
npm run lint
npm test
npm run build
```

Tester ensuite manuellement sur mobile et ordinateur : navigation, recherche, WhatsApp, connexion, chaque CRUD, expiration/déconnexion et refus d’accès du rôle Responsable aux utilisateurs.

## Procédure Git recommandée

```bash
git switch -c codex/finalize-mwali-production
git status --short
git diff --check
git add .
git diff --cached
git commit -m "feat: finalize Mwali Baby Shop production experience"
git push -u origin codex/finalize-mwali-production
```

Avant le commit, rechercher les secrets et vérifier que `.env`, clés, certificats, dumps et données de production ne sont pas suivis.
