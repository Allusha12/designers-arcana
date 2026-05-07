// No-repeat deck algorithm (PRD §7)
// Rule: a card must not appear again until all 32 cards have been drawn once
// Storage: sessionStorage key "arcana_deck_state" (resets per browser session)
//          Firestore sync optional for cross-device continuity (future)

import { cards } from "@/data/cards";

const STORAGE_KEY = "arcana_deck_state";

interface DeckState {
  remaining: string[]; // slugs not yet drawn this cycle
  drawn: string[];     // slugs drawn this cycle
}

function loadState(): DeckState {
  if (typeof window === "undefined") return buildFreshState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DeckState;
  } catch {
    // corrupted storage — reset
  }
  return buildFreshState();
}

function buildFreshState(): DeckState {
  const slugs = cards.map((c) => c.slug);
  return { remaining: shuffle(slugs), drawn: [] };
}

function saveState(state: DeckState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns next N slugs to display in the spread (without removing from state)
export function peekNextCards(count: number = 5): string[] {
  const state = loadState();
  if (state.remaining.length < count) {
    // cycle is almost done — refill with undrawn remainder + reset
    const refill = shuffle(state.drawn);
    state.remaining = [...state.remaining, ...refill];
    state.drawn = [];
    saveState(state);
  }
  return state.remaining.slice(0, count);
}

// Call after user picks a card — marks it as drawn
export function drawCard(slug: string): void {
  const state = loadState();
  state.remaining = state.remaining.filter((s) => s !== slug);
  state.drawn.push(slug);
  if (state.remaining.length === 0) {
    // Full cycle complete — reshuffle for next round
    state.remaining = shuffle(state.drawn);
    state.drawn = [];
  }
  saveState(state);
}

export function resetDeck(): void {
  if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
}
