import { timingSafeEqual } from "node:crypto";

export function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN?.trim() || "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
    "Cache-Control": "no-store",
  };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
): Response {
  const payload =
    details !== undefined ? { error: message, details } : { error: message };
  return jsonResponse(payload, status);
}

export function optionsResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function isAuthorizedAdmin(request: Request): boolean {
  const configuredKey = process.env.ADMIN_API_KEY?.trim();
  if (!configuredKey) return false;
  const provided = request.headers.get("x-admin-key")?.trim();
  if (!provided) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(configuredKey, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function mapDbProductRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    sku: row.sku,
    brand: row.brand,
    brandLabel: row.brand_label,
    name: row.name,
    category: row.category,
    price: Number(row.price_egp),
    compareAt: row.compare_at_egp != null ? Number(row.compare_at_egp) : null,
    badge: row.badge,
    scarcity: row.scarcity,
    swatches: row.swatches,
    swatchDetails: row.swatch_details,
    image: row.image_url,
    hoverImage: row.hover_image_url,
    fabricWeight: row.fabric_weight,
    composition: row.composition,
    washProcess: row.wash_process,
    fitProfile: row.fit_profile,
    description: row.description,
    availableSizes: row.available_sizes,
    stockQty: Number(row.stock_qty ?? 0),
    featuredRank: Number(row.featured_rank ?? 100),
  };
}
