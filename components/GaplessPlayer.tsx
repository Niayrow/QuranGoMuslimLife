"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Loader2, PlayCircle, Languages, Type, Repeat1, Repeat, X, Check, MapPin, Flag } from "lucide-react";
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
    const [isABLooping, setIsABLooping] = useState(false);
    const [showABMenu, setShowABMenu] = useState(false);

    const [loopStartVerse, setLoopStartVerse] = useState<number | string>(1);
    const [loopEndVerse, setLoopEndVerse] = useState<number | string>(1);

    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const activeVerseRef = useRef<HTMLDivElement | null>(null);
    const bismillahRef = useRef<HTMLDivElement | null>(null);

    const pad = (num: number) => num.toString().padStart(3, '0');

    const getReciterFolder = (id: number) => {
        if (id === 87) return "nasseralqatami";
        if (id === 125) return "yasseraddussary";
        if (id === 10) return "shuraim";
      

        return null;
    };

    const showBismillahHeader = surahId !== 1 && surahId !== 10;

    useEffect(() => {
        const headerMobile = document.querySelector('.fixed.top-0.z-40.md\\:hidden') as HTMLElement;
        if (headerMobile) headerMobile.style.display = 'none';

        return () => {
            if (headerMobile) headerMobile.style.display = '';
        };
    }, []);

    useEffect(() => {
        if (!isPlayerReady) return;
        if (currentTrack && currentTrack.reciter.id === reciter.id && currentTrack.surah.id !== surahId) {
            router.push(`/audio/${reciter.id}?surah=${currentTrack.surah.id}`);
        }
    }, [currentTrack, reciter.id, surahId, router, isPlayerReady]);

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
                    setLoopEndVerse(versesCount);
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

                        const newTimestamps: Timestamp[] = endTimes.map((endTime, index) => {
                            const startTime = index === 0 ? 0 : endTimes[index - 1];
                            let vNum = index + 1;
                            // Petite correction pour la basmalah si nécessaire
                            if (versesCount > 0 && endTimes.length === versesCount + 1 && index === 0) return { verseNum: 0, start: 0, end: endTime };
                            if (versesCount > 0 && endTimes.length === versesCount + 1) vNum = index;

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

    useEffect(() => {
        if (!isVerseLooping || isABLooping || timestamps.length === 0) return;
        const timeInMs = currentTime * 1000;
        const currentSegment = timestamps.find(t => t.verseNum === currentAyahNum);
        if (currentSegment) {
            if (timeInMs >= currentSegment.end) {
                seek(currentSegment.start / 1000);
            }
        }
    }, [currentTime, isVerseLooping, isABLooping, currentAyahNum, timestamps, seek]);

    useEffect(() => {
        if (!isABLooping || timestamps.length === 0) return;
        const timeInMs = currentTime * 1000;

        const safeStart = typeof loopStartVerse === 'number' ? loopStartVerse : 1;
        const safeEnd = typeof loopEndVerse === 'number' ? loopEndVerse : verses.length;

        const startSegment = timestamps.find(t => t.verseNum === safeStart);
        const endSegment = timestamps.find(t => t.verseNum === safeEnd);

        if (startSegment && endSegment) {
            if (timeInMs >= endSegment.end) {
                seek(startSegment.start / 1000);
                setCurrentAyahNum(safeStart);
            }
        }
    }, [currentTime, isABLooping, loopStartVerse, loopEndVerse, timestamps, seek, verses.length]);

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

    const activateABLoop = () => {
        let start = (loopStartVerse === '' || loopStartVerse === undefined) ? 1 : Number(loopStartVerse);
        let end = (loopEndVerse === '' || loopEndVerse === undefined) ? verses.length : Number(loopEndVerse);

        start = Math.max(1, Math.min(start, verses.length));
        end = Math.max(1, Math.min(end, verses.length));

        if (start > end) end = start;

        setLoopStartVerse(start);
        setLoopEndVerse(end);

        setIsABLooping(true);
        setIsVerseLooping(false);
        setShowABMenu(false);
        skipToVerse(start);
    };

    const handleInputChange = (type: 'start' | 'end', val: string) => {
        if (val === '') {
            if (type === 'start') setLoopStartVerse('');
            else setLoopEndVerse('');
            return;
        }
        if (/^\d+$/.test(val)) {
            const num = parseInt(val);
            if (type === 'start') setLoopStartVerse(num);
            else setLoopEndVerse(num);
        }
    };

    const setQuickLoopStart = (vNum: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLoopStartVerse(vNum);
        if (typeof loopEndVerse === 'number' && vNum > loopEndVerse) setLoopEndVerse(vNum);
        setShowABMenu(true);
    };

    const setQuickLoopEnd = (vNum: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLoopEndVerse(vNum);
        if (typeof loopStartVerse === 'number' && vNum < loopStartVerse) setLoopStartVerse(vNum);
        setShowABMenu(true);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-emerald-400 gap-4">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="animate-pulse">Chargement...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 pb-96 animate-in fade-in duration-700 relative">

            <div className="fixed top-[4.5rem] left-0 right-0 z-40 md:hidden flex items-center justify-center pointer-events-none">
                <Link href="/" className="relative w-12 h-12 pointer-events-auto filter drop-shadow-xl transition-transform active:scale-95">
                    <Image src="/logo.png" alt="GoMuslim" fill className="object-contain" />
                </Link>
            </div>

            <div className="flex justify-center mb-8 sticky top-32 z-30">
                <button onClick={() => setIsPhonetic(!isPhonetic)} className="flex items-center gap-2 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:border-emerald-500/50 transition-all group">
                    {isPhonetic ? <><Languages size={16} className="text-emerald-400" /><span className="text-white">Mode Phonétique</span></> : <><Type size={16} className="text-emerald-400" /><span className="text-white">Mode Arabe</span></>}
                </button>
            </div>

            <div className={`space-y-8 ${isPhonetic ? "text-left ltr" : "text-right rtl"}`} dir={isPhonetic ? "ltr" : "rtl"}>
                {showBismillahHeader && (
                    <div ref={bismillahRef} className={`text-center mb-12 py-8 font-serif text-3xl md:text-4xl transition-all duration-500 rounded-3xl ${currentAyahNum === 0 ? "text-emerald-400 scale-110 bg-white/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "text-emerald-500/60 opacity-80"}`}>
                        {isPhonetic ? "Bismillaahir Rahmaanir Raheem" : "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"}
                    </div>
                )}
                {verses.map((verse) => {
                    const vNum = verse.numberInSurah;
                    const isActive = vNum === currentAyahNum;

                    const s = (typeof loopStartVerse === 'number') ? loopStartVerse : 1;
                    const e = (typeof loopEndVerse === 'number') ? loopEndVerse : verses.length;

                    // --- CHANGEMENT ICI : Surlignage Rouge ---
                    const isInLoopRange = isABLooping && vNum >= s && vNum <= e;

                    const isStart = loopStartVerse === vNum;
                    const isEnd = loopEndVerse === vNum;

                    return (
                        <div key={vNum} ref={isActive ? activeVerseRef : null} onClick={() => skipToVerse(vNum)}
                            className={`relative p-6 rounded-3xl transition-all duration-500 cursor-pointer group 
                             ${isActive
                                    ? "bg-white/5 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] scale-105 my-8"
                                    : isInLoopRange
                                        ? "bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" // ROUGE ICI
                                        : "border border-transparent hover:bg-white/5"
                                }`}>

                            <p className={`leading-[2.2] transition-all ${isPhonetic ? "font-sans text-xl md:text-2xl text-slate-200" : "font-serif text-3xl md:text-4xl text-white"} ${isActive ? "text-white drop-shadow-md" : isPhonetic ? "text-slate-300" : "text-slate-400"}`}>
                                {isPhonetic ? verse.transliteration : verse.text}
                            </p>

                            <div className={`flex flex-wrap items-center justify-between mt-4 gap-3 ${isPhonetic ? "" : "flex-row-reverse"}`}>

                                <div className={`flex items-center gap-2 ${isPhonetic ? "flex-row" : "flex-row-reverse"}`}>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isActive || isInLoopRange ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-500"}`}>
                                        Verset {vNum}
                                    </span>

                                    {/* BOUTON DÉBUT (Rouge si actif) */}
                                    <button
                                        onClick={(e) => setQuickLoopStart(vNum, e)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all border shadow-sm
                                            ${isStart
                                                ? "bg-red-500 text-white border-red-400 shadow-red-500/20"
                                                : "bg-white/10 text-slate-300 border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"}`}
                                    >
                                        <MapPin size={10} /> Début
                                    </button>

                                    {/* BOUTON FIN (Rouge si actif) */}
                                    <button
                                        onClick={(e) => setQuickLoopEnd(vNum, e)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all border shadow-sm
                                            ${isEnd
                                                ? "bg-red-500 text-white border-red-400 shadow-red-500/20"
                                                : "bg-white/10 text-slate-300 border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"}`}
                                    >
                                        <Flag size={10} /> Fin
                                    </button>
                                </div>

                                <button className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-emerald-400" : "text-slate-500"}`}><PlayCircle size={20} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-40 md:bottom-28 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-[40] pointer-events-none">

                {showABMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-4 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in duration-200 pointer-events-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Boucle A-B</span>
                            <button onClick={() => setShowABMenu(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="text-[10px] text-slate-400 block mb-1">DÉBUT</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={loopStartVerse}
                                    onChange={(e) => handleInputChange('start', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] text-slate-400 block mb-1">FIN</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={loopEndVerse}
                                    onChange={(e) => handleInputChange('end', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                        <button onClick={activateABLoop} className="w-full py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Check size={16} /> Appliquer la boucle
                        </button>
                    </div>
                )}

                <div className="bg-black/60 backdrop-blur-md rounded-full border border-white/10 p-2 flex items-center justify-between pointer-events-auto shadow-2xl">
                    <div className="flex items-center gap-1">
                        <button onClick={() => { setIsVerseLooping(!isVerseLooping); setIsABLooping(false); }} className={`p-2 rounded-full transition-all active:scale-90 ${isVerseLooping ? "text-emerald-400 bg-emerald-400/10" : "text-slate-400"}`}><Repeat1 size={20} /></button>
                        <button onClick={() => skipToVerse(Math.max(1, currentAyahNum - 1))} className="p-2 text-slate-300 active:scale-90"><SkipBack size={20} /></button>
                    </div>

                    <button onClick={togglePlay} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    <div className="flex items-center gap-1">
                        <button onClick={() => skipToVerse(Math.min(verses.length, currentAyahNum + 1))} className="p-2 text-slate-300 active:scale-90"><SkipForward size={20} /></button>
                        <button onClick={() => isABLooping ? setIsABLooping(false) : setShowABMenu(!showABMenu)} className={`p-2 rounded-full transition-all active:scale-90 ${isABLooping ? "text-blue-400 bg-blue-400/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "text-slate-400"}`}><Repeat size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}