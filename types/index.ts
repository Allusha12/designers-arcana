import type { Timestamp } from "firebase/firestore";

export interface Card {
  id: number;         // 1–32
  slug: string;       // "card-01" … "card-32"
  name: string;       // Ukrainian card name
  meaning: string;    // Situation / context description
  advice: string;     // Actionable advice
  image: string;      // Path: /cards/<filename>.png
}

export interface HistoryEntry {
  id: string;         // Firestore document ID
  cardSlug: string;
  drawnAt: Timestamp;
}

export interface DeckState {
  remaining: string[];
  drawn: string[];
}

// Breakpoint tokens — mirrors tailwind.config.ts screens
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
