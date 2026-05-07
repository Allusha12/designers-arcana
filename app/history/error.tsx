"use client";
// History route error boundary — overrides the global one for the /history
// segment with messaging tailored to the most likely failure modes:
// localStorage corruption, JSON parse errors on legacy entries, or a
// HistoryItem rendering an unknown card slug. Offers a "Спробувати знову"
// reset and a one-click "Очистити історію" escape hatch.

import { useEffect } from "react";
import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { localClear } from "@/lib/history/localHistory";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HistoryError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[History error]", error);
  }, [error]);

  function clearAndRetry() {
    try {
      localClear();
    } catch {
      /* ignore — even if clear fails, reset will still re-render */
    }
    reset();
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="history" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center px-[var(--page-padding-x)] text-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="text-label" style={{ color: "rgba(200,168,97,0.7)" }}>
              ІСТОРІЯ ЗАГУБИЛАСЬ
            </span>
            <div className="h-px w-[80px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          </div>

          <h1
            className="font-display font-medium text-[#c8a861] animate__zoomIn"
            style={{
              fontSize: "clamp(32px, 5vw, 60px)",
              letterSpacing: "0.01em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Не вдалось прочитати історію
          </h1>

          <p className="text-subtitle font-body max-w-[480px]" style={{ color: "#f4eccb" }}>
            Можливо, дані пошкоджені.
            <span className="hidden md:inline"><br /></span>{" "}
            Спробуй ще раз або очисти збережену історію.
          </p>

          <div className="mt-2 md:mt-4 flex flex-col items-center gap-5">
            <Button label="СПРОБУВАТИ ЗНОВУ" onClick={reset} />
            <button onClick={clearAndRetry} className="nav-link text-nav">
              ОЧИСТИТИ ІСТОРІЮ
            </button>
          </div>

          {error.digest && (
            <p
              className="mt-2 font-mono"
              style={{ fontSize: 11, color: "rgba(200,168,97,0.40)", letterSpacing: "0.04em" }}
            >
              ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
