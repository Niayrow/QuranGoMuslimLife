"use client";

import { Chapter } from "@/types";
import { Play, Pause, MapPin, AlignRight, Layers, LayoutGrid, List as ListIcon, GripHorizontal } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { POPULAR_RECITERS } from "@/lib/constants";
import { Fragment, useState } from "react";

interface SurahListProps {
    chapters: Chapter[];
    reciterId: number;
    serverUrl?: string;
}

// --- LOGIQUE JUZ ---
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

export default function SurahList({ chapters, reciterId, serverUrl }: SurahListProps) {
    const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
    const reciterInfo = POPULAR_RECITERS.find(r => r.id === reciterId);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const handlePlay = (chapter: Chapter) => {
        if (!reciterInfo || !serverUrl) return;
        if (currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId) {
            togglePlay();
            return;
        }
        playTrack(chapter, { id: reciterId, name: reciterInfo.name, image: reciterInfo.image, serverUrl: serverUrl }, chapters);
    };

    return (
        <div className="space-y-4 pb-24">

            {/* --- BARRE D'OUTILS --- */}
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <GripHorizontal className="text-emerald-400" size={20} />
                    Sourates
                </h3>
                <div className="bg-[#1e293b] p-1 rounded-lg border border-white/10 flex gap-1">
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                        <ListIcon size={18} />
                    </button>
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" : "space-y-3"}>
                {chapters.map((chapter, index) => {
                    const isCurrentTrack = currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId;
                    const isActuallyPlaying = isCurrentTrack && isPlaying;

                    const currentJuz = getJuzNumber(chapter.id);
                    const prevChapter = index > 0 ? chapters[index - 1] : null;
                    const prevJuz = prevChapter ? getJuzNumber(prevChapter.id) : 0;
                    const showJuzHeader = (index === 0 || currentJuz !== prevJuz) && viewMode === 'list';

                    // Données Metadata
                    const revelationPlace = chapter.revelation_place || "makkah";
                    const isMakkah = revelationPlace === "makkah";
                    const versesCount = chapter.verses_count || 0;
                    const juzLabel = getJuzRangeLabel(chapter.id);

                    return (
                        <Fragment key={chapter.id}>

                            {/* --- HEADER JUZ --- */}
                            {showJuzHeader && currentJuz > 0 && (
                                <div className="sticky top-0 z-30 py-3 -mx-2 px-2 backdrop-blur-xl bg-[#0f172a]/95 border-b border-emerald-500/10 transition-all col-span-full">
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-1 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full"></div>
                                        <span className="text-emerald-400 font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                                            <Layers size={14} />
                                            Juz {currentJuz}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'list' ? (
                                // === MODE LISTE ===
                                <div
                                    onClick={() => handlePlay(chapter)}
                                    className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border overflow-hidden
                    ${isCurrentTrack
                                            ? "bg-[#1e293b]/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] translate-x-2"
                                            : "bg-[#1e293b]/30 border-white/5 hover:bg-[#1e293b]/60 hover:border-white/10 hover:translate-x-1"
                                        }`}
                                >
                                    {isCurrentTrack && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none" />}
                                    {isCurrentTrack && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-500" />}

                                    <div className="relative flex items-center gap-4 z-10 flex-1 min-w-0">
                                        <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-sm font-bold border transition-colors
                      ${isCurrentTrack ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20 shadow-lg" : "bg-white/5 text-slate-500 border-white/5"}`}>
                                            {chapter.id}
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0">
                                            <h3 className={`font-bold text-base truncate transition-colors flex items-center gap-2
                         ${isCurrentTrack ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300" : "text-slate-200 group-hover:text-white"}`}>
                                                {chapter.name_simple}
                                                {isActuallyPlaying && <span className="flex h-2 w-2 relative ml-1 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
                                            </h3>

                                            {/* LIGNE METADATA COMPLETE : JUZ | VERSETS | LIEU */}
                                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 group-hover:text-slate-400">
                                                <span className="bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1"><Layers size={10} /> {juzLabel}</span>
                                                <span className="flex items-center gap-1"><AlignRight size={12} /> {versesCount}</span>
                                                {/* RESTAURATION DU LIEU DE RÉVÉLATION */}
                                                <span className={`flex items-center gap-1 ${isMakkah ? "text-amber-500/80" : "text-emerald-500/80"}`}>
                                                    <MapPin size={12} /> {isMakkah ? "Mecque" : "Médine"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-4 pl-4 border-l border-white/10 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <span className={`font-serif text-xl block ${isCurrentTrack ? "text-emerald-200" : "text-slate-500 group-hover:text-slate-300"}`} dir="rtl">
                                                {chapter.name_arabic}
                                            </span>
                                        </div>

                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                      ${isCurrentTrack
                                                ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white scale-100"
                                                : "bg-white/5 text-slate-400 scale-90 opacity-60 group-hover:opacity-100 group-hover:scale-100 group-hover:bg-emerald-500 group-hover:text-white"
                                            }`}>
                                            {isActuallyPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                        </div>
                                    </div>
                                </div>

                            ) : (
                                // === MODE GRILLE ===
                                <div
                                    onClick={() => handlePlay(chapter)}
                                    className={`group relative flex flex-col justify-between p-3 h-28 rounded-2xl cursor-pointer transition-all duration-300 border overflow-hidden
                    ${isCurrentTrack
                                            ? "bg-[#1e293b] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                            : "bg-[#1e293b]/40 border-white/5 hover:bg-[#1e293b]/80 hover:border-emerald-500/30 hover:-translate-y-1"
                                        }`}
                                >
                                    {isCurrentTrack && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 pointer-events-none" />}

                                    <div className="flex w-full justify-between items-start z-10">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isCurrentTrack ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500"}`}>
                                            {chapter.id}
                                        </span>
                                        {isActuallyPlaying && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
                                    </div>

                                    <div className="z-10 text-center">
                                        <h3 className={`font-bold text-sm truncate ${isCurrentTrack ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300" : "text-slate-200"}`}>
                                            {chapter.name_simple}
                                        </h3>
                                        <span className="text-[10px] text-slate-500 font-serif" dir="rtl">{chapter.name_arabic}</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}