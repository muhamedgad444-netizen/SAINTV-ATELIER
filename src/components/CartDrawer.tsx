import { FormEvent, useEffect, useState } from "react";
import { Lock, X } from "lucide-react";
import {
  CartEntry,
  GarmentProduct,
  GarmentSize,
  formatEGP,
} from "../data/catalog";
import { submitOrder } from "../lib/api";

interface CartDrawerProps {
  open: boolean;
  items: CartEntry[];
  upsellProduct: GarmentProduct | undefined;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onAddUpsell: (product: GarmentProduct, size: GarmentSize) => void;
  onClearBag: () => void;
}

type DrawerStep = "bag" | "checkout" | "confirmed";

interface ConfirmedSnapshot {
  count: number;
  totalEgp: number;
  city: string;
  paymentMethod: "COD" | "CARD";
}

const PROMO_THRESHOLD = 2999;

export function CartDrawer({
  open,
  items,
  upsellProduct,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onAddUpsell,
  onClearBag,
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
  const [confirmedSummary, setConfirmedSummary] =
    useState<ConfirmedSnapshot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("bag");
    setFormError(null);
    setSubmitting(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
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

  const promoEligible =
    appliedPromo === "GIZA26" && subtotalEgp >= PROMO_THRESHOLD;
  const discountEgp = promoEligible ? Math.round(subtotalEgp * 0.1) : 0;
  const totalEgp = Math.max(0, subtotalEgp - discountEgp);
  const promoProgress = Math.min(100, Math.round((subtotalEgp / PROMO_THRESHOLD) * 100));
  const promoRemaining = Math.max(0, PROMO_THRESHOLD - subtotalEgp);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === "GIZA26") {
      setAppliedPromo("GIZA26");
      if (subtotalEgp >= PROMO_THRESHOLD) {
        setPromoFeedback("GIZA26 APPLIED · 10% OFF ACTIVE");
      } else {
        setPromoFeedback(
          `GIZA26 SAVED · ADD ${formatEGP(PROMO_THRESHOLD - subtotalEgp)} MORE FOR 10% OFF`
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
    const snapshot: ConfirmedSnapshot = {
      count: totalCount,
      totalEgp,
      city: shippingCity.trim() || "Giza",
      paymentMethod,
    };
    const result = await submitOrder(items, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingCity: snapshot.city,
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      promoCode: promoEligible ? "GIZA26" : undefined,
    });
    setOrderCode(result.orderCode);
    setConfirmedSummary(snapshot);
    setSubmitting(false);
    setAppliedPromo(null);
    setPromoInput("");
    setPromoFeedback(null);
    onClearBag();
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
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close bag"
          >
            <span>CLOSE</span>
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {step === "bag" ? (
          <>
            <div
              className={`cart-promo-banner mono${
                promoRemaining === 0 ? " is-unlocked" : ""
              }`}
            >
              <span>
                {promoRemaining === 0
                  ? promoEligible
                    ? "✓ 10% OFF UNLOCKED & ACTIVE (CODE: GIZA26)"
                    : "✓ 10% OFF UNLOCKED — APPLY CODE GIZA26 BELOW"
                  : `ADD ${formatEGP(promoRemaining)} MORE TO UNLOCK 10% OFF (CODE: GIZA26)`}
              </span>
              <div className="cart-promo-track" aria-hidden="true">
                <div
                  className="cart-promo-fill"
                  style={{ width: `${promoProgress}%` }}
                />
              </div>
            </div>

            <div className="cart-items">
              {items.length === 0 ? (
                <p className="cart-empty mono">
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
                      <div className="cart-item-brand mono">
                        {entry.item.brandLabel}
                      </div>
                      <div className="cart-item-name">{entry.item.name}</div>
                      <div className="cart-item-meta mono">
                        SIZE: {entry.size} · {formatEGP(entry.item.price)}
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-qty-control mono">
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
                        className="cart-remove-btn mono"
                        onClick={() => onRemoveItem(idx)}
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
                <div className="cart-upsell-copy">
                  <div className="cart-upsell-kicker mono">
                    ESSENTIAL ADD-ON
                  </div>
                  <div className="cart-upsell-title">{upsellProduct.name}</div>
                  <div className="cart-upsell-price mono">
                    {formatEGP(upsellProduct.price)}
                  </div>
                </div>
                <button
                  type="button"
                  className="pill-btn solid-dark cart-upsell-btn"
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
                  <span>{formatEGP(subtotalEgp)}</span>
                </div>
                {discountEgp > 0 ? (
                  <div className="cart-summary-row is-discount">
                    <span>DISCOUNT (GIZA26 · 10%)</span>
                    <span>− {formatEGP(discountEgp)}</span>
                  </div>
                ) : null}
                <div className="cart-subtotal">
                  <span>TOTAL</span>
                  <span>{formatEGP(totalEgp)}</span>
                </div>
              </div>

              <button
                type="button"
                className="pill-btn solid-dark cart-cta-btn"
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
                <span>{formatEGP(totalEgp)}</span>
              </div>
              <button
                type="submit"
                className="pill-btn solid-dark cart-cta-btn"
                disabled={submitting}
              >
                <Lock size={13} aria-hidden="true" />
                <span>
                  {submitting
                    ? "CONFIRMING WITH GIZA DISPATCH..."
                    : `PLACE ORDER — ${formatEGP(totalEgp)}`}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <div className="cart-confirmed-box">
            <div className="cart-confirmed-badge mono">GIZA COURIER DISPATCHED ✓</div>
            <h5>THANK YOU, {customerName.toUpperCase() || "MEMBER"}</h5>
            <p className="mono cart-confirmed-code">ORDER REF: {orderCode}</p>
            <p className="cart-confirmed-note">
              Your SAINTV archive order ({confirmedSummary?.count ?? 0}{" "}
              {(confirmedSummary?.count ?? 0) === 1 ? "piece" : "pieces"} ·{" "}
              {formatEGP(confirmedSummary?.totalEgp ?? 0)} ·{" "}
              {confirmedSummary?.paymentMethod ?? paymentMethod}) is logged for
              delivery to <strong>{confirmedSummary?.city ?? shippingCity}</strong>{" "}
              within 2–5 working days.
            </p>
            <button
              type="button"
              className="pill-btn solid-dark cart-cta-btn"
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
