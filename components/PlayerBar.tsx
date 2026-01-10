"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Repeat, Repeat1 } from "lucide-react";
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
        <div className="fixed bottom-20 left-4 right-4 md:bottom-0 md:left-0 md:right-0 z-50 transition-all duration-500 ease-out">

            {/* CONTAINER DU LECTEUR */}
            <div className={`
        w-full overflow-hidden relative group backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50
        bg-[#0f172a]/95 md:bg-[#0f172a]/80 
        rounded-t-2xl rounded-b-none border-b-white/5 md:rounded-none md:border-b-0 md:border-t
      `}>

                {/* Progress Mobile (Ligne fine haut) */}
                <div className="absolute top-0 left-0 h-[3px] w-full bg-white/5 md:hidden z-50 pointer-events-none">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-100 linear" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-between p-3 md:px-8 md:py-4 h-20 md:h-24 gap-3 md:gap-8">

                    {/* --- INFO (GAUCHE) --- */}
                    <div className="flex items-center gap-3 md:gap-4 md:w-1/4 min-w-0 z-10 flex-[0.7] md:flex-none">
                        <Link href={`/audio/${currentTrack.reciter.id}`} className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg active:scale-95 transition-transform ${isPlaying ? 'animate-[spin_12s_linear_infinite] md:animate-none' : ''}`}>
                            <Image src={currentTrack.reciter.image} alt="Cover" fill className="object-cover" />
                        </Link>

                        <div className="overflow-hidden flex flex-col justify-center">
                            <Link href={`/audio/${currentTrack.reciter.id}`} className="block">
                                <h4 className="text-white font-bold text-sm md:text-lg truncate leading-tight hover:text-emerald-400 transition-colors">
                                    {currentTrack.surah.name_simple}
                                </h4>
                            </Link>
                            <p className="text-[11px] md:text-sm text-slate-400 truncate">
                                {currentTrack.reciter.name}
                            </p>
                        </div>
                    </div>

                    {/* --- CONTRÔLES (DROITE MOBILE & CENTRE DESKTOP) --- */}
                    <div className="flex items-center justify-end md:justify-center flex-shrink-0 gap-2 md:gap-6 md:flex-1 z-10">

                        {/* BOUTONS MOBILES */}
                        <div className="flex items-center md:hidden bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-sm">
                            <button onClick={toggleLoop} className={`p-2 rounded-full ${isLoop ? "text-emerald-400" : "text-slate-500"}`}>
                                {isLoop ? <Repeat1 size={16} /> : <Repeat size={16} />}
                            </button>
                            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                            <button onClick={playPrev} className="p-2 text-slate-300 active:text-white"><SkipBack size={20} /></button>
                            <button onClick={togglePlay} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg mx-1 ${isPlaying ? "bg-emerald-500 text-white" : "bg-white text-black"}`}>
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button onClick={playNext} className="p-2 text-slate-300 active:text-white"><SkipForward size={20} /></button>
                        </div>

                        {/* VERSION DESKTOP */}
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={playPrev} className="text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipBack size={24} /></button>
                            <button onClick={togglePlay} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlaying ? "bg-emerald-500 text-white" : "bg-white text-black hover:scale-110"}`}>
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={playNext} className="text-slate-400 hover:text-white transition-colors hover:scale-110"><SkipForward size={24} /></button>
                        </div>

                        {/* Timeline Desktop */}
                        <div className="hidden md:flex items-center gap-3 w-full max-w-xl group/timeline ml-4">
                            <span className="text-xs text-slate-500 font-medium w-10 text-right">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 h-6 flex items-center cursor-pointer group">
                                <input type="range" min={0} max={duration || 100} value={currentTime} onChange={(e) => seek(Number(e.target.value))} className="absolute z-20 w-full h-full opacity-0 cursor-pointer" />
                                <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-100 linear" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium w-10">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* --- VOLUME & BRANDING (DESKTOP ONLY) --- */}
                    <div className="hidden md:flex items-center justify-end gap-6 md:w-1/4 z-10">

                        <button onClick={toggleLoop} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${isLoop ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-transparent border-slate-700 text-slate-500"}`}>
                            {isLoop ? <Repeat1 size={16} /> : <Repeat size={16} />}
                            <span className="hidden lg:inline">{isLoop ? "En boucle" : "En continu"}</span>
                        </button>

                        <div className="flex items-center gap-2 relative w-24 group/vol">
                            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-slate-400 hover:text-white"><Volume2 size={20} /></button>
                            <div className="relative flex-1 h-8 flex items-center">
                                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="absolute z-30 w-full h-full opacity-0 cursor-pointer" />
                                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${volume * 100}%` }} /></div>
                            </div>
                        </div>

                        {/* --- NOUVEAU : BRANDING CLIQUABLE --- */}
                        {/* S'affiche uniquement sur les grands écrans (xl) pour ne pas charger les petits laptops */}
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