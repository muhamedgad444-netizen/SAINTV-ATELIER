import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getSql, isDatabaseConfigured } from "../../db/client.js";
import { SEED_PRODUCTS } from "../../db/seed-data.js";
import {
  errorResponse,
  isAuthorizedAdmin,
  jsonResponse,
  optionsResponse,
} from "../../lib/http.js";

const CreateOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(120).optional(),
  customerEmail: z.string().trim().email().max(180).optional(),
  customerPhone: z.string().trim().min(7).max(30).optional(),
  shippingCity: z.string().trim().min(2).max(80).default("Giza"),
  shippingAddress: z.string().trim().max(300).optional(),
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
  promoCode: z.string().trim().max(40).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.enum(["S", "M", "L", "XL", "OS"]),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Order must contain at least one item"),
});

function generateOrderCode(): string {
  return `SV-GIZA-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }
    if (!isDatabaseConfigured()) {
      return jsonResponse({ source: "fallback", orders: [] });
    }

    const sql = getSql();
    const orders = await sql`
      SELECT
        o.id,
        o.order_code AS "orderCode",
        o.customer_name AS "customerName",
        o.customer_email AS "customerEmail",
        o.shipping_city AS "shippingCity",
        o.payment_method AS "paymentMethod",
        o.promo_code AS "promoCode",
        o.subtotal_egp AS "subtotalEgp",
        o.discount_egp AS "discountEgp",
        o.total_egp AS "totalEgp",
        o.status,
        o.created_at AS "createdAt"
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 100
    `;

    return jsonResponse({
      source: "database",
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("[GET /api/orders] Error listing orders:", err);
    return errorResponse("Failed to load orders", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid order payload", 400, parsed.error.flatten());
    }

    const payload = parsed.data;
    const normalizedPromo = payload.promoCode?.toUpperCase() || null;

    if (!isDatabaseConfigured()) {
      const catalogMap = new Map(SEED_PRODUCTS.map((p) => [p.id, p]));
      let subtotalEgp = 0;
      for (const line of payload.items) {
        const product = catalogMap.get(line.productId);
        if (!product) {
          return errorResponse(`Unknown productId: ${line.productId}`, 400);
        }
        subtotalEgp += product.price * line.quantity;
      }

      const discountEgp =
        normalizedPromo === "GIZA26" && subtotalEgp >= 2999
          ? Math.round(subtotalEgp * 0.1)
          : 0;
      const totalEgp = Math.max(0, subtotalEgp - discountEgp);
      const orderCode = generateOrderCode();

      return jsonResponse(
        {
          source: "fallback",
          order: {
            orderCode,
            status: "PENDING",
            paymentMethod: payload.paymentMethod,
            shippingCity: payload.shippingCity,
            promoCode: discountEgp > 0 ? normalizedPromo : null,
            subtotalEgp,
            discountEgp,
            totalEgp,
            itemCount: payload.items.reduce((s, i) => s + i.quantity, 0),
          },
        },
        201
      );
    }

    const sql = getSql();
    const requestedIds = [...new Set(payload.items.map((i) => i.productId))];
    const dbProducts = (await sql`
      SELECT id, price_egp FROM products WHERE id = ANY(${requestedIds})
    `) as { id: string; price_egp: number }[];

    const priceById = new Map(dbProducts.map((p) => [p.id, Number(p.price_egp)]));
    let subtotalEgp = 0;
    const resolvedLines: {
      productId: string;
      size: string;
      quantity: number;
      unitPriceEgp: number;
    }[] = [];

    for (const line of payload.items) {
      const unitPriceEgp = priceById.get(line.productId);
      if (unitPriceEgp === undefined) {
        return errorResponse(`Unknown productId: ${line.productId}`, 400);
      }
      subtotalEgp += unitPriceEgp * line.quantity;
      resolvedLines.push({
        productId: line.productId,
        size: line.size,
        quantity: line.quantity,
        unitPriceEgp,
      });
    }

    const discountEgp =
      normalizedPromo === "GIZA26" && subtotalEgp >= 2999
        ? Math.round(subtotalEgp * 0.1)
        : 0;
    const totalEgp = Math.max(0, subtotalEgp - discountEgp);
    const orderCode = generateOrderCode();

    const createdRows = (await sql`
      INSERT INTO orders (
        order_code, customer_name, customer_email, customer_phone,
        shipping_city, shipping_address, payment_method, promo_code,
        subtotal_egp, discount_egp, total_egp, status
      ) VALUES (
        ${orderCode},
        ${payload.customerName ?? null},
        ${payload.customerEmail ?? null},
        ${payload.customerPhone ?? null},
        ${payload.shippingCity},
        ${payload.shippingAddress ?? null},
        ${payload.paymentMethod},
        ${discountEgp > 0 ? normalizedPromo : null},
        ${subtotalEgp},
        ${discountEgp},
        ${totalEgp},
        'PENDING'
      )
      RETURNING id, order_code, status, created_at
    `) as { id: string; order_code: string; status: string; created_at: string }[];

    const orderId = createdRows[0].id;
    for (const line of resolvedLines) {
      await sql`
        INSERT INTO order_items (order_id, product_id, size, quantity, unit_price_egp)
        VALUES (${orderId}, ${line.productId}, ${line.size}, ${line.quantity}, ${line.unitPriceEgp})
      `;
    }

    return jsonResponse(
      {
        source: "database",
        order: {
          id: orderId,
          orderCode: createdRows[0].order_code,
          status: createdRows[0].status,
          paymentMethod: payload.paymentMethod,
          shippingCity: payload.shippingCity,
          promoCode: discountEgp > 0 ? normalizedPromo : null,
          subtotalEgp,
          discountEgp,
          totalEgp,
          createdAt: createdRows[0].created_at,
        },
      },
      201
    );
  } catch (err) {
    console.error("[POST /api/orders] Error creating order:", err);
    return errorResponse("Failed to create order", 500);
  }
}
