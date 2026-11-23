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

const PatchProductSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  price: z.number().int().nonnegative().optional(),
  compareAt: z.number().int().nonnegative().nullable().optional(),
  badge: z.string().min(1).max(40).optional(),
  scarcity: z.string().min(1).max(60).optional(),
  stockQty: z.number().int().nonnegative().optional(),
  availableSizes: z.array(z.enum(["S", "M", "L", "XL", "OS"])).min(1).optional(),
});

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = decodeURIComponent(segments[segments.length - 1] || "");

    if (!id) {
      return errorResponse("Product ID is required", 400);
    }

    if (!isDatabaseConfigured()) {
      const product = SEED_PRODUCTS.find((p) => p.id === id || p.sku === id);
      if (!product) return errorResponse("Product not found", 404);
      return jsonResponse({ source: "fallback", product });
    }

    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM products WHERE id = ${id} OR sku = ${id} LIMIT 1
    `) as Record<string, unknown>[];

    if (rows.length === 0) {
      return errorResponse("Product not found", 404);
    }

    return jsonResponse({
      source: "database",
      product: mapDbProductRow(rows[0]),
    });
  } catch (err) {
    console.error("[GET /api/products/:id] Error loading product:", err);
    return errorResponse("Failed to load product", 500);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }
    if (!isDatabaseConfigured()) {
      return errorResponse("Database is not configured (set DATABASE_URL)", 503);
    }

    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = decodeURIComponent(segments[segments.length - 1] || "");
    if (!id) {
      return errorResponse("Product ID is required", 400);
    }

    const body = await request.json();
    const parsed = PatchProductSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid product update", 400, parsed.error.flatten());
    }

    const sql = getSql();
    const existingRows = (await sql`
      SELECT * FROM products WHERE id = ${id} OR sku = ${id} LIMIT 1
    `) as Record<string, unknown>[];

    if (existingRows.length === 0) {
      return errorResponse("Product not found", 404);
    }

    const current = mapDbProductRow(existingRows[0]);
    const patch = parsed.data;
    const nextName = patch.name ?? String(current.name);
    const nextPrice = patch.price ?? current.price;
    const nextCompareAt =
      patch.compareAt !== undefined ? patch.compareAt : current.compareAt;
    const nextBadge = patch.badge ?? String(current.badge);
    const nextScarcity = patch.scarcity ?? String(current.scarcity);
    const nextStockQty = patch.stockQty ?? current.stockQty;
    const nextSizes =
      patch.availableSizes ?? (current.availableSizes as string[]);

    const updated = (await sql`
      UPDATE products
      SET
        name = ${nextName},
        price_egp = ${nextPrice},
        compare_at_egp = ${nextCompareAt},
        badge = ${nextBadge},
        scarcity = ${nextScarcity},
        stock_qty = ${nextStockQty},
        available_sizes = ${nextSizes},
        updated_at = NOW()
      WHERE id = ${String(current.id)}
      RETURNING *
    `) as Record<string, unknown>[];

    return jsonResponse({
      source: "database",
      product: mapDbProductRow(updated[0]),
    });
  } catch (err) {
    console.error("[PATCH /api/products/:id] Error updating product:", err);
    return errorResponse("Failed to update product", 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }
    if (!isDatabaseConfigured()) {
      return errorResponse("Database is not configured (set DATABASE_URL)", 503);
    }

    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = decodeURIComponent(segments[segments.length - 1] || "");
    if (!id) {
      return errorResponse("Product ID is required", 400);
    }

    const sql = getSql();
    const deleted = (await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `) as Record<string, unknown>[];

    if (deleted.length === 0) {
      return errorResponse("Product not found", 404);
    }

    return jsonResponse({ ok: true, deletedId: String(deleted[0].id) });
  } catch (err) {
    console.error("[DELETE /api/products/:id] Error deleting product:", err);
    return errorResponse(
      "Cannot delete product (it may be referenced by existing orders)",
      409
    );
  }
}
