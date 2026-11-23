import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  KeyRound,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  BRAND_NAME,
  GarmentCategory,
  GarmentProduct,
  GarmentSize,
  LINE_A,
  LINE_B,
  computeBadge,
  formatEGP,
} from "../data/catalog";
import {
  AdminOrder,
  AdminSubscriber,
  DEMO_ADMIN_KEY,
  OrderStatus,
  deleteAdminProduct,
  fetchAdminOrders,
  fetchAdminSubscribers,
  fetchRemoteCatalog,
  isRemoteApiConfigured,
  patchAdminProduct,
  updateAdminOrderStatus,
  upsertAdminProduct,
  verifyAdminKey,
} from "../lib/api";

interface AdminDashboardProps {
  products: GarmentProduct[];
  onProductsUpdated: (nextProducts: GarmentProduct[]) => void;
  onExitAdmin: () => void;
}

type AdminTab = "orders" | "products" | "subscribers";

const SESSION_KEY_STORAGE = "saintv_admin_session_key";
const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];
const ALL_SIZES: GarmentSize[] = ["S", "M", "L", "XL", "OS"];
const CATEGORIES: GarmentCategory[] = ["KNITWEAR", "TOPS", "BOTTOMS", "SETS"];

const COMPASS_STAR_PATH =
  "M32 0 L36.5 23.5 L64 32 L36.5 40.5 L32 64 L27.5 40.5 L0 32 L27.5 23.5 Z M32 14 L45 19 L37 32 L45 45 L32 39 L19 45 L27 32 L19 19 Z";

function formatEgyptWhatsApp(phone: string, order: AdminOrder): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("20")
    ? digits
    : digits.startsWith("0")
    ? `2${digits}`
    : `20${digits}`;
  const msg = encodeURIComponent(
    `Hello ${order.customerName || ""}, this is SAINTV STUDIOS (Giza Dispatch). Confirming your order ${order.orderCode} (${formatEGP(order.totalEgp)} · ${order.paymentMethod}) to ${order.shippingCity}. Reply YES to dispatch today.`
  );
  return `https://wa.me/${intl}?text=${msg}`;
}

function escapeCsvCell(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((r) => r.map(escapeCsvCell).join(",")),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function slugifyId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || `piece-${Date.now()}`
  );
}

interface ProductFormState {
  isEditing: boolean;
  id: string;
  sku: string;
  brand: string;
  name: string;
  category: GarmentCategory;
  price: string;
  compareAt: string;
  scarcity: string;
  stockQty: string;
  image: string;
  hoverImage: string;
  fabricWeight: string;
  composition: string;
  washProcess: string;
  fitProfile: string;
  description: string;
  availableSizes: GarmentSize[];
}

function emptyProductForm(): ProductFormState {
  return {
    isEditing: false,
    id: "",
    sku: `SV2-NW-${Math.floor(10 + Math.random() * 89)}`,
    brand: LINE_A,
    name: "",
    category: "TOPS",
    price: "1499",
    compareAt: "",
    scarcity: "In Stock",
    stockQty: "15",
    image: "/images/washed_black_zip_jacket_1795380641700.jpg",
    hoverImage: "/assets/products/washed-black-zip-jacket-back.webp",
    fabricWeight: "420 GSM Heavyweight Cotton",
    composition: "100% Combed Egyptian Cotton",
    washProcess: "Enzyme Garment Wash",
    fitProfile: "Boxy Drop-Shoulder Cut",
    description:
      "Heavyweight Giza studio garment cut in a boxy silhouette with reinforced ribbing and washed matte finish.",
    availableSizes: ["S", "M", "L", "XL"],
  };
}

function productToForm(p: GarmentProduct): ProductFormState {
  return {
    isEditing: true,
    id: p.id,
    sku: p.sku,
    brand: p.brand,
    name: p.name,
    category: p.category,
    price: String(p.price),
    compareAt: p.compareAt != null ? String(p.compareAt) : "",
    scarcity: p.scarcity,
    stockQty: String(p.stockQty ?? 12),
    image: p.image,
    hoverImage: p.hoverImage,
    fabricWeight: p.fabricWeight,
    composition: p.composition,
    washProcess: p.washProcess,
    fitProfile: p.fitProfile,
    description: p.description,
    availableSizes: p.availableSizes,
  };
}

export function AdminDashboard({
  products,
  onProductsUpdated,
  onExitAdmin,
}: AdminDashboardProps) {
  const remoteConfigured = isRemoteApiConfigured();

  const [adminKey, setAdminKey] = useState<string>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY_STORAGE) ?? "";
    } catch {
      return "";
    }
  });
  const [keyInput, setKeyInput] = useState("");
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [mode, setMode] = useState<"live" | "demo">(
    remoteConfigured ? "live" : "demo"
  );

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Order filters
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Product filters & modal
  const [productSearch, setProductSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [formState, setFormState] = useState<ProductFormState>(emptyProductForm);
  const [savingProduct, setSavingProduct] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((curr) => (curr === message ? null : curr));
    }, 3200);
  }, []);

  const loadDashboardData = useCallback(
    async (keyToUse: string) => {
      setLoadingData(true);
      try {
        const [loadedOrders, loadedCatalog, loadedSubscribers] =
          await Promise.all([
            fetchAdminOrders(keyToUse),
            fetchRemoteCatalog(),
            fetchAdminSubscribers(keyToUse),
          ]);
        setOrders(loadedOrders);
        if (loadedCatalog) onProductsUpdated(loadedCatalog);
        setSubscribers(loadedSubscribers);
      } finally {
        setLoadingData(false);
      }
    },
    [onProductsUpdated]
  );

  useEffect(() => {
    if (!adminKey) return;
    let active = true;
    setAuthChecking(true);
    verifyAdminKey(adminKey).then((result) => {
      if (!active) return;
      setAuthChecking(false);
      if (result.ok) {
        setAuthenticated(true);
        setMode(result.mode);
        loadDashboardData(adminKey);
      } else {
        setAuthenticated(false);
        try {
          sessionStorage.removeItem(SESSION_KEY_STORAGE);
        } catch {
          // ignore
        }
      }
    });
    return () => {
      active = false;
    };
  }, [adminKey, loadDashboardData]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthChecking(true);
    const trimmed = keyInput.trim();
    const res = await verifyAdminKey(trimmed);
    setAuthChecking(false);
    if (!res.ok) {
      setAuthError(res.error || "Invalid admin key.");
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY_STORAGE, trimmed);
    } catch {
      // ignore
    }
    setMode(res.mode);
    setAdminKey(trimmed);
    setAuthenticated(true);
    loadDashboardData(trimmed);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY_STORAGE);
    } catch {
      // ignore
    }
    setAdminKey("");
    setKeyInput("");
    setAuthenticated(false);
  };

  const handleStatusChange = async (order: AdminOrder, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderCode === order.orderCode ? { ...o, status: nextStatus } : o
      )
    );
    const ok = await updateAdminOrderStatus(adminKey, order.orderCode, nextStatus);
    if (ok) {
      showToast(`${order.orderCode} → ${nextStatus}`);
    } else {
      showToast("Failed to update status — please retry.");
      loadDashboardData(adminKey);
    }
  };

  const handleAdjustStock = async (product: GarmentProduct, delta: number) => {
    const nextStock = Math.max(0, (product.stockQty ?? 10) + delta);
    const nextScarcity =
      nextStock === 0
        ? "Sold Out"
        : nextStock <= 4
        ? `Only ${nextStock} left`
        : "In Stock";

    const updated = await patchAdminProduct(adminKey, product.id, {
      stockQty: nextStock,
      scarcity: nextScarcity,
    });
    if (updated) {
      onProductsUpdated(
        products.map((p) => (p.id === product.id ? updated : p))
      );
      showToast(`${product.sku} stock updated → ${nextStock}`);
    }
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.sku.trim()) return;
    setSavingProduct(true);

    const priceNum = Math.max(0, Math.round(Number(formState.price) || 0));
    const compareNum = formState.compareAt.trim()
      ? Math.max(0, Math.round(Number(formState.compareAt) || 0))
      : null;
    const stockNum = Math.max(0, Math.round(Number(formState.stockQty) || 0));
    const existing = products.find((p) => p.id === formState.id);

    const nextProduct: GarmentProduct = {
      id: formState.isEditing ? formState.id : slugifyId(formState.name),
      sku: formState.sku.trim().toUpperCase(),
      brand: formState.brand,
      brandLabel: `${BRAND_NAME} · ${formState.brand}`,
      name: formState.name.trim().toUpperCase(),
      category: formState.category,
      price: priceNum,
      compareAt: compareNum && compareNum > priceNum ? compareNum : null,
      badge: computeBadge(
        priceNum,
        compareNum && compareNum > priceNum ? compareNum : null,
        existing?.badge || "NEW"
      ),
      scarcity:
        stockNum === 0
          ? "Sold Out"
          : formState.scarcity.trim() || "In Stock",
      swatches: existing?.swatches ?? ["#18191c", "#4e5157"],
      swatchDetails: existing?.swatchDetails ?? [
        { hex: "#18191c", name: "Washed Obsidian", filterStyle: "none" },
        {
          hex: "#4e5157",
          name: "Concrete Slate",
          filterStyle: "brightness(1.06) contrast(0.95)",
        },
      ],
      image: formState.image.trim() || "/images/washed_black_zip_jacket_1795380641700.jpg",
      hoverImage:
        formState.hoverImage.trim() ||
        formState.image.trim() ||
        "/assets/products/washed-black-zip-jacket-back.webp",
      fabricWeight: formState.fabricWeight.trim() || "400 GSM Heavyweight",
      composition: formState.composition.trim() || "100% Cotton",
      washProcess: formState.washProcess.trim() || "Enzyme Garment Wash",
      fitProfile: formState.fitProfile.trim() || "Boxy Street Cut",
      description:
        formState.description.trim().length >= 10
          ? formState.description.trim()
          : "Heavyweight Giza archive garment crafted for everyday street rotation.",
      availableSizes:
        formState.availableSizes.length > 0
          ? formState.availableSizes
          : ["S", "M", "L", "XL"],
      stockQty: stockNum,
      featuredRank: existing?.featuredRank ?? products.length + 1,
    };

    const saved = await upsertAdminProduct(adminKey, nextProduct);
    setSavingProduct(false);
    if (!saved) {
      showToast("Failed to save product — check required fields.");
      return;
    }

    const existsInList = products.some((p) => p.id === saved.id);
    onProductsUpdated(
      existsInList
        ? products.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...products]
    );
    setEditorOpen(false);
    showToast(
      existsInList ? `Saved ${saved.sku}` : `Added ${saved.name} to archive`
    );
  };

  const handleDeleteProduct = async (product: GarmentProduct) => {
    const res = await deleteAdminProduct(adminKey, product.id);
    if (!res.ok) {
      showToast(res.error || "Could not delete product.");
      return;
    }
    onProductsUpdated(products.filter((p) => p.id !== product.id));
    showToast(`Removed ${product.sku} from archive`);
  };

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      const matchQuery =
        !q ||
        order.orderCode.toLowerCase().includes(q) ||
        (order.customerName || "").toLowerCase().includes(q) ||
        (order.customerPhone || "").toLowerCase().includes(q) ||
        (order.shippingCity || "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, orderSearch]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const kpis = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "CANCELLED");
    const revenue = activeOrders.reduce((sum, o) => sum + o.totalEgp, 0);
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    const lowStockCount = products.filter((p) => (p.stockQty ?? 10) <= 4).length;
    return {
      revenue,
      activeCount: activeOrders.length,
      pendingCount,
      lowStockCount,
    };
  }, [orders, products]);

  const handleExportOrdersCsv = () => {
    const headers = [
      "Order Ref",
      "Date",
      "Status",
      "Customer Name",
      "Phone",
      "City",
      "Address",
      "Items",
      "Payment Method",
      "Promo Code",
      "Total EGP",
    ];
    const rows = filteredOrders.map((o) => [
      o.orderCode,
      new Date(o.createdAt).toLocaleString("en-EG"),
      o.status,
      o.customerName,
      o.customerPhone,
      o.shippingCity,
      o.shippingAddress,
      o.items
        .map((it) => `${it.quantity}x ${it.productName} (${it.size})`)
        .join(" | "),
      o.paymentMethod,
      o.promoCode ?? "",
      o.totalEgp,
    ]);
    downloadCsv(
      `saintv-giza-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows
    );
    showToast(`Exported ${filteredOrders.length} orders to Courier CSV`);
  };

  const handleExportSubscribersCsv = () => {
    downloadCsv(
      `saintv-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Email", "Source", "Subscribed At"],
      subscribers.map((s) => [s.email, s.source, s.createdAt])
    );
    showToast(`Exported ${subscribers.length} subscriber emails`);
  };

  if (!authenticated) {
    return (
      <div className="admin-auth-shell">
        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <span className="brand-word">{LINE_A}</span>
            <svg
              className="compass-star"
              viewBox="0 0 64 64"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={COMPASS_STAR_PATH} />
            </svg>
            <span className="brand-word">{LINE_B}</span>
          </div>

          <p className="admin-auth-eyebrow mono">
            GIZA OPERATIONS CONSOLE // OWNER ACCESS
          </p>
          <h1>ADMIN SIGN IN</h1>
          <p className="admin-auth-sub">
            Manage Giza COD dispatch orders, export courier sheets, adjust drop
            inventory, and publish new archive garments.
          </p>

          <form className="admin-auth-form" onSubmit={handleLogin}>
            <label className="mono" htmlFor="admin-key-input">
              ADMIN API KEY
            </label>
            <div className="admin-key-input-wrap">
              <KeyRound size={15} aria-hidden="true" />
              <input
                id="admin-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter ADMIN_API_KEY..."
                autoFocus
              />
            </div>

            {authError ? (
              <p className="admin-auth-error mono">{authError}</p>
            ) : null}

            <button
              type="submit"
              className="pill-btn solid-dark admin-auth-submit"
              disabled={authChecking}
            >
              {authChecking ? "VERIFYING ACCESS..." : "UNLOCK OPERATIONS CONSOLE"}
            </button>
          </form>

          {!remoteConfigured ? (
            <div className="admin-demo-hint mono">
              <span>LOCAL DEMO MODE · KEY: {DEMO_ADMIN_KEY}</span>
              <button
                type="button"
                onClick={() => setKeyInput(DEMO_ADMIN_KEY)}
              >
                AUTO-FILL
              </button>
            </div>
          ) : null}

          <button
            type="button"
            className="admin-back-store-link mono"
            onClick={onExitAdmin}
          >
            <ArrowLeft size={13} aria-hidden="true" />
            <span>RETURN TO STOREFRONT</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <div className="admin-brand-inline">
              <span className="brand-word">{LINE_A}</span>
              <svg
                className="compass-star"
                viewBox="0 0 64 64"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={COMPASS_STAR_PATH} />
              </svg>
              <span className="brand-word">{LINE_B}</span>
            </div>
            <span className="admin-env-pill mono">
              <i
                className={`admin-env-dot${mode === "live" ? " is-live" : ""}`}
                aria-hidden="true"
              />
              {mode === "live" ? "LIVE POSTGRES" : "LOCAL DEMO MODE"}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-top-btn mono"
              onClick={() => loadDashboardData(adminKey)}
              disabled={loadingData}
            >
              <RefreshCw
                size={13}
                className={loadingData ? "is-spinning" : ""}
                aria-hidden="true"
              />
              <span>REFRESH</span>
            </button>
            <button
              type="button"
              className="admin-top-btn mono"
              onClick={onExitAdmin}
            >
              <ExternalLink size={13} aria-hidden="true" />
              <span>VIEW STOREFRONT</span>
            </button>
            <button
              type="button"
              className="admin-top-btn is-danger mono"
              onClick={handleLogout}
            >
              <LogOut size={13} aria-hidden="true" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {toast ? (
          <div className="admin-toast mono" role="status">
            {toast}
          </div>
        ) : null}

        <section className="admin-kpi-grid" aria-label="Store metrics">
          <div className="admin-kpi-card is-dark">
            <span className="admin-kpi-label mono">GROSS REVENUE</span>
            <strong className="admin-kpi-value mono">
              {formatEGP(kpis.revenue)}
            </strong>
            <span className="admin-kpi-sub mono">
              EXCLUDING CANCELLED ORDERS
            </span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label mono">ACTIVE ORDERS</span>
            <strong className="admin-kpi-value">{kpis.activeCount}</strong>
            <span className="admin-kpi-sub mono">
              {kpis.pendingCount} AWAITING CONFIRMATION
            </span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label mono">ARCHIVE CATALOG</span>
            <strong className="admin-kpi-value">{products.length}</strong>
            <span className="admin-kpi-sub mono">
              {kpis.lowStockCount} LOW-STOCK PIECES (≤ 4)
            </span>
          </div>

          <div className="admin-kpi-card">
            <span className="admin-kpi-label mono">DROP SUBSCRIBERS</span>
            <strong className="admin-kpi-value">{subscribers.length}</strong>
            <span className="admin-kpi-sub mono">EARLY-ACCESS DISPATCH LIST</span>
          </div>
        </section>

        <div className="admin-tabs-bar">
          <div className="admin-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "orders"}
              className={`admin-tab${activeTab === "orders" ? " active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag size={14} aria-hidden="true" />
              <span>ORDERS &amp; DISPATCH ({orders.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "products"}
              className={`admin-tab${activeTab === "products" ? " active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <Package size={14} aria-hidden="true" />
              <span>PRODUCTS &amp; STOCK ({products.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "subscribers"}
              className={`admin-tab${
                activeTab === "subscribers" ? " active" : ""
              }`}
              onClick={() => setActiveTab("subscribers")}
            >
              <Mail size={14} aria-hidden="true" />
              <span>SUBSCRIBERS ({subscribers.length})</span>
            </button>
          </div>
        </div>

        {activeTab === "orders" ? (
          <section className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-filter-pills">
                {(["ALL", ...ORDER_STATUSES] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`cat-pill${
                      statusFilter === status ? " active" : ""
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="admin-toolbar-right">
                <div className="admin-search-box">
                  <Search size={14} aria-hidden="true" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order ref, phone, city..."
                    aria-label="Search orders"
                  />
                </div>
                <button
                  type="button"
                  className="pill-btn solid-dark admin-export-btn"
                  onClick={handleExportOrdersCsv}
                  disabled={filteredOrders.length === 0}
                >
                  <Download size={13} aria-hidden="true" />
                  <span>EXPORT COURIER CSV</span>
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty-box mono">
                NO ORDERS MATCH THIS FILTER.
              </div>
            ) : (
              <div className="admin-orders-list">
                {filteredOrders.map((order) => (
                  <article key={order.orderCode} className="admin-order-card">
                    <div className="admin-order-top">
                      <div className="admin-order-meta mono">
                        <strong className="admin-order-code">
                          {order.orderCode}
                        </strong>
                        <span className="admin-pill-tag">
                          {order.paymentMethod}
                        </span>
                        {order.promoCode ? (
                          <span className="admin-pill-tag is-promo">
                            {order.promoCode}
                          </span>
                        ) : null}
                        <span className="admin-order-date">
                          {new Date(order.createdAt).toLocaleString("en-EG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="admin-order-status-wrap">
                        <span
                          className={`admin-status-dot status-${order.status.toLowerCase()}`}
                          aria-hidden="true"
                        />
                        <select
                          className={`admin-status-select mono status-${order.status.toLowerCase()}`}
                          value={order.status}
                          aria-label={`Status for order ${order.orderCode}`}
                          onChange={(e) =>
                            handleStatusChange(
                              order,
                              e.target.value as OrderStatus
                            )
                          }
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="admin-order-body">
                      <div className="admin-order-customer">
                        <div className="admin-customer-name">
                          {order.customerName || "Guest Customer"}
                        </div>
                        <div className="admin-customer-contact mono">
                          <span>{order.customerPhone || "No phone"}</span>
                          {order.customerPhone ? (
                            <a
                              href={formatEgyptWhatsApp(
                                order.customerPhone,
                                order
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-wa-btn"
                            >
                              <MessageCircle size={12} aria-hidden="true" />
                              <span>WHATSAPP</span>
                            </a>
                          ) : null}
                        </div>
                        <div className="admin-customer-address">
                          <strong>{order.shippingCity}</strong> —{" "}
                          {order.shippingAddress || "Address pending"}
                        </div>
                      </div>

                      <div className="admin-order-items">
                        {order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div
                              key={`${order.orderCode}-${item.productId}-${idx}`}
                              className="admin-order-line mono"
                            >
                              <span>
                                {item.quantity}× {item.productName} ({item.size}
                                )
                              </span>
                              <span>
                                {formatEGP(item.unitPriceEgp * item.quantity)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="admin-order-line mono">
                            <span>Order line items archived</span>
                          </div>
                        )}
                      </div>

                      <div className="admin-order-total mono">
                        {order.discountEgp > 0 ? (
                          <span className="admin-order-discount">
                            − {formatEGP(order.discountEgp)}
                          </span>
                        ) : null}
                        <strong>{formatEGP(order.totalEgp)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === "products" ? (
          <section className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={14} aria-hidden="true" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search SKU, piece name, category..."
                  aria-label="Search products"
                />
              </div>

              <button
                type="button"
                className="pill-btn solid-dark admin-export-btn"
                onClick={() => {
                  setFormState(emptyProductForm());
                  setEditorOpen(true);
                }}
              >
                <Plus size={14} aria-hidden="true" />
                <span>ADD NEW PIECE</span>
              </button>
            </div>

            <div className="admin-products-list">
              {filteredProducts.map((product) => {
                const qty = product.stockQty ?? 12;
                return (
                  <div key={product.id} className="admin-product-row">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-prod-thumb"
                    />
                    <div className="admin-prod-info">
                      <div className="admin-prod-sku mono">
                        {product.sku} · {product.brand} · {product.category}
                      </div>
                      <div className="admin-prod-name">{product.name}</div>
                      <div className="admin-prod-sizes mono">
                        SIZES: {product.availableSizes.join(" / ")} ·{" "}
                        <span
                          className={
                            qty === 0
                              ? "is-soldout"
                              : qty <= 4
                              ? "is-low"
                              : ""
                          }
                        >
                          {product.scarcity}
                        </span>
                      </div>
                    </div>

                    <div className="admin-prod-price mono">
                      <strong>{formatEGP(product.price)}</strong>
                      {product.compareAt ? (
                        <span className="admin-prod-compare">
                          LE {product.compareAt.toLocaleString("en-US")}
                        </span>
                      ) : null}
                    </div>

                    <div className="admin-stock-stepper mono">
                      <span className="admin-stock-label">STOCK</span>
                      <div className="admin-stock-controls">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(product, -1)}
                          aria-label={`Decrease stock for ${product.name}`}
                        >
                          −
                        </button>
                        <strong>{qty}</strong>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(product, 1)}
                          aria-label={`Increase stock for ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="admin-prod-actions">
                      <button
                        type="button"
                        className="admin-icon-action"
                        onClick={() => {
                          setFormState(productToForm(product));
                          setEditorOpen(true);
                        }}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                        <span>EDIT</span>
                      </button>
                      <button
                        type="button"
                        className="admin-icon-action is-delete"
                        onClick={() => handleDeleteProduct(product)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="admin-panel">
            <div className="admin-toolbar">
              <div className="section-meta">
                EARLY-ACCESS DROP DISPATCH LIST ({subscribers.length})
              </div>
              <button
                type="button"
                className="pill-btn solid-dark admin-export-btn"
                onClick={handleExportSubscribersCsv}
                disabled={subscribers.length === 0}
              >
                <Download size={13} aria-hidden="true" />
                <span>EXPORT EMAILS CSV</span>
              </button>
            </div>

            {subscribers.length === 0 ? (
              <div className="admin-empty-box mono">
                NO SUBSCRIBERS YET. FOOTER SIGNUPS APPEAR HERE AUTOMATICALLY.
              </div>
            ) : (
              <div className="admin-subs-list">
                {subscribers.map((sub) => (
                  <div key={String(sub.id)} className="admin-sub-row mono">
                    <strong>{sub.email}</strong>
                    <span>SOURCE: {sub.source.toUpperCase()}</span>
                    <span>
                      {new Date(sub.createdAt).toLocaleDateString("en-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {editorOpen ? (
        <div
          className="pdp-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={formState.isEditing ? "Edit product" : "Add new product"}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditorOpen(false);
          }}
        >
          <form className="admin-editor-modal" onSubmit={handleSaveProduct}>
            <div className="admin-editor-head">
              <h3>
                {formState.isEditing
                  ? `EDIT ARCHIVE PIECE // ${formState.sku}`
                  : "ADD NEW ARCHIVE PIECE"}
              </h3>
              <button
                type="button"
                className="cart-close-btn"
                onClick={() => setEditorOpen(false)}
                aria-label="Close editor"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="admin-editor-body">
              <div className="admin-editor-grid">
                <div className="checkout-field admin-span-2">
                  <label className="mono" htmlFor="ed-name">
                    GARMENT NAME *
                  </label>
                  <input
                    id="ed-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="e.g. WASHED OBSIDIAN HEAVYWEIGHT ZIP HOODIE"
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-sku">
                    SKU *
                  </label>
                  <input
                    id="ed-sku"
                    type="text"
                    required
                    value={formState.sku}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, sku: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-brand">
                    COLLECTION LINE
                  </label>
                  <select
                    id="ed-brand"
                    value={formState.brand}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, brand: e.target.value }))
                    }
                  >
                    <option value={LINE_A}>{LINE_A}</option>
                    <option value={LINE_B}>{LINE_B}</option>
                  </select>
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-cat">
                    CATEGORY
                  </label>
                  <select
                    id="ed-cat"
                    value={formState.category}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        category: e.target.value as GarmentCategory,
                      }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-price">
                    PRICE (EGP) *
                  </label>
                  <input
                    id="ed-price"
                    type="number"
                    min={0}
                    required
                    value={formState.price}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-compare">
                    COMPARE-AT PRICE (OPTIONAL)
                  </label>
                  <input
                    id="ed-compare"
                    type="number"
                    min={0}
                    value={formState.compareAt}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, compareAt: e.target.value }))
                    }
                    placeholder="Leave blank if no sale"
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-stock">
                    STOCK QUANTITY
                  </label>
                  <input
                    id="ed-stock"
                    type="number"
                    min={0}
                    value={formState.stockQty}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, stockQty: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-scarcity">
                    SCARCITY / BADGE NOTE
                  </label>
                  <input
                    id="ed-scarcity"
                    type="text"
                    value={formState.scarcity}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, scarcity: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field admin-span-2">
                  <span className="mono checkout-label">AVAILABLE SIZES</span>
                  <div className="admin-size-checks">
                    {ALL_SIZES.map((sz) => {
                      const active = formState.availableSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          className={`pdp-size-pill mono${
                            active ? " active" : ""
                          }`}
                          onClick={() =>
                            setFormState((s) => {
                              const next = active
                                ? s.availableSizes.filter((x) => x !== sz)
                                : [...s.availableSizes, sz];
                              return {
                                ...s,
                                availableSizes: next.length > 0 ? next : [sz],
                              };
                            })
                          }
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-image">
                    STUDIO IMAGE URL
                  </label>
                  <input
                    id="ed-image"
                    type="text"
                    value={formState.image}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, image: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-hover">
                    FULL LOOK IMAGE URL
                  </label>
                  <input
                    id="ed-hover"
                    type="text"
                    value={formState.hoverImage}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, hoverImage: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-fabric">
                    FABRIC WEIGHT
                  </label>
                  <input
                    id="ed-fabric"
                    type="text"
                    value={formState.fabricWeight}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        fabricWeight: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label className="mono" htmlFor="ed-fit">
                    SILHOUETTE / FIT
                  </label>
                  <input
                    id="ed-fit"
                    type="text"
                    value={formState.fitProfile}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        fitProfile: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="checkout-field admin-span-2">
                  <label className="mono" htmlFor="ed-desc">
                    GARMENT DESCRIPTION
                  </label>
                  <textarea
                    id="ed-desc"
                    rows={3}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="admin-editor-foot">
              <button
                type="button"
                className="pill-btn outline-dark"
                onClick={() => setEditorOpen(false)}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="pill-btn solid-dark"
                disabled={savingProduct}
              >
                {savingProduct ? "SAVING..." : "SAVE TO ARCHIVE"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
