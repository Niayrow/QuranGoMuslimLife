"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Repeat1 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function PlayerBar() {
    const {
        currentTrack, isPlaying, togglePlay, progress, currentTime, duration, seek,
        volume, setVolume, isLoop, toggleLoop, playNext, playPrev
    } = useAudio();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (currentTrack) setIsVisible(true);
    }, [currentTrack]);

    if (!currentTrack || !isVisible) return null;

    return (
        <div className="fixed bottom-20 left-0 right-0 md:bottom-0 z-40 transition-all duration-500 ease-out">

            {/* CONTAINER DU LECTEUR (GLASSMORPHISM) */}
            {/* 👇 Changement ici : bg-[#020617]/70 au lieu de /95 + backdrop-blur-xl */}
            <div className="w-full overflow-hidden relative group backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] bg-[#020617]/70">

                {/* Progress Bar Mobile (Ligne fine haut) */}
                <div className="absolute top-0 left-0 h-[2px] w-full bg-white/5 md:hidden z-50 pointer-events-none">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-100 linear shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-between px-3 py-2 md:px-8 md:py-4 h-16 md:h-24 gap-2 md:gap-8">

                    {/* --- INFO (GAUCHE) --- */}
                    <div className="flex items-center gap-2 md:gap-4 md:w-1/4 min-w-0 z-10 flex-1 md:flex-none overflow-hidden">

                        <Link
                            href={`/audio/${currentTrack.reciter.id}`}
                            className="relative w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg active:scale-95 transition-transform"
                        >
                            <Image src={currentTrack.reciter.image} alt="Cover" fill className="object-cover" />

                            {/* --- FAKE EQUALIZER (VISIBLE TOUT LE TEMPS, ANIMÉ SI PLAY) --- */}
                            {/* On affiche l'overlay sombre uniquement si ça joue, ou tout le temps si tu préfères */}
                            <div className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-end justify-center pb-1.5 gap-0.5 md:gap-1 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>

                                {/* Barre 1 */}
                                <div
                                    className={`w-1 md:w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-blue-500 ${isPlaying ? 'animate-[music-bar_1s_ease-in-out_infinite]' : 'h-[30%]'}`}
                                    style={{ height: isPlaying ? undefined : '30%' }} // Hauteur fixe quand pause
                                />

                                {/* Barre 2 (Délai différent) */}
                                <div
                                    className={`w-1 md:w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-blue-500 ${isPlaying ? 'animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]' : 'h-[50%]'}`}
                                    style={{ height: isPlaying ? undefined : '50%' }}
                                />

                                {/* Barre 3 (Délai différent) */}
                                <div
                                    className={`w-1 md:w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-blue-500 ${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]' : 'h-[40%]'}`}
                                    style={{ height: isPlaying ? undefined : '40%' }}
                                />
                            </div>
                        </Link>

                        <div className="overflow-hidden flex flex-col justify-center min-w-0">
                            <Link href={`/audio/${currentTrack.reciter.id}`} className="block">
                                <h4 className="text-white font-bold text-xs md:text-lg truncate leading-tight hover:text-emerald-400 transition-colors drop-shadow-sm">
                                    {currentTrack.surah.name_simple}
                                </h4>
                            </Link>
                            <p className="text-[10px] md:text-sm text-slate-400 truncate">
                                {currentTrack.reciter.name}
                            </p>
                        </div>
                    </div>

                    {/* --- CONTRÔLES (CENTRE) --- */}
                    <div className="flex items-center justify-end md:justify-center flex-shrink-0 gap-2 md:gap-6 md:flex-1 z-10">

                        {/* MOBILE */}
                        <div className="flex items-center gap-1 md:hidden">
                            <button onClick={toggleLoop} className={`p-2 rounded-full ${isLoop ? "text-emerald-400" : "text-slate-500"}`}>
                                {isLoop ? <Repeat1 size={14} /> : <Repeat size={14} />}
                            </button>
                            <button onClick={playPrev} className="p-2 text-slate-300 active:text-white"><SkipBack size={18} /></button>
                            <button onClick={togglePlay} className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg mx-1 border border-white/10 ${isPlaying ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-white/10 text-white backdrop-blur-md"}`}>
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button onClick={playNext} className="p-2 text-slate-300 active:text-white"><SkipForward size={18} /></button>
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={playPrev} className="text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipBack size={24} /></button>
                            <button onClick={togglePlay} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl border border-white/10 ${isPlaying ? "bg-emerald-500 text-white shadow-emerald-500/40 scale-105" : "bg-white/10 text-white hover:bg-white/20 hover:scale-110"}`}>
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={playNext} className="text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipForward size={24} /></button>
                        </div>

                        {/* Timeline Desktop */}
                        <div className="hidden md:flex items-center gap-3 w-full max-w-xl group/timeline ml-4">
                            <span className="text-xs text-slate-400 font-medium w-10 text-right font-mono">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 h-6 flex items-center cursor-pointer group">
                                <input type="range" min={0} max={duration || 100} value={currentTime} onChange={(e) => seek(Number(e.target.value))} className="absolute z-20 w-full h-full opacity-0 cursor-pointer" />
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-100 linear shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 font-medium w-10 font-mono">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* --- VOLUME & BRANDING (DESKTOP) --- */}
                    <div className="hidden md:flex items-center justify-end gap-6 md:w-1/4 z-10">
                        <button onClick={toggleLoop} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${isLoop ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-transparent border-white/10 text-slate-500 hover:text-slate-300"}`}>
                            {isLoop ? <Repeat1 size={16} /> : <Repeat size={16} />}
                            <span className="hidden lg:inline">{isLoop ? "Boucle" : "Continu"}</span>
                        </button>

                        <div className="flex items-center gap-2 relative w-24 group/vol">
                            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-slate-400 hover:text-white transition-colors"><Volume2 size={20} /></button>
                            <div className="relative flex-1 h-8 flex items-center">
                                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="absolute z-30 w-full h-full opacity-0 cursor-pointer" />
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${volume * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Branding */}
                        <Link
                            href="https://gomuslimlife.com"
                            target="_blank"
                            className="pl-6 border-l border-white/10 hidden xl:flex items-center gap-2 group/brand opacity-50 hover:opacity-100 transition-all duration-300"
                        >
                            <div className="relative w-5 h-5 grayscale group-hover/brand:grayscale-0 transition-all">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 group-hover/brand:text-white tracking-wide">
                                GoMuslim<span className="text-emerald-400">Life</span>
                            </span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}