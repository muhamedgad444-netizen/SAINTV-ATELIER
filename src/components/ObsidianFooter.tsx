import { FormEvent, useState } from "react";
import { subscribeNewsletter } from "../lib/api";

const COMPASS_STAR_PATH =
  "M32 0 L36.5 23.5 L64 32 L36.5 40.5 L32 64 L27.5 40.5 L0 32 L27.5 23.5 Z M32 14 L45 19 L37 32 L45 45 L32 39 L19 45 L27 32 L19 19 Z";

interface ObsidianFooterProps {
  onOpenAdmin?: () => void;
}

export function ObsidianFooter({ onOpenAdmin }: ObsidianFooterProps) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    await subscribeNewsletter(trimmed);
    setJoined(true);
    setEmail("");
  };

  return (
    <footer className="obsidian-manifesto">
      <div className="manifesto-banner">
        <div>
          <div className="manifesto-eyebrow mono">
            DROP THE SHOP · GIZA ARCHIVE // GIZA ROOFTOPS
          </div>
          <h2>
            GIZA TOLERATES NO WEAKNESS.
            <br />
            FROM GIZA STREETS TO THE WORLD.
          </h2>
        </div>
        <svg
          className="manifesto-star"
          viewBox="0 0 64 64"
          fill="#fcfcfc"
          aria-hidden="true"
        >
          <path d={COMPASS_STAR_PATH} />
        </svg>
      </div>

      <div className="footer-columns">
        <div className="footer-col">
          <h5>UNDERGROUND DISPATCH // EARLY ACCESS</h5>
          <p className="footer-lead">
            Subscribe for private password drops, Giza pop-up coordinates,
            and 10% off orders over 2,999 EGP.
          </p>
          <form className="newsletter-box" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL..."
              aria-label="Email address for early access"
            />
            <button type="submit">{joined ? "JOINED ✓" : "JOIN"}</button>
          </form>
          {joined ? (
            <p className="newsletter-confirm mono">
              ACCESS CONFIRMED · USE CODE GIZA26 FOR 10% OFF ORDERS OVER 2,999 EGP
            </p>
          ) : null}
        </div>

        <div className="footer-col">
          <h5>POLICIES &amp; DISPATCH</h5>
          <ul className="footer-links">
            <li>Delivery 2–5 Working Days (Egypt &amp; Worldwide)</li>
            <li>Cash on Delivery &amp; Prepaid Free Shipping</li>
            <li>Easy Exchange &amp; Returns Within 24 Hours</li>
            <li>Drop The Shop — Giza Underground Archive</li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>ARCHIVE CHANNELS</h5>
          <ul className="footer-links">
            <li>
              <a href="#showroom">3D SHOWROOM RAIL (SAINTV × ATELIER) ↗</a>
            </li>
            <li>
              <a href="#archive-grid">FULL 20-PIECE STUDIO ARCHIVE ↗</a>
            </li>
            <li>
              <a href="#how-to-style">GIZA STREET ROTATION LOOKBOOK ↗</a>
            </li>
            {onOpenAdmin ? (
              <li>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAdmin();
                  }}
                >
                  OPERATIONS CONSOLE (ADMIN) ↗
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="footer-big-mark">
        <div className="footer-copyright mono">
          © 2026 SAINTV STUDIOS · SAINTV × ATELIER · BUILT FOR GIZA
        </div>
      </div>
    </footer>
  );
}
