"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Home } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import Image from "next/image";

export default function Navigation() {
    const pathname = usePathname();
    const { currentTrack } = useAudio();

    const navItems = [
        { name: "Accueil", href: "/", icon: Home },
        { name: "Lecture", href: "/quran", icon: BookOpen },
        { name: "Écoute", href: "/audio", icon: Headphones },
    ];

    return (
        <>
            {/* --- MOBILE LOGO (Capsule Flottante) --- */}
            <div className="fixed top-0 left-0 right-0 z-30 flex justify-center pt-4 md:hidden pointer-events-none">
                <div className="flex items-center gap-2 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg shadow-black/20 pointer-events-auto">
                    <div className="relative w-6 h-6">
                        <Image
                            src="/logo.png"
                            alt="GoMuslim"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">
                        GoMuslim
                        {/* DÉGRADÉ APPLIQUÉ ICI */}
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent ml-0.5">
                            Life
                        </span>
                    </span>
                </div>
            </div>

            {/* --- MOBILE NAV (Menu du bas) --- */}
            <nav
                className={`fixed left-4 right-4 z-40 md:hidden shadow-2xl shadow-black/40 border border-white/10 transition-all duration-500 ease-out
        ${currentTrack
                        ? "bottom-4 h-16 rounded-b-2xl rounded-t-none border-t-0 bg-[#0f172a]"
                        : "bottom-4 h-16 rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl"
                    }`}
            >
                <div className="flex justify-around items-center h-full px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? "scale-110" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    // DÉGRADÉ SUR LE POINT ACTIF
                                    <div className="absolute top-2 w-1 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-[0_0_10px_#34d399]" />
                                )}

                                {/* Icône : On garde une couleur unie proche du dégradé pour la lisibilité */}
                                <item.icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? "text-emerald-400" : ""}
                                />

                                {/* DÉGRADÉ SUR LE TEXTE ACTIF */}
                                <span className={`text-[10px] font-medium mt-1 ${isActive
                                    ? "bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent font-bold"
                                    : ""
                                    }`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* --- DESKTOP NAV (PC) --- */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 h-24 z-50 px-10 items-center justify-between border-b border-white/5 bg-[#0f172a]/90 backdrop-blur-xl transition-all">

                {/* LOGO & NOM DU SITE */}
                <div className="flex items-center gap-4 text-2xl font-bold text-white tracking-wide hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="relative w-16 h-16">
                        <Image
                            src="/logo.png"
                            alt="GoMuslim Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span>Quran.</span>
                        {/* DÉGRADÉ APPLIQUÉ SUR LE NOM PRINCIPAL */}
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent text-lg font-bold tracking-widest">
                            GoMuslimLife
                        </span>
                    </div>
                </div>

                {/* BOUTONS CENTRÉS */}
                <div className="absolute left-1/2 -translate-x-1/2 flex gap-3 bg-white/5 rounded-full p-1.5 border border-white/10 shadow-inner">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                    // DÉGRADÉ SUR LE FOND DU BOUTON ACTIF
                                    ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="w-[240px]"></div>

            </nav>
        </>
    );
}