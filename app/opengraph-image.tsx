// Open Graph image — 1200×630 (the recommended Twitter / Facebook /
// LinkedIn share size). Next.js auto-generates <meta property="og:image">
// + Twitter card tags pointing at this. Same image is reused for
// `twitter-image` via re-export below.
//
// Layout: featured card illustration on the left, title block on the
// right. Reads as a single tarot pull rather than a generic logo
// splash, which is what the brand promises.

import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "The Designer's Arcana — метафоричні карти для дизайнерів";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-rendered PNG of the "Бабосіки" card. Living next to this file (and
// gitignored from public/) so we can ship a single-file social preview
// without pulling raw card files into the OG generator.
// Embedded as a data: URL so the edge runtime doesn't need to fetch over
// the network — Next.js builds this at deploy time using the bundled
// asset.
const CARD_DATA_URL = `data:image/png;base64,${readFileSync(join(process.cwd(), "app", "_og-card.png")).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080705",
          display: "flex",
          alignItems: "center",
          position: "relative",
          color: "#c8a861",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Outer & inner frame — mirrors the SceneBackground frame motif */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(200,168,97,0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 38,
            border: "1px solid rgba(200,168,97,0.20)",
          }}
        />

        {/* 4-point gold sparkle — corner ornaments */}
        {[
          { top: 21, left: 21 },
          { top: 21, right: 21 },
          { bottom: 21, left: 21 },
          { bottom: 21, right: 21 },
        ].map((pos, i) => (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            style={{ position: "absolute", ...pos }}
          >
            <path
              d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
              fill="#c8a861"
              opacity="0.6"
            />
          </svg>
        ))}

        {/* Left half — card illustration with soft gold glow */}
        <div
          style={{
            display: "flex",
            width: 540,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Warm gold radial behind the card */}
          <div
            style={{
              position: "absolute",
              width: 460,
              height: 580,
              borderRadius: 240,
              background:
                "radial-gradient(ellipse at center, rgba(200,168,97,0.18) 0%, rgba(200,168,97,0) 70%)",
              filter: "blur(20px)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_DATA_URL}
            width={340}
            height={540}
            alt=""
            style={{ borderRadius: 8, boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}
          />
        </div>

        {/* Right half — title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 80,
            paddingLeft: 16,
            gap: 24,
          }}
        >
          {/* Small sparkle above the title */}
          <div style={{ display: "flex", opacity: 0.7 }}>
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
                fill="#c8a861"
              />
            </svg>
          </div>

          {/* Title — Cormorant-style serif, gold */}
          <div
            style={{
              fontSize: 78,
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: 1.05,
              color: "#c8a861",
              fontStyle: "italic",
            }}
          >
            The Designer&apos;s Arcana
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: "#f4eccb",
              lineHeight: 1.4,
              maxWidth: 540,
            }}
          >
            Твій особистий знак від Всесвіту, який завжди під рукою
          </div>

          {/* Bottom hint label */}
          <div
            style={{
              marginTop: 20,
              fontSize: 14,
              letterSpacing: "0.4em",
              color: "rgba(200,168,97,0.55)",
              textTransform: "uppercase",
            }}
          >
            Метафоричні карти для дизайнерів
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
