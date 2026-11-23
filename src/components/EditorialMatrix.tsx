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
    category: "KNITWEAR",
    img: "/images/padded_collar_bomber_jacket_1795380644376.jpg",
    alt: "Heavyweight Ribbed Knitwear",
    tag: "SAINTV × ATELIER // 01",
    title: "CHUNKY RIBBED KNITWEAR",
    cta: "FILTER KNITWEAR →",
  },
  {
    category: "BOTTOMS",
    img: "/assets/products/washed-black-barrel-jeans-front.webp",
    alt: "Washed Barrel Denim and Corduroy",
    tag: "SAINTV // 02",
    title: "BARREL DENIM & CORDUROY",
    cta: "FILTER BOTTOMS →",
  },
  {
    category: "TOPS",
    img: "/assets/products/heavyweight-black-pullover-hoodie-front.webp",
    alt: "Heavyweight Fleece and Boxy Tees",
    tag: "ATELIER // 03",
    title: "HEAVYWEIGHT FLEECE & TEES",
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
          GIZA // EGYPT
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
