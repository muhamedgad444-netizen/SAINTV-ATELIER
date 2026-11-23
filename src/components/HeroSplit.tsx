import { GarmentProduct } from "../data/catalog";

interface HeroSplitProps {
  lineupProducts: GarmentProduct[];
  totalCatalogCount: number;
  onInspect: (product: GarmentProduct, swatchIndex: number) => void;
}

export function HeroSplit({
  lineupProducts,
  totalCatalogCount,
  onInspect,
}: HeroSplitProps) {
  return (
    <section className="hero-hybrid">
      <div className="hero-cairo-pane">
        <div className="hero-cairo-bg" />
        <div className="hero-cairo-overlay" />

        <div className="hero-top-meta mono">
          <span className="live-badge">
            <i aria-hidden="true" /> FW26/27 × SAINTV DROP
          </span>
          <span>30.0444° N, 31.2357° E // CAIRO</span>
        </div>

        <div className="hero-bottom-copy">
          <div className="hero-eyebrow mono">SAINTV STUDIOS // JOINT ARCHIVE</div>
          <h1 className="hero-title">
            FROM CAIRO STREETS
            <br />
            TO THE WORLD.
          </h1>
          <p className="hero-sub">
            GIZA TOLERATES NO WEAKNESS — LIMITED QUANTITIES · NO RESTOCKS
          </p>
          <div className="hero-ctas">
            <a href="#archive-grid" className="pill-btn glass">
              SHOP JOINT DROP ›
            </a>
            <a href="#showroom" className="pill-btn solid-dark">
              EXPLORE 3D RAIL
            </a>
          </div>
        </div>
      </div>

      <div className="hero-sn2-pane">
        <div className="hero-top-meta mono" style={{ color: "var(--ink)" }}>
          <span>SAINTV // WASHED SILHOUETTES LINEUP</span>
          <span>{totalCatalogCount} ARCHIVE PIECES</span>
        </div>

        <div className="sn2-lineup-stage">
          {lineupProducts.map((item) => (
            <div
              key={item.id}
              className="sn2-lineup-model"
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
              <img
                src={item.hoverImage}
                alt={item.name}
                style={{ objectFit: "contain" }}
              />
              <span className="sn2-model-tag mono">
                LE {item.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="sn2-pane-footer">
          <div className="sn2-title-block">
            <h2>WASHED COLLECTION LIVE</h2>
            <p className="mono">
              RAW STATE LEATHER · BARREL DENIM · HEAVY FLEECE
            </p>
          </div>
          <a href="#archive-grid" className="pill-btn outline-dark">
            VIEW ALL {totalCatalogCount} PIECES
          </a>
        </div>
      </div>
    </section>
  );
}
