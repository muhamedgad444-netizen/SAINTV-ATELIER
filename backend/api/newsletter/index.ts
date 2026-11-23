import { z } from "zod";
import { getSql, isDatabaseConfigured } from "../../db/client.js";
import {
  errorResponse,
  isAuthorizedAdmin,
  jsonResponse,
  optionsResponse,
} from "../../lib/http.js";

const SubscribeSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").max(180),
  source: z.string().trim().max(40).default("footer"),
});

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  try {
    if (!isAuthorizedAdmin(request)) {
      return errorResponse("Unauthorized: valid x-admin-key header required", 401);
    }
    if (!isDatabaseConfigured()) {
      return jsonResponse({ source: "fallback", count: 0, subscribers: [] });
    }

    const sql = getSql();
    const rows = (await sql`
      SELECT id, email, source, created_at AS "createdAt"
      FROM newsletter_subscribers
      ORDER BY created_at DESC
      LIMIT 500
    `) as Record<string, unknown>[];

    return jsonResponse({
      source: "database",
      count: rows.length,
      subscribers: rows,
    });
  } catch (err) {
    console.error("[GET /api/newsletter] Error loading subscribers:", err);
    return errorResponse("Failed to load newsletter subscribers", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid email address", 400, parsed.error.flatten());
    }

    const email = parsed.data.email.toLowerCase();
    const source = parsed.data.source;

    if (!isDatabaseConfigured()) {
      return jsonResponse(
        {
          ok: true,
          source: "fallback",
          subscribed: true,
          email,
        },
        201
      );
    }

    const sql = getSql();
    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email}, ${source})
      ON CONFLICT (email) DO NOTHING
    `;

    return jsonResponse(
      {
        ok: true,
        source: "database",
        subscribed: true,
        email,
      },
      201
    );
  } catch (err) {
    console.error("[POST /api/newsletter] Subscription error:", err);
    return errorResponse("Failed to subscribe email", 500);
  }
}
