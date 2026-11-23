import { useEffect, useState } from "react";
import { GarmentProduct, GarmentSize } from "../data/catalog";

interface ProductModalProps {
  product: GarmentProduct | null;
  swatchIndex: number;
  onClose: () => void;
  onAddToBag: (product: GarmentProduct, size: GarmentSize) => void;
}

export function ProductModal({
  product,
  swatchIndex,
  onClose,
  onAddToBag,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<GarmentSize>("M");
  const [sizeChartExpanded, setSizeChartExpanded] = useState(false);

  useEffect(() => {
    if (!product) return;
    const defaultSize = product.availableSizes.includes("M")
      ? "M"
      : product.availableSizes[0];
    setSelectedSize(defaultSize);
    setSizeChartExpanded(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const filterStyle =
    product.swatchDetails[swatchIndex]?.filterStyle ?? "none";

  const urgencyText =
    selectedSize === "S" || selectedSize === "M"
      ? `✦ SELLING FAST · Only ${selectedSize === "S" ? 3 : 5} left in ${selectedSize}`
      : `✓ IN STOCK · Ready for Cairo Dispatch (${selectedSize})`;

  return (
    <div
      className="pdp-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdpModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pdp-modal">
        <button
          type="button"
          className="pdp-close"
          onClick={onClose}
          aria-label="Close product preview"
        >
          ✕
        </button>

        <div className="pdp-gallery">
          <img
            src={product.image}
            alt={product.name}
            style={{ filter: filterStyle }}
          />
        </div>

        <div className="pdp-details">
          <div className="pdp-brand-pill mono">{product.brandLabel}</div>
          <h3 id="pdpModalTitle" className="pdp-title">
            {product.name}
          </h3>
          <div className="pdp-urgency mono">{urgencyText}</div>
          <div className="pdp-price mono">
            LE {product.price.toLocaleString()}.00 EGP
          </div>

          <div className="pdp-size-header">
            <span>SELECT SIZE</span>
            <button
              type="button"
              className="mono"
              style={{ textDecoration: "underline" }}
              onClick={() => setSizeChartExpanded((prev) => !prev)}
            >
              {sizeChartExpanded
                ? "CHEST: S 60×66cm · M 63×69cm · L 66×72cm · XL 69×74cm (BOXY)"
                : "SIZE CHART (CM)"}
            </button>
          </div>

          <div className="pdp-sizes">
            {product.availableSizes.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`pdp-size-pill mono${
                  sz === selectedSize ? " active" : ""
                }`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="fit-meter-box">
            <div className="fit-meter-labels mono">
              <span>Small</span>
              <span>True / Boxy Cut</span>
              <span>Oversized</span>
            </div>
            <div className="fit-segments">
              <div className="fit-seg" />
              <div className="fit-seg" />
              <div className="fit-seg active" />
              <div className="fit-seg active" />
              <div className="fit-seg" />
            </div>
          </div>

          <button
            type="button"
            className="pill-btn solid-dark"
            style={{ width: "100%", padding: "15px" }}
            onClick={() => {
              onAddToBag(product, selectedSize);
              onClose();
            }}
          >
            ADD TO UNDERGROUND BAG
          </button>

          <div className="trust-row mono">
            <div>CASH ON DELIVERY</div>
            <div>2–5 DAYS SHIPPING</div>
            <div>24H EASY EXCHANGE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
