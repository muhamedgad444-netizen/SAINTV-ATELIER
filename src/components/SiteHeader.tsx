import { useEffect, useRef, useState } from "react";
import { ArchiveFilter, LINE_A, LINE_B } from "../data/catalog";

interface SiteHeaderProps {
  totalCount: number;
  lineACount: number;
  lineBCount: number;
  bagCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFilter: (filter: ArchiveFilter) => void;
  onOpenCart: () => void;
}

const COMPASS_STAR_PATH =
  "M32 0 L36.5 23.5 L64 32 L36.5 40.5 L32 64 L27.5 40.5 L0 32 L27.5 23.5 Z M32 14 L45 19 L37 32 L45 45 L32 39 L19 45 L27 32 L19 19 Z";

export function SiteHeader({
  totalCount,
  lineACount,
  lineBCount,
  bagCount,
  searchQuery,
  onSearchChange,
  onSelectFilter,
  onOpenCart,
}: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <nav className="nav-left" aria-label="Primary">
          <a
            href="#archive-grid"
            className="nav-link hot"
            onClick={() => onSelectFilter("all")}
          >
            New Drop <sup>{totalCount}</sup>
          </a>
          <a
            href="#archive-grid"
            className="nav-link"
            onClick={() => onSelectFilter(LINE_A)}
          >
            {LINE_A} <sup>{lineACount}</sup>
          </a>
          <a
            href="#archive-grid"
            className="nav-link"
            onClick={() => onSelectFilter(LINE_B)}
          >
            {LINE_B} <sup>{lineBCount}</sup>
          </a>
          <a href="#showroom" className="nav-link">
            3D Rail
          </a>
          <a href="#how-to-style" className="nav-link">
            How To Style
          </a>
        </nav>

        <a href="#" className="brand-lockup">
          <span className="brand-word">{LINE_A}</span>
          <svg
            className="compass-star"
            viewBox="0 0 64 64"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={COMPASS_STAR_PATH} />
          </svg>
          <span className="brand-word">{LINE_B}</span>
        </a>

        <div className="nav-right">
          <span className="currency-tag mono">CAIRO · EGP ج.م</span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            Search
          </button>
          <button
            type="button"
            className="icon-btn bag-btn"
            onClick={onOpenCart}
          >
            <span>Bag</span>
            <span className="mono">· {bagCount}</span>
          </button>
        </div>
      </div>

      <div className={`search-popdown${searchOpen ? " active" : ""}`}>
        <div className="search-bar-wrap">
          <span className="mono" style={{ fontSize: "12px" }} aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH WASHED LEATHER, WORK JACKETS, BARREL DENIM, HOODIES..."
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            CLOSE ×
          </button>
        </div>
      </div>
    </header>
  );
}
