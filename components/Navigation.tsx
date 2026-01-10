"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, Home } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import Image from "next/image";
import { motion } from "framer-motion";

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
            {/* ==============================
                MOBILE : HEADER TRANSPARENT (HAUT)
               ============================== */}
            <div className="fixed top-0 left-0 right-0 z-40 md:hidden pt-6 flex items-center justify-center pointer-events-none">
                <Link href="/" className="flex items-center gap-2.5 pointer-events-auto drop-shadow-2xl">
                    <div className="relative w-8 h-8 filter drop-shadow-lg">
                        <Image src="/logo.png" alt="GoMuslim" fill className="object-contain" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide drop-shadow-md">
                        Quran.
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent ml-0.5">
                            GoMuslimLife
                        </span>
                    </span>
                </Link>
            </div>

            {/* ==============================
                MOBILE : BARRE NAVIGATION (BAS)
               ============================== */}
            <nav
                className={`fixed left-0 right-0 z-50 md:hidden transition-all duration-500 ease-out border-t border-white/5
                ${currentTrack
                        ? "bottom-0 pb-4 bg-[#020617]/80 backdrop-blur-xl h-20" // Un peu plus opaque si lecteur actif
                        : "bottom-0 pb-safe bg-[#020617]/60 backdrop-blur-xl h-20" // Très transparent sinon
                    }`}
            >
                <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center w-full h-full group"
                            >
                                {/* Indicateur lumineux actif */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute top-0 w-10 h-1 rounded-b-full bg-gradient-to-r from-emerald-400 to-blue-500 shadow-[0_4px_15px_rgba(16,185,129,0.6)]"
                                    />
                                )}

                                <div className={`transition-all duration-300 ${isActive ? "-translate-y-1" : "group-active:scale-90"}`}>
                                    <item.icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`transition-colors duration-300 ${isActive ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "text-slate-400"
                                            }`}
                                    />
                                </div>

                                <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500"
                                    }`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ==============================
                DESKTOP : BARRE NAVIGATION (TRANSPARENTE)
               ============================== */}
            {/* 👇 Changement ici : bg-[#020617]/30 (30% d'opacité seulement) + Gros flou */}
            <nav className="hidden md:flex sticky top-0 left-0 right-0 h-24 z-50 px-8 items-center justify-between transition-all bg-[#020617]/30 backdrop-blur-xl border-b border-white/5">

                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 bg-white/5 rounded-xl border border-white/10 p-2 transition-transform group-hover:scale-105 shadow-inner">
                            <Image src="/logo.png" alt="GoMuslim Logo" fill className="object-contain p-1" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Platform</span>
                            <span className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                                GoMuslim<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Life</span>
                            </span>
                        </div>
                    </Link>

                    {/* MENU CENTRAL (Pillule Glass) */}
                    <div className="relative flex items-center bg-white/5 rounded-full p-1 border border-white/10 shadow-lg backdrop-blur-md">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-nav-pill"
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-blue-600/80 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-sm"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="w-[180px] flex justify-end"></div>
                </div>
            </nav>
        </>
    );
}