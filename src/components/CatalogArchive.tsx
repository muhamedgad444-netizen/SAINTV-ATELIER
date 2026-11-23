import { useMemo } from "react";
import {
  ArchiveFilter,
  GarmentProduct,
  GarmentSize,
  LINE_A,
  LINE_B,
  SortMode,
} from "../data/catalog";

interface CatalogArchiveProps {
  products: GarmentProduct[];
  activeCategory: ArchiveFilter;
  searchQuery: string;
  sortMode: SortMode;
  lineACount: number;
  lineBCount: number;
  onCategoryChange: (cat: ArchiveFilter) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (mode: SortMode) => void;
  onInspect: (product: GarmentProduct, swatchIndex: number) => void;
  onQuickAdd: (product: GarmentProduct, size: GarmentSize) => void;
}

export function CatalogArchive({
  products,
  activeCategory,
  searchQuery,
  sortMode,
  lineACount,
  lineBCount,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onInspect,
  onQuickAdd,
}: CatalogArchiveProps) {
  const categoryPills: { value: ArchiveFilter; label: string }[] = [
    { value: "all", label: `ALL ARCHIVE (${products.length})` },
    { value: LINE_A, label: `${LINE_A} (${lineACount})` },
    { value: LINE_B, label: `${LINE_B} (${lineBCount})` },
    { value: "JACKETS", label: "OUTERWEAR & LEATHER" },
    { value: "TOPS", label: "HOODIES & KNITS" },
    { value: "BOTTOMS", label: "BARREL DENIM" },
    { value: "ACCESSORIES", label: "ACCESSORIES" },
  ];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchCat =
        activeCategory === "all" ||
        item.brand === activeCategory ||
        item.category === activeCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brandLabel.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortMode === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sortMode === "high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeCategory, searchQuery, sortMode]);

  return (
    <section className="catalog-section" id="archive-grid">
      <div className="catalog-top-bar">
        <div className="catalog-heading">
          <h2>
            UNDERGROUND ARCHIVE <sup>{filteredProducts.length}</sup>
          </h2>
        </div>
        <div
          className="mono"
          style={{
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "var(--muted)",
          }}
        >
          SEAMLESS STUDIO CUTOUTS · HOVER FOR 1-CLICK SIZE QUICK-ADD
        </div>
      </div>

      <div className="filter-toolbar">
        <div className="category-pills">
          {categoryPills.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => onCategoryChange(pill.value)}
              className={`cat-pill${activeCategory === pill.value ? " active" : ""}`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="sn2-query-box">
          <input
            type="text"
            className="sn2-inline-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="What are you looking for?"
          />
          <select
            className="sn2-sort-select"
            value={sortMode}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            aria-label="Sort products"
          >
            <option value="featured">SORT: FEATURED DROP</option>
            <option value="low">PRICE: LOW TO HIGH</option>
            <option value="high">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="p-card"
            role="button"
            tabIndex={0}
            onClick={() => onInspect(item, 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onInspect(item, 0);
              }
            }}
          >
            <div className="p-media">
              <div className="p-badges">
                <span
                  className={`badge-pill ${
                    item.brand === LINE_A ? "brand-sn2" : "brand-coddi"
                  } mono`}
                >
                  {item.brand} · {item.badge}
                </span>
                <span className="badge-pill scarcity mono">{item.scarcity}</span>
              </div>
              <img
                className="main-img"
                src={item.image}
                alt={item.name}
                loading="lazy"
              />
              <div
                className="quick-size-bar mono"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    paddingRight: "4px",
                  }}
                >
                  + BAG:
                </span>
                {item.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className="q-size-btn"
                    onClick={() => onQuickAdd(item, sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-info">
              <div className="p-title">{item.name}</div>
              <div className="p-price-row mono">
                {item.compareAt ? (
                  <>
                    <span className="sale-price">
                      LE {item.price.toLocaleString()}.00
                    </span>
                    <span className="compare-price">
                      LE {item.compareAt.toLocaleString()}.00
                    </span>
                  </>
                ) : (
                  <span>LE {item.price.toLocaleString()}.00 EGP</span>
                )}
              </div>
              <div className="swatch-row">
                {item.swatches.map((color) => (
                  <span
                    key={color}
                    className="swatch-dot"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
