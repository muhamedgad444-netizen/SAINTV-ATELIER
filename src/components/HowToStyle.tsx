import { GarmentProduct, LOOKS } from "../data/catalog";

interface HowToStyleProps {
  productsById: Map<string, GarmentProduct>;
  onInspect: (product: GarmentProduct, swatchIndex: number) => void;
}

export function HowToStyle({ productsById, onInspect }: HowToStyleProps) {
  return (
    <section className="style-section" id="how-to-style">
      <div className="section-head-split">
        <h3>HOW TO STYLE // CAIRO STREET ROTATION</h3>
        <span
          className="mono"
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "var(--muted)",
          }}
        >
          1-CLICK COMPLETE LOOK
        </span>
      </div>

      <div className="style-grid">
        {LOOKS.map((look) => {
          const linkedProduct = productsById.get(look.productId);
          return (
            <div key={look.code} className="style-card">
              <div className="style-card-top mono">
                <span>HOW TO STYLE</span>
                <span>{look.code}</span>
              </div>
              <div className="style-card-img">
                <img src={look.img} alt={look.title} loading="lazy" />
              </div>
              <div className="style-card-foot">
                <div>{look.title}</div>
                <button
                  type="button"
                  onClick={() => {
                    if (linkedProduct) onInspect(linkedProduct, 0);
                  }}
                >
                  SHOP THE LOOK
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
