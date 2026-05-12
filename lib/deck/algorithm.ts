// No-repeat deck algorithm (PRD §7)
// Hard rule: within a session, a card the user has already PICKED never shows
//            up again until they've drawn all 32. The next pick after the 32nd
//            silently starts a fresh cycle.
// Storage:   sessionStorage key "arcana_deck_state" — resets per browser tab,
//            survives reloads inside the tab.

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
    if (raw) {
      const parsed = JSON.parse(raw) as DeckState;
      // Sanity: storage must reference real card slugs. If the data set
      // changed between deploys we'd otherwise show stale slugs forever.
      const known = new Set(cards.map((c) => c.slug));
      if (
        Array.isArray(parsed.remaining) &&
        Array.isArray(parsed.drawn) &&
        parsed.remaining.every((s) => known.has(s)) &&
        parsed.drawn.every((s) => known.has(s))
      ) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage — fall through to fresh state
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

// Re-randomise the order of cards the user hasn't picked yet. Called from
// the shuffle action so each new spread shows a different selection from
// the same un-drawn pool — without ever surfacing a previously picked card.
export function reshuffleRemaining(): void {
  const state = loadState();
  if (state.remaining.length === 0) {
    // Cycle exhausted — start fresh so the next peek has something to show.
    saveState({ remaining: shuffle(cards.map((c) => c.slug)), drawn: [] });
    return;
  }
  state.remaining = shuffle(state.remaining);
  saveState(state);
}

// Returns up to `count` un-drawn slugs to display in the spread. Crucially,
// this NEVER falls back to already-drawn cards — even when fewer than
// `count` remain. Showing a smaller spread is a better UX than showing a
// card the user has already seen this session.
export function peekNextCards(count: number = 5): string[] {
  let state = loadState();

  // Cycle exhausted: silently start a fresh shuffle so the experience keeps
  // working. This is the only path that can surface a previously drawn card,
  // and only after the user has gone through all 32.
  if (state.remaining.length === 0) {
    state = { remaining: shuffle(cards.map((c) => c.slug)), drawn: [] };
    saveState(state);
  }

  return state.remaining.slice(0, Math.min(count, state.remaining.length));
}

// Mark a card as drawn so it stops appearing in future peeks. Idempotent: a
// double-click that somehow fires twice won't corrupt the state.
export function drawCard(slug: string): void {
  const state = loadState();
  if (!state.remaining.includes(slug)) return;
  state.remaining = state.remaining.filter((s) => s !== slug);
  state.drawn.push(slug);
  saveState(state);
}

// How many cards the user still has to discover this cycle. Useful for UI
// hints ("останніх 3 карти") or analytics, currently unused by the views.
export function remainingCount(): number {
  return loadState().remaining.length;
}

export function resetDeck(): void {
  if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
}
