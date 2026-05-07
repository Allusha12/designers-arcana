// History hook — local-only. Reads/writes browser localStorage via
// lib/history/localHistory.ts. The signature stays a hook so consumers don't
// have to deal with hydration timing themselves; on the server this returns
// an empty list, then we hydrate on mount.

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  localGetHistory,
  localAddEntry,
  localDeleteEntry,
} from "@/lib/history/localHistory";
import type { HistoryEntry } from "@/types";

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount. We start with `loading: true` so the
  // very first server-rendered HTML doesn't claim an empty list before we've
  // had a chance to read storage.
  useEffect(() => {
    setEntries(localGetHistory());
    setLoading(false);
  }, []);

  const addEntry = useCallback((cardSlug: string) => {
    const entry = localAddEntry(cardSlug);
    setEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    localDeleteEntry(entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  return { entries, loading, addEntry, removeEntry };
}
