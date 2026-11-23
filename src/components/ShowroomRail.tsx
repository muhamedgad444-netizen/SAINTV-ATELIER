import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, ZoomIn } from "lucide-react";
import {
  GarmentCategory,
  GarmentProduct,
  GarmentSize,
  RAIL_FEATURED_IDS,
  formatEGP,
} from "../data/catalog";

interface ShowroomRailProps {
  products: GarmentProduct[];
  onInspect: (product: GarmentProduct, swatchIndex: number) => void;
  onQuickAdd: (
    product: GarmentProduct,
    size: GarmentSize,
    swatchIndex: number
  ) => void;
}

type RailFilter = "ALL" | GarmentCategory;

const FILTER_OPTIONS: { value: RailFilter; label: string }[] = [
  { value: "ALL", label: "All Pieces" },
  { value: "JACKETS", label: "Jackets" },
  { value: "TOPS", label: "Tops" },
  { value: "BOTTOMS", label: "Bottoms" },
  { value: "ACCESSORIES", label: "Accessories" },
];

export function ShowroomRail({
  products,
  onInspect,
  onQuickAdd,
}: ShowroomRailProps) {
  const [filter, setFilter] = useState<RailFilter>("ALL");
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(1280);
  const [selectedSwatches, setSelectedSwatches] = useState<
    Record<string, number>
  >({});
  const [quickSizeOpen, setQuickSizeOpen] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const lastHoverSwitchRef = useRef<number>(0);

  const visibleProducts = useMemo(() => {
    if (filter === "ALL") {
      const byId = new Map(products.map((p) => [p.id, p]));
      const curated = RAIL_FEATURED_IDS.map((id) => byId.get(id)).filter(
        (p): p is GarmentProduct => Boolean(p)
      );
      return (curated.length > 0 ? curated : products).slice(0, 8);
    }
    return products.filter((p) => p.category === filter).slice(0, 8);
  }, [filter, products]);

  const safeIndex = Math.min(
    activeIndex,
    Math.max(visibleProducts.length - 1, 0)
  );
  const activeProduct = visibleProducts[safeIndex];
  const activeSwatchIdx = activeProduct
    ? selectedSwatches[activeProduct.id] ?? 0
    : 0;
  const activeSwatch = activeProduct?.swatchDetails[activeSwatchIdx];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      const nextW = el.clientWidth;
      if (nextW > 0) setStageWidth(nextW);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFilterChange = (nextFilter: RailFilter) => {
    setFilter(nextFilter);
    setActiveIndex(0);
    setQuickSizeOpen(false);
  };

  const goPrev = useCallback(() => {
    setQuickSizeOpen(false);
    setActiveIndex((prev) =>
      visibleProducts.length <= 1
        ? 0
        : (prev - 1 + visibleProducts.length) % visibleProducts.length
    );
  }, [visibleProducts.length]);

  const goNext = useCallback(() => {
    setQuickSizeOpen(false);
    setActiveIndex((prev) =>
      visibleProducts.length <= 1 ? 0 : (prev + 1) % visibleProducts.length
    );
  }, [visibleProducts.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (document.body.dataset.modalOpen === "true") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const railLayout = useMemo(() => {
    const count = visibleProducts.length;
    const isMobile = stageWidth < 640;
    const isTablet = stageWidth >= 640 && stageWidth < 1024;
    const isWide = stageWidth >= 1500;
    const openWidth = isMobile ? 216 : isTablet ? 244 : isWide ? 286 : 268;
    const horizontalInset = isMobile ? 26 : 44;
    const usableWidth = Math.max(openWidth, stageWidth - horizontalInset * 2);

    if (count <= 1) {
      return {
        openWidth,
        positions: [stageWidth / 2],
        activeCenterX: stageWidth / 2,
      };
    }

    const partGap = isMobile ? 16 : isWide ? 36 : 28;
    const maxStep = isMobile ? 76 : isTablet ? 104 : isWide ? 210 : 126;
    const minStep = isMobile ? 28 : 82;
    const idealStep = (usableWidth - openWidth - partGap * 2) / (count - 1);
    const closedStep = Math.max(minStep, Math.min(maxStep, idealStep));

    const totalSpan = openWidth + partGap * 2 + (count - 1) * closedStep;
    const startX = (stageWidth - totalSpan) / 2;

    const positions: number[] = [];
    let cursorX = startX;

    for (let i = 0; i < count; i++) {
      if (i === safeIndex) {
        const openCenter = cursorX + partGap + openWidth / 2;
        positions.push(openCenter);
        cursorX += partGap + openWidth + partGap;
      } else {
        positions.push(cursorX + closedStep / 2);
        cursorX += closedStep;
      }
    }

    return {
      openWidth,
      positions,
      activeCenterX: positions[safeIndex] ?? stageWidth / 2,
    };
  }, [visibleProducts.length, safeIndex, stageWidth]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (visibleProducts.length <= 1 || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const openHalfSpan = railLayout.openWidth / 2 + 12;
    if (Math.abs(mouseX - railLayout.activeCenterX) <= openHalfSpan) {
      return;
    }

    const now = performance.now();
    if (now - lastHoverSwitchRef.current < 75) {
      return;
    }

    let nearestIdx = safeIndex;
    let nearestDist = Infinity;
    for (let i = 0; i < railLayout.positions.length; i++) {
      const dist = Math.abs(mouseX - railLayout.positions[i]);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    if (nearestIdx !== safeIndex) {
      lastHoverSwitchRef.current = now;
      setQuickSizeOpen(false);
      setActiveIndex(nearestIdx);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (!activeProduct) return null;

  const clampedCaptionX = Math.max(
    Math.min(stageWidth / 2, 230),
    Math.min(
      stageWidth - Math.min(stageWidth / 2, 230),
      railLayout.activeCenterX
    )
  );

  return (
    <section id="showroom" className="sr-section">
      <div
        aria-hidden="true"
        className="sr-spotlight"
        style={{
          left: `calc(50% + ${railLayout.activeCenterX - stageWidth / 2}px)`,
        }}
      />

      <div className="sr-container">
        <div className="sr-header">
          <div>
            <p className="sr-eyebrow">
              Interactive 3D Showroom Rack · Glide cursor across hangers or use
              arrow keys
            </p>
            <h2 className="sr-heading">The Cairo Underground Rail</h2>
          </div>

          <div className="sr-controls">
            <div
              role="tablist"
              aria-label="Filter showroom rail by category"
              className="sr-tablist"
            >
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = filter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleFilterChange(opt.value)}
                    className={`sr-tab${isSelected ? " is-selected" : ""}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="sr-nav-group">
              <span className="sr-counter">
                {String(safeIndex + 1).padStart(2, "0")} /{" "}
                {String(visibleProducts.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous hanger"
                className="sr-nav-btn"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                <span className="sr-nav-label">Prev Hanger</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next hanger"
                className="sr-nav-btn"
              >
                <span className="sr-nav-label">Next Hanger</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="showroom-perspective sr-stage"
          aria-label="Interactive clothing rail — move cursor across garments to flip open"
        >
          <div className="sr-bar-wrap">
            <div className="sr-endcap metallic-endcap" />
            <div className="sr-rail-rod metallic-rail" />
            <div className="sr-endcap metallic-endcap" />
          </div>

          <div aria-hidden="true" className="sr-floor-line" />

          <div className="preserve-3d sr-hangers-layer">
            {visibleProducts.map((product, index) => {
              const isOpen = index === safeIndex;
              const centerX = railLayout.positions[index] ?? stageWidth / 2;
              const itemSwatchIdx = selectedSwatches[product.id] ?? 0;
              const itemFilter =
                product.swatchDetails[itemSwatchIdx]?.filterStyle ?? "none";

              const rotateY = isOpen ? 0 : -62;
              const translateZ = isOpen ? 58 : -18;
              const scale = isOpen ? 1 : 0.93;
              const zIndex = isOpen ? 50 : 30 - Math.abs(index - safeIndex);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (isOpen) {
                      onInspect(product, itemSwatchIdx);
                    } else {
                      setQuickSizeOpen(false);
                      setActiveIndex(index);
                    }
                  }}
                  role="button"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={
                    isOpen
                      ? `Inspect ${product.name}`
                      : `Open ${product.name} on rail`
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (isOpen) {
                        onInspect(product, itemSwatchIdx);
                      } else {
                        setActiveIndex(index);
                      }
                    }
                  }}
                  style={{
                    width: `${railLayout.openWidth}px`,
                    zIndex,
                    transform: `translate3d(${centerX - railLayout.openWidth / 2}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  }}
                  className={`sr-hanger${isOpen ? " is-open" : ""}`}
                >
                  <div className="sr-hook-wrap">
                    <svg
                      width="148"
                      height="36"
                      viewBox="0 0 148 36"
                      fill="none"
                      aria-hidden="true"
                      style={{ overflow: "visible" }}
                    >
                      <path
                        d="M74 19V11.5C74 6.5 79.5 3 83 6.2C85.5 8.5 84.5 13 80.5 14.5"
                        stroke={isOpen ? "#EAECEF" : "#A2A7B2"}
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      />
                      <rect
                        x="71.5"
                        y="17.5"
                        width="5"
                        height="4.5"
                        rx="1"
                        fill={isOpen ? "#D6D9E0" : "#808590"}
                      />
                      <path
                        d="M74 22L18 33.5H130L74 22Z"
                        fill="#18191E"
                        stroke={
                          isOpen
                            ? "rgba(255,255,255,0.26)"
                            : "rgba(255,255,255,0.12)"
                        }
                        strokeWidth="1"
                      />
                    </svg>
                  </div>

                  <div className="sr-card-shell">
                    <div className="sr-card-aspect">
                      <img
                        src={product.image}
                        alt={product.name}
                        draggable={false}
                        style={{ filter: itemFilter }}
                        className="sr-card-img"
                      />

                      {!isOpen ? (
                        <div aria-hidden="true" className="sr-closed-shade" />
                      ) : null}

                      {isOpen ? (
                        <div className="sr-open-overlay">
                          <span className="sr-sku-text">{product.sku}</span>
                          <span className="sr-inspect-hint">
                            <ZoomIn size={14} aria-hidden="true" />
                            Click to Inspect
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sr-caption-outer">
          <div style={{ left: `${clampedCaptionX}px` }} className="sr-caption">
            <div className="sr-meta-row">
              <span className="sr-meta-brand">{activeProduct.brandLabel}</span>
              <span aria-hidden="true" className="sr-meta-dot">
                ·
              </span>
              <span className="sr-meta-weight">
                {activeProduct.fabricWeight}
              </span>
              <span aria-hidden="true" className="sr-meta-dot">
                ·
              </span>
              <span className="sr-meta-scarcity">{activeProduct.scarcity}</span>
            </div>

            <h3 className="sr-prod-title">{activeProduct.name}</h3>

            <div className="sr-price-swatch-row">
              <div className="sr-price-group">
                <span className="sr-price-main">
                  {formatEGP(activeProduct.price)}
                </span>
                {activeProduct.compareAt ? (
                  <span className="sr-price-compare">
                    {formatEGP(activeProduct.compareAt)}
                  </span>
                ) : null}
              </div>

              <div className="sr-divider" aria-hidden="true" />

              <div className="sr-swatch-wrap">
                <div
                  className="sr-swatch-list"
                  role="group"
                  aria-label="Select colorway"
                >
                  {activeProduct.swatchDetails.map((swatch, idx) => {
                    const selected = idx === activeSwatchIdx;
                    return (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() =>
                          setSelectedSwatches((prev) => ({
                            ...prev,
                            [activeProduct.id]: idx,
                          }))
                        }
                        title={swatch.name}
                        aria-label={`Colorway ${swatch.name}`}
                        aria-pressed={selected}
                        className={`sr-swatch-btn${
                          selected ? " is-selected" : ""
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    );
                  })}
                </div>
                <span className="sr-swatch-name">{activeSwatch?.name}</span>
              </div>
            </div>

            <div className="sr-actions-row">
              <button
                type="button"
                onClick={() => onInspect(activeProduct, activeSwatchIdx)}
                className="sr-btn-primary"
              >
                <ZoomIn size={14} aria-hidden="true" />
                Inspect 2.4×
              </button>

              {!quickSizeOpen ? (
                <button
                  type="button"
                  onClick={() => setQuickSizeOpen(true)}
                  className="sr-btn-secondary"
                >
                  <Plus size={14} aria-hidden="true" />
                  Quick Add
                </button>
              ) : (
                <div className="sr-quick-sizes">
                  <span className="sr-size-label">Size:</span>
                  {activeProduct.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        onQuickAdd(activeProduct, size, activeSwatchIdx);
                        setQuickSizeOpen(false);
                      }}
                      className="sr-size-btn"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
