"use client";

import { Chapter } from "@/types";
import { Play, Pause, MapPin, AlignRight, Layers, BookOpenText } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { POPULAR_RECITERS } from "@/lib/constants";
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";

interface SurahListProps {
    chapters: Chapter[];
    reciterId: number;
    serverUrl?: string;
    isSyncEnabled?: boolean;
}

const JUZ_START_MAPPING: Record<number, number> = {
    1: 1, 2: 1, 3: 3, 4: 4, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11,
    11: 11, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 16, 20: 16,
    21: 17, 22: 17, 23: 18, 24: 18, 25: 18, 26: 19, 27: 19, 28: 20, 29: 20, 30: 21,
    31: 21, 32: 21, 33: 21, 34: 22, 35: 22, 36: 22, 37: 23, 38: 23, 39: 23, 40: 24,
    41: 24, 42: 25, 43: 25, 44: 25, 45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
    51: 26, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27, 57: 27, 58: 28, 59: 28, 60: 28,
    61: 28, 62: 28, 63: 28, 64: 28, 65: 28, 66: 28, 67: 29, 68: 29, 69: 29, 70: 29,
    71: 29, 72: 29, 73: 29, 74: 29, 75: 29, 76: 29, 77: 29, 78: 30,
};

const getJuzRangeLabel = (chapterId: number): string => {
    const start = JUZ_START_MAPPING[chapterId] || (chapterId >= 78 ? 30 : 0);
    const multiJuz: Record<number, string> = {
        2: "1-3", 3: "3-4", 4: "4-6", 5: "6-7", 6: "7-8", 7: "8-9", 8: "9-10",
        9: "10-11", 11: "11-12", 12: "12-13",
    };
    if (multiJuz[chapterId]) return `Juz ${multiJuz[chapterId]}`;
    return `Juz ${start}`;
};

const getJuzNumber = (chapterId: number) => {
    if (chapterId >= 78) return 30;
    return JUZ_START_MAPPING[chapterId] || 0;
}

export default function SurahList({ chapters, reciterId, serverUrl, isSyncEnabled = false }: SurahListProps) {
    const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
    const reciterInfo = POPULAR_RECITERS.find(r => r.id === reciterId);

    const handlePlay = (e: React.MouseEvent, chapter: Chapter) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!reciterInfo || !serverUrl) return;
        if (currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId) {
            togglePlay();
            return;
        }
        playTrack(chapter, { ...reciterInfo, server: serverUrl } as any, chapters);
    };

    return (
        <div className="space-y-3 pb-24 relative">
            {chapters.map((chapter, index) => {
                const isCurrentTrack = currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId;
                const isActuallyPlaying = isCurrentTrack && isPlaying;

                const currentJuz = getJuzNumber(chapter.id);
                const prevChapter = index > 0 ? chapters[index - 1] : null;
                const prevJuz = prevChapter ? getJuzNumber(prevChapter.id) : 0;
                const showJuzHeader = index === 0 || currentJuz !== prevJuz;

                const revelationPlace = chapter.revelation_place || "makkah";
                const isMakkah = revelationPlace === "makkah";
                const versesCount = chapter.verses_count || 0;
                const juzLabel = getJuzRangeLabel(chapter.id);

                return (
                    <Fragment key={chapter.id}>
                        {/* EN-TÊTE JUZ */}
                        {showJuzHeader && currentJuz > 0 && (
                            <div className="sticky top-0 z-30 py-3 -mx-2 px-2 backdrop-blur-xl bg-[#0f172a]/95 border-b border-emerald-500/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-1 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full"></div>
                                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                                        <Layers size={14} />
                                        Juz {currentJuz}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CARTE SOURATE */}
                        <div
                            onClick={(e) => handlePlay(e, chapter)}
                            className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-300 border overflow-hidden cursor-pointer
                ${isCurrentTrack
                                    ? "bg-[#1e293b]/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] translate-x-1 sm:translate-x-2"
                                    : "bg-[#1e293b]/30 border-white/5 hover:bg-[#1e293b]/60 hover:border-white/10"
                                }`}
                        >
                            {/* Effets visuels (Active Track) */}
                            {isCurrentTrack && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none" />}
                            {isCurrentTrack && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-500" />}

                            {/* --- PARTIE GAUCHE (ID + TEXTES) --- */}
                            <div className="relative flex items-center gap-3 sm:gap-4 z-10 flex-1 min-w-0 mr-2">

                                {/* ID Sourate */}
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold border transition-colors
                  ${isCurrentTrack ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20 shadow-lg" : "bg-white/5 text-slate-500 border-white/5"}`}>
                                    {chapter.id}
                                </div>

                                {/* Textes (Titre + Infos) */}
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <h3 className={`font-bold text-sm sm:text-base truncate transition-colors flex items-center gap-2
                     ${isCurrentTrack ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300" : "text-slate-200 group-hover:text-white"}`}>
                                        {chapter.name_simple}
                                        {isActuallyPlaying && <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative ml-1 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span></span>}
                                    </h3>

                                    {/* Infos compactes */}
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-medium text-slate-500 group-hover:text-slate-400">
                                        <span className="bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap"><Layers size={10} /> {juzLabel}</span>
                                        <span className="flex items-center gap-1 whitespace-nowrap"><AlignRight size={12} /> {versesCount}</span>

                                        {/* MODIFICATION ICI : Retrait de 'hidden sm:flex' pour afficher tout le temps */}
                                        <span className={`flex items-center gap-1 whitespace-nowrap ${isMakkah ? "text-amber-500/80" : "text-emerald-500/80"}`}>
                                            <MapPin size={12} /> {isMakkah ? "Mecque" : "Médine"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* --- PARTIE DROITE (BOUTONS) --- */}
                            <div className="relative z-10 flex items-center gap-2 sm:gap-3 pl-0 sm:pl-4 sm:border-l border-white/10 shrink-0">

                                {/* Nom Arabe (Caché sur mobile) */}
                                <div className={`text-right hidden sm:block`}>
                                    <span className={`font-serif text-xl block ${isCurrentTrack ? "text-emerald-200" : "text-slate-500 group-hover:text-slate-300"}`} dir="rtl">
                                        {chapter.name_arabic}
                                    </span>
                                </div>

                                {/* BOUTON SYNCHRO (Desktop) */}
                                {isSyncEnabled && (
                                    <Link
                                        href={`/audio/${reciterId}?surah=${chapter.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 uppercase tracking-wide z-20"
                                        title="Mode Synchronisé"
                                    >
                                        <BookOpenText size={16} />
                                        <span>Synchro</span>
                                    </Link>
                                )}

                                {/* BOUTON PLAY */}
                                <button
                                    onClick={(e) => handlePlay(e, chapter)}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                    ${isCurrentTrack
                                            ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white scale-100"
                                            : "bg-white/5 text-slate-400 scale-90 opacity-80 hover:opacity-100 hover:scale-100 hover:bg-emerald-500 hover:text-white"
                                        }`}
                                >
                                    {isActuallyPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                </button>

                                {/* BOUTON SYNCHRO (Mobile) */}
                                {isSyncEnabled && (
                                    <Link
                                        href={`/audio/${reciterId}?surah=${chapter.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wide shadow-md active:scale-95 transition-all z-20"
                                    >
                                        <BookOpenText size={12} />
                                        Synchro
                                    </Link>
                                )}

                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
}