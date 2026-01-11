"use client";

import { useState, useEffect, useRef } from "react";
import { getAyahAudioUrl } from "@/lib/everyayah";
import { Play, Pause, SkipForward, SkipBack, Loader2 } from "lucide-react";

interface Verse {
    id: number;
    verse_key: string;
    text_uthmani: string;
}

export default function SyncPlayer({ surahId }: { surahId: number }) {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Référence audio HTML5
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // Référence pour scroller automatiquement vers le verset actif
    const activeVerseRef = useRef<HTMLDivElement | null>(null);

    // 1. Récupérer le texte des versets (API Quran.com)
    useEffect(() => {
        const fetchVerses = async () => {
            try {
                const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`);
                const data = await res.json();
                setVerses(data.verses);
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur chargement versets", error);
            }
        };
        fetchVerses();
    }, [surahId]);

    // 2. Gérer la lecture Audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        // Fonction pour passer au suivant à la fin du verset
        const handleEnded = () => {
            if (currentAyahIndex < verses.length - 1) {
                setCurrentAyahIndex((prev) => prev + 1);
            } else {
                setIsPlaying(false); // Fin de la sourate
            }
        };

        audio.addEventListener("ended", handleEnded);

        // Charger et jouer le verset actuel
        if (verses.length > 0) {
            const ayahNumber = currentAyahIndex + 1;
            audio.src = getAyahAudioUrl(surahId, ayahNumber);

            if (isPlaying) {
                audio.play().catch(e => console.error("Erreur lecture", e));
            }
        }

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.pause();
        };
    }, [currentAyahIndex, surahId, verses]);

    // 3. Effet de "Play/Pause" immédiat sans recharger la source si on ne change pas de verset
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
        }
    }, [isPlaying]);

    // 4. Scroll automatique vers le verset actif
    useEffect(() => {
        if (activeVerseRef.current) {
            activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentAyahIndex]);


    if (isLoading) return <div className="text-center p-10 text-emerald-400"><Loader2 className="animate-spin mx-auto" /> Chargement du texte...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 pb-32">

            {/* ZONE DE TEXTE (VERSETS) */}
            <div className="space-y-6 text-right" dir="rtl">
                {verses.map((verse, index) => {
                    const isActive = index === currentAyahIndex;

                    return (
                        <div
                            key={verse.id}
                            ref={isActive ? activeVerseRef : null} // Référence pour le scroll
                            onClick={() => { setCurrentAyahIndex(index); setIsPlaying(true); }} // Click to play
                            className={`relative p-4 rounded-xl leading-[2.5] text-2xl md:text-3xl font-serif transition-all duration-500 cursor-pointer border-b border-white/5
                ${isActive
                                    ? "bg-emerald-500/10 text-emerald-300 scale-105 shadow-lg border-none py-8"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {verse.text_uthmani}

                            {/* Numéro du verset */}
                            <span className={`inline-flex items-center justify-center w-8 h-8 mr-2 text-sm border rounded-full font-sans
                ${isActive ? "border-emerald-500 text-emerald-500" : "border-slate-600 text-slate-600"}`}>
                                {index + 1}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* BARRE DE CONTRÔLE FLOTTANTE */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-full shadow-2xl flex items-center gap-6 z-50">

                <button
                    onClick={() => setCurrentAyahIndex(prev => Math.max(0, prev - 1))}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <SkipBack size={24} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={() => setCurrentAyahIndex(prev => Math.min(verses.length - 1, prev + 1))}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <SkipForward size={24} />
                </button>

                {/* Info Verset Actuel */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 whitespace-nowrap">
                    Verset {currentAyahIndex + 1} / {verses.length}
                </div>
            </div>

        </div>
    );
}