import { getSql, isDatabaseConfigured } from "../db/client.js";
import { SEED_PRODUCTS } from "../db/seed-data.js";
import { errorResponse, jsonResponse, optionsResponse } from "../lib/http.js";

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(): Promise<Response> {
  try {
    if (!isDatabaseConfigured()) {
      return jsonResponse({
        ok: true,
        service: "saintv-atelier-backend",
        database: "unconfigured-fallback",
        productCount: SEED_PRODUCTS.length,
        timestamp: new Date().toISOString(),
      });
    }

    const sql = getSql();
    const rows = await sql`SELECT COUNT(*)::int AS count FROM products`;
    return jsonResponse({
      ok: true,
      service: "saintv-atelier-backend",
      database: "connected",
      productCount: Number(rows[0]?.count ?? 0),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/health] Health check error:", err);
    return errorResponse("Health check failed", 500);
  }
}
