# SAINTV STUDIOS — GIZA UNDERGROUND ARCHIVE (`FW26-27`)

> **GIZA TOLERATES NO WEAKNESS.**  
> Turnkey full-stack luxury streetwear storefront, Owner Operations Console (`/admin`), and Vercel serverless backend built with **React 18**, **TypeScript**, **Vite**, **Vercel Functions (Fluid Compute)**, and **Neon PostgreSQL**.

---

## Highlights

- **Full-Viewport (`100svh`) Split Editorial Campaign Hero** — Edge-to-edge full-screen opening with looping 1080p campaign video (`SOUND ON / OFF` toggle, Giza coordinates `29.9792° N, 31.1342° E // GIZA`) paired opposite a full-height 4-model matte concrete studio lineup and single-row drop footer.
- **Unified Flagship Design Language** — Cohesive `Montserrat` / `Inter` / `Space Mono` typographic hierarchy, obsidian + concrete surfaces, WCAG-accessible crimson accents, fluid viewport-proportional desktop scaling, and smooth sticky-header anchor navigation.
- **Interactive 3D Showroom Rail (`The Giza Underground Rail`)** — Perspective 3D garment rack with cursor-glide physics, keyboard (`←` / `→`) & touch-swipe controls, live category filtering (`All Pieces`, `Knitwear`, `Tops`, `Bottoms`, `Studio Sets`), and real-time circular colorway previews.
- **20-Piece Seamless Underground Archive** — Filterable, searchable, sortable catalog synced with the live backend API (`fetchRemoteCatalog()`), smooth front-to-full-look hover crossfades, clickable colorway swatches, 1-click hover quick-add (`S / M / L / XL`), and zero-results empty state with instant filter reset.
- **Editorial Product Detail Modal** — Full-bleed **Studio** portrait & **Full Look** cutout view toggle, interactive colorway switcher, SKU & sale compare-at pricing, 4-cell material specification grid (`Fabric`, `Composition`, `Wash`, `Silhouette`), interactive size chart, urgency indicator, and a 5-segment boxy fit meter.
- **2-Step Slide-Over Bag & Giza COD Checkout** — Live `GIZA26` 10% threshold progress bar (**10% off orders ≥ 2,999 EGP**), essential add-on upsell, Giza/Egypt delivery form (`Cash on Delivery` or `Prepaid Card`), automatic stock decrement, bag reset, and order confirmation reference (`SV-GIZA-XXXXXX`).
- **Owner Operations Console (`/admin`)** — Protected admin dashboard (`ADMIN_API_KEY` live, or local demo key `SAINTV-ADMIN-2026` offline) with real-time KPI cards, order status workflow (`PENDING → CONFIRMED → DISPATCHED → DELIVERED / CANCELLED`), **1-click Egyptian WhatsApp confirmation links**, **Courier CSV export** (Bosta / Aramex ready), inline stock `- / +` stepper, Add/Edit/Delete garment editor, and newsletter email export.
- **Curated Editorial Matrix & Full-Body Lookbook** — Head-to-toe `"How To Style // Giza Street Rotation"` lookbook cards linked directly to shoppable studio sets.
- **Responsive Engineering** — Verified across wide desktop (`1920×1080`), laptop (`1440×900`, `1366×768`, `1280×720`), tablet, and mobile (`375×812`) with zero horizontal overflow.
- **Vercel Serverless Backend + Postgres Database (`backend/`)** — Self-contained Vercel Functions API + Neon PostgreSQL schema, constant-time admin key auth (`timingSafeEqual`), Zod validation, and seamless offline fallback.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend & Admin UI** | React 18, TypeScript 5, Vite 5, Lucide Icons, Custom Editorial CSS |
| **Backend API** | Vercel Functions (Node.js Fluid Compute, Web Standard `Request`/`Response`), Zod |
| **Database** | Neon PostgreSQL (`@neondatabase/serverless`) — relational schema with B-tree indexes |
| **Media** | Web-optimized 1080p H.264 `+faststart` campaign video + WebP transparent studio cutouts |

---

## Project Structure

```text
SAINTV-ATELIER/
├── index.html
├── package.json
├── vercel.json                       # Frontend SPA rewrites (supports direct /admin visits)
├── vite.config.ts
├── media/
│   └── hero-video.mp4                # Web-optimized 1080p campaign film
├── public/
│   ├── images/                       # 20 studio garment portraits
│   └── assets/products/              # Full-body lookbook & alternate views
├── src/
│   ├── App.tsx                       # Storefront + /admin routing & live catalog sync
│   ├── data/catalog.ts               # 20-piece SAINTV × ATELIER archive & formatEGP()
│   ├── lib/api.ts                    # Storefront + Admin API client (live + local demo sync)
│   ├── styles/site.css               # Unified design tokens, storefront & /admin styles
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
│       ├── CartDrawer.tsx
│       └── AdminDashboard.tsx        # Protected /admin Operations Console
└── backend/                          # Standalone Vercel Functions + Neon Postgres package
    ├── api/
    │   ├── health.ts                 # GET /api/health
    │   ├── products/
    │   │   ├── index.ts              # GET /api/products, POST /api/products (admin)
    │   │   └── [id].ts               # GET, PATCH (admin), DELETE (admin) /api/products/:id
    │   ├── orders/
    │   │   ├── index.ts              # POST /api/orders (stock decrement), GET (admin + items)
    │   │   └── [id].ts               # PATCH /api/orders/:id (admin status update)
    │   └── newsletter/
    │       └── index.ts              # POST /api/newsletter, GET (admin)
    ├── db/
    │   ├── client.ts                 # Lazy Neon serverless SQL client
    │   ├── schema.sql                # PostgreSQL DDL (products, orders, order_items, newsletter_subscribers)
    │   ├── seed-data.ts              # 20-item catalog seed
    │   └── setup.ts                  # Schema migration & idempotent seed runner
    ├── lib/http.ts                   # CORS, JSON helpers, timingSafeEqual admin auth
    ├── server.ts                     # Local Node.js dev server mirroring Vercel routes
    ├── vercel.json                   # Fluid Compute + CORS configuration
    └── README.md
```

---

## Local Development

### 1. Run the Frontend Storefront & Admin Console

```bash
npm install
npm run dev
```

- **Storefront:** `http://localhost:5174/`
- **Owner Admin Console:** `http://localhost:5174/admin`  
  Without `VITE_API_URL`, the console runs in **Local Demo Mode** (demo key: `SAINTV-ADMIN-2026`), synced via `localStorage` so test orders placed on the storefront immediately appear in `/admin` and stock/product edits immediately update the storefront.

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
| `POST` | `/api/products` | Create or upsert a garment *(requires `x-admin-key` header)* |
| `PATCH` | `/api/products/:id` | Update stock, price, sizes, or scarcity note *(requires `x-admin-key` header)* |
| `DELETE` | `/api/products/:id` | Remove an archive piece *(requires `x-admin-key` header)* |
| `POST` | `/api/orders` | Create COD/Card order with authoritative pricing, `GIZA26` 10% discount (≥ 2,999 EGP), & automatic stock decrement |
| `GET` | `/api/orders` | List recent orders with customer phone, address, & batched line items *(requires `x-admin-key` header)* |
| `PATCH` | `/api/orders/:id` | Update order fulfillment status (`PENDING`, `CONFIRMED`, `DISPATCHED`, `DELIVERED`, `CANCELLED`) *(requires `x-admin-key` header)* |
| `POST` | `/api/newsletter` | Subscribe an email to early-access Giza drop dispatches |
| `GET` | `/api/newsletter` | List newsletter subscribers *(requires `x-admin-key` header)* |

---

## Deploying to Vercel

### Backend (`backend/` + Neon Postgres)
1. Import this repository in [Vercel](https://vercel.com/new) and set **Root Directory** to `backend`.
2. Attach **Neon Postgres** via the Vercel Marketplace (`vercel integration add neon`) so `DATABASE_URL` is provisioned automatically.
3. Add `ADMIN_API_KEY` and `ALLOWED_ORIGIN` in Environment Variables.
4. Run `npm run db:setup` inside `backend/` to create tables and seed all 20 products.

### Frontend (Root)
1. Import the same repository in Vercel with the default root directory (`.` — Vite auto-detected, SPA rewrite included via `vercel.json`).
2. Add environment variable `VITE_API_URL=https://<your-backend>.vercel.app`.
3. Deploy — `npm run build` outputs `dist/`. Connect your custom domain in Vercel Domains and access the Owner Console at `https://<your-domain>/admin`.

---

## Author

Built by **Mohamed Gad** · **SAINTV STUDIOS · GIZA UNDERGROUND ARCHIVE**.
