export interface Card {
  id: number;         // 1–32
  slug: string;       // "card-01" … "card-32"
  name: string;       // Ukrainian card name
  meaning: string;    // Situation / context description
  advice: string;     // Actionable advice
  image: string;      // Path: /cards/<filename>.avif
}

export interface HistoryEntry {
  id: string;         // local prefix-id (e.g. `local_<ts>_<rand>`)
  cardSlug: string;
  drawnAt: Date;
}

export interface DeckState {
  remaining: string[];
  drawn: string[];
}

// Breakpoint tokens — mirrors tailwind.config.ts screens
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
