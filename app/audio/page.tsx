"use client";

import { POPULAR_RECITERS } from "@/lib/constants";
import { PlayCircle, Sparkles, Music, Play, BookOpenCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StarrySky from "@/components/StarrySky";

export default function AudioPage() {
    return (
        <div className="min-h-screen text-white relative">

            {/* Fond Nuit Étoilée */}
            <StarrySky />

            <main className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 relative z-10">

                {/* Header "Ambilight" */}
                <header className="mb-16 mt-8 text-center relative">
                    {/* Glow central */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400 font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-white/10 transition-colors cursor-default">
                            <Sparkles size={12} className="animate-pulse" />
                            Sélection Premium
                        </span>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
                            Espace <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 animate-gradient">Écoute</span>
                        </h1>

                        <p className="text-slate-300/80 max-w-xl mx-auto text-lg leading-relaxed font-light">
                            Plongez dans une expérience spirituelle immersive. Une qualité audio haute définition avec les plus grandes voix du monde musulman.
                        </p>
                    </div>
                </header>

                {/* Grille des Récitateurs */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-40">
                    {POPULAR_RECITERS.map((reciter) => {
                        // On détecte si c'est Nasser Al Qatami pour afficher le badge
                        const isSyncAvailable = reciter.id === 87;

                        return (
                            <Link
                                href={`/audio/${reciter.id}`}
                                key={reciter.id}
                                className="group relative flex flex-col overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* --- EFFET GLASSMORPHISM CARD --- */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]" />

                                {/* Glow interne au survol */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-blue-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[2rem]" style={{ background: `linear-gradient(135deg, ${reciter.color.replace('text-', '')}20, transparent)` }} />

                                {/* --- IMAGE CONTAINER --- */}
                                <div className="relative w-full aspect-[4/5] mb-0 rounded-t-[1.5rem] overflow-hidden shadow-2xl">

                                    {/* BADGE SYNCHRO (Design amélioré : Dégradé Bleu/Vert + Glass) */}
                                    {isSyncAvailable && (
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/90 to-blue-600/90 backdrop-blur-xl border border-white/30 text-white text-[11px] font-black shadow-[0_0_15px_rgba(59,130,246,0.4)] uppercase tracking-widest animate-in fade-in zoom-in duration-500">
                                                <BookOpenCheck size={13} strokeWidth={3} />
                                                Synchro
                                            </span>
                                        </div>
                                    )}

                                    <Image
                                        src={reciter.image}
                                        alt={reciter.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />

                                    {/* Overlay dégradé sombre en bas */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-90" />

                                    {/* Indicateur de lecture (Equalizer simulé) */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex gap-1 items-end h-4">
                                            <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: '60%' }} />
                                            <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                                            <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '40%' }} />
                                        </div>
                                    </div>

                                    {/* --- BOUTON PLAY DEGRADÉ --- */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                            <Play size={24} fill="currentColor" className="ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- INFORMATIONS --- */}
                                <div className="relative p-4 text-center z-10 flex flex-col items-center flex-1 justify-between">
                                    <div className="w-full">
                                        <h3 className="text-white font-bold text-lg md:text-xl leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300 line-clamp-1 mb-1">
                                            {reciter.name}
                                        </h3>

                                        {/* Style Badge */}
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] md:text-xs font-medium text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-colors mt-2">
                                            <Music size={10} className="text-emerald-500" />
                                            <span className="uppercase tracking-wider">{reciter.style}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}