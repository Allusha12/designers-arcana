"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Card } from "@/types";

interface CardFrontProps {
  card: Card;
  className?: string;
  /**
   * "detail" — large card on /card/[slug]. Renders at 100% × auto and locks the
   *            374:594 aspect ratio so the parent controls the responsive width.
   * "flip"   — small 219×347 card used inside CardFlip on the deck screen.
   */
  size?: "detail" | "flip";
}

// Warm-dark vertical gradient — matches the painterly cards' average tone so
// the placeholder doesn't read as "broken" while the real image streams in.
// Inline SVG → no extra request, no extra import. Used by Next/Image's
// `placeholder="blur"` mechanism, which fades it out as the source loads.
const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNzQgNTk0Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMmEyMDE4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTUxMDBkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==";

export default function CardFront({ card, className, size = "flip" }: CardFrontProps) {
  const isDetail = size === "detail";
  // Pull from globals.css — detail uses the larger token (matches the design
  // reference at /card/[slug]); the flip variant on /deck shares the back-card
  // token so the front/back radii are visually consistent during the flip.
  const r = isDetail ? "var(--r-card-detail)" : "var(--r-card-back)";

  // The shimmer must only appear WHILE the image is loading — never as a
  // post-load flash. Two pitfalls to avoid:
  //   1. With `priority`, the browser preloads the image during HTML parse,
  //      so by the time React hydrates the image is often already complete.
  //      React's `onLoad` won't fire for an image that loaded before the
  //      listener was attached — so we sync-check `img.complete` on mount.
  //   2. SSR can't know whether the image will be cached; rendering shimmer
  //      visible on the server caused a flash after hydration for fast
  //      connections. Server renders the shimmer hidden; client decides.
  const imgRef = useRef<HTMLImageElement>(null);
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const img = imgRef.current;
    // `complete && naturalWidth > 0` is the reliable cross-browser test for
    // "decoded successfully" (complete alone returns true for broken images).
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  // Shimmer is visible only after hydration AND only while the image is
  // still streaming. Cached images skip it entirely (mounted → already
  // loaded → still hidden).
  const shimmerVisible = isDetail && mounted && !imageLoaded;

  // For "detail" size we fill the parent so the parent can apply responsive
  // sizing (clamp / max-width / vw) without us hard-coding pixels.
  const style: React.CSSProperties = isDetail
    ? { width: "100%", aspectRatio: "374 / 594", borderRadius: r }
    : { width: 219, height: 347, borderRadius: r };

  return (
    <div
      className={clsx("relative shrink-0 overflow-hidden", className)}
      style={style}
    >
      <Image
        src={card.image}
        alt={card.name}
        fill
        sizes={isDetail ? "(max-width: 767px) 88vw, (max-width: 1023px) 60vw, 374px" : "219px"}
        className="object-cover"
        // The detail card is above-fold on /card/[slug] at every breakpoint, so
        // we emit a <link rel="preload"> + fetchpriority="high" via `priority`
        // — the browser starts the image request during HTML parse instead of
        // after hydration. The flip variant is decorative on /deck and stays
        // lazy-loaded.
        priority={isDetail}
        // Without a placeholder, phones see an empty black rectangle while
        // the file streams. The gradient blur cross-fades into the painted
        // illustration so the page never feels "broken".
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        // Skip Vercel's image optimization pipeline. The source AVIFs are
        // already 350–800 KB (pre-compressed q88 1500×2384), so the only thing
        // Vercel adds is a cold-cache penalty: regenerating each device-size
        // variant on first hit took ~1.3s, vs. 150–450ms to serve the AVIF
        // directly from the edge. The bytes saved by extra resizing aren't
        // worth the latency for content this small.
        unoptimized
        ref={imgRef}
        onLoad={() => setImageLoaded(true)}
      />
      {/* Gold shimmer that sweeps diagonally across the placeholder while
          the AVIF streams in, then cross-fades out the moment the image
          decodes. The element is always mounted (so the fade-out CSS
          transition has something to animate) but starts at opacity 0 and
          only becomes visible during the actual load window. */}
      {isDetail && (
        <div
          aria-hidden="true"
          className={clsx("card-shimmer", !shimmerVisible && "card-shimmer--hidden")}
          style={{ borderRadius: r }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: r, border: "1px solid rgba(200,168,97,0.45)" }}
      />
    </div>
  );
}
