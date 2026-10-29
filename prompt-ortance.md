# PROMPT COMPLET — Application Web E-commerce « ORTANCE »

## 1. Rôle et contexte

Tu es un **développeur web full-stack senior** expert en **Next.js (App Router)**, **Node.js**, **bases de données relationnelles** et **UI/UX moderne**. Tu dois concevoir et développer une **application web e-commerce / vitrine** complète pour une boutique nommée **ORTANCE**.

L'objectif principal : permettre à la boutique de **mettre ses articles en ligne**, et permettre aux clients de **consulter le catalogue par catégories**, puis de **passer commande via WhatsApp** (pas de paiement en ligne pour le moment, pas de prix affiché).

---

## 2. Objectifs fonctionnels (côté client / public)

### 2.1 Page d'accueil
- **Mise en avant des catégories de produits en premier plan** : dès l'arrivée sur le site, le visiteur voit les **catégories** sous forme de cartes / grille / carrousel.
- Ensuite, le visiteur **scrolle verticalement** et découvre les produits **regroupés par catégorie**.
- **Carrousel(s) d'articles mis en avant** (produits « vedettes » / « à la une ») en haut de page, avec défilement automatique, flèches de navigation et indicateurs (dots).
- **L'adresse de l'entreprise doit être mise en avant** de manière visible (bandeau, section dédiée, footer, carte).
- Sections suggérées sur la home :
  1. Header / Navbar (logo ORTANCE, recherche, menu catégories, lien contact)
  2. Hero avec carrousel des produits en avant
  3. Grille des catégories
  4. Bandeau « Adresse & Contact » (très visible)
  5. Produits par catégorie (sections successives au scroll)
  6. Section « Pourquoi nous choisir » (arguments)
  7. Témoignages / avis clients (optionnel)
  8. Footer complet (adresse, WhatsApp, horaires, réseaux sociaux)

### 2.2 Page catégorie
- Liste des produits de la catégorie sélectionnée.
- Filtres / tri simples (nouveauté, alphabétique, mis en avant).
- Pagination ou infinite scroll.

### 2.3 Page produit (fiche article)
- **NE PAS afficher le prix de l'article.**
- À la place, afficher :
  - Une **description attrayante** du produit (texte rédigé pour donner envie d'acheter),
  - L'**adresse de l'entreprise**,
  - Les caractéristiques (dimensions, couleurs, matières, disponibilité…),
  - Une **galerie d'images** (zoom, miniatures, slider),
  - Des **produits similaires / suggérés**.
- **Bouton « Commander sur WhatsApp »** bien visible (sticky sur mobile).
  - Au clic : ouverture de `https://wa.me/243822262471?text=...` avec un **message pré-rempli** contenant le nom du produit, sa référence et le lien de la page.
  - Le numéro WhatsApp utilisé pour le moment est : **0822262471** (format international : **+243 822 262 471**).
  - Le message doit préciser que la discussion porte sur **le prix et la commande**, et que la commande est validée **si les deux parties sont d'accord**.

### 2.4 Autres pages publiques
- **À propos** (histoire, valeurs d'ORTANCE)
- **Contact** (adresse, WhatsApp, formulaire, carte Google Maps intégrée)
- **Mentions légales / Politique de confidentialité**
- **Page 404 personnalisée**

---

## 3. Espace Administration (Back-office)

### 3.1 Authentification
- Authentification sécurisée (email + mot de passe hashé avec **bcrypt**, session via **JWT** ou **NextAuth**).
- **Deux rôles uniquement** :
  1. **Responsable** (gestion complète du catalogue et du contenu)
  2. **Ingénieur Informaticien** (accès total, y compris gestion des utilisateurs, configuration technique, logs, maintenance)

### 3.2 Tableau de bord (Dashboard)
- Statistiques : nombre de produits, catégories, produits en avant, visites, clics WhatsApp, commandes reçues.
- Graphiques : évolution des clics WhatsApp, top produits consultés, répartition par catégorie.
- Activité récente (derniers produits ajoutés/modifiés).

### 3.3 CRUD complets
- **CRUD Catégories** : nom, slug, description, image, ordre d'affichage, statut (actif/inactif).
- **CRUD Produits** : nom, description, catégorie, images multiples, mise en avant (oui/non), statut, référence, tags.
- **CRUD Utilisateurs** (réservé à l'informaticien) : création, modification, suppression, changement de rôle.
- **CRUD Médias / Bannières** : gestion des images du carrousel, du hero, des bandeaux.
- **CRUD Paramètres du site** : nom de la boutique, adresse, numéro WhatsApp, réseaux sociaux, textes des sections.

### 3.4 Gestion des images (important)
L'admin doit pouvoir ajouter une image de **trois manières** :
1. **Upload depuis la machine** (PC) — via drag & drop ou sélecteur de fichiers.
2. **Upload depuis le téléphone** — le champ doit accepter `capture="environment"` pour ouvrir directement l'appareil photo sur mobile.
3. **Depuis un lien URL externe** (image provenant d'Internet).

Stockage : local (`/public/uploads`) en développement, et **Cloudinary / S3 / Supabase Storage** en production. Prévoir la génération de miniatures et la compression.

---

## 4. Stack technique imposée

| Couche | Technologie |
|---|---|
| Frontend | **Next.js 14+ (App Router)**, React, TypeScript |
| Styling | **Tailwind CSS** + shadcn/ui (ou Radix UI) |
| Animations | **Framer Motion** (+ CSS transitions, AOS si besoin) |
| Carrousels | **Embla Carousel** ou Swiper.js |
| Backend | **Node.js** — API Routes Next.js et/ou serveur Express séparé |
| Base de données | **PostgreSQL** (recommandé) avec **Prisma ORM** — alternative : MongoDB + Mongoose |
| Auth | NextAuth.js ou JWT + bcrypt |
| Upload | Multer / UploadThing / Cloudinary |
| Déploiement | Vercel (front) + Railway/Render/Supabase (DB) |

---

## 5. Modèle de données (proposition)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(RESPONSABLE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  RESPONSABLE
  INFORMATICIEN
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  reference   String?
  images      String[]
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  views       Int      @default(0)
  whatsappClicks Int   @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Banner {
  id       String  @id @default(cuid())
  title    String?
  image    String
  link     String?
  order    Int     @default(0)
  isActive Boolean @default(true)
}

model Setting {
  id              String @id @default("site")
  companyName     String @default("ORTANCE")
  address         String?
  whatsappNumber  String @default("243822262471")
  email           String?
  facebook        String?
  instagram       String?
  tiktok          String?
  aboutText       String?
}
```

---

## 6. Design & Direction artistique

- **Style** : moderne, élégant, épuré, professionnel, orienté conversion.
- **Palette** : à définir (suggérer une couleur principale forte + neutres), cohérente avec l'identité d'ORTANCE.
- **Typographie** : une police display pour les titres, une police lisible pour le corps.
- **Responsive** : mobile-first, parfaitement adapté aux téléphones (la majorité du trafic viendra du mobile).
- **Accessibilité** : contrastes suffisants, alt sur les images, navigation clavier, ARIA.
- **Micro-interactions** : hover sur les cartes produits, effets de survol, transitions douces.

### Animations à prévoir
- Apparition au scroll (fade-in, slide-up) via Framer Motion.
- Animation d'entrée du hero et du carrousel.
- Transition entre les pages (page transitions).
- Skeleton loaders pendant le chargement.
- Animation du bouton WhatsApp (pulse subtil).
- Compteurs animés dans le dashboard admin.

---

## 7. Points de mise en avant obligatoires

1. **Les catégories d'abord** : première chose visible après le hero.
2. **Le carrousel de produits vedettes** : bien visible, attractif, automatique.
3. **L'adresse de l'entreprise** : affichée dans un bandeau dédié + footer + page contact + intégrée dans le message WhatsApp.
4. **Le bouton WhatsApp** : présent sur chaque fiche produit, sur la page contact, et en **bouton flottant** sur tout le site (mobile surtout).
5. **Aucun prix affiché** — uniquement description + adresse + bouton WhatsApp.
6. **Numéro WhatsApp actuel** : `0822262471` → lien `https://wa.me/243822262471`.

---

## 8. Arborescence des routes (proposition)

```
/                        → Accueil (hero + carrousel + catégories + produits par catégorie)
/categories              → Toutes les catégories
/categorie/[slug]        → Produits d'une catégorie
/produit/[slug]          → Fiche produit (description + adresse + bouton WhatsApp)
/a-propos                → À propos d'ORTANCE
/contact                 → Contact + carte + WhatsApp
/admin                   → Dashboard (protégé)
/admin/produits          → CRUD produits
/admin/produits/nouveau  → Créer un produit
/admin/produits/[id]     → Modifier un produit
/admin/categories        → CRUD catégories
/admin/bannieres         → CRUD bannières / carrousel
/admin/parametres        → Paramètres du site
/admin/utilisateurs      → CRUD utilisateurs (INFORMATICIEN uniquement)
/admin/login             → Connexion
```

---

## 9. Sécurité

- Hashage des mots de passe (bcrypt).
- Protection des routes admin par middleware Next.js.
- Validation des entrées (Zod).
- Protection CSRF / rate limiting sur les routes sensibles.
- Sanitisation des contenus HTML.
- Variables d'environnement pour tous les secrets (`.env.local`, jamais commité).
- Journalisation des actions admin (audit log).

---

## 10. Livrables attendus

1. Projet **Next.js** complet, structuré et commenté.
2. Backend **Node.js** (API Routes ou Express) documenté.
3. **Schéma de base de données** + migrations Prisma.
4. **Seed** avec des données de démonstration (catégories, produits, comptes admin).
5. **Comptes par défaut** :
   - Responsable : `responsable@ortance.com`
   - Informaticien : `admin@ortance.com`
   - (mots de passe à changer à la première connexion)
6. Interface **admin responsive** avec dashboard, CRUD, gestion des images (upload machine / téléphone / URL).
7. **README.md** avec : installation, configuration, variables d'environnement, lancement, déploiement.
8. Code propre, typé, modulaire, respectant les bonnes pratiques.

---

## 11. Contraintes & exigences

- Le site doit être **rapide** (score Lighthouse > 90 sur mobile).
- **SEO** : metadata dynamiques, Open Graph, sitemap, robots.txt, URLs propres.
- **Images optimisées** via `next/image`.
- Le site doit fonctionner **sans paiement en ligne** : tout passe par WhatsApp.
- Le numéro WhatsApp doit être **configurable depuis l'admin** (pas hardcodé).
- Prévoir la **traduction facile** (FR par défaut, structure i18n prête).
- Le design doit inspirer **confiance et professionnalisme**.

---

## 12. Critères d'acceptation

- [ ] Un visiteur arrive sur le site et voit immédiatement les **catégories**.
- [ ] Il peut scroller et voir les produits **groupés par catégorie**.
- [ ] Il peut cliquer sur un produit et voir sa **description + l'adresse**, **sans prix**.
- [ ] Le bouton **« Commander sur WhatsApp »** ouvre bien une conversation avec le `+243 822 262 471` et un message pré-rempli.
- [ ] Le carrousel des produits en avant fonctionne et est animé.
- [ ] L'adresse de l'entreprise est visible sur la home et dans le footer.
- [ ] L'admin peut **se connecter**, voir le **dashboard**, faire du **CRUD** sur produits/catégories/bannières.
- [ ] L'admin peut **uploader une image depuis son PC**, depuis **son téléphone**, ou via **une URL**.
- [ ] Les deux rôles (**Responsable** et **Informaticien**) ont des permissions distinctes.
- [ ] Le site est **responsive** et agréable sur mobile.

---

## 13. Images de référence

> ⚠️ **Note** : l'utilisateur a mentionné vouloir fournir des images de référence pour l'organisation du site, mais **aucune image n'a été jointe à ce prompt**. Il faudra les ajouter ici (ou les décrire) avant de lancer le développement.
>
> **Emplacements prévus pour les images de référence :**
> - `[IMAGE_1]` — Inspiration pour la page d'accueil / hero
> - `[IMAGE_2]` — Inspiration pour la grille des catégories
> - `[IMAGE_3]` — Inspiration pour la fiche produit
> - `[IMAGE_4]` — Inspiration pour le carrousel
> - `[IMAGE_5]` — Inspiration pour le dashboard admin
>
> Utiliser ces images comme **références visuelles** pour la mise en page, les espacements, la hiérarchie et le style — sans les copier telles quelles.

---

## 14. Instructions finales pour l'IA

1. Commence par proposer une **architecture complète** du projet.
2. Génère ensuite le **code étape par étape** : configuration → base de données → API → frontend public → admin.
3. Explique chaque choix technique brièvement.
4. Fournis du code **prêt à l'emploi**, complet et fonctionnel.
5. Signale les points où une configuration manuelle est nécessaire (clés API, `.env`, etc.).
6. Propose des **améliorations supplémentaires** pour valoriser le site (blog, newsletter, avis clients, promotions, multilingue, PWA…).
7. Sois pédagogique : l'utilisateur est développeur web mais veut comprendre chaque étape.

**Nom de l'entreprise : ORTANCE**
**Numéro WhatsApp actuel : 0822262471 (+243 822 262 471)**
**Rôles admin : Responsable & Ingénieur Informaticien**
**Stack : Next.js + Node.js + Base de données**
