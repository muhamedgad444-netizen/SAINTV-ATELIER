import { FormEvent, useEffect, useState } from "react";
import { CartEntry, GarmentProduct, GarmentSize } from "../data/catalog";
import { submitOrder } from "../lib/api";

interface CartDrawerProps {
  open: boolean;
  items: CartEntry[];
  upsellProduct: GarmentProduct | undefined;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onAddUpsell: (product: GarmentProduct, size: GarmentSize) => void;
}

type DrawerStep = "bag" | "checkout" | "confirmed";

export function CartDrawer({
  open,
  items,
  upsellProduct,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onAddUpsell,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>("bag");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingCity, setShippingCity] = useState("Giza");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [formError, setFormError] = useState<string | null>(null);

  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("bag");
    setFormError(null);
    setSubmitting(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const totalCount = items.reduce((sum, entry) => sum + entry.qty, 0);
  const subtotalEgp = items.reduce(
    (sum, entry) => sum + entry.qty * entry.item.price,
    0
  );

  const promoEligible = appliedPromo === "GIZA26" && subtotalEgp >= 2999;
  const discountEgp = promoEligible ? Math.round(subtotalEgp * 0.1) : 0;
  const totalEgp = Math.max(0, subtotalEgp - discountEgp);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === "GIZA26") {
      setAppliedPromo("GIZA26");
      if (subtotalEgp >= 2999) {
        setPromoFeedback("GIZA26 APPLIED · 10% OFF ACTIVE");
      } else {
        const diff = 2999 - subtotalEgp;
        setPromoFeedback(
          `GIZA26 SAVED · ADD LE ${diff.toLocaleString()} MORE FOR 10% OFF`
        );
      }
    } else {
      setAppliedPromo(null);
      setPromoFeedback("INVALID CODE · TRY GIZA26 (ORDERS OVER 2,999 EGP)");
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setFormError("Please enter your full name, phone number, and delivery address.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    const result = await submitOrder(items, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingCity: shippingCity.trim() || "Giza",
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      promoCode: promoEligible ? "GIZA26" : undefined,
    });
    setOrderCode(result.orderCode);
    setSubmitting(false);
    setStep("confirmed");
  };

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
          <h4>
            {step === "bag"
              ? `UNDERGROUND BAG (${totalCount})`
              : step === "checkout"
              ? "GIZA DISPATCH CHECKOUT"
              : "ORDER CONFIRMED"}
          </h4>
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

        {step === "bag" ? (
          <>
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
                        SIZE: {entry.size} · LE{" "}
                        {entry.item.price.toLocaleString()}
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
                    {upsellProduct.name} — LE{" "}
                    {upsellProduct.price.toLocaleString()}
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
              <form className="cart-promo-form" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="PROMO CODE (TRY GIZA26)"
                  aria-label="Promo code"
                  className="mono"
                />
                <button type="submit">APPLY</button>
              </form>
              {promoFeedback ? (
                <div
                  className={`cart-promo-msg mono${
                    promoEligible ? " is-valid" : ""
                  }`}
                >
                  {promoFeedback}
                </div>
              ) : null}

              <div className="cart-summary-lines mono">
                <div className="cart-summary-row">
                  <span>SUBTOTAL</span>
                  <span>LE {subtotalEgp.toLocaleString()}.00 EGP</span>
                </div>
                {discountEgp > 0 ? (
                  <div className="cart-summary-row is-discount">
                    <span>DISCOUNT (GIZA26 · 10%)</span>
                    <span>− LE {discountEgp.toLocaleString()}.00 EGP</span>
                  </div>
                ) : null}
                <div className="cart-subtotal">
                  <span>TOTAL</span>
                  <span>LE {totalEgp.toLocaleString()}.00 EGP</span>
                </div>
              </div>

              <button
                type="button"
                className="pill-btn solid-dark"
                style={{ width: "100%", padding: "15px" }}
                disabled={items.length === 0}
                onClick={() => setStep("checkout")}
              >
                PROCEED TO CHECKOUT ›
              </button>
            </div>
          </>
        ) : step === "checkout" ? (
          <form className="cart-checkout-wrap" onSubmit={handlePlaceOrder}>
            <div className="cart-items">
              <button
                type="button"
                className="cart-back-link mono"
                onClick={() => setStep("bag")}
              >
                ‹ BACK TO BAG ({totalCount} ITEMS)
              </button>

              <div className="checkout-field">
                <label className="mono" htmlFor="checkout-name">
                  FULL NAME *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Mohamed Gad"
                />
              </div>

              <div className="checkout-field">
                <label className="mono" htmlFor="checkout-phone">
                  PHONE / WHATSAPP *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01X XXXX XXXX"
                />
              </div>

              <div className="checkout-field">
                <label className="mono" htmlFor="checkout-city">
                  GOVERNORATE / CITY
                </label>
                <select
                  id="checkout-city"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                >
                  <option value="Giza">Giza (Sheikh Zayed / 6th Oct / Dokki / Mohandessin)</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Delta">Delta Governorates</option>
                  <option value="Upper Egypt">Upper Egypt</option>
                  <option value="International">Worldwide Express</option>
                </select>
              </div>

              <div className="checkout-field">
                <label className="mono" htmlFor="checkout-address">
                  STREET &amp; APARTMENT ADDRESS *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Building, street, floor, landmark"
                />
              </div>

              <div className="checkout-field">
                <span className="mono checkout-label">PAYMENT METHOD</span>
                <div className="checkout-pay-row">
                  <button
                    type="button"
                    className={`checkout-pay-pill mono${
                      paymentMethod === "COD" ? " active" : ""
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    CASH ON DELIVERY
                  </button>
                  <button
                    type="button"
                    className={`checkout-pay-pill mono${
                      paymentMethod === "CARD" ? " active" : ""
                    }`}
                    onClick={() => setPaymentMethod("CARD")}
                  >
                    PREPAID CARD (FREE SHIP)
                  </button>
                </div>
              </div>

              {formError ? (
                <div className="checkout-error mono">{formError}</div>
              ) : null}
            </div>

            <div className="cart-foot">
              <div className="cart-subtotal mono">
                <span>TOTAL DUE ({paymentMethod})</span>
                <span>LE {totalEgp.toLocaleString()}.00 EGP</span>
              </div>
              <button
                type="submit"
                className="pill-btn solid-dark"
                style={{ width: "100%", padding: "15px" }}
                disabled={submitting}
              >
                {submitting
                  ? "CONFIRMING WITH GIZA DISPATCH..."
                  : `🔒 PLACE ORDER — LE ${totalEgp.toLocaleString()} EGP`}
              </button>
            </div>
          </form>
        ) : (
          <div className="cart-confirmed-box">
            <div className="cart-confirmed-badge mono">GIZA COURIER DISPATCHED ✓</div>
            <h5>THANK YOU, {customerName.toUpperCase() || "MEMBER"}</h5>
            <p className="mono cart-confirmed-code">ORDER REF: {orderCode}</p>
            <p className="cart-confirmed-note">
              Your SAINTV archive order ({totalCount}{" "}
              {totalCount === 1 ? "piece" : "pieces"} · LE{" "}
              {totalEgp.toLocaleString()}.00 EGP · {paymentMethod}) is logged
              for delivery to <strong>{shippingCity}</strong> within 2–5 working
              days.
            </p>
            <button
              type="button"
              className="pill-btn solid-dark"
              style={{ width: "100%", padding: "14px" }}
              onClick={onClose}
            >
              CONTINUE BROWSING ARCHIVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
