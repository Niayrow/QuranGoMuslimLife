"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f172a] border-t border-white/5 pt-12 pb-32 md:pb-12 mt-20 relative overflow-hidden">

            {/* Lueur d'ambiance bas de page (Discrète) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">

                {/* 1. Logo & Identité (Centré) */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-8 h-8">
                        <Image src="/logo.png" alt="GoMuslim Logo" fill className="object-contain" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">
                        GoMuslim
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent ml-0.5">Life</span>
                    </span>
                </div>

                <p className="text-slate-400 text-sm max-w-md mb-8">
                    Votre compagnon spirituel quotidien. Le Saint Coran, partout, tout le temps.
                </p>

                {/* 2. Liens Rapides (Ligne simple) */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 text-sm font-medium text-slate-300">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Accueil</Link>
                    <Link href="/quran" className="hover:text-emerald-400 transition-colors">Lire le Coran</Link>
                    <Link href="/audio" className="hover:text-emerald-400 transition-colors">Écoute Audio</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link>
                </div>

                {/* 3. Séparateur & Bas de page */}
                <div className="w-full border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Copyright & Made with love */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs text-slate-500">
                        <span>© {currentYear} GoMuslimLife.</span>
                        <span className="hidden md:inline">•</span>
                        <div className="flex items-center gap-1">
                            <span>Fait avec</span>
                            <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                            <span>pour la Ummah</span>
                        </div>
                    </div>

                    {/* Réseaux Sociaux (Avec vos liens) */}
                    <div className="flex gap-4">
                        <Link
                            href="https://x.com/gomuslimlife"
                            target="_blank"
                            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <Twitter size={18} />
                        </Link>

                        <Link
                            href="https://www.instagram.com/gomuslimlife/"
                            target="_blank"
                            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <Instagram size={18} />
                        </Link>

                        <Link
                            href="https://github.com/Niayrow/QuranGoMuslimLife"
                            target="_blank"
                            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <Github size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}