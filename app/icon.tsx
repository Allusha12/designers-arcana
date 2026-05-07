// Favicon — Next.js auto-generates a 32×32 PNG and wires <link rel="icon">.
// Design: dark canvas with the brand's gold 4-point sparkle, the same shape
// used on buttons and section accents.

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 4-point sparkle ✦ — fills 70% of the canvas, gold */}
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
            fill="#c8a861"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
