"use client";
import { useEffect, useState } from "react";
import CardFlip from "./CardFlip";
import CardFront from "./CardFront";
import Button from "@/components/ui/Button";
import { CardCornerBranches } from "@/components/background/SceneBackground";
import type { Card } from "@/types";

interface CardDetailProps {
  card: Card;
}

// Figma layout (1728×1117):
//   ЗНАЧЕННЯ: x:125, w:324 (left col)
//   Center card: x:566, w:628 — card 374×594 inside 628×628
//   ПОРАДА: x:1312, w:324 (right col)
//   CTA: y:930, centered
export default function CardDetail({ card }: CardDetailProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-flip on mount after brief delay
  useEffect(() => {
    const t = setTimeout(() => setIsFlipped(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* ── Desktop layout: 3-column ── */}
      <div className="hidden lg:grid w-full px-[var(--page-padding-x)] mt-8"
        style={{ gridTemplateColumns: "324px 1fr 324px", gap: "0 0" }}>

        {/* Left — ЗНАЧЕННЯ */}
        <div className="flex flex-col gap-[25px] pt-[67px]">
          <div>
            <span className="text-label block mb-[17px]">ЗНАЧЕННЯ</span>
            <div className="h-px w-[120px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          </div>
          <p className="text-body" style={{ color: "#e5ddc8" }}>{card.meaning}</p>
        </div>

        {/* Center — card flip with corner branches glued to the corners */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-[374px] aspect-[374/594]">
            <CardFlip card={card} isFlipped={isFlipped} />
            <CardCornerBranches />
          </div>
        </div>

        {/* Right — ПОРАДА */}
        <div className="flex flex-col gap-[25px] pt-[67px]">
          <div>
            <span className="text-label block mb-[17px]">ПОРАДА</span>
            <div className="h-px w-[120px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          </div>
          <p className="text-body" style={{ color: "#e5ddc8" }}>{card.advice}</p>
        </div>
      </div>

      {/* ── Mobile/tablet layout: vertical ── */}
      <div className="lg:hidden flex flex-col items-center w-full px-[var(--page-padding-x)] mt-6 gap-8">
        {/* Card image with corner branches glued to the corners.
            Width: clamp scales card from 260px (small phones) to 374px (max
            from Figma) without ever exceeding the viewport minus page padding. */}
        <div
          className="relative w-full aspect-[374/594] mx-auto"
          style={{ maxWidth: "min(374px, calc(100vw - 2 * var(--page-padding-x)))" }}
        >
          <CardFront card={card} size="detail" />
          <CardCornerBranches />
        </div>

        {/* ЗНАЧЕННЯ */}
        <div className="w-full max-w-[480px]">
          <span className="text-label block mb-3">ЗНАЧЕННЯ</span>
          <div className="h-px w-[80px] mb-4" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          <p className="text-body" style={{ color: "#e5ddc8" }}>{card.meaning}</p>
        </div>

        {/* ПОРАДА */}
        <div className="w-full max-w-[480px]">
          <span className="text-label block mb-3">ПОРАДА</span>
          <div className="h-px w-[80px] mb-4" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          <p className="text-body" style={{ color: "#e5ddc8" }}>{card.advice}</p>
        </div>
      </div>

      {/* ── CTA — shared, raised ~20px closer to the content above ── */}
      <div className="mt-12 lg:mt-[76px] mb-8 w-full flex justify-center px-[var(--page-padding-x)]">
        <Button label="ВИТЯГНУТИ ЩЕ" href="/deck" />
      </div>
    </div>
  );
}
