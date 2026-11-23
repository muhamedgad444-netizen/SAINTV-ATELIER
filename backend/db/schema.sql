-- SAINTV STUDIOS (GIZA UNDERGROUND ARCHIVE) — PostgreSQL Schema
-- Compatible with Neon Postgres (Vercel Marketplace) and standard PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  brand_label TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('KNITWEAR', 'TOPS', 'BOTTOMS', 'SETS')),
  price_egp INTEGER NOT NULL CHECK (price_egp >= 0),
  compare_at_egp INTEGER CHECK (compare_at_egp IS NULL OR compare_at_egp >= 0),
  badge TEXT NOT NULL,
  scarcity TEXT NOT NULL,
  swatches JSONB NOT NULL DEFAULT '[]'::jsonb,
  swatch_details JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  hover_image_url TEXT NOT NULL,
  fabric_weight TEXT NOT NULL,
  composition TEXT NOT NULL,
  wash_process TEXT NOT NULL,
  fit_profile TEXT NOT NULL,
  description TEXT NOT NULL,
  available_sizes TEXT[] NOT NULL DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  stock_qty INTEGER NOT NULL DEFAULT 15 CHECK (stock_qty >= 0),
  featured_rank INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_city TEXT NOT NULL DEFAULT 'Giza',
  shipping_address TEXT,
  payment_method TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD', 'CARD')),
  promo_code TEXT,
  subtotal_egp INTEGER NOT NULL CHECK (subtotal_egp >= 0),
  discount_egp INTEGER NOT NULL DEFAULT 0 CHECK (discount_egp >= 0),
  total_egp INTEGER NOT NULL CHECK (total_egp >= 0),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_egp INTEGER NOT NULL CHECK (unit_price_egp >= 0)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for storefront filtering, sorting, and foreign-key lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_featured_rank ON products (featured_rank ASC, id ASC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
