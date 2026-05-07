// Apple touch icon — 180×180 for iOS home-screen / Safari tab.
// Larger canvas so we can add a thin gold frame border (matching the
// SceneBackground frame motif) around the same brand sparkle.

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          position: "relative",
        }}
      >
        {/* Outer thin gold frame — same vibe as the page-level frame border */}
        <div
          style={{
            position: "absolute",
            inset: 14,
            border: "2px solid rgba(200,168,97,0.45)",
            borderRadius: 8,
          }}
        />
        {/* Inner subtle frame */}
        <div
          style={{
            position: "absolute",
            inset: 22,
            border: "1px solid rgba(200,168,97,0.20)",
            borderRadius: 4,
          }}
        />
        {/* 4-point sparkle */}
        <svg width="96" height="96" viewBox="0 0 24 24">
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
