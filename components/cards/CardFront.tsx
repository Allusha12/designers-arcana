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
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: r, border: "1px solid rgba(200,168,97,0.45)" }}
      />
    </div>
  );
}
