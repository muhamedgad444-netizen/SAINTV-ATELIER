import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getSql } from "./client.js";
import { SEED_PRODUCTS } from "./seed-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runSetup() {
  const sql = getSql();
  const schemaPath = join(__dirname, "schema.sql");
  const rawSchema = readFileSync(schemaPath, "utf-8");

  const statements = rawSchema
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

  console.log(`Applying ${statements.length} schema statements...`);
  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Seeding ${SEED_PRODUCTS.length} SAINTV catalog products...`);
  for (const p of SEED_PRODUCTS) {
    await sql`
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
        featured_rank = EXCLUDED.featured_rank,
        updated_at = NOW()
    `;
  }

  console.log("Database schema applied and all 20 products seeded successfully.");
}

runSetup().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});
