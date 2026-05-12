import Image from "next/image";
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
  const r = 16;

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
        // Without a placeholder, phones see an empty black rectangle for 1–2s
        // on cold CDN cache (Vercel optimises the 3.5MB source PNG on first
        // hit for each device size). The gradient blur cross-fades to the
        // real image, so the page feels instant.
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        // Painted illustrations with soft gradients — q65 is visually
        // indistinguishable from the default q75 here but saves ~20–25% bytes
        // per generated variant.
        quality={isDetail ? 65 : 75}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: r, border: "1px solid rgba(200,168,97,0.45)" }}
      />
    </div>
  );
}
