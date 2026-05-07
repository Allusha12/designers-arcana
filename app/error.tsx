"use client";
// Global error boundary — catches sync render errors in any route segment.
// Stays inside the root layout, so the user keeps the design system around them
// and never lands on a white screen. Renders a thematic fallback with
// "Спробувати знову" (calls Next's `reset` to re-render) and a return-home link.

import { useEffect } from "react";
import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  // In production this is where Sentry / LogRocket / etc. would fire.
  // For now we just log to the console with the digest so we can correlate
  // server-side stack traces.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[App error]", error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="landing" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center px-[var(--page-padding-x)] text-center gap-6 md:gap-8">
          {/* Small label using the same `.text-label` token as ЗНАЧЕННЯ/ПОРАДА */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-label" style={{ color: "rgba(200,168,97,0.7)" }}>
              ЩОСЬ ПІШЛО НЕ ТАК
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
            Зорі затьмарилися
          </h1>

          <p className="text-subtitle font-body max-w-[480px]" style={{ color: "#f4eccb" }}>
            Несподівана пригода в космосі.
            <span className="hidden md:inline"><br /></span>{" "}
            Спробуй ще раз або повернись на головну.
          </p>

          {/* Primary CTA reruns the failed render; secondary link is the safety hatch. */}
          <div className="mt-2 md:mt-4 flex flex-col items-center gap-5">
            <Button label="СПРОБУВАТИ ЗНОВУ" onClick={reset} />
            <a href="/" className="nav-link text-nav">НА ГОЛОВНУ</a>
          </div>

          {/* Show the digest in dev / production so users can quote it in support */}
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
