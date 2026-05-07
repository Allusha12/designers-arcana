"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import CardSpread from "@/components/cards/CardSpread";
import Button from "@/components/ui/Button";
import { useDeck } from "@/hooks/useDeck";
import { useHistory } from "@/hooks/useHistory";

// Figma: title 44px Cormorant Garamond Medium, gold, 1% ls, centered at y:249
export default function DeckPage() {
  const router = useRouter();
  const { addEntry } = useHistory();
  const { phase, spreadSlugs, shuffle, pick } = useDeck();

  function handlePick(slug: string) {
    pick(slug);               // mark as drawn in deck algorithm
    addEntry(slug);           // save to history (localStorage)
    router.push(`/card/${slug}`);
  }

  const isShuffling = phase === "shuffling";

  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="deck" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header showBack backHref="/" />

        {/* Layout strategy:
            - Title + card + button live as ONE tight group separated by the
              same gap, so the button sits visually close to the card (instead
              of floating at the bottom of the viewport).
            - The card slot has a fixed height across BOTH states, AND the
              button slot ALWAYS reserves its 58px height — even when the
              button is hidden on the spread state. This keeps the column's
              total height constant, so when the group is vertically centered,
              the title and card stay on the same Y line in both states.
        */}
        {/* Content group lifted up ~30px on tablet+ so it doesn't sit dead-centre.
            On phone the viewport is short, so we keep no extra padding to avoid
            pushing the CTA below the fold. */}
        <div
          className="flex-1 flex flex-col items-center justify-center w-full px-[var(--page-padding-x)] gap-6 md:gap-10 pb-0 md:pb-[60px]"
        >
          {/* Title — uppercase, fixed 36px */}
          <h1
            className="font-display font-medium text-center uppercase"
            style={{ fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: "0.01em", color: "#c8a861" }}
          >
            {phase === "spread" ? "Обирай свою карту" : "Тасуй щоб обрати карту"}
          </h1>

          {/* Card area — fixed height in both states so the stack above stays
              at the same vertical position. Slot uses max(deck-card-height,
              spread-card-height) so neither state overflows on any breakpoint:
              desktop deck-card is 347px (taller than the 329px spread card);
              mobile/tablet deck-card is 222/277px (smaller than 329px). */}
          <div
            className="flex items-center justify-center w-full"
            style={{ height: "max(var(--card-height), 329px)" }}
          >
            {phase !== "spread" ? (
              <button
                type="button"
                onClick={shuffle}
                disabled={isShuffling}
                aria-label="Тасувати колоду"
                className={`deck ${isShuffling ? "deckShuffling" : ""} cursor-pointer disabled:cursor-default bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,168,97,0.6)] rounded-2xl`}
              >
                {[0, 1, 2].map((layer) => (
                  <div key={layer} className="deckCard" data-layer={layer}>
                    <Image
                      src="/cards/back.png"
                      alt=""
                      fill
                      sizes="(max-width: 767px) 140px, (max-width: 1023px) 175px, 219px"
                      className="object-cover"
                      priority={layer === 1}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ borderRadius: 16, border: "1px solid rgba(200,168,97,0.45)" }}
                    />
                  </div>
                ))}
              </button>
            ) : (
              <CardSpread cardSlugs={spreadSlugs} onPick={handlePick} />
            )}
          </div>

          {/* Button slot — reserves 58px in BOTH states so the column height
              stays constant and title/card don't shift when entering spread. */}
          <div className="h-[58px] flex items-center justify-center w-full">
            {phase !== "spread" && (
              <Button label="ТАСУВАТИ" onClick={shuffle} disabled={isShuffling} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
