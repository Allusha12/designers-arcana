"use client";
import Image from "next/image";
import { useState } from "react";
import HistoryItem from "./HistoryItem";
import CardPopup from "./CardPopup";
import { getCardBySlug } from "@/data/cards";
import type { HistoryEntry } from "@/types";

interface HistoryListProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
}

export default function HistoryList({ entries, onDelete }: HistoryListProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [vanishingId, setVanishingId] = useState<string | null>(null);
  const activeCard = activeSlug ? getCardBySlug(activeSlug) : null;

  // Item click → vanishOut animation starts; popup opens shortly after so the
  // user gets a beat of visual feedback. When popup closes, both reset together.
  // Trash click → same vanishOut animation, but we wait for it to finish before
  // removing the entry from state so the user sees the item fully dissolve.
  const VANISH_VIEW_MS = 220;
  const VANISH_DELETE_MS = 580; // matches vanishOut 0.6s minus a hair
  const handleOpen = (slug: string, entryId: string) => {
    if (vanishingId) return;
    setVanishingId(entryId);
    window.setTimeout(() => setActiveSlug(slug), VANISH_VIEW_MS);
  };
  const handleDelete = (entryId: string) => {
    if (vanishingId) return;
    setVanishingId(entryId);
    window.setTimeout(() => {
      onDelete(entryId);
      // Reset vanishingId AFTER the entry is removed — otherwise the next
      // delete (or open) click is blocked by the `if (vanishingId) return`
      // guard above, which sticks at the just-deleted entry's id forever.
      // Functional update keeps us safe if a parallel `handleOpen` set it.
      setVanishingId((current) => (current === entryId ? null : current));
    }, VANISH_DELETE_MS);
  };
  const handleClose = () => {
    setActiveSlug(null);
    setVanishingId(null);
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center w-full py-12">
        <Image
          src="/empty-history.png"
          alt=""
          width={400}
          height={409}
          priority
          className="w-full h-auto"
          style={{ maxWidth: 400 }}
        />
      </div>
    );
  }

  return (
    <>
      <ul className="w-full max-w-[640px] mx-auto">
        {entries.map((entry) => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            onDelete={handleDelete}
            onOpen={(slug) => handleOpen(slug, entry.id)}
            isVanishing={vanishingId === entry.id}
          />
        ))}
      </ul>

      {/* Popup — rendered outside ul, inside portal-like overlay */}
      {activeCard && (
        <CardPopup
          card={activeCard}
          onClose={handleClose}
        />
      )}
    </>
  );
}
