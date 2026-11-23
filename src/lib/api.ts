import { CartEntry, GarmentProduct } from "../data/catalog";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export interface OrderSubmissionResult {
  ok: boolean;
  orderCode: string;
  persisted: boolean;
}

export async function fetchRemoteCatalog(): Promise<GarmentProduct[] | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) return null;
    const data = (await res.json()) as { products?: GarmentProduct[] };
    return Array.isArray(data.products) ? data.products : null;
  } catch {
    return null;
  }
}

export async function submitOrder(
  items: CartEntry[],
  options?: { promoCode?: string; paymentMethod?: "COD" | "CARD" }
): Promise<OrderSubmissionResult> {
  const fallbackCode = `SV-GIZA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (!API_BASE) {
    return { ok: true, orderCode: fallbackCode, persisted: false };
  }

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((entry) => ({
          productId: entry.item.id,
          size: entry.size,
          quantity: entry.qty,
        })),
        paymentMethod: options?.paymentMethod ?? "COD",
        promoCode: options?.promoCode,
      }),
    });

    if (!res.ok) {
      return { ok: true, orderCode: fallbackCode, persisted: false };
    }

    const data = (await res.json()) as { order?: { orderCode?: string } };
    return {
      ok: true,
      orderCode: data.order?.orderCode ?? fallbackCode,
      persisted: true,
    };
  } catch {
    return { ok: true, orderCode: fallbackCode, persisted: false };
  }
}

export async function subscribeNewsletter(email: string): Promise<boolean> {
  if (!API_BASE) return true;
  try {
    const res = await fetch(`${API_BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    });
    return res.ok;
  } catch {
    return true;
  }
}
