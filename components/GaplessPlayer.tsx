"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Loader2, PlayCircle, Languages, Type, Repeat1 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Verse {
    number: number;
    text: string;
    transliteration: string;
    numberInSurah: number;
}

interface Timestamp {
    verseNum: number;
    start: number;
    end: number;
}

interface GaplessPlayerProps {
    surahId: number;
    reciter: any;
    chapters: any[];
}

export default function GaplessPlayer({ surahId, reciter, chapters }: GaplessPlayerProps) {
    const { currentTime, isPlaying, togglePlay, playTrack, seek, currentTrack } = useAudio();
    const router = useRouter();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
    const [currentAyahNum, setCurrentAyahNum] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPhonetic, setIsPhonetic] = useState(false);
    const [isVerseLooping, setIsVerseLooping] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const activeVerseRef = useRef<HTMLDivElement | null>(null);
    const bismillahRef = useRef<HTMLDivElement | null>(null);

    const pad = (num: number) => num.toString().padStart(3, '0');

    const getReciterFolder = (id: number) => {
        if (id === 87) return "nasseralqatami";
        return null;
    };

    const showBismillahHeader = surahId !== 1 && surahId !== 9;

    // --- MASQUER LE HEADER GLOBAL ET LA NAVBAR ---
    useEffect(() => {
        // 1. On sélectionne le Header Mobile et la Navbar du bas
        // On essaie plusieurs sélecteurs courants pour la navbar (balise <nav> ou classe fixed bottom-0)
        const elementsToHide = [
            document.querySelector('.fixed.top-0.z-40.md\\:hidden'), // Header Mobile
        ];

        // On filtre les éléments trouvés (non null)
        const validElements = elementsToHide.filter(el => el !== null) as HTMLElement[];

        // On sauvegarde l'état initial pour le restaurer après
        const originalDisplays = validElements.map(el => el.style.display);

        // On masque tout
        validElements.forEach(el => el.style.display = 'none');

        // Nettoyage : On réaffiche tout quand on quitte ce composant
        return () => {
            validElements.forEach((el, index) => {
                el.style.display = originalDisplays[index];
            });
        };
    }, []);

    // --- NAVIGATION AUTO ---
    useEffect(() => {
        if (!isPlayerReady) return;
        if (currentTrack && currentTrack.reciter.id === reciter.id && currentTrack.surah.id !== surahId) {
            router.push(`/audio/${reciter.id}?surah=${currentTrack.surah.id}`);
        }
    }, [currentTrack, reciter.id, surahId, router, isPlayerReady]);

    // --- CHARGEMENT ---
    useEffect(() => {
        const loadData = async () => {
            setIsPlayerReady(false);
            setIsLoading(true);
            try {
                const textRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.transliteration`);
                const textData = await textRes.json();
                let versesCount = 0;

                if (textData.data && textData.data.length >= 2) {
                    const arabicData = textData.data[0].ayahs;
                    const phoneticData = textData.data[1].ayahs;
                    versesCount = arabicData.length;

                    let mergedVerses: Verse[] = arabicData.map((ayah: any, index: number) => ({
                        number: ayah.number,
                        numberInSurah: ayah.numberInSurah,
                        text: ayah.text,
                        transliteration: phoneticData[index] ? phoneticData[index].text : ""
                    }));

                    if (surahId !== 1 && surahId !== 9 && mergedVerses.length > 0) {
                        const BASMALAH_AR = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
                        const BASMALAH_EN = "Bismillaahir Rahmaanir Raheem";
                        if (mergedVerses[0].text.startsWith(BASMALAH_AR)) mergedVerses[0].text = mergedVerses[0].text.replace(BASMALAH_AR, "").trim();
                        if (mergedVerses[0].transliteration.includes(BASMALAH_EN)) mergedVerses[0].transliteration = mergedVerses[0].transliteration.replace(BASMALAH_EN, "").trim();
                    }
                    setVerses(mergedVerses);
                }

                const folderName = getReciterFolder(reciter.id);
                if (folderName) {
                    const timestampRes = await fetch(`/timestamps/${folderName}/${pad(surahId)}.txt`);
                    if (timestampRes.ok) {
                        const textContent = await timestampRes.text();
                        const endTimes = textContent.split('\n')
                            .map(line => {
                                const match = line.match(/(\d+)\s*$/);
                                return match ? parseInt(match[1]) : NaN;
                            })
                            .filter(num => !isNaN(num));

                        const hasBasmalahTimestamp = (surahId !== 1 && surahId !== 9) && (endTimes.length === versesCount + 1);

                        const newTimestamps: Timestamp[] = endTimes.map((endTime, index) => {
                            const startTime = index === 0 ? 0 : endTimes[index - 1];
                            let vNum = index + 1;
                            if (hasBasmalahTimestamp) vNum = index;
                            return { verseNum: vNum, start: startTime, end: endTime };
                        });
                        setTimestamps(newTimestamps);
                    } else { setTimestamps([]); }
                } else { setTimestamps([]); }

                if (reciter && reciter.server) {
                    const isSameTrack = currentTrack?.surah?.id === surahId && currentTrack?.reciter?.id === reciter.id;
                    if (!isSameTrack) {
                        playTrack(
                            {
                                id: surahId,
                                name_simple: textData.data[0].englishName,
                                name_complex: textData.data[0].englishName,
                                name_arabic: textData.data[0].name,
                                verses_count: versesCount,
                                revelation_place: "makkah",
                                revelation_order: 0,
                                bismillah_pre: false,
                                pages: [0, 0],
                                translated_name: { name: "", language_name: "fr" }
                            },
                            reciter,
                            chapters
                        );
                    }
                }
            } catch (e) {
                console.error("Erreur chargement", e);
            } finally {
                setIsLoading(false);
                setIsPlayerReady(true);
            }
        };
        loadData();
    }, [surahId, reciter]);

    // --- BOUCLE VERSET ---
    useEffect(() => {
        if (!isVerseLooping || timestamps.length === 0) return;
        const timeInMs = currentTime * 1000;
        const currentSegment = timestamps.find(t => t.verseNum === currentAyahNum);
        if (currentSegment) {
            if (timeInMs >= currentSegment.end) {
                seek(currentSegment.start / 1000);
            }
        }
    }, [currentTime, isVerseLooping, currentAyahNum, timestamps, seek]);

    // --- SYNCHRO VISUELLE ---
    useEffect(() => {
        if (timestamps.length === 0) return;
        const timeInMs = currentTime * 1000;
        const activeVerse = timestamps.find((t) => timeInMs >= t.start && timeInMs < t.end);
        if (activeVerse && activeVerse.verseNum !== currentAyahNum) setCurrentAyahNum(activeVerse.verseNum);
    }, [currentTime, timestamps]);

    const skipToVerse = (verseNum: number) => {
        const target = timestamps.find(t => t.verseNum === verseNum);
        if (target) {
            seek(target.start / 1000);
            setCurrentAyahNum(verseNum);
        }
    };

    useEffect(() => {
        if (currentAyahNum === 0 && bismillahRef.current) bismillahRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        else if (activeVerseRef.current) activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [currentAyahNum]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-emerald-400 gap-4">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="animate-pulse">Chargement...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 pb-96 animate-in fade-in duration-700 relative">

            {/* LOGO SEUL (HAUT) */}
            <div className="fixed top-[4.5rem] left-0 right-0 z-40 md:hidden flex items-center justify-center pointer-events-none">
                <Link href="/" className="relative w-12 h-12 pointer-events-auto filter drop-shadow-xl transition-transform active:scale-95">
                    <Image src="/logo.png" alt="GoMuslim" fill className="object-contain" />
                </Link>
            </div>

            {/* TOGGLE PHONÉTIQUE */}
            <div className="flex justify-center mb-8 sticky top-32 z-30">
                <button onClick={() => setIsPhonetic(!isPhonetic)} className="flex items-center gap-2 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:border-emerald-500/50 transition-all group">
                    {isPhonetic ? <><Languages size={16} className="text-emerald-400" /><span className="text-white">Mode Phonétique</span></> : <><Type size={16} className="text-emerald-400" /><span className="text-white">Mode Arabe</span></>}
                </button>
            </div>

            {/* BISMILLAH */}
            {showBismillahHeader && (
                <div ref={bismillahRef} className={`text-center mb-12 py-8 font-serif text-3xl md:text-4xl transition-all duration-500 rounded-3xl ${currentAyahNum === 0 ? "text-emerald-400 scale-110 bg-white/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "text-emerald-500/60 opacity-80"}`}>
                    {isPhonetic ? "Bismillaahir Rahmaanir Raheem" : "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"}
                </div>
            )}

            {/* LISTE VERSETS */}
            <div className={`space-y-8 ${isPhonetic ? "text-left ltr" : "text-right rtl"}`} dir={isPhonetic ? "ltr" : "rtl"}>
                {verses.map((verse) => {
                    const vNum = verse.numberInSurah;
                    const isActive = vNum === currentAyahNum;
                    return (
                        <div key={vNum} ref={isActive ? activeVerseRef : null} onClick={() => skipToVerse(vNum)} className={`relative p-6 rounded-3xl transition-all duration-500 cursor-pointer group ${isActive ? "bg-white/5 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] scale-105 my-8" : "border border-transparent hover:bg-white/5"}`}>
                            <p className={`leading-[2.2] transition-all ${isPhonetic ? "font-sans text-xl md:text-2xl text-slate-200" : "font-serif text-3xl md:text-4xl text-white"} ${isActive ? "text-white drop-shadow-md" : isPhonetic ? "text-slate-300" : "text-slate-400"}`}>
                                {isPhonetic ? verse.transliteration : verse.text}
                            </p>
                            <div className={`flex items-center justify-between mt-4 ${isPhonetic ? "" : "flex-row-reverse"}`}>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isActive ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-500"}`}>Verset {vNum}</span>
                                <button className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-emerald-400" : "text-slate-500"}`}><PlayCircle size={20} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BARRE FLOTTANTE CONTROLE VERSETS */}
            <div className="fixed bottom-36 md:bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 px-4 pointer-events-none">
                <div className="bg-black/20 backdrop-blur-sm rounded-full border border-white/5 p-2 md:p-3 flex flex-col items-center gap-1 pointer-events-auto transition-all hover:bg-black/40">

                    <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold">
                        Navigation Verset
                    </div>

                    <div className="flex items-center justify-between w-full gap-4 px-4">
                        <button onClick={() => skipToVerse(Math.max(1, currentAyahNum - 1))} className="text-slate-300 hover:text-white transition-colors active:scale-90">
                            <SkipBack size={20} />
                        </button>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsVerseLooping(!isVerseLooping)}
                                className={`transition-all ${isVerseLooping ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-400 hover:text-slate-200"}`}
                                title="Boucler Verset"
                            >
                                <Repeat1 size={20} />
                            </button>

                            <button onClick={togglePlay} className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-95 border border-white/10">
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                            </button>
                        </div>

                        <button onClick={() => skipToVerse(Math.min(verses.length, currentAyahNum + 1))} className="text-slate-300 hover:text-white transition-colors active:scale-90">
                            <SkipForward size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}