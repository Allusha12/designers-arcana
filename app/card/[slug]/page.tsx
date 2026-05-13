// Screen: 04 Card's Details
// Figma node: 257:12716
// Elements: card image (large), card name, meaning text, advice text, btn "Витягнути ще"
// Nav: НАЗАД (← /deck) + ІСТОРІЯ (→ /history)
// Responsive:
//   desktop: card left, text right (two-column)
//   tablet:  card top-center, text below
//   mobile:  card hero full-width, scrollable text below, sticky CTA

import type { Metadata } from "next";
import { cards } from "@/data/cards";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = cards.find((c) => c.slug === params.slug);
  if (!card) return {};
  return { title: `${card.name} — The Designer's Arcana` };
}

import SceneBackground from "@/components/background/SceneBackground";
import Header from "@/components/layout/Header";
import CardDetail from "@/components/cards/CardDetail";

export default function CardDetailPage({ params }: Props) {
  const card = cards.find((c) => c.slug === params.slug);
  if (!card) notFound();

  return (
    <main className="relative min-h-screen flex flex-col">
      <SceneBackground variant="detail" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header showBack backHref="/deck" />
        {/* Stretch CardDetail to fill remaining height so the card centers on
            the astral wheel. On the compact iPad / small-laptop range (lg →
            2xl-1) the composition feels low after we shrank the card — nudge
            it up 20 px so there's more visible breathing room under the CTA.
            Real desktops at 2xl (1440+) keep the original centered position. */}
        <div className="flex-1 flex flex-col justify-center lg:-translate-y-5 2xl:translate-y-0">
          <CardDetail card={card} />
        </div>
      </div>
    </main>
  );
}
