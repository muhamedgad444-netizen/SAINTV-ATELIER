# SAINTV STUDIOS — Vercel Backend & Postgres Database (`backend/`)

Self-contained Vercel Functions (Node.js Fluid Compute) + Neon PostgreSQL backend for the **SAINTV STUDIOS · GIZA UNDERGROUND ARCHIVE** storefront.

## Folder Structure

```text
backend/
├── api/
│   ├── health.ts             # GET /api/health
│   ├── products/
│   │   ├── index.ts          # GET /api/products (?category=&brand=&q=&sort=), POST (admin)
│   │   └── [id].ts           # GET /api/products/:id
│   ├── orders/
│   │   └── index.ts          # POST /api/orders (server-side pricing + GIZA26 promo), GET (admin)
│   └── newsletter/
│       └── index.ts          # POST /api/newsletter
├── db/
│   ├── client.ts             # Lazy @neondatabase/serverless client (build-time safe)
│   ├── schema.sql            # PostgreSQL schema (products, orders, order_items, newsletter_subscribers)
│   ├── seed-data.ts          # All 20 SAINTV catalog items
│   └── setup.ts              # Applies schema.sql + idempotently seeds all 20 products
├── lib/
│   └── http.ts               # CORS headers, JSON/error helpers, admin key check
├── server.ts                 # Local Node.js dev server mirroring Vercel Functions
├── vercel.json               # Fluid Compute + CORS configuration
├── .env.example              # Required environment variables
└── package.json
```

## Deploy to Vercel + Neon Postgres

1. Import this repository in Vercel and set **Root Directory** to `backend` (or run `vercel` inside `backend/`).
2. Add Neon Postgres via the **Vercel Marketplace**:
   ```bash
   vercel integration add neon
   vercel env pull .env.local --yes
   ```
3. Set `ADMIN_API_KEY` and `ALLOWED_ORIGIN` in Vercel Environment Variables.
4. Create tables and seed the 20 products:
   ```bash
   cd backend
   npm install
   npm run db:setup
   ```
5. Point the frontend to your deployed backend by setting `VITE_API_URL=https://<your-backend>.vercel.app` in the frontend Vercel project.

## Local Development

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Without `DATABASE_URL`, the API runs in **fallback mode** using the built-in 20-item catalog seed so every endpoint can be tested immediately.
