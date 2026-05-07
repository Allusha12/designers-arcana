"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

interface HeaderProps {
  /** Kept for backward compat with existing call-sites; currently a no-op. */
  showBack?: boolean;
  /** Kept for backward compat with existing call-sites; currently a no-op. */
  backHref?: string;
  /**
   * Controlled scroll state for the frosted backdrop. Pass `true` to force the
   * backdrop on, `false` to force it off, or omit to fall back to a built-in
   * `window`-scroll listener. Pages that use an internal scroll container
   * (e.g. History's app-shell list) should track that container themselves
   * and pass the value here — the window won't scroll, so the fallback
   * listener wouldn't fire.
   */
  scrolled?: boolean;
}

// Threshold (in px) before the sticky backdrop fades in. Small enough that the
// effect kicks in immediately, large enough to ignore rubber-band overscroll.
const SCROLL_THRESHOLD = 12;

// Simple two-link nav: gold gold→star colour shift + sweeping underline on
// hover (see .nav-link in globals.css). No persistent "you are here"
// indicator — the underline only appears on hover.
const navLink = "text-nav nav-link";

export default function Header({
  scrolled: scrolledProp,
}: HeaderProps) {
  // Figma deck (node 279:14288): header sits at y=66 inside the outer frame,
  // 16px tall row. We render at the same vertical band: pt-[66px] pb-[26px]
  // gives ~108px header block before page content begins.
  // ── Sticky behaviour ──
  // When a parent page locks body scroll and lets only its inner list scroll
  // (app-shell), it controls `scrolled` via prop. Otherwise we listen to
  // `window` here so other pages keep working out of the box.
  const [scrolledLocal, setScrolledLocal] = useState(false);
  const isControlled = scrolledProp !== undefined;
  const scrolled = isControlled ? scrolledProp : scrolledLocal;

  useEffect(() => {
    if (isControlled) return;
    const onScroll = () => setScrolledLocal(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // sync on mount (in case page loads already scrolled)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isControlled]);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-30 w-full pt-[54px] pb-[26px] md:pt-[66px] transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out"
      style={{
        backgroundColor: scrolled ? "rgba(8, 7, 5, 0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(200, 168, 97, 0.14)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 24px rgba(0, 0, 0, 0.35)" : "none",
      }}
    >
      <div className="relative flex items-center justify-center h-4 px-[var(--page-padding-x)]">
        {/* ГОЛОВНА — left edge, visible on every breakpoint */}
        <div className="absolute left-[var(--page-padding-x)]">
          <Link href="/" className={navLink}>
            ГОЛОВНА
          </Link>
        </div>

        {/* Logo — centered, hidden on phones (the "THE DESIGNER'S ARCANA"
            wordmark with 40% letter-spacing is wider than a phone viewport).
            ГОЛОВНА link on the left already covers the home-navigation need. */}
        <div className="hidden md:block">
          <Logo />
        </div>

        {/* ІСТОРІЯ — right edge, visible on every breakpoint */}
        <div className="absolute right-[var(--page-padding-x)]">
          <Link href="/history" className={navLink}>
            ІСТОРІЯ
          </Link>
        </div>
      </div>
    </header>
  );
}
