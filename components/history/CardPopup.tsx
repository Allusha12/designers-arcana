"use client";
// History card popup — clean dark modal that matches the rest of the service:
//   • Same dark backdrop & gold border as the SceneBackground frame
//   • Card image floats freely (no cream wrapper); subtle gold border + soft shadow
//   • Headings use Cormorant Garamond Medium (same as landing & detail pages)
//   • Section labels "ЗНАЧЕННЯ" / "ПОРАДА" with the small gold underline used on /card/[slug]
//   • Body text in #e5ddc8 (same `.text-body` token as detail page)
//   • Close button uses the shared `.nav-link` style (НАЗАД / ІСТОРІЯ)
//   • Card name appears only ONCE — as the heading on the right column

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Card } from "@/types";

interface CardPopupProps {
  card: Card;
  onClose: () => void;
}

export default function CardPopup({ card, onClose }: CardPopupProps) {
  // Mount tracker so we can portal AFTER hydration. Avoids SSR mismatch and
  // ensures `document.body` is available when we call createPortal.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Esc closes the modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    // Rendered into document.body via portal so the modal escapes any ancestor
    // that creates a containing block (e.g. History's scrollable list, sticky
    // Header with backdrop-filter). Ensures `fixed inset-0` is always
    // viewport-relative, so the dark overlay covers the entire page including
    // its title and Header.
    //
    // Scrollable backdrop — when the modal is taller than the viewport, the
    // ENTIRE page (this overlay) scrolls instead of the modal scrolling
    // internally. items-center centers when content fits; when it doesn't,
    // modal aligns to top and user scrolls up to see the heading.
    <div
      className="fixed inset-0 z-[60] overflow-y-auto popup-backdrop"
      style={{
        backgroundColor: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div className="min-h-full w-full flex items-center justify-center p-3 md:p-6">
        <div
          className="popup-modal relative w-full max-w-[1040px] flex flex-col gap-5 md:gap-7 p-5 md:p-10 lg:p-12"
          style={{
            background: "#131211",
            borderRadius: 20,
            border: "1px solid rgba(200,168,97,0.22)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top row — close button on its own line so it never collides with
              the card image (mobile) or the title (desktop). */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="nav-link text-nav"
              aria-label="Закрити"
            >
              ЗАКРИТИ
            </button>
          </div>

          {/* Content — card on the left, sections on the right.
              The card name is intentionally NOT repeated as a heading: it's
              already painted on the card illustration itself. */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 lg:gap-14">
            {/* ── Left: card image, displayed cleanly on dark (no cream panel) ── */}
            <div className="shrink-0 self-center md:self-start">
              <div
                className="relative"
                style={{
                  width: "min(290px, 70vw)",
                  aspectRatio: "374 / 594",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(200,168,97,0.45)",
                  boxShadow: "0 0 32px rgba(0,0,0,0.55)",
                }}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 70vw, 290px"
                  priority
                />
              </div>
            </div>

            {/* ── Right: ЗНАЧЕННЯ + ПОРАДА ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-7 md:gap-9">
              {/* ЗНАЧЕННЯ — label + 80px gold underline + body, matching /card/[slug] */}
              <section className="flex flex-col gap-4">
                <div>
                  <span className="text-label block mb-2">ЗНАЧЕННЯ</span>
                  <div className="h-px w-[80px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
                </div>
                <p className="text-body" style={{ color: "#e5ddc8", maxWidth: 540, margin: 0 }}>
                  {card.meaning}
                </p>
              </section>

              {/* ПОРАДА — same pattern */}
              <section className="flex flex-col gap-4">
                <div>
                  <span className="text-label block mb-2">ПОРАДА</span>
                  <div className="h-px w-[80px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
                </div>
                <p className="text-body" style={{ color: "#e5ddc8", maxWidth: 540, margin: 0 }}>
                  {card.advice}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
