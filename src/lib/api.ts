import {
  CATALOG,
  CartEntry,
  GarmentProduct,
  GarmentSize,
} from "../data/catalog";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

const LOCAL_PRODUCTS_KEY = "saintv_catalog_v1";
const LOCAL_ORDERS_KEY = "saintv_orders_v1";
const LOCAL_SUBSCRIBERS_KEY = "saintv_subscribers_v1";

export const DEMO_ADMIN_KEY = "SAINTV-ADMIN-2026";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export interface AdminOrderItem {
  productId: string;
  productName: string;
  sku: string;
  size: GarmentSize;
  quantity: number;
  unitPriceEgp: number;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingCity: string;
  shippingAddress: string;
  paymentMethod: "COD" | "CARD";
  promoCode: string | null;
  subtotalEgp: number;
  discountEgp: number;
  totalEgp: number;
  status: OrderStatus;
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminSubscriber {
  id: string | number;
  email: string;
  source: string;
  createdAt: string;
}

export interface CheckoutCustomerDetails {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingCity: string;
  shippingAddress: string;
  paymentMethod: "COD" | "CARD";
  promoCode?: string;
}

export interface OrderSubmissionResult {
  ok: boolean;
  orderCode: string;
  persisted: boolean;
}

export function isRemoteApiConfigured(): boolean {
  return Boolean(API_BASE);
}

function defaultStockFor(product: GarmentProduct, idx: number): number {
  if (typeof product.stockQty === "number") return product.stockQty;
  return 8 + ((idx * 5) % 14);
}

function readLocalCatalog(): GarmentProduct[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GarmentProduct[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore malformed storage
  }
  return CATALOG.map((item, idx) => ({
    ...item,
    stockQty: defaultStockFor(item, idx),
    featuredRank: idx + 1,
  }));
}

function writeLocalCatalog(products: GarmentProduct[]): void {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // Ignore quota errors
  }
}

function seedDemoOrders(): AdminOrder[] {
  const now = Date.now();
  return [
    {
      id: "demo-order-1",
      orderCode: "SV-GIZA-84A2C1",
      customerName: "Youssef El-Masry",
      customerPhone: "01012345678",
      customerEmail: "youssef@example.com",
      shippingCity: "Giza",
      shippingAddress: "14 Sheikh Zayed Central Axis, Beverly Hills, Bldg 6",
      paymentMethod: "COD",
      promoCode: "GIZA26",
      subtotalEgp: 3598,
      discountEgp: 360,
      totalEgp: 3238,
      status: "PENDING",
      createdAt: new Date(now - 1000 * 60 * 42).toISOString(),
      items: [
        {
          productId: "washed-black-zip-jacket",
          productName: "CHARCOAL BRUSHED WOOL-BLEND KNIT CREWNECK",
          sku: "SV2-KN-01",
          size: "L",
          quantity: 1,
          unitPriceEgp: 1699,
        },
        {
          productId: "padded-collar-bomber-jacket",
          productName: "OLIVE CHUNKY FISHERMAN RAGLAN KNIT SWEATER",
          sku: "SV2-KN-04",
          size: "M",
          quantity: 1,
          unitPriceEgp: 1899,
        },
      ],
    },
    {
      id: "demo-order-2",
      orderCode: "SV-GIZA-71F9D4",
      customerName: "Omar Tarek",
      customerPhone: "01198765432",
      customerEmail: null,
      shippingCity: "Giza",
      shippingAddress: "28 Gameat El Dewal St, Mohandessin, Apt 12",
      paymentMethod: "COD",
      promoCode: null,
      subtotalEgp: 2899,
      discountEgp: 0,
      totalEgp: 2899,
      status: "CONFIRMED",
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      items: [
        {
          productId: "canvas-utility-work-jacket",
          productName: "CHARCOAL KNIT & INDIGO WIDE DENIM STUDIO SET",
          sku: "SV2-ST-02",
          size: "M",
          quantity: 1,
          unitPriceEgp: 2899,
        },
      ],
    },
    {
      id: "demo-order-3",
      orderCode: "SV-GIZA-53B0E8",
      customerName: "Karim Hassan",
      customerPhone: "01255443322",
      customerEmail: null,
      shippingCity: "Alexandria",
      shippingAddress: "Kafr Abdo, Villa 9, Street 4",
      paymentMethod: "CARD",
      promoCode: null,
      subtotalEgp: 1599,
      discountEgp: 0,
      totalEgp: 1599,
      status: "DISPATCHED",
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      items: [
        {
          productId: "raw-seam-washed-jacket",
          productName: "ESPRESSO RIBBED HEAVYWEIGHT KNIT SWEATER",
          sku: "SV2-KN-03",
          size: "XL",
          quantity: 1,
          unitPriceEgp: 1599,
        },
      ],
    },
  ];
}

function readLocalOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminOrder[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage issues
  }
  const seeded = seedDemoOrders();
  writeLocalOrders(seeded);
  return seeded;
}

function writeLocalOrders(orders: AdminOrder[]): void {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage issues
  }
}

function readLocalSubscribers(): AdminSubscriber[] {
  try {
    const raw = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminSubscriber[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage issues
  }
  return [
    {
      id: 1,
      email: "earlydrop@saintv-giza.eg",
      source: "footer",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
  ];
}

function writeLocalSubscribers(list: AdminSubscriber[]): void {
  try {
    localStorage.setItem(LOCAL_SUBSCRIBERS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }
}

export async function fetchRemoteCatalog(): Promise<GarmentProduct[] | null> {
  if (!API_BASE) return readLocalCatalog();
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) return null;
    const data = (await res.json()) as { products?: GarmentProduct[] };
    return Array.isArray(data.products) && data.products.length > 0
      ? data.products
      : null;
  } catch {
    return null;
  }
}

export async function submitOrder(
  items: CartEntry[],
  customer: CheckoutCustomerDetails
): Promise<OrderSubmissionResult> {
  const fallbackCode = `SV-GIZA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const saveLocalOrder = (orderCode: string) => {
    const subtotalEgp = items.reduce(
      (sum, entry) => sum + entry.qty * entry.item.price,
      0
    );
    const normalizedPromo = customer.promoCode?.trim().toUpperCase() || null;
    const discountEgp =
      normalizedPromo === "GIZA26" && subtotalEgp >= 2999
        ? Math.round(subtotalEgp * 0.1)
        : 0;
    const totalEgp = Math.max(0, subtotalEgp - discountEgp);

    const newOrder: AdminOrder = {
      id: `local-${Date.now()}`,
      orderCode,
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail || null,
      shippingCity: customer.shippingCity,
      shippingAddress: customer.shippingAddress,
      paymentMethod: customer.paymentMethod,
      promoCode: discountEgp > 0 ? normalizedPromo : null,
      subtotalEgp,
      discountEgp,
      totalEgp,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      items: items.map((entry) => ({
        productId: entry.item.id,
        productName: entry.item.name,
        sku: entry.item.sku,
        size: entry.size,
        quantity: entry.qty,
        unitPriceEgp: entry.item.price,
      })),
    };

    const existing = readLocalOrders();
    writeLocalOrders([newOrder, ...existing]);

    // Decrement stock in local catalog
    const catalog = readLocalCatalog();
    const updatedCatalog = catalog.map((product) => {
      const orderedQty = items
        .filter((entry) => entry.item.id === product.id)
        .reduce((s, e) => s + e.qty, 0);
      if (orderedQty === 0) return product;
      const nextStock = Math.max(0, (product.stockQty ?? 10) - orderedQty);
      return {
        ...product,
        stockQty: nextStock,
        scarcity:
          nextStock === 0
            ? "Sold Out"
            : nextStock <= 4
            ? `Only ${nextStock} left`
            : product.scarcity,
      };
    });
    writeLocalCatalog(updatedCatalog);
  };

  if (!API_BASE) {
    saveLocalOrder(fallbackCode);
    return { ok: true, orderCode: fallbackCode, persisted: true };
  }

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail || undefined,
        shippingCity: customer.shippingCity,
        shippingAddress: customer.shippingAddress,
        paymentMethod: customer.paymentMethod,
        promoCode: customer.promoCode || undefined,
        items: items.map((entry) => ({
          productId: entry.item.id,
          size: entry.size,
          quantity: entry.qty,
        })),
      }),
    });

    if (!res.ok) {
      saveLocalOrder(fallbackCode);
      return { ok: true, orderCode: fallbackCode, persisted: false };
    }

    const data = (await res.json()) as { order?: { orderCode?: string } };
    return {
      ok: true,
      orderCode: data.order?.orderCode ?? fallbackCode,
      persisted: true,
    };
  } catch {
    saveLocalOrder(fallbackCode);
    return { ok: true, orderCode: fallbackCode, persisted: false };
  }
}

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const saveLocal = () => {
    const existing = readLocalSubscribers();
    if (!existing.some((entry) => entry.email === normalized)) {
      writeLocalSubscribers([
        {
          id: Date.now(),
          email: normalized,
          source: "footer",
          createdAt: new Date().toISOString(),
        },
        ...existing,
      ]);
    }
  };

  if (!API_BASE) {
    saveLocal();
    return true;
  }
  try {
    const res = await fetch(`${API_BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, source: "footer" }),
    });
    return res.ok;
  } catch {
    saveLocal();
    return true;
  }
}

/* ─── ADMIN API METHODS (LIVE BACKEND + LOCAL DEMO FALLBACK) ─── */

export async function verifyAdminKey(adminKey: string): Promise<{
  ok: boolean;
  mode: "live" | "demo";
  error?: string;
}> {
  const trimmed = adminKey.trim();
  if (!trimmed) {
    return { ok: false, mode: API_BASE ? "live" : "demo", error: "Enter your Admin API Key." };
  }

  if (!API_BASE) {
    if (trimmed === DEMO_ADMIN_KEY) {
      return { ok: true, mode: "demo" };
    }
    return {
      ok: false,
      mode: "demo",
      error: `Invalid key. Use demo key "${DEMO_ADMIN_KEY}" (or configure VITE_API_URL for live Neon Postgres).`,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      headers: { "x-admin-key": trimmed },
    });
    if (res.status === 401) {
      return { ok: false, mode: "live", error: "Unauthorized: invalid ADMIN_API_KEY." };
    }
    if (!res.ok) {
      return { ok: false, mode: "live", error: `Backend responded with status ${res.status}.` };
    }
    return { ok: true, mode: "live" };
  } catch {
    return {
      ok: false,
      mode: "live",
      error: "Could not reach backend API. Verify VITE_API_URL is online.",
    };
  }
}

export async function fetchAdminOrders(adminKey: string): Promise<AdminOrder[]> {
  if (!API_BASE) return readLocalOrders();
  const res = await fetch(`${API_BASE}/api/orders`, {
    headers: { "x-admin-key": adminKey },
  });
  if (!res.ok) throw new Error("Failed to load orders");
  const data = (await res.json()) as { orders?: AdminOrder[] };
  return Array.isArray(data.orders) ? data.orders : [];
}

export async function updateAdminOrderStatus(
  adminKey: string,
  orderCodeOrId: string,
  status: OrderStatus
): Promise<boolean> {
  if (!API_BASE) {
    const updated = readLocalOrders().map((o) =>
      o.orderCode === orderCodeOrId || o.id === orderCodeOrId
        ? { ...o, status }
        : o
    );
    writeLocalOrders(updated);
    return true;
  }

  const res = await fetch(
    `${API_BASE}/api/orders/${encodeURIComponent(orderCodeOrId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ status }),
    }
  );
  return res.ok;
}

export async function patchAdminProduct(
  adminKey: string,
  productId: string,
  patch: Partial<
    Pick<
      GarmentProduct,
      "name" | "price" | "compareAt" | "badge" | "scarcity" | "stockQty" | "availableSizes"
    >
  >
): Promise<GarmentProduct | null> {
  if (!API_BASE) {
    let saved: GarmentProduct | null = null;
    const updated = readLocalCatalog().map((p) => {
      if (p.id !== productId) return p;
      saved = { ...p, ...patch };
      return saved;
    });
    writeLocalCatalog(updated);
    return saved;
  }

  const res = await fetch(
    `${API_BASE}/api/products/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify(patch),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { product?: GarmentProduct };
  return data.product ?? null;
}

export async function upsertAdminProduct(
  adminKey: string,
  product: GarmentProduct
): Promise<GarmentProduct | null> {
  if (!API_BASE) {
    const existing = readLocalCatalog();
    const idx = existing.findIndex((p) => p.id === product.id);
    const nextList =
      idx === -1
        ? [product, ...existing]
        : existing.map((p, i) => (i === idx ? product : p));
    writeLocalCatalog(nextList);
    return product;
  }

  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({
      ...product,
      stockQty: product.stockQty ?? 10,
      featuredRank: product.featuredRank ?? 100,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { product?: GarmentProduct };
  return data.product ?? null;
}

export async function deleteAdminProduct(
  adminKey: string,
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!API_BASE) {
    const remaining = readLocalCatalog().filter((p) => p.id !== productId);
    writeLocalCatalog(remaining);
    return { ok: true };
  }

  const res = await fetch(
    `${API_BASE}/api/products/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    }
  );
  if (res.ok) return { ok: true };
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: false, error: data.error || "Failed to delete product" };
}

export async function fetchAdminSubscribers(
  adminKey: string
): Promise<AdminSubscriber[]> {
  if (!API_BASE) return readLocalSubscribers();
  const res = await fetch(`${API_BASE}/api/newsletter`, {
    headers: { "x-admin-key": adminKey },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { subscribers?: AdminSubscriber[] };
  return Array.isArray(data.subscribers) ? data.subscribers : [];
}
