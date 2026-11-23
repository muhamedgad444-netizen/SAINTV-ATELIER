import { FormEvent, useState } from "react";

const COMPASS_STAR_PATH =
  "M32 0 L36.5 23.5 L64 32 L36.5 40.5 L32 64 L27.5 40.5 L0 32 L27.5 23.5 Z M32 14 L45 19 L37 32 L45 45 L32 39 L19 45 L27 32 L19 19 Z";

export function ObsidianFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setJoined(true);
    setEmail("");
  };

  return (
    <footer className="obsidian-manifesto">
      <div className="manifesto-banner">
        <div>
          <div
            className="mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.24em",
              color: "var(--coddi-red)",
              marginBottom: "8px",
            }}
          >
            DROP THE SHOP · ONE NINETY, NEW CAIRO // CAIRO ROOFTOPS
          </div>
          <h2>
            FROM CAIRO STREETS TO THE WORLD.
            <br />
            GIZA TOLERATES NO WEAKNESS.
          </h2>
        </div>
        <svg
          width="74"
          height="74"
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
          <p
            style={{
              fontSize: "12px",
              color: "rgba(252,252,252,0.75)",
              lineHeight: 1.6,
            }}
          >
            Subscribe for private password drops, New Cairo pop-up coordinates,
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
        </div>

        <div className="footer-col">
          <h5>POLICIES &amp; DISPATCH</h5>
          <ul className="footer-links">
            <li>Delivery 2–5 Working Days (Egypt &amp; Worldwide)</li>
            <li>Cash on Delivery &amp; Prepaid Free Shipping</li>
            <li>Easy Exchange &amp; Returns Within 24 Hours</li>
            <li>Drop The Shop — One Ninety, New Cairo</li>
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
              <a href="#how-to-style">CAIRO STREET ROTATION LOOKBOOK ↗</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-big-mark">
        <div
          className="mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          © 2026 SAINTV STUDIOS · SAINTV × ATELIER · BUILT FOR CAIRO
        </div>
      </div>
    </footer>
  );
}
