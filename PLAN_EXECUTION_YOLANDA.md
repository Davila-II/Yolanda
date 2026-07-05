# YOLANDA — Plan d'Exécution 7 Jours

> Marketplace C2C de mode circulaire au Cameroun
> Stack : Laravel 13 + PostgreSQL · React 19 + Vite + TailwindCSS 4
> Début : 5 juillet 2026 — Fin : 13 juillet 2026
> Version 1.0

---

## Table des matières

1. Organisation de l'Équipe
2. Méthodologie de Travail
3. Vue d'Ensemble des 7 Jours
4. Phase 1 — Base de données & Auth (Jour 1-2)
5. Phase 2 — API Catalogue (Jour 2-3)
6. Phase 3 — Frontend Site Public (Jour 3-5)
7. Phase 4 — Espace Vendeur & Favoris (Jour 5-6)
8. Phase 5 — Admin & Finalisation (Jour 6-7)
9. Catalogue des Pages & Composants React
10. Plan de Test
11. Procédure de Validation
12. Déploiement

---

## Chapitre 1 — Organisation de l'Équipe

### 1.1 Composition

| Rôle | Personne |
|------|----------|
| Chef de Projet / Développeur Fullstack | **Toi** (décisions, développement, recette) |
| Assistant IA | **CodeWhale** (génération de code, scaffolding, débogage, conseils) |

### 1.2 Répartition des Responsabilités

**Toi (Chef de Projet + Dev Fullstack)**
- Valide les specs et priorise les modules
- Exécute les migrations et seeders
- Teste chaque module avant de passer au suivant
- Déploie en production

**CodeWhale (Assistant IA)**
- Génère le code backend (controllers, migrations, seeders)
- Génère les composants React et pages
- Propose l'architecture et les corrections
- Écrit les tests unitaires et d'intégration

---

## Chapitre 2 — Méthodologie de Travail

### Processus par module

```
CodeWhale écrit le code → Tu exécutes et testes → Validation → Module suivant
```

### Règles d'Or

1. **Un module à la fois** — on termine complètement un module avant de commencer le suivant
2. **Tests avant recette** — chaque endpoint est testé (Postman ou php artisan test)
3. **Commit quotidien** — fin de journée, tout ce qui est fonctionnel est commité
4. **Mobile-first** — tout est testé en résolution mobile (le marché camerounais est majoritairement mobile)
5. **Validation obligatoire** avant de passer au module suivant

---

## Chapitre 3 — Vue d'Ensemble des 7 Jours

| Jour | Phase | Tâches principales | Livrable |
|------|-------|-------------------|----------|
| **1** | Base de données & Auth | Migrations, seeders (catégories), auth API | BDD prête + register/login OK |
| **2** | API Catalogue | CRUD produits, upload images, recherche, filtres, catégories, reviews | API catalogue complète |
| **3** | Frontend — Auth + Layout | Login, Register, Layout mobile, Navbar, navigation | Auth frontend OK + shell navigable |
| **4** | Frontend — Accueil + Produits | Homepage, listing catégories, fiche produit, recherche | Site public navigable |
| **5** | Frontend — Vendeur | Formulaire publication, dashboard vendeur, favoris | Parcours vendeur complet |
| **6** | Admin + Pages statiques | Dashboard admin, gestion utilisateurs, pages info | Back-office fonctionnel |
| **7** | Tests + Déploiement | Tests bout en bout, responsive, corrections, mise en ligne | **Plateforme en production** |

---

## Chapitre 4 — Phase 1 : Base de données & Auth (Jours 1-2)

**Objectif** : Base de données initialisée avec les tables et catégories, authentification API fonctionnelle.

### Jour 1 — Migrations & Seeders

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Lancer les migrations | `php artisan migrate` — 9 tables créées |
| 09:30 | Vérifier la BDD | `psql -U yolanda -d yolanda_db -c "\dt"` |
| 10:00 | Créer le DatabaseSeeder | Catégories principales (Femmes, Hommes, Enfants, Chaussures, Sacs, Beauté) + sous-catégories |
| 10:30 | Lancer les seeders | `php artisan db:seed` |
| 11:00 | Tester l'auth API | `POST /api/v1/auth/register` puis `POST /api/v1/auth/login` avec Postman |
| 14:00 | Créer UserFactory | Factory pour générer des utilisateurs de test |
| 15:00 | Créer ProductFactory | Factory pour générer des produits de test |
| 16:00 | Seeder de test | 10 utilisateurs + 50 produits + images |
| 17:00 | Commit | `git commit -m "Phase 1: migrations + seeders + auth OK"` |

**Fichiers à créer/modifier :**
- `backend/database/seeders/DatabaseSeeder.php`
- `backend/database/seeders/CategorySeeder.php`
- `backend/database/factories/ProductFactory.php`

### Jour 2 — Finalisation API

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Tester ProductController | GET/POST/PUT/DELETE — tous les endpoints |
| 10:00 | Système d'upload images | Endpoint `POST /api/v1/products/{id}/images` |
| 11:00 | Tester filtres | `?category_id=&search=&min_price=&max_price=&condition_state=&size=&sort=` |
| 14:00 | Tester Favorites + Reviews | `POST /api/v1/favorites/{id}` + `POST /api/v1/reviews` |
| 15:00 | Tester Admin | `GET /api/v1/admin/stats` |
| 16:00 | Corriger les bugs | Ajuster ce qui ne passe pas |
| 17:00 | Commit | `git commit -m "Phase 1: API catalogue complète et testée"` |

---

## Chapitre 5 — Phase 2 : API Catalogue (Jour 2-3)

**Objectif** : Toute l'API est fonctionnelle, testée et documentée.

### Vérification de tous les endpoints

```
✓ POST   /api/v1/auth/register        → 201 + token
✓ POST   /api/v1/auth/login            → 200 + token
✓ POST   /api/v1/auth/logout           → 200 (auth)
✓ GET    /api/v1/auth/me               → 200 (auth)
✓ GET    /api/v1/categories            → 200 + arbre catégories
✓ GET    /api/v1/categories/{id}       → 200 + sous-catégories
✓ GET    /api/v1/products              → 200 + pagination
✓ GET    /api/v1/products?search=robe  → 200 + filtres
✓ GET    /api/v1/products?category_id=1&min_price=1000&max_price=50000
✓ GET    /api/v1/products?condition_state=new&size=M
✓ GET    /api/v1/products?sort=price_asc
✓ GET    /api/v1/products/{id}         → 200 + views_count++
✓ POST   /api/v1/products              → 201 (auth)
✓ PUT    /api/v1/products/{id}         → 200 (owner only)
✓ DELETE /api/v1/products/{id}         → 200 (owner or moderator)
✓ GET    /api/v1/favorites             → 200 (auth)
✓ POST   /api/v1/favorites/{id}        → 201/200 toggle
✓ POST   /api/v1/reviews               → 201 (auth)
✓ GET    /api/v1/admin/stats           → 200 (admin only)
✓ PATCH  /api/v1/admin/users/{id}/status → 200 (admin only)
```

---

## Chapitre 6 — Phase 3 : Frontend Site Public (Jours 3-5)

**Objectif** : Site public React fonctionnel connecté à l'API.

### Jour 3 — Auth + Layout

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Structure des dossiers | `src/features/auth/`, `src/features/products/`, `src/components/`, `src/api/` |
| 10:00 | Client Axios | Intercepteur JWT + configuration base URL |
| 11:00 | AuthContext | Contexte React pour user + token + login/logout |
| 14:00 | Page Login | Formulaire email + mot de passe |
| 15:00 | Page Register | Formulaire nom + email + téléphone + ville + mot de passe |
| 16:00 | Layout mobile | BottomNav (Accueil, Recherche, +Vendre, Favoris, Profil) |
| 17:00 | Routing | React Router avec routes publiques et protégées |

**Fichiers à créer :**
- `frontend/src/api/client.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/BottomNav.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`

### Jour 4 — Accueil + Produits

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Page Accueil | Bannière hero, catégories, "Comment ça marche", CTA Vendre |
| 10:00 | Composant ProductCard | Image, prix, titre, taille, badge promo |
| 11:00 | Page Catégorie | Grille 2 colonnes, filtres, tri |
| 14:00 | Page Recherche | Barre de recherche + résultats dynamiques |
| 15:00 | Page Fiche Produit | Galerie photos, infos, bouton WhatsApp, produits similaires |
| 16:00 | Intégration API | Connecter toutes les pages aux vrais endpoints |
| 17:00 | Test responsive | Vérifier sur mobile |

**Fichiers à créer :**
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/CategoryPage.jsx`
- `frontend/src/pages/SearchPage.jsx`
- `frontend/src/pages/ProductDetailPage.jsx`
- `frontend/src/components/ProductCard.jsx`
- `frontend/src/components/ProductGrid.jsx`
- `frontend/src/components/SearchBar.jsx`
- `frontend/src/components/FilterBar.jsx`
- `frontend/src/components/ImageGallery.jsx`

### Jour 5 — Vendeur + Favoris

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Page Publier | Formulaire multi-étapes (catégorie → photos → détails → prix) |
| 10:00 | Upload images | Prévisualisation + upload vers l'API |
| 11:00 | Dashboard Vendeur | Liste de mes annonces, stats simples |
| 14:00 | Page Favoris | Grille des produits likés |
| 15:00 | Page Profil | Infos utilisateur, éditer profil |
| 16:00 | Pages statiques | Comment ça marche, CGU, À propos |
| 17:00 | Test complet | Parcours acheteur + vendeur de bout en bout |

**Fichiers à créer :**
- `frontend/src/pages/PublishProductPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/FavoritesPage.jsx`
- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/pages/StaticPage.jsx`
- `frontend/src/components/PublishForm/` (Step1, Step2, Step3, Step4)
- `frontend/src/components/WhatsAppButton.jsx`

---

## Chapitre 7 — Phase 4 : Admin & Finalisation (Jour 6)

**Objectif** : Back-office administrateur fonctionnel.

| Heure | Tâche | Détail |
|-------|-------|--------|
| 09:00 | Dashboard Admin | KPI : utilisateurs, produits, ventes, signalements |
| 10:00 | Gestion Utilisateurs | Table paginée, recherche, suspendre/vérifier |
| 11:00 | Gestion Annonces | Modération, validation, suppression |
| 14:00 | Gestion Catégories | CRUD catégories et sous-catégories |
| 15:00 | Gestion Contenu | Éditer les pages statiques (CGU, À propos...) |
| 16:00 | Gestion Signalements | Liste, statuts (en attente, traité, rejeté) |
| 17:00 | Test admin | Parcours admin complet |

**Fichiers à créer :**
- `frontend/src/pages/admin/DashboardPage.jsx`
- `frontend/src/pages/admin/UsersPage.jsx`
- `frontend/src/pages/admin/ProductsPage.jsx`
- `frontend/src/pages/admin/CategoriesPage.jsx`
- `frontend/src/pages/admin/PagesPage.jsx`
- `frontend/src/pages/admin/ReportsPage.jsx`
- `frontend/src/components/admin/AdminLayout.jsx`
- `frontend/src/components/admin/StatsCard.jsx`

---

## Chapitre 8 — Catalogue des Pages & Composants React

### 8.1 Pages Site Public

| Page | Route | Composant | Jour |
|------|-------|-----------|------|
| Accueil | `/` | `HomePage` | J4 |
| Connexion | `/login` | `LoginPage` | J3 |
| Inscription | `/register` | `RegisterPage` | J3 |
| Catégorie | `/category/:slug` | `CategoryPage` | J4 |
| Recherche | `/search` | `SearchPage` | J4 |
| Fiche produit | `/product/:id` | `ProductDetailPage` | J4 |
| Publier | `/publish` | `PublishProductPage` | J5 |
| Dashboard | `/dashboard` | `DashboardPage` | J5 |
| Favoris | `/favorites` | `FavoritesPage` | J5 |
| Profil | `/profile` | `ProfilePage` | J5 |
| Pages statiques | `/page/:slug` | `StaticPage` | J5 |

### 8.2 Pages Admin

| Page | Route | Composant | Jour |
|------|-------|-----------|------|
| Dashboard | `/admin` | `DashboardPage` | J6 |
| Utilisateurs | `/admin/users` | `UsersPage` | J6 |
| Annonces | `/admin/products` | `ProductsPage` | J6 |
| Catégories | `/admin/categories` | `CategoriesPage` | J6 |
| Pages | `/admin/pages` | `PagesPage` | J6 |
| Signalements | `/admin/reports` | `ReportsPage` | J6 |

### 8.3 Composants Réutilisables

| Composant | Usage | Jour |
|-----------|-------|------|
| `Layout` | Wrapper avec BottomNav | J3 |
| `BottomNav` | Navigation mobile (5 onglets) | J3 |
| `ProductCard` | Carte produit (image, prix, titre) | J4 |
| `ProductGrid` | Grille 2 colonnes adaptative | J4 |
| `SearchBar` | Barre de recherche avec autocomplete | J4 |
| `FilterBar` | Filtres (prix, état, taille, tri) | J4 |
| `ImageGallery` | Galerie swipeable | J4 |
| `WhatsAppButton` | Bouton contact vendeur | J4 |
| `PublishForm` | Formulaire multi-étapes | J5 |
| `StatsCard` | Carte KPI dashboard | J6 |
| `AdminLayout` | Layout admin avec sidebar | J6 |
| `DataTable` | Table paginée + recherche | J6 |

---

## Chapitre 9 — Plan de Test

### 9.1 Parcours de Test Critiques

1. **Parcours Acheteur** : Accueil → Catégorie → Fiche produit → Contact WhatsApp
2. **Parcours Vendeur** : Inscription → Publier article → Dashboard → Modifier annonce
3. **Parcours Favoris** : Connexion → Ajouter favori → Page favoris → Retirer favori
4. **Parcours Admin** : Connexion admin → Dashboard → Suspendre utilisateur → Valider annonce
5. **Parcours Recherche** : Rechercher "robe" → Filtrer par prix → Trier → Voir résultat

### 9.2 Outils de Test

| Outil | Pour |
|-------|------|
| **PHPUnit** | Tests unitaires backend (modèles, contrôleurs) |
| **Postman / Insomnia** | Tests manuels d'API pendant le développement |
| **Laravel Dusk** | Tests de navigation backend |
| **Vitest** | Tests unitaires frontend (composants) |
| **Lighthouse** | Tests de performance et SEO |
| **Chrome DevTools** | Mode mobile (iPhone SE, Galaxy S20) |

---

## Chapitre 10 — Commandes et Tâches Planifiées

| Commande | Fréquence | Action |
|----------|-----------|--------|
| `products:archive-old` | Quotidien (00:00) | Archive les produits inactifs depuis 30 jours |
| `reports:cleanup` | Quotidien (01:00) | Supprime les signalements rejetés de plus de 90 jours |
| `backup:database` | Quotidien (02:00) | Sauvegarde PostgreSQL |
| `images:cleanup-orphans` | Hebdomadaire | Supprime les images sans produit associé |

---

## Chapitre 11 — Procédure de Validation

### 11.1 Processus de Recette par Module

```
Étape 1 : CodeWhale génère le code
Étape 2 : Tu exécutes et testes
Étape 3 : Tu valides ou demandes des corrections
Étape 4 : Commit
Étape 5 : Passage au module suivant
```

### 11.2 Checklist de Validation par Module

Pour chaque module, vérifier :

- [ ] CRUD complet fonctionnel (créer, lire, modifier, supprimer)
- [ ] Permissions respectées (owner/admin seulement)
- [ ] Recherche, filtres et pagination opérationnels
- [ ] Responsive (mobile 375px, tablette 768px, desktop 1024px)
- [ ] Temps de réponse < 2 secondes
- [ ] Messages d'erreur en français
- [ ] Pas de régression sur les modules précédents
- [ ] Les images se chargent correctement

---

## Chapitre 12 — Déploiement (Jour 7)

### 12.1 Plan de Mise en Production

| Étape | Moment | Action |
|-------|--------|--------|
| Préparation | J7 matin | Nettoyer le code, vérifier `.env`, builder le frontend |
| Staging | J7 midi | Déployer backend (Railway/Render/VPS) + frontend (Vercel/Netlify) |
| Recette finale | J7 après-midi | Test complet sur staging par toi |
| Production | J7 soir | Mise en ligne DNS + SSL + BDD |
| Post-prod | J7+ | Support et corrections post-déploiement |

### 12.2 Checklist Déploiement

- [ ] `APP_ENV=production` et `APP_DEBUG=false`
- [ ] `DB_PASSWORD` sécurisé (pas le mot de passe de dev)
- [ ] CORS configuré pour le domaine frontend
- [ ] Stockage images configuré (Cloudinary ou S3)
- [ ] HTTPS activé
- [ ] `php artisan config:cache`
- [ ] `php artisan route:cache`
- [ ] `npm run build` pour le frontend

---

## Récapitulatif Final

```
JOUR 1 : ████████░░░░░░░░░░░░  BDD + Auth (migrate, seed, register/login)
JOUR 2 : ████████████████░░░░  API Catalogue (CRUD products, images, filtres)
JOUR 3 : ████████████████████  Frontend Auth + Layout (login, register, navigation)
JOUR 4 : ████████████████████  Frontend Public (home, catégories, produits, recherche)
JOUR 5 : ████████████████████  Frontend Vendeur (publier, dashboard, favoris)
JOUR 6 : ████████████████████  Admin + Pages (back-office, gestion contenu)
JOUR 7 : ████████████████████  Tests + Déploiement (recette, corrections, PRODUCTION)
                                      🚀 YOLANDA EN LIGNE !
```

---

> Document généré le 5 juillet 2026 — Version 1.0
> Projet Yolanda — La marketplace de mode circulaire au Cameroun
