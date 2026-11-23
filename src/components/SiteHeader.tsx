import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ArchiveFilter, LINE_A, LINE_B } from "../data/catalog";

interface SiteHeaderProps {
  totalCount: number;
  lineACount: number;
  lineBCount: number;
  bagCount: number;
  activeCategory: ArchiveFilter;
  searchQuery: string;
  matchCount: number;
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
  activeCategory,
  searchQuery,
  matchCount,
  onSearchChange,
  onSelectFilter,
  onOpenCart,
}: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, searchOpen]);

  const handleMobileSelect = (filter?: ArchiveFilter) => {
    if (filter) onSelectFilter(filter);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => {
            setMobileMenuOpen((prev) => !prev);
            setSearchOpen(false);
          }}
        >
          {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>

        <nav className="nav-left" aria-label="Primary">
          <a
            href="#archive-grid"
            className={`nav-link hot${activeCategory === "all" ? " is-active" : ""}`}
            onClick={() => onSelectFilter("all")}
          >
            New Drop <sup>{totalCount}</sup>
          </a>
          <a
            href="#archive-grid"
            className={`nav-link${activeCategory === LINE_A ? " is-active" : ""}`}
            onClick={() => onSelectFilter(LINE_A)}
          >
            {LINE_A} <sup>{lineACount}</sup>
          </a>
          <a
            href="#archive-grid"
            className={`nav-link${activeCategory === LINE_B ? " is-active" : ""}`}
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
          <span className="currency-tag mono">GIZA · EGP ج.م</span>
          <button
            type="button"
            className="icon-btn search-toggle-btn"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setMobileMenuOpen(false);
            }}
          >
            <Search size={14} className="search-icon-only" aria-hidden="true" />
            <span className="search-label">Search</span>
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

      <nav
        className={`mobile-nav-drawer${mobileMenuOpen ? " active" : ""}`}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-nav-links">
          <a
            href="#archive-grid"
            className="nav-link hot"
            onClick={() => handleMobileSelect("all")}
          >
            New Drop <sup>{totalCount}</sup>
          </a>
          <a
            href="#archive-grid"
            className="nav-link"
            onClick={() => handleMobileSelect(LINE_A)}
          >
            {LINE_A} <sup>{lineACount}</sup>
          </a>
          <a
            href="#archive-grid"
            className="nav-link"
            onClick={() => handleMobileSelect(LINE_B)}
          >
            {LINE_B} <sup>{lineBCount}</sup>
          </a>
          <a
            href="#showroom"
            className="nav-link"
            onClick={() => handleMobileSelect()}
          >
            3D Rail
          </a>
          <a
            href="#how-to-style"
            className="nav-link"
            onClick={() => handleMobileSelect()}
          >
            How To Style
          </a>
        </div>
      </nav>

      <div className={`search-popdown${searchOpen ? " active" : ""}`}>
        <form
          className="search-bar-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            document
              .getElementById("archive-grid")
              ?.scrollIntoView({ behavior: "smooth" });
            setSearchOpen(false);
          }}
        >
          <Search size={15} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH KNITWEAR, BARREL DENIM, CORDUROY, BOXY TEES, SETS..."
            aria-label="Search archive"
          />
          {searchQuery.trim() ? (
            <button type="submit" className="search-bar-jump mono">
              VIEW {matchCount} {matchCount === 1 ? "RESULT" : "RESULTS"} ↓
            </button>
          ) : null}
          <button
            type="button"
            className="search-bar-close"
            onClick={() => setSearchOpen(false)}
          >
            <span>CLOSE</span>
            <X size={13} aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
