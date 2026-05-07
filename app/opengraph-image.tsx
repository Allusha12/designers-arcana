// Open Graph image — 1200×630 (the recommended Twitter / Facebook / LinkedIn
// share size). Next.js auto-generates <meta property="og:image"> + Twitter
// card tags pointing at this. Same image is reused for `twitter-image` via
// re-export below.

import { ImageResponse } from "next/og";

export const alt = "The Designer's Arcana — метафоричні карти для дизайнерів";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#c8a861",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Outer & inner frame — mirrors the SceneBackground frame motif */}
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "1px solid rgba(200,168,97,0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 50,
            border: "1px solid rgba(200,168,97,0.20)",
          }}
        />

        {/* 4-point gold sparkle — corner ornaments */}
        {[
          { top: 33, left: 33 },
          { top: 33, right: 33 },
          { bottom: 33, left: 33 },
          { bottom: 33, right: 33 },
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

        {/* Main sparkle ornament above the title */}
        <div style={{ display: "flex", marginBottom: 24, opacity: 0.7 }}>
          <svg width="36" height="36" viewBox="0 0 24 24">
            <path
              d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
              fill="#c8a861"
            />
          </svg>
        </div>

        {/* Title — Cormorant-style serif, gold */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: "0.01em",
            lineHeight: 1.05,
            color: "#c8a861",
            fontStyle: "italic",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          The Designer&apos;s Arcana
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#f4eccb",
            textAlign: "center",
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          Твій особистий знак від Всесвіту, який завжди під рукою
        </div>

        {/* Bottom hint label */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontSize: 14,
            letterSpacing: "0.4em",
            color: "rgba(200,168,97,0.55)",
            textTransform: "uppercase",
          }}
        >
          Метафоричні карти для дизайнерів
        </div>
      </div>
    ),
    { ...size },
  );
}
