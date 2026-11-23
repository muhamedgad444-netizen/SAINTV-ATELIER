# SAINTV STUDIOS — GIZA UNDERGROUND ARCHIVE (`FW26-27`)

> **GIZA TOLERATES NO WEAKNESS.**  
> Full-stack luxury streetwear storefront & Vercel serverless backend built with **React 18**, **TypeScript**, **Vite**, **Vercel Functions (Fluid Compute)**, and **Neon PostgreSQL**.

---

## Highlights

- **Split Editorial Campaign Hero** — Full-bleed looping 1080p campaign video (`SOUND ON / OFF` toggle, Giza coordinates `29.9792° N, 31.1342° E // GIZA`) paired opposite a 4-model matte concrete studio lineup.
- **Interactive 3D Showroom Rail (`The Giza Underground Rail`)** — Perspective 3D garment rack with cursor-glide physics, keyboard (`←` / `→`) & touch-swipe controls, live category filtering (`All Pieces`, `Knitwear`, `Tops`, `Bottoms`, `Studio Sets`), and real-time colorway previews.
- **20-Piece Seamless Underground Archive** — Filterable, searchable, sortable catalog with smooth front-to-styled-look hover crossfades, clickable colorway swatches per card, and 1-click hover size quick-add (`S / M / L / XL`).
- **Editorial Product Detail Modal** — Garment descriptions, 4-cell material specification grid (`Fabric`, `Composition`, `Wash`, `Silhouette`), interactive size chart toggle, urgency badges, and a 5-segment boxy fit meter.
- **2-Step Slide-Over Bag & Giza COD Checkout** — Live `GIZA26` promo code validation (**10% off orders ≥ 2,999 EGP**), essential add-on upsell, Giza/Egypt delivery form (`Cash on Delivery` or `Prepaid Card`), and order confirmation reference (`SV-GIZA-XXXXXX`).
- **Curated Editorial Matrix & Full-Body Lookbook** — Head-to-toe `"How To Style // Giza Street Rotation"` lookbook cards linked directly to shoppable studio sets.
- **Responsive Engineering** — Tested at desktop (`1440×900`), tablet (`1024×768`), and mobile (`375×812`) with collapsible mobile navigation drawer and zero horizontal overflow.
- **Vercel Serverless Backend + Postgres Database (`backend/`)** — Self-contained Vercel Functions API + Neon PostgreSQL schema, seed script, Zod validation, and graceful offline fallback.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, TypeScript 5, Vite 5, Lucide Icons, Custom Editorial CSS |
| **Backend API** | Vercel Functions (Node.js Fluid Compute, Web Standard `Request`/`Response`), Zod |
| **Database** | Neon PostgreSQL (`@neondatabase/serverless`) — relational schema with B-tree indexes |
| **Media** | Web-optimized 1080p H.264 `+faststart` campaign video + WebP transparent studio cutouts |

---

## Project Structure

```text
SAINTV-ATELIER/
├── index.html
├── package.json
├── vite.config.ts
├── media/
│   └── hero-video.mp4                # Web-optimized 1080p campaign film
├── public/
│   ├── images/                       # 20 studio garment cutouts
│   └── assets/products/              # Full-body lookbook & alternate views
├── src/
│   ├── App.tsx
│   ├── data/catalog.ts               # 20-piece SAINTV × ATELIER archive
│   ├── lib/api.ts                    # Frontend API client (VITE_API_URL)
│   ├── styles/site.css               # Design tokens & responsive layout system
│   └── components/
│       ├── AnnouncementBars.tsx
│       ├── SiteHeader.tsx
│       ├── HeroSplit.tsx
│       ├── ShowroomRail.tsx
│       ├── CatalogArchive.tsx
│       ├── EditorialMatrix.tsx
│       ├── HowToStyle.tsx
│       ├── ObsidianFooter.tsx
│       ├── ProductModal.tsx
│       └── CartDrawer.tsx
└── backend/                          # Standalone Vercel Functions + Neon Postgres package
    ├── api/
    │   ├── health.ts                 # GET /api/health
    │   ├── products/index.ts         # GET /api/products, POST /api/products (admin)
    │   ├── products/[id].ts          # GET /api/products/:id
    │   ├── orders/index.ts           # POST /api/orders, GET /api/orders (admin)
    │   └── newsletter/index.ts       # POST /api/newsletter
    ├── db/
    │   ├── client.ts                 # Lazy Neon serverless SQL client
    │   ├── schema.sql                # PostgreSQL DDL (products, orders, order_items, newsletter_subscribers)
    │   ├── seed-data.ts              # 20-item catalog seed
    │   └── setup.ts                  # Schema migration & idempotent seed runner
    ├── lib/http.ts                   # CORS, JSON helpers, admin key auth
    ├── server.ts                     # Local Node.js dev server mirroring Vercel routes
    ├── vercel.json                   # Fluid Compute + CORS configuration
    └── README.md
```

---

## Local Development

### 1. Run the Frontend Storefront

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5174/`.

### 2. Run the Backend API Locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs on `http://127.0.0.1:3001`. Without `DATABASE_URL`, it automatically serves the 20-item fallback catalog so every route can be tested immediately.

### 3. Apply Database Schema & Seed Postgres

Once `DATABASE_URL` is configured in `backend/.env`:

```bash
cd backend
npm run db:setup
```

---

## API Reference (`backend/`)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check & Postgres connection status |
| `GET` | `/api/products` | List catalog with optional `?category=`, `?brand=`, `?q=`, `?sort=featured\|low\|high` |
| `GET` | `/api/products/:id` | Fetch single garment details by `id` or `sku` |
| `POST` | `/api/products` | Upsert a product *(requires `x-admin-key` header)* |
| `POST` | `/api/orders` | Create COD/Card order with authoritative pricing & `GIZA26` 10% discount (≥ 2,999 EGP) |
| `GET` | `/api/orders` | List recent orders *(requires `x-admin-key` header)* |
| `POST` | `/api/newsletter` | Subscribe an email to early-access Giza drop dispatches |

---

## Deploying to Vercel

### Backend (`backend/` + Neon Postgres)
1. Import this repository in [Vercel](https://vercel.com/new) and set **Root Directory** to `backend`.
2. Attach **Neon Postgres** via the Vercel Marketplace (`vercel integration add neon`) so `DATABASE_URL` is provisioned automatically.
3. Add `ADMIN_API_KEY` and `ALLOWED_ORIGIN` in Environment Variables.
4. Run `npm run db:setup` inside `backend/` to create tables and seed all 20 products.

### Frontend (Root)
1. Import the same repository in Vercel with the default root directory (`.` — Vite auto-detected).
2. Add environment variable `VITE_API_URL=https://<your-backend>.vercel.app`.
3. Deploy — `npm run build` outputs `dist/`.

---

## Author

Built by **Mohamed Gad** · **SAINTV STUDIOS · GIZA UNDERGROUND ARCHIVE**.
