"use client";
import CardBack from "./CardBack";

interface CardSpreadProps {
  cardSlugs: string[];
  onPick: (slug: string) => void;
}

// CardBack size="spread" is 208w + 34px gap = 242px between centres
const CARD_PITCH = 242;
// Tight middle-out stagger so the fan opens as a single gesture, not 5 separate moves.
const STAGGER_MS = 40;

// Each card starts stacked at the deck's centre and slides outward to its slot.
// --deal-x = (centerIndex - i) * pitch  (cards left of centre start displaced right; right cards start displaced left)
// Middle-out stagger: centre card appears first, the outer cards last.
function getDealStyle(i: number, total: number): React.CSSProperties {
  const center = (total - 1) / 2;
  const dealX = (center - i) * CARD_PITCH;
  const delayMs = Math.round(Math.abs(i - center)) * STAGGER_MS;
  return {
    ["--deal-x" as string]: `${dealX}px`,
    animationDelay: `${delayMs}ms`,
  };
}

export default function CardSpread({ cardSlugs, onPick }: CardSpreadProps) {
  return (
    <>
      {/* Desktop (≥ xl, 1280px) — flex row, all 5 cards visible at once.
          5 × 208 + 4 × 34 = 1176px wide → fits in xl viewport with page padding. */}
      <div className="hidden xl:flex items-center justify-center gap-[34px]">
        {cardSlugs.map((slug, i) => (
          <div
            key={slug}
            className="dealCard"
            style={getDealStyle(i, cardSlugs.length)}
          >
            <CardBack size="spread" onClick={() => onPick(slug)} />
          </div>
        ))}
      </div>

      {/* Phone & tablet (< xl) — horizontal scroll-snap. Five 208-px cards don't
          fit side-by-side until ~1280px viewport, so we fall back to a swipeable
          row. Cards still emerge with the same fan-out animation. */}
      <div className="xl:hidden card-spread-mobile py-4">
        {cardSlugs.map((slug, i) => (
          <div
            key={slug}
            className="dealCard"
            style={getDealStyle(i, cardSlugs.length)}
          >
            <CardBack size="spread" onClick={() => onPick(slug)} />
          </div>
        ))}
      </div>
    </>
  );
}
