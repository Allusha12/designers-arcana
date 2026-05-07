"use client";
import Image from "next/image";
import { getCardBySlug } from "@/data/cards";
import type { HistoryEntry } from "@/types";

interface HistoryItemProps {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  onOpen: (cardSlug: string) => void;
  isVanishing?: boolean;
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HistoryItem({ entry, onDelete, onOpen, isVanishing = false }: HistoryItemProps) {
  const card = getCardBySlug(entry.cardSlug);
  if (!card) return null;

  const date = entry.drawnAt instanceof Date
    ? entry.drawnAt
    : (entry.drawnAt as { toDate?: () => Date })?.toDate?.() ?? new Date();
  const dateStr = date.toLocaleDateString("uk-UA", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <li
      className={`flex items-center gap-4 py-4 border-b ${isVanishing ? "animate__vanishOut pointer-events-none" : ""}`}
      style={{ borderColor: "rgba(200,168,97,0.20)" }}
    >
      {/* Thumbnail — click opens popup */}
      <button
        onClick={() => onOpen(card.slug)}
        className="shrink-0 transition-opacity hover:opacity-80"
        aria-label={`Відкрити картку ${card.name}`}
      >
        <div className="relative w-[52px] h-[82px] rounded-[8px] overflow-hidden">
          <Image src={card.image} alt={card.name} fill className="object-cover" sizes="52px" />
        </div>
      </button>

      {/* Name + date — click opens popup */}
      <button
        onClick={() => onOpen(card.slug)}
        className="flex-1 min-w-0 text-left transition-opacity hover:opacity-80"
      >
        <p
          className="font-display font-semibold uppercase truncate"
          style={{ fontSize: 15, letterSpacing: "0.24em", color: "#c8a861" }}
        >
          {card.name}
        </p>
        <p className="font-body text-[13px] mt-1" style={{ color: "rgba(200,168,97,0.72)" }}>
          {dateStr}
        </p>
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(entry.id)}
        className="shrink-0 p-2 rounded transition-opacity hover:opacity-100"
        style={{ color: "rgba(200,168,97,0.78)" }}
        aria-label="Видалити запис"
      >
        <TrashIcon />
      </button>
    </li>
  );
}
