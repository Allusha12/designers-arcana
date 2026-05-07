import SceneBackground from "@/components/background/SceneBackground";
import Button from "@/components/ui/Button";

// Figma: hero title 128px → hero-xl, subtitle 22px, CTA centered at y:771
// Landing has no top brand row — the hero is the only focal point.
export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="landing" />

      {/* Content above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero — centered vertically in the full viewport */}
        <div className="flex-1 flex flex-col items-center justify-center px-[var(--page-padding-x)] text-center gap-6 md:gap-8">
          {/* Title — Animate.css-style zoomIn on mount */}
          <h1 className="text-hero-sm md:text-hero-md xl:text-hero-xl font-display font-medium text-[#c8a861] animate__zoomIn"
            style={{ letterSpacing: "0.01em", lineHeight: 1 }}>
            The Designer&apos;s Arcana
          </h1>

          {/* Subtitle — soft line break on tablet+ where the design intends
              two lines; on phone it wraps naturally to whatever fits. */}
          <p className="text-subtitle font-body max-w-[438px]" style={{ color: "#f4eccb" }}>
            Твій особистий знак від Всесвіту,
            <span className="hidden md:inline"><br /></span>{" "}
            який завжди під рукою
          </p>

          {/* CTA */}
          <div className="mt-4 md:mt-6">
            <Button label="ПОЧАТИ СЕСІЮ" href="/deck" />
          </div>
        </div>
      </div>
    </main>
  );
}
