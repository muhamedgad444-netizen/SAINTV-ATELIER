import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Lazily initializes the Neon serverless SQL client so builds never crash
 * when DATABASE_URL is absent prior to Vercel Marketplace provisioning.
 */
export function getSql(): NeonQueryFunction<false, false> {
  if (!cachedSql) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not configured.");
    }
    cachedSql = neon(url);
  }
  return cachedSql;
}
