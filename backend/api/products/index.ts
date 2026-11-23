import { z } from "zod";
import { getSql, isDatabaseConfigured } from "../../db/client.js";
import { SEED_PRODUCTS } from "../../db/seed-data.js";
import {
  errorResponse,
  isAuthorizedAdmin,
  jsonResponse,
  mapDbProductRow,
  optionsResponse,
} from "../../lib/http.js";

const UpsertProductSchema = z.object({
  id: z.string().min(2).max(100),
  sku: z.string().min(2).max(40),
  brand: z.string().min(2).max(40),
  brandLabel: z.string().min(2).max(80),
  name: z.string().min(2).max(160),
  category: z.enum(["KNITWEAR", "TOPS", "BOTTOMS", "SETS"]),
  price: z.number().int().nonnegative(),
  compareAt: z.number().int().nonnegative().nullable().optional().default(null),
  badge: z.string().min(1).max(40).default("NEW"),
  scarcity: z.string().min(1).max(60).default("In Stock"),
  swatches: z.array(z.string()).default([]),
  swatchDetails: z
    .array(
      z.object({
        hex: z.string(),
        name: z.string(),
        filterStyle: z.string().optional(),
      })
    )
    .default([]),
  image: z.string().min(1),
  hoverImage: z.string().min(1),
  fabricWeight: z.string().min(1),
  composition: z.string().min(1),
  washProcess: z.string().min(1),
  fitProfile: z.string().min(1),
  description: z.string().min(10),
  availableSizes: z.array(z.enum(["S", "M", "L", "XL", "OS"])).min(1),
  stockQty: z.number().int().nonnegative().default(10),
  featuredRank: z.number().int().nonnegative().default(100),
});

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category")?.trim().toUpperCase() || "";
    const brand = url.searchParams.get("brand")?.trim().toUpperCase() || "";
    const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
    const sort = url.searchParams.get("sort")?.trim().toLowerCase() || "featured";

    if (!isDatabaseConfigured()) {
      let filtered = [...SEED_PRODUCTS];
      if (category && category !== "ALL") {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (brand) {
        filtered = filtered.filter((p) => p.brand.toUpperCase() === brand);
      }
      if (q) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brandLabel.toLowerCase().includes(q)
        );
      }
      if (sort === "low") filtered.sort((a, b) => a.price - b.price);
      else if (sort === "high") filtered.sort((a, b) => b.price - a.price);
      else filtered.sort((a, b) => a.featuredRank - b.featuredRank);

      return jsonResponse({
        source: "fallback",
        count: filtered.length,
        products: filtered,
      });
    }

    const sql = getSql();
    const rows = (await sql`
      SELECT *
      FROM products
      ORDER BY featured_rank ASC, id ASC
    `) as Record<string, unknown>[];

    let products = rows.map(mapDbProductRow);
    if (category && category !== "ALL") {
      products = products.filter((p) => p.category === category);
    }
    if (brand) {
      products = products.filter(
        (p) => String(p.brand).toUpperCase() === brand
      );
    }
    if (q) {
      products = products.filter(
        (p) =>
          String(p.name).toLowerCase().includes(q) ||
          String(p.description).toLowerCase().includes(q) ||
          String(p.category).toLowerCase().includes(q) ||
          String(p.brandLabel).toLowerCase().includes(q)
      );
    }
    if (sort === "low") products.sort((a, b) => a.price - b.price);
    else if (sort === "high") products.sort((a, b) => b.price - a.price);

    return jsonResponse({
      source: "database",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("[GET /api/products] Error loading products:", err);
    return errorResponse("Failed to load products", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }
    if (!isDatabaseConfigured()) {
      return errorResponse("Database is not configured (set DATABASE_URL)", 503);
    }

    const body = await request.json();
    const parsed = UpsertProductSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid product payload", 400, parsed.error.flatten());
    }

    const p = parsed.data;
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO products (
        id, sku, brand, brand_label, name, category,
        price_egp, compare_at_egp, badge, scarcity,
        swatches, swatch_details, image_url, hover_image_url,
        fabric_weight, composition, wash_process, fit_profile,
        description, available_sizes, stock_qty, featured_rank, updated_at
      ) VALUES (
        ${p.id}, ${p.sku}, ${p.brand}, ${p.brandLabel}, ${p.name}, ${p.category},
        ${p.price}, ${p.compareAt}, ${p.badge}, ${p.scarcity},
        ${JSON.stringify(p.swatches)}::jsonb, ${JSON.stringify(p.swatchDetails)}::jsonb,
        ${p.image}, ${p.hoverImage},
        ${p.fabricWeight}, ${p.composition}, ${p.washProcess}, ${p.fitProfile},
        ${p.description}, ${p.availableSizes}, ${p.stockQty}, ${p.featuredRank}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        sku = EXCLUDED.sku,
        brand = EXCLUDED.brand,
        brand_label = EXCLUDED.brand_label,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_egp = EXCLUDED.price_egp,
        compare_at_egp = EXCLUDED.compare_at_egp,
        badge = EXCLUDED.badge,
        scarcity = EXCLUDED.scarcity,
        swatches = EXCLUDED.swatches,
        swatch_details = EXCLUDED.swatch_details,
        image_url = EXCLUDED.image_url,
        hover_image_url = EXCLUDED.hover_image_url,
        fabric_weight = EXCLUDED.fabric_weight,
        composition = EXCLUDED.composition,
        wash_process = EXCLUDED.wash_process,
        fit_profile = EXCLUDED.fit_profile,
        description = EXCLUDED.description,
        available_sizes = EXCLUDED.available_sizes,
        stock_qty = EXCLUDED.stock_qty,
        featured_rank = EXCLUDED.featured_rank,
        updated_at = NOW()
      RETURNING *
    `) as Record<string, unknown>[];

    return jsonResponse({ product: mapDbProductRow(rows[0]) }, 201);
  } catch (err) {
    console.error("[POST /api/products] Error upserting product:", err);
    return errorResponse("Failed to save product", 500);
  }
}
