import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GarmentProduct, GarmentSize, formatEGP } from "../data/catalog";

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
  const [activeSwatch, setActiveSwatch] = useState(swatchIndex);
  const [viewMode, setViewMode] = useState<"studio" | "look">("studio");
  const [sizeChartExpanded, setSizeChartExpanded] = useState(false);

  useEffect(() => {
    if (!product) return;
    const defaultSize = product.availableSizes.includes("M")
      ? "M"
      : product.availableSizes[0];
    setSelectedSize(defaultSize);
    setActiveSwatch(swatchIndex);
    setViewMode("studio");
    setSizeChartExpanded(false);
  }, [product, swatchIndex]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const hasAltView = Boolean(
    product.hoverImage && product.hoverImage !== product.image
  );
  const activeSrc =
    viewMode === "look" && hasAltView ? product.hoverImage : product.image;
  const isLookbookCutout = activeSrc.endsWith(".webp") && viewMode === "look";

  const currentSwatch =
    product.swatchDetails[activeSwatch] ?? product.swatchDetails[0];
  const filterStyle = currentSwatch?.filterStyle ?? "none";

  const urgencyText =
    selectedSize === "S" || selectedSize === "M"
      ? `✦ SELLING FAST · Only ${selectedSize === "S" ? 3 : 5} left in ${selectedSize}`
      : `✓ IN STOCK · Ready for Giza Dispatch (${selectedSize})`;

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
          <X size={16} aria-hidden="true" />
        </button>

        <div
          className={`pdp-gallery${isLookbookCutout ? " is-lookbook" : ""}`}
        >
          <img
            src={activeSrc}
            alt={product.name}
            style={{ filter: filterStyle }}
          />
          {hasAltView ? (
            <div className="pdp-view-toggle mono" role="group" aria-label="Product view">
              <button
                type="button"
                className={`pdp-view-btn${viewMode === "studio" ? " active" : ""}`}
                onClick={() => setViewMode("studio")}
              >
                Studio
              </button>
              <button
                type="button"
                className={`pdp-view-btn${viewMode === "look" ? " active" : ""}`}
                onClick={() => setViewMode("look")}
              >
                Full Look
              </button>
            </div>
          ) : null}
        </div>

        <div className="pdp-details">
          <div className="pdp-brand-pill mono">
            {product.brandLabel} · {product.sku}
          </div>
          <h3 id="pdpModalTitle" className="pdp-title">
            {product.name}
          </h3>
          <div className="pdp-urgency mono">{urgencyText}</div>
          <div className="pdp-price-row mono">
            <span
              className={`pdp-price${product.compareAt ? " is-sale" : ""}`}
            >
              {formatEGP(product.price)}
            </span>
            {product.compareAt ? (
              <span className="pdp-compare-price">
                LE {product.compareAt.toLocaleString("en-US")}
              </span>
            ) : null}
          </div>

          <p className="pdp-description">{product.description}</p>

          {product.swatchDetails.length > 0 ? (
            <div className="pdp-swatch-row">
              <span className="pdp-swatch-label mono">COLORWAY:</span>
              <div
                className="pdp-swatch-dots"
                role="group"
                aria-label="Select colorway"
              >
                {product.swatchDetails.map((swatch, idx) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    aria-label={`Colorway ${swatch.name}`}
                    aria-pressed={idx === activeSwatch}
                    className={`swatch-dot${
                      idx === activeSwatch ? " active" : ""
                    }`}
                    style={{ background: swatch.hex }}
                    onClick={() => setActiveSwatch(idx)}
                  />
                ))}
              </div>
              <span className="pdp-swatch-name mono">
                {currentSwatch?.name}
              </span>
            </div>
          ) : null}

          <dl className="pdp-spec-grid mono">
            <div>
              <dt>FABRIC</dt>
              <dd>{product.fabricWeight}</dd>
            </div>
            <div>
              <dt>COMPOSITION</dt>
              <dd>{product.composition}</dd>
            </div>
            <div>
              <dt>WASH</dt>
              <dd>{product.washProcess}</dd>
            </div>
            <div>
              <dt>SILHOUETTE</dt>
              <dd>{product.fitProfile}</dd>
            </div>
          </dl>

          <div className="pdp-size-header">
            <span>SELECT SIZE</span>
            <button
              type="button"
              className="pdp-size-chart-btn mono"
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
            className="pill-btn solid-dark pdp-add-btn"
            onClick={() => {
              onAddToBag(product, selectedSize);
              onClose();
            }}
          >
            ADD TO UNDERGROUND BAG — {formatEGP(product.price)}
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
