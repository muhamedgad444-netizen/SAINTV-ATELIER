import { z } from "zod";
import { getSql, isDatabaseConfigured } from "../../db/client.js";
import { errorResponse, jsonResponse, optionsResponse } from "../../lib/http.js";

const SubscribeSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").max(180),
  source: z.string().trim().max(40).default("footer"),
});

export function OPTIONS(): Response {
  return optionsResponse();
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
