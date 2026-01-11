"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Github, Twitter, Instagram, } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 border-t border-white/5 bg-[#020617] pt-16 pb-32 md:pb-12 overflow-hidden">

            {/* Ligne lumineuse supérieure */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Lueur d'ambiance */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">

                {/* 1. Logo & Identité */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="relative w-12 h-12 p-2 bg-white/5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                        <Image src="/logo.png" alt="GoMuslim Logo" fill className="object-contain p-1" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-2xl font-black text-white tracking-tight">
                            GoMuslim<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Life</span>
                        </span>
                        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                            Votre compagnon spirituel quotidien. Le Saint Coran, partout, tout le temps, dans une interface épurée.
                        </p>
                    </div>
                </div>

                {/* 2. Navigation */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
                    {[
                        { name: "Accueil", href: "/" },
                        { name: "Lire le Coran", href: "/coran" },
                        { name: "Écoute Audio", href: "/audio" },
                        { name: "Contact", href: "#" },

                    ].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                        </Link>

                    ))}
                </nav>
                {/* Réseaux Sociaux */}
                <div className="flex gap-1 justify-center   mb-12 ">
                    {[
                        { icon: Twitter, href: "https://x.com/gomuslimlife" },
                        { icon: Instagram, href: "https://www.instagram.com/gomuslimlife/" },
                        { icon: Github, href: "https://github.com/Niayrow/QuranGoMuslimLife" },

                    ].map((social, i) => (
                        <Link
                            key={i}
                            href={social.href}
                            target="_blank"
                            className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                        >
                            <social.icon size={16} />
                        </Link>
                    ))}
                </div>
                {/* 3. Bas de page */}
                <div className="w-full border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>© {currentYear} GoMuslimLife.</span>
                        <span className="hidden md:inline text-slate-700">•</span>
                        <div className="flex items-center gap-1.5">
                            <span>Fait avec</span>
                            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
                            <span>pour la Ummah</span>
                        </div>
                    </div>


                </div>
            </div>
        </footer>
    );
}