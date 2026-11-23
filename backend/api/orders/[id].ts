import { z } from "zod";
import { getSql, isDatabaseConfigured } from "../../db/client.js";
import {
  errorResponse,
  isAuthorizedAdmin,
  jsonResponse,
  optionsResponse,
} from "../../lib/http.js";

const UpdateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"]),
});

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }

    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const identifier = decodeURIComponent(segments[segments.length - 1] || "");
    if (!identifier) {
      return errorResponse("Order ID or order code is required", 400);
    }

    const body = await request.json();
    const parsed = UpdateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid status update", 400, parsed.error.flatten());
    }

    if (!isDatabaseConfigured()) {
      return jsonResponse({
        source: "fallback",
        order: { orderCode: identifier, status: parsed.data.status },
      });
    }

    const sql = getSql();
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    const rows = (isUuid
      ? await sql`
          UPDATE orders
          SET status = ${parsed.data.status}
          WHERE id = ${identifier}::uuid
          RETURNING id, order_code AS "orderCode", status
        `
      : await sql`
          UPDATE orders
          SET status = ${parsed.data.status}
          WHERE order_code = ${identifier}
          RETURNING id, order_code AS "orderCode", status
        `) as Record<string, unknown>[];

    if (rows.length === 0) {
      return errorResponse("Order not found", 404);
    }

    return jsonResponse({
      source: "database",
      order: rows[0],
    });
  } catch (err) {
    console.error("[PATCH /api/orders/:id] Error updating order:", err);
    return errorResponse("Failed to update order status", 500);
  }
}
