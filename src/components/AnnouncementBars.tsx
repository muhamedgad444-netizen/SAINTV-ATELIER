import { useState } from "react";
import { MARQUEE_PHRASES, PROMOS } from "../data/catalog";

const MARQUEE_ITEMS = Array.from({ length: 4 }, (_, repeat) =>
  MARQUEE_PHRASES.map((text, idx) => ({
    key: `${repeat}-${idx}`,
    text,
  }))
).flat();

export function AnnouncementBars() {
  const [promoIdx, setPromoIdx] = useState(0);

  const handlePrev = () => {
    setPromoIdx((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
  };

  const handleNext = () => {
    setPromoIdx((prev) => (prev + 1) % PROMOS.length);
  };

  return (
    <>
      <div className="top-marquee mono">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((entry) => (
            <span key={entry.key}>
              <i className="red-dot" aria-hidden="true" /> {entry.text}
            </span>
          ))}
        </div>
      </div>

      <div className="sn2-promo-bar">
        <button
          type="button"
          className="nav-arr"
          onClick={handlePrev}
          aria-label="Previous promo"
        >
          ‹
        </button>
        <span className="promo-text">{PROMOS[promoIdx]}</span>
        <a href="#archive-grid" className="promo-pill-cta">
          SHOP NOW
        </a>
        <button
          type="button"
          className="nav-arr"
          onClick={handleNext}
          aria-label="Next promo"
        >
          ›
        </button>
      </div>
    </>
  );
}
