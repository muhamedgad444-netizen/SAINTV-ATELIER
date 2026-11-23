import { getSql, isDatabaseConfigured } from "../../db/client.js";
import { SEED_PRODUCTS } from "../../db/seed-data.js";
import {
  errorResponse,
  jsonResponse,
  mapDbProductRow,
  optionsResponse,
} from "../../lib/http.js";

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
