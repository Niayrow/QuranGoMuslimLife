import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AudioProvider } from "@/context/AudioContext";
import PlayerBar from "@/components/PlayerBar";

export const metadata: Metadata = {
  title: "Quran.GoMuslimLife.com",
  description: "Lecture et écoute du Saint Coran",
  manifest: "/manifest.json",
  // ... vos autres métadonnées
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased relative selection:bg-emerald-500 selection:text-white bg-[#0f172a]">
        <AudioProvider>
          {/* Fond d'ambiance */}
          <Navigation />

          {/* 👇 CORRECTION ICI : J'ai retiré "md:pt-28" */}
          {/* Le sticky nav pousse déjà le contenu, pas besoin de padding forcé ici */}
          <div className="pb-0 min-h-screen">
            {children}
          </div>

          <PlayerBar />
        </AudioProvider>
      </body>
    </html>
  );
}