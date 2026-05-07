"use client";
// History page — local-only, accessible to all users.
// Reads/writes localStorage via useHistory(). No sign-in flow.
// Figma: title 44px Cormorant Garamond Medium gold, subtitle PT Serif 20px
//
// Layout: app-shell. Body scroll is locked (h-screen h-[100dvh] + overflow-hidden) so
// the cosmic background, frame border, header, and title stay perfectly still.
// Only the inner list container scrolls — when it scrolls past a small
// threshold, we light up the Header's frosted backdrop for visual separation.

import { useEffect, useRef, useState } from "react";
import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import HistoryList from "@/components/history/HistoryList";
import { useHistory } from "@/hooks/useHistory";

const SCROLL_THRESHOLD = 12;

export default function HistoryPage() {
  const { entries, loading, removeEntry } = useHistory();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [listScrolled, setListScrolled] = useState(false);

  // Drive Header's frosted backdrop from the inner scroller, since the body
  // doesn't scroll in this layout.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setListScrolled(el.scrollTop > SCROLL_THRESHOLD);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative h-screen h-[100dvh] flex flex-col overflow-hidden">
      <SceneBackground variant="history" />

      {/* pb on the wrapper pulls the scroller up so its bottom edge sits ABOVE
          the decorative gold frame line (which is at viewport-inset 40px).
          Without this, scrolled cards get hard-clipped right on top of the
          frame border. */}
      <div className="relative z-10 flex flex-col h-screen h-[100dvh] pb-[clamp(60px,8vh,96px)]">
        <Header showBack backHref="/" scrolled={listScrolled} />

        {/* Static page chrome: title + subtitle. shrink-0 so they never
            compress when the list grows. */}
        <div className="shrink-0 text-center px-[var(--page-padding-x)] pt-10 mb-10">
          <h1
            className="font-display font-medium"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "0.01em", color: "#c8a861" }}
          >
            Історія сесії
          </h1>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              color: "rgba(185,175,185,1)",
              lineHeight: 1.5,
            }}
          >
            Тут відображатимуться карти, які тобі випадають
          </p>
        </div>

        {/* Internal scroll container — the ONLY thing that moves on scroll.
            min-h-0 is required so flex-1 actually constrains height inside a
            flex column (otherwise content would push the parent open). */}
        <div
          ref={scrollerRef}
          className="flex-1 min-h-0 w-full overflow-y-auto px-[var(--page-padding-x)] pb-16 history-scroller"
        >
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-nav" style={{ color: "rgba(200,168,97,0.5)" }}>
                Завантаження…
              </span>
            </div>
          ) : (
            <HistoryList entries={entries} onDelete={removeEntry} />
          )}
        </div>
      </div>
    </main>
  );
}
