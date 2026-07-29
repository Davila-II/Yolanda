# Yolanda — Marketplace de mode de seconde main au Cameroun 

**Yolanda** est une plateforme de vente de vêtements et accessoires de seconde main entre particuliers au Cameroun.  
Achetez et vendez sans commission, contactez les vendeurs directement via WhatsApp.

---

## 🛠 Stack technique

| Couche        | Technologie                              |
|---------------|------------------------------------------|
| **Backend**   | Laravel 13.8 (PHP 8.3+)                  |
| **Frontend**  | React 19 + Vite 7 + Tailwind CSS 4       |
| **Base de données** | SQLite (dev) / MySQL, PostgreSQL (prod) |
| **Authentification** | Laravel Sanctum (token API)         |
| **Autorisations** | Spatie Laravel Permission (rôles admin/user) |
| **Client HTTP** | Axios                                  |
| **Icônes**    | Lucide React                             |

---

##  Structure du projet

```
Yolanda/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/   # Contrôleurs API (à implémenter)
│   │   └── Models/             # Modèles Eloquent
│   ├── config/                 # Configuration (DB, auth, permissions...)
│   ├── database/
│   │   ├── migrations/         # Schéma de base de données ✅
│   │   └── seeders/            # Données de test
│   ├── routes/
│   │   └── api.php             # Routes API
│   └── storage/                # Fichiers uploadés, logs
├── frontend/                   # SPA React
│   └── src/
│       ├── api/                # Appels API (mode mock intégré)
│       ├── components/         # Composants réutilisables
│       │   └── admin/          # Composants du panneau admin
│       ├── context/            # AuthContext (état global)
│       └── pages/              # Pages de l'application
│           └── admin/          # Pages admin
└── Design/                     # Maquettes statiques
```

---

##  Démarrage rapide

### Prérequis

- **Node.js** ≥ 20.15 *(testé avec 20.15.1)*
- **npm** ≥ 9
- **PHP** ≥ 8.3 *(backend uniquement)*
- **Composer** *(backend uniquement)*
- **SQLite3** *(ou MySQL/PostgreSQL)*

### 1. Frontend (peut tourner seul en mode mock)

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:5173**.  
Sans backend configuré, il utilise automatiquement des **données mockées**.

#### Comptes de test mock :
| Rôle   | Email               | Mot de passe |
|--------|---------------------|--------------|
| User   | test@yolanda.cm     | password     |
| Admin  | admin@yolanda.cm    | admin        |

### 2. Backend (nécessite PHP)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

L'API démarre sur **http://localhost:8000**.

### 3. Brancher le frontend au backend

Dans `frontend/.env` :
```
VITE_API_URL=http://localhost:8000/api/v1
```

Dès que cette variable est définie, le frontend abandonne les mocks et appelle l'API réelle.

---

##  Modèle de données

```
users ──────────┐
  │              │ (seller_id)
  │              ▼
  │       products ──────── categories
  │         │   │               │
  │         │   └── product_images  └── parent_id (self-ref)
  │         │
  ├── favorites
  ├── reviews
  ├── contacts_log
  └── reports

permissions ←→ roles ←→ users (via Spatie)
```

**Tables :**
- `users` — acheteurs, vendeurs, admins
- `categories` — hiérarchie de catégories (Femmes, Hommes, Enfants...)
- `products` — annonces avec prix, état, taille, marque...
- `product_images` — galerie photo par produit
- `favorites` — wishlist utilisateur
- `reviews` — avis sur un vendeur pour un produit
- `contacts_log` — historique des contacts WhatsApp
- `reports` — signalements de produits

---

##  Routes du frontend

| URL                    | Page                    | Accès    |
|------------------------|-------------------------|----------|
| `/`                    | Accueil                 | Public   |
| `/login`               | Connexion               | Public   |
| `/register`            | Inscription             | Public   |
| `/category/:slug`      | Produits par catégorie  | Public   |
| `/product/:id`         | Fiche produit           | Public   |
| `/search`              | Recherche               | Public   |
| `/page/:slug`          | Page statique           | Public   |
| `/publish`             | Publier une annonce     | Connecté |
| `/dashboard`           | Tableau de bord vendeur | Connecté |
| `/favorites`           | Mes favoris             | Connecté |
| `/profile`             | Mon profil              | Connecté |
| `/admin`               | Dashboard admin         | Admin    |
| `/admin/users`         | Gestion utilisateurs    | Admin    |
| `/admin/products`      | Gestion annonces        | Admin    |
| `/admin/categories`    | Gestion catégories      | Admin    |
| `/admin/pages`         | Pages statiques         | Admin    |
| `/admin/reports`       | Signalements            | Admin    |

---

##  État du projet

| Composant              | État          |
|------------------------|---------------|
| Schéma base de données | ✅ Terminé    |
| Migrations             | ✅ Terminé    |
| Frontend (UI complète) | ✅ Terminé    |
| Mode mock frontend     | ✅ Fonctionnel|
| API routes             | ❌ À faire    |
| Contrôleurs backend    | ❌ À faire    |
| Modèles Eloquent       | ❌ À faire    |
| Auth (register/login)  | ❌ À faire    |
| Upload images          | ❌ À faire    |
| Seeds réalistes        | ❌ À faire    |

---

##  Licence

Projet en développement. Licence à définir.
