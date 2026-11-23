import { useEffect, useState } from "react";
import { CartEntry, GarmentProduct, GarmentSize } from "../data/catalog";

interface CartDrawerProps {
  open: boolean;
  items: CartEntry[];
  upsellProduct: GarmentProduct | undefined;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onAddUpsell: (product: GarmentProduct, size: GarmentSize) => void;
}

export function CartDrawer({
  open,
  items,
  upsellProduct,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onAddUpsell,
}: CartDrawerProps) {
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCheckedOut(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const totalCount = items.reduce((sum, entry) => sum + entry.qty, 0);
  const totalEgp = items.reduce(
    (sum, entry) => sum + entry.qty * entry.item.price,
    0
  );

  return (
    <div
      className="cart-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cart-drawer">
        <div className="cart-head">
          <h4>UNDERGROUND BAG ({totalCount})</h4>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            CLOSE ✕
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p
              className="mono"
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              YOUR UNDERGROUND BAG IS EMPTY
            </p>
          ) : (
            items.map((entry, idx) => (
              <div
                key={`${entry.item.id}-${entry.size}`}
                className="cart-item"
              >
                <img src={entry.item.image} alt={entry.item.name} />
                <div>
                  <div
                    className="mono"
                    style={{ fontSize: "9px", color: "var(--muted)" }}
                  >
                    {entry.item.brandLabel}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      margin: "2px 0",
                    }}
                  >
                    {entry.item.name}
                  </div>
                  <div className="mono" style={{ fontSize: "10px" }}>
                    SIZE: {entry.size} · LE {entry.item.price.toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "6px",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "99px",
                      padding: "2px 10px",
                      fontSize: "11px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onUpdateQty(idx, -1)}
                      aria-label={`Decrease quantity of ${entry.item.name}`}
                    >
                      −
                    </button>
                    <span>{entry.qty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(idx, 1)}
                      aria-label={`Increase quantity of ${entry.item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mono"
                    onClick={() => onRemoveItem(idx)}
                    style={{
                      fontSize: "9px",
                      textDecoration: "underline",
                      color: "var(--muted)",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {upsellProduct ? (
          <div className="cart-upsell">
            <div>
              <div
                className="mono"
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "var(--coddi-red)",
                  letterSpacing: "0.14em",
                }}
              >
                ESSENTIAL ADD-ON
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                CRIMSON WASHED BOXY TEE — LE {upsellProduct.price}
              </div>
            </div>
            <button
              type="button"
              className="pill-btn solid-dark"
              style={{ padding: "7px 14px", fontSize: "9px" }}
              onClick={() => onAddUpsell(upsellProduct, "L")}
            >
              + ADD
            </button>
          </div>
        ) : null}

        <div className="cart-foot">
          <div className="cart-subtotal mono">
            <span>SUBTOTAL</span>
            <span>LE {totalEgp.toLocaleString()}.00 EGP</span>
          </div>
          <button
            type="button"
            className="pill-btn solid-dark"
            style={{ width: "100%", padding: "15px" }}
            onClick={() => setCheckedOut(true)}
          >
            {checkedOut
              ? "ORDER DISPATCHED — CAIRO COURIER ✓"
              : "🔒 CHECK OUT — CASH ON DELIVERY / CARD"}
          </button>
        </div>
      </div>
    </div>
  );
}
