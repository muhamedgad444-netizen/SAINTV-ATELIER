import { GarmentCategory } from "../data/catalog";

interface EditorialMatrixProps {
  onJumpCategory: (category: GarmentCategory) => void;
}

const MATRIX_TILES: {
  category: GarmentCategory;
  img: string;
  alt: string;
  tag: string;
  title: string;
  cta: string;
}[] = [
  {
    category: "JACKETS",
    img: "/assets/products/washed-stand-collar-leather-jacket-front.webp",
    alt: "Heavy Outerwear",
    tag: "SAINTV × ATELIER // 01",
    title: "RAW LEATHER & WORK JACKETS",
    cta: "FILTER OUTERWEAR →",
  },
  {
    category: "BOTTOMS",
    img: "/assets/products/washed-black-barrel-jeans-front.webp",
    alt: "Barrel Denim",
    tag: "SAINTV // 02",
    title: "WASHED BARREL CURVED DENIM",
    cta: "FILTER DENIM →",
  },
  {
    category: "TOPS",
    img: "/assets/products/heavyweight-black-pullover-hoodie-front.webp",
    alt: "Heavyweight Hoodies",
    tag: "ATELIER // 03",
    title: "HEAVYWEIGHT HOODIES & KNITS",
    cta: "FILTER TOPS →",
  },
];

export function EditorialMatrix({ onJumpCategory }: EditorialMatrixProps) {
  return (
    <section className="matrix-section">
      <div className="section-head-split">
        <h3>CURATED SILHOUETTES // 01—03</h3>
        <span
          className="mono"
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "var(--muted)",
          }}
        >
          CAIRO × NEW CAIRO
        </span>
      </div>

      <div className="matrix-grid">
        {MATRIX_TILES.map((tile) => (
          <div
            key={tile.category}
            className="matrix-tile"
            role="button"
            tabIndex={0}
            onClick={() => onJumpCategory(tile.category)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onJumpCategory(tile.category);
              }
            }}
          >
            <img src={tile.img} alt={tile.alt} loading="lazy" />
            <div className="matrix-tile-content">
              <span className="tag mono">{tile.tag}</span>
              <h4>{tile.title}</h4>
              <span className="shop-link">{tile.cta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
