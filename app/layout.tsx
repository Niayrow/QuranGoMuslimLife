import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AudioProvider } from "@/context/AudioContext";
import PlayerBar from "@/components/PlayerBar";
// REMARQUE : J'ai retiré l'import du Footer ici

export const metadata: Metadata = {
  title: "Quran.GoMuslimLife.com",
  description: "Lecture et écoute du Saint Coran",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoMuslim",
  },
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

          {/* Fond d'ambiance fixe */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
          </div>

          <Navigation />

          <div className="pb-0 md:pt-28 min-h-screen">
            {children}
          </div>

          {/* Footer RETIRÉ d'ici */}

          <PlayerBar />

        </AudioProvider>

      </body>
    </html>
  );
}