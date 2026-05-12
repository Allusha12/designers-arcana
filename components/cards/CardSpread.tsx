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
  // Phones get a 2×2 grid of 4 cards (a horizontal row of 5 doesn't fit and
  // scroll-snap on a "pick one" screen is awkward — there's no visual hint that
  // more cards exist offscreen). The 5th peeked slug just stays in the deck;
  // peekNextCards doesn't consume, drawCard does.
  const phoneSlugs = cardSlugs.slice(0, 4);

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

      {/* Tablet (md..lg, 768–1279) — horizontal scroll-snap, all 5 cards
          swipeable. Tablet has the room for the spread metaphor; switching it
          to a grid would feel cramped given the larger card size. */}
      <div className="hidden md:flex xl:hidden card-spread-mobile py-4">
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

      {/* Phone (< md) — 2×2 grid of 4 cards, sized to --card-width / --card-height.
          A center-out fan animation doesn't apply here (cards live in a grid,
          not a row), so each card drops in with a soft scale+fade. */}
      <div
        className="md:hidden grid grid-cols-2 gap-x-4 gap-y-5 mx-auto shrink-0"
        style={{ width: "calc(2 * var(--card-width) + 16px)", maxWidth: "100%" }}
      >
        {phoneSlugs.map((slug) => (
          // No animationDelay stagger here. With four cards in a 2×2 grid, a
          // staggered drop made the bottom row finish noticeably later than
          // the top row — users read that as misaligned levels. Animating all
          // four in unison reads as one synchronised reveal.
          <div
            key={slug}
            className="dealCardGrid"
            style={{
              width: "var(--card-width)",
              height: "var(--card-height)",
            }}
          >
            <CardBack size="fill" onClick={() => onPick(slug)} />
          </div>
        ))}
      </div>
    </>
  );
}
