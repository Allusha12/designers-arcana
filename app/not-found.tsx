import type { Metadata } from "next";
import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

// 404 — same visual language as the rest of the service:
//   • Landing background (astral chart + comets)
//   • Header with navigation, so the user is never trapped
//   • A small "404" label, a thematic Cormorant heading, supporting subtitle,
//     and a primary gold-pill CTA back home.
//   • Echoes the PRD problem statement: "коли зайшов в глухий кут".

export const metadata: Metadata = {
  title: "Загубилась карта · The Designer's Arcana",
  description: "Цієї карти немає в колоді. Повернись на головну і спробуй ще раз.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="landing" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center px-[var(--page-padding-x)] text-center gap-6 md:gap-8">
          {/* Small label — uses the same `.text-label` token as ЗНАЧЕННЯ/ПОРАДА */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-label" style={{ color: "rgba(200,168,97,0.7)" }}>
              СТОРІНКА 404
            </span>
            <div className="h-px w-[80px]" style={{ backgroundColor: "rgba(200,168,97,0.55)" }} />
          </div>

          {/* Hero heading — Cormorant Garamond Medium gold, animate zoomIn on mount */}
          <h1
            className="font-display font-medium text-[#c8a861] animate__zoomIn"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "0.01em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Загубилась карта
          </h1>

          {/* Subtitle — same `.text-subtitle` family + colour as landing */}
          <p className="text-subtitle font-body max-w-[438px]" style={{ color: "#f4eccb" }}>
            Здається, ти зайшов у глухий кут.
            <span className="hidden md:inline"><br /></span>{" "}
            Повернись і обери знову — Всесвіт ще має для тебе знаки.
          </p>

          {/* CTA */}
          <div className="mt-2 md:mt-4">
            <Button label="НА ГОЛОВНУ" href="/" />
          </div>
        </div>
      </div>
    </main>
  );
}
