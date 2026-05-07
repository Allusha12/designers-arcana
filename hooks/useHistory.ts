// History hook — works both with Firebase (logged-in) and localStorage (guest).
// If uid is null → uses localStorage via lib/history/localHistory.ts
// If uid is set  → uses Firestore via lib/firebase/firestore.ts
// On sign-in, caller can optionally migrate local entries to Firestore (future).

"use client";

import { useState, useEffect, useCallback } from "react";
import { getHistoryEntries, addHistoryEntry, deleteHistoryEntry } from "@/lib/firebase/firestore";
import {
  localGetHistory,
  localAddEntry,
  localDeleteEntry,
} from "@/lib/history/localHistory";
import type { HistoryEntry } from "@/types";

export function useHistory(uid: string | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    if (uid) {
      const data = await getHistoryEntries(uid);
      setEntries(data);
    } else {
      // Guest mode — read from localStorage (sync, no await needed)
      setEntries(localGetHistory());
    }
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(async (cardSlug: string) => {
    if (uid) {
      await addHistoryEntry(uid, cardSlug);
      await fetchEntries();
    } else {
      const newEntry = localAddEntry(cardSlug);
      setEntries((prev) => [newEntry, ...prev]);
    }
  }, [uid, fetchEntries]);

  const removeEntry = useCallback(async (entryId: string) => {
    if (uid) {
      await deleteHistoryEntry(uid, entryId);
    } else {
      localDeleteEntry(entryId);
    }
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, [uid]);

  return { entries, loading, addEntry, removeEntry };
}
