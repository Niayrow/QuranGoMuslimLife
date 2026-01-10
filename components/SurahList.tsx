"use client";

import { Chapter } from "@/types";
import { Play, Pause, Signal } from "lucide-react"; // Signal icône pour l'effet "live"
import { useAudio } from "@/context/AudioContext";
import { POPULAR_RECITERS } from "@/lib/constants";

interface SurahListProps {
    chapters: Chapter[];
    reciterId: number;
    serverUrl?: string;
}

export default function SurahList({ chapters, reciterId, serverUrl }: SurahListProps) {
    const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
    const reciterInfo = POPULAR_RECITERS.find(r => r.id === reciterId);

    const handlePlay = (chapter: Chapter) => {
        if (!reciterInfo || !serverUrl) return;

        if (currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId) {
            togglePlay();
            return;
        }

        playTrack(
            chapter,
            {
                id: reciterId,
                name: reciterInfo.name,
                image: reciterInfo.image,
                serverUrl: serverUrl
            },
            chapters
        );
    };

    return (
        <div className="space-y-2">
            {chapters.map((chapter) => {
                const isCurrentTrack = currentTrack?.surah.id === chapter.id && currentTrack?.reciter.id === reciterId;
                const isActuallyPlaying = isCurrentTrack && isPlaying;

                return (
                    <div
                        key={chapter.id}
                        onClick={() => handlePlay(chapter)}
                        className={`group relative flex items-center justify-between p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border overflow-hidden
              ${isCurrentTrack
                                ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-2" // Décalage actif
                                : "bg-transparent border-transparent hover:bg-white/5 hover:translate-x-1"
                            }`}
                    >
                        {/* --- FOND DÉGRADÉ ANIMÉ (Uniquement si actif) --- */}
                        {isCurrentTrack && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-transparent opacity-100 transition-opacity" />
                        )}

                        {/* --- BARRE LATÉRALE ACTIVE --- */}
                        {isCurrentTrack && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-r-full" />
                        )}

                        <div className="relative flex items-center gap-4 z-10">
                            {/* Bouton Play/Pause */}
                            <div className="relative">
                                <div
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCurrentTrack
                                            ? "bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                                        }`}
                                >
                                    {isActuallyPlaying ? (
                                        <Pause size={18} fill="currentColor" />
                                    ) : (
                                        <Play size={18} fill="currentColor" className="ml-1" />
                                    )}
                                </div>

                                {/* Visualizer animé (Barres qui bougent) */}
                                {isActuallyPlaying && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 h-3 items-end">
                                        <span className="w-0.5 bg-emerald-400 animate-[bounce_0.8s_infinite] h-2"></span>
                                        <span className="w-0.5 bg-blue-400 animate-[bounce_1.2s_infinite] h-3"></span>
                                        <span className="w-0.5 bg-emerald-400 animate-[bounce_0.6s_infinite] h-1.5"></span>
                                    </div>
                                )}
                            </div>

                            {/* Infos Texte */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md 
                    ${isCurrentTrack ? "bg-white/10 text-emerald-300" : "bg-white/5 text-slate-500"}`}>
                                        {chapter.id}
                                    </span>
                                    <h3 className={`font-bold text-sm md:text-base transition-colors
                    ${isCurrentTrack
                                            ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300" // Titre en dégradé
                                            : "text-slate-200 group-hover:text-white"
                                        }`}>
                                        {chapter.name_simple}
                                    </h3>
                                </div>
                                <p className={`text-xs ml-8 transition-colors ${isCurrentTrack ? "text-slate-300" : "text-slate-500"}`}>
                                    {chapter.translated_name.name}
                                </p>
                            </div>
                        </div>

                        {/* Infos Arabe & Statut */}
                        <div className="relative z-10 text-right">
                            <span className={`font-serif text-lg md:text-xl block transition-colors
                ${isCurrentTrack ? "text-emerald-200" : "text-slate-600 group-hover:text-slate-400"}`} dir="rtl">
                                {chapter.name_arabic}
                            </span>

                            {/* Petit badge "En écoute" */}
                            {isActuallyPlaying && (
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">En écoute</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}