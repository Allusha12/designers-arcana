// Manages deck state for the DeckPage
// Phases: idle → shuffling → spread → (user picks) → navigating
// Wraps lib/deck/algorithm.ts

"use client";

import { useState, useCallback } from "react";
import { peekNextCards, drawCard, reshuffleRemaining } from "@/lib/deck/algorithm";

type DeckPhase = "idle" | "shuffling" | "spread";

export function useDeck() {
  const [phase, setPhase] = useState<DeckPhase>("idle");
  const [spreadSlugs, setSpreadSlugs] = useState<string[]>([]);

  const shuffle = useCallback(() => {
    setPhase("shuffling");
    // Re-randomise the un-drawn pool BEFORE the animation completes so the
    // user gets a different selection on every shuffle — even if they came
    // back to /deck mid-session. We still never surface a previously picked
    // card (reshuffle only touches `remaining`).
    reshuffleRemaining();
    // Shuffle animation duration is 1.5s — match it before transitioning to spread
    setTimeout(() => {
      setSpreadSlugs(peekNextCards(5));
      setPhase("spread");
    }, 1500);
  }, []);

  const pick = useCallback((slug: string) => {
    drawCard(slug);
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setSpreadSlugs([]);
  }, []);

  return { phase, spreadSlugs, shuffle, pick, reset };
}
