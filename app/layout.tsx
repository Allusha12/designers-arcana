import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Open_Sans, PT_Serif } from "next/font/google";
import "./globals.css";

// Self-hosted Google Fonts — Next.js downloads them at build time and serves
// them from Vercel's CDN. Eliminates the Cormorant FOUT (flash of fallback
// serif) we saw on the Vercel preview, and removes the runtime request to
// fonts.googleapis.com that was hurting CLS / LCP.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600"],
  variable: "--font-opensans",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-ptserif",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://designers-arcana.app";
const SITE_NAME = "The Designer's Arcana";
const SITE_DESCRIPTION = "Твій особистий знак від Всесвіту, який завжди під рукою";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Designer Arcana",
    "metaphor cards",
    "tarot for designers",
    "метафоричні карти",
    "карти для дизайнерів",
    "UX",
    "дизайн",
  ],
  // app/icon.tsx + app/apple-icon.tsx are auto-detected by Next.js metadata.
  // app/opengraph-image.tsx + app/twitter-image.tsx ditto for share previews.
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${cormorantGaramond.variable} ${openSans.variable} ${ptSerif.variable}`}
    >
      <body className="min-h-screen bg-[#000000] text-[#f4eccb] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
