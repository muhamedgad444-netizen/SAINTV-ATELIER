import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { GarmentProduct } from "../data/catalog";
import heroVideo from "../../media/hero-video.mp4";

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
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section className="hero-hybrid">
      <div className="hero-cairo-pane">
        <video
          ref={videoRef}
          className="hero-cairo-video"
          src={heroVideo}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          aria-label="SAINTV Studios campaign film"
        />
        <div className="hero-cairo-overlay" />

        <div className="hero-top-meta mono">
          <span className="live-badge">
            <i aria-hidden="true" /> FW26/27 × SAINTV DROP
          </span>
          <div className="hero-meta-right">
            <span>29.9792° N, 31.1342° E // GIZA</span>
            <button
              type="button"
              className="hero-sound-btn"
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute hero video" : "Mute hero video"}
              aria-pressed={!isMuted}
            >
              {isMuted ? (
                <VolumeX size={13} aria-hidden="true" />
              ) : (
                <Volume2 size={13} aria-hidden="true" />
              )}
              <span>{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
            </button>
          </div>
        </div>

        <div className="hero-bottom-copy">
          <div className="hero-eyebrow mono">SAINTV STUDIOS // JOINT ARCHIVE</div>
          <h1 className="hero-title">
            GIZA TOLERATES
            <br />
            NO WEAKNESS.
          </h1>
          <p className="hero-sub">
            FROM GIZA STREETS TO THE WORLD — LIMITED QUANTITIES · NO RESTOCKS
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
              CHUNKY KNITWEAR · BARREL DENIM · HEAVYWEIGHT FLEECE
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
