import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // 1. Import de la police
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import Navigation from "@/components/Navigation";
import PlayerBar from "@/components/PlayerBar"; // 2. Import du PlayerBar (Créé ci-dessous si pas encore fait)
import { Analytics } from "@vercel/analytics/next";

// Configuration de la police
const inter = Inter({ subsets: ["latin"] });

// --- CONFIGURATION VIEWPORT (Mobile) ---
export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Empêche le zoom accidentel sur mobile (optionnel)
};

// --- CONFIGURATION SEO GLOBALE ---
export const metadata: Metadata = {
  metadataBase: new URL('https://quran.gomuslimlife.com'),
  title: {
    default: "Quran GoMuslimLife - Écoute et Lecture du Coran",
    template: "%s | Quran GoMuslimLife"
  },
  description: "Écoutez et lisez le Saint Coran en haute qualité avec synchronisation verset par verset. Disponible avec les plus grands récitateurs (Nasser Al Qatami, etc).",
  applicationName: "GoMuslimLifeQuran",
  keywords: ["Coran", "Quran", "Islam", "Audio", "MP3", "Nasser Al Qatami", "Sourate", "Verset"],
  authors: [{ name: "GoMuslimLife Team" }],
  openGraph: {
    title: "Quran GoMuslimLife - L'expérience spirituelle ultime",
    description: "Lecture synchronisée, audio HD et design immersif.",
    url: 'https://quran.gomuslimlife.com',
    siteName: 'GoMuslimLifeQuran',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quran GoMuslimLife",
    description: "Le Coran partout avec vous.",
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-[#020617] text-white antialiased selection:bg-emerald-500/30`}>
        <Analytics />
        <AudioProvider>
          {/* Navigation Globale (Sera cachée par GaplessPlayer si besoin) */}
          <Navigation />

          {/* Contenu de la page */}
          {children}

          {/* PlayerBar Global (Barre bleue en bas) */}
          {/* C'est ESSENTIEL pour que le son continue en naviguant */}
          <PlayerBar />
        </AudioProvider>
      </body>
    </html>
  );
}