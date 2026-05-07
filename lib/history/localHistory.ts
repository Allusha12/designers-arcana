// localStorage history — the only persistence layer for the History screen.
// drawnAt is stored as an ISO string and hydrated to a plain Date.

import type { HistoryEntry } from "@/types";

const KEY = "arcana_history";
const MAX_ENTRIES = 200; // prevent unbounded growth

interface StoredEntry {
  id: string;
  cardSlug: string;
  drawnAt: string; // ISO date string
}

function load(): StoredEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: StoredEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

function toHistoryEntry(e: StoredEntry): HistoryEntry {
  return {
    id: e.id,
    cardSlug: e.cardSlug,
    drawnAt: new Date(e.drawnAt),
  };
}

export function localGetHistory(): HistoryEntry[] {
  return load().map(toHistoryEntry);
}

export function localAddEntry(cardSlug: string): HistoryEntry {
  const stored = load();
  const entry: StoredEntry = {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    cardSlug,
    drawnAt: new Date().toISOString(),
  };
  save([entry, ...stored]);
  return toHistoryEntry(entry);
}

export function localDeleteEntry(id: string): void {
  save(load().filter((e) => e.id !== id));
}

export function localClear(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
