"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft, Settings, Type, AlignLeft,
    Moon, Sun, Coffee, Check, Heart, History, Languages, BookOpen, LayoutTemplate,
    Copy
} from "lucide-react";

interface Verse {
    number: number;
    text: string;
    translation?: string;
    numberInSurah: number;
}

interface SurahInfo {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
}

// --- THÈMES (COULEURS CORRIGÉES) ---
const THEMES = {
    light: {
        name: "Clair",
        bg: "bg-white",
        text: "text-slate-900",
        accent: "text-emerald-600",
        panelBg: "bg-white",
        panelBorder: "border-slate-200",
        panelText: "text-slate-800"
    },
    sepia: {
        name: "Sépia",
        bg: "bg-[#f4ecd8]",
        text: "text-[#433422]",
        accent: "text-[#8b5e3c]",
        panelBg: "bg-[#e8dfc8]",
        panelBorder: "border-[#d4c5a9]",
        panelText: "text-[#433422]"
    },
    midnight: {
        name: "Nuit",
        bg: "bg-[#0f172a]",
        text: "text-[#e2e8f0]",
        accent: "text-blue-400",
        panelBg: "bg-[#1e293b]",
        panelBorder: "border-slate-700",
        panelText: "text-slate-200"
    },
    oled: {
        name: "OLED",
        bg: "bg-black",
        text: "text-gray-200",
        accent: "text-emerald-400",
        panelBg: "bg-[#1a1a1a]",
        panelBorder: "border-white/20",
        panelText: "text-white"
    },
};

export default function QuranReader({ surah, verses }: { surah: SurahInfo, verses: Verse[] }) {
    // --- ÉTATS ---
    const [fontSize, setFontSize] = useState(32);
    const [theme, setTheme] = useState<keyof typeof THEMES>("midnight");
    const [showArabic, setShowArabic] = useState(true);
    const [showFrench, setShowFrench] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [lastReadVerse, setLastReadVerse] = useState<number | null>(null);
    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const [showResumeButton, setShowResumeButton] = useState(false);
    const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

    const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // --- CHARGEMENT ---
    useEffect(() => {
        const savedTheme = localStorage.getItem("quran_theme") as keyof typeof THEMES;
        if (savedTheme && THEMES[savedTheme]) setTheme(savedTheme);

        const savedSize = localStorage.getItem("quran_fontSize");
        if (savedSize) setFontSize(Number(savedSize));

        const savedShowAr = localStorage.getItem("quran_showArabic");
        const savedShowFr = localStorage.getItem("quran_showFrench");
        if (savedShowAr !== null) setShowArabic(savedShowAr === "true");
        if (savedShowFr !== null) setShowFrench(savedShowFr === "true");

        const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${surah.number}`) || "[]");
        setBookmarks(savedBookmarks);

        const savedLastRead = localStorage.getItem(`lastRead_${surah.number}`);
        if (savedLastRead) {
            setLastReadVerse(Number(savedLastRead));
            setShowResumeButton(true);
        }
    }, [surah.number]);

    // --- SAUVEGARDES ---
    const updateTheme = (t: keyof typeof THEMES) => { setTheme(t); localStorage.setItem("quran_theme", t); };
    const updateFontSize = (s: number) => { setFontSize(s); localStorage.setItem("quran_fontSize", s.toString()); };

    const toggleShowArabic = () => {
        if (showArabic && !showFrench) return;
        setShowArabic(!showArabic);
        localStorage.setItem("quran_showArabic", String(!showArabic));
    };

    const toggleShowFrench = () => {
        if (showFrench && !showArabic) return;
        setShowFrench(!showFrench);
        localStorage.setItem("quran_showFrench", String(!showFrench));
    };

    const toggleBookmark = (verseNum: number) => {
        const newBookmarks = bookmarks.includes(verseNum)
            ? bookmarks.filter(b => b !== verseNum)
            : [...bookmarks, verseNum];
        setBookmarks(newBookmarks);
        localStorage.setItem(`bookmarks_${surah.number}`, JSON.stringify(newBookmarks));
    };

    const copyText = (verse: Verse) => {
        const text = `${verse.text}\n\n${verse.translation}\n[Sourate ${surah.englishName} - ${surah.number}:${verse.numberInSurah}]`;
        navigator.clipboard.writeText(text);
        setCopiedVerse(verse.number);
        setTimeout(() => setCopiedVerse(null), 2000);
    };

    const saveProgress = (verseNum: number) => {
        setLastReadVerse(verseNum);
        localStorage.setItem(`lastRead_${surah.number}`, verseNum.toString());
        setShowResumeButton(false);
    };

    const goToLastRead = () => {
        if (lastReadVerse && verseRefs.current[lastReadVerse]) {
            verseRefs.current[lastReadVerse]?.scrollIntoView({ behavior: "smooth", block: "center" });
            setShowResumeButton(false);
        }
    };

    const currentTheme = THEMES[theme];
    const frenchFontSize = Math.max(16, Math.round(fontSize * 0.55));

    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text} pb-32 font-sans`}>

            {/* HEADER FIXE */}
            <div className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b shadow-sm ${currentTheme.panelBg} ${currentTheme.panelBorder}`}>
                <Link href="/quran" className={`p-2 rounded-full hover:opacity-70 transition-opacity ${currentTheme.panelText}`}>
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <h1 className={`font-bold text-lg leading-none ${currentTheme.panelText}`}>{surah.englishName}</h1>
                    <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${currentTheme.accent}`}>Sourate {surah.number}</p>
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-full transition-all ${isMenuOpen ? `bg-current opacity-20` : `hover:opacity-70`} ${currentTheme.panelText}`}
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* BOUTON REPRENDRE */}
            {lastReadVerse && showResumeButton && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={goToLastRead}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl border text-xs font-bold uppercase tracking-wide transition-all active:scale-95
                        ${theme === 'light' ? 'bg-slate-900 text-white border-slate-700' : 'bg-emerald-500 text-black border-emerald-400'}`}
                    >
                        <History size={16} />
                        Reprendre Verset {verses.find(v => v.number === lastReadVerse)?.numberInSurah}
                    </button>
                </div>
            )}

            {/* MENU RÉGLAGES */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />

                    <div className={`fixed top-16 right-4 z-50 w-80 rounded-xl shadow-2xl p-5 border animate-in slide-in-from-top-2 duration-200 ${currentTheme.panelBg} ${currentTheme.panelBorder} ${currentTheme.panelText}`}>
                        <div className="space-y-6">

                            {/* 1. Thèmes */}
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block flex items-center gap-2">
                                    <LayoutTemplate size={14} /> Thème
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(THEMES).map(([key, t]) => (
                                        <button
                                            key={key}
                                            onClick={() => updateTheme(key as keyof typeof THEMES)}
                                            // ICI : Utilisation de t.bg dans className au lieu de style={} pour que Tailwind détecte la couleur
                                            className={`h-10 rounded-lg border-2 flex items-center justify-center transition-all ${t.bg} ${theme === key ? `border-emerald-500 ring-2 ring-emerald-500/20` : 'border-transparent opacity-70 hover:opacity-100'} shadow-sm`}
                                            title={t.name}
                                        >
                                            {/* Icônes avec couleur forcée pour le contraste */}
                                            {key === 'light' && <Sun size={18} className="text-slate-800" />}
                                            {key === 'sepia' && <Coffee size={18} className="text-[#5b4636]" />}
                                            {key === 'midnight' && <Moon size={18} className="text-slate-200" />}
                                            {key === 'oled' && <div className="w-5 h-5 bg-white rounded-full border border-black" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Taille */}
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
                                    <span className="flex items-center gap-2"><Type size={14} /> Taille</span>
                                    <span>{fontSize}px</span>
                                </div>
                                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                                    <Type size={16} className="opacity-50" />
                                    <input
                                        type="range" min="24" max="70" value={fontSize}
                                        onChange={(e) => updateFontSize(Number(e.target.value))}
                                        className="flex-1 accent-emerald-500 h-2 bg-gray-400/30 rounded-lg cursor-pointer"
                                    />
                                    <Type size={24} className="opacity-80" />
                                </div>
                            </div>

                            {/* 3. Langues */}
                            <div className="pt-4 border-t border-black/10 dark:border-white/10">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block flex items-center gap-2">
                                    <Languages size={14} /> Langues
                                </span>

                                <div className="space-y-3">
                                    <div
                                        onClick={toggleShowArabic}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${showArabic ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-serif font-bold text-lg w-6 text-center">ع</span>
                                            <span className="font-medium text-sm">Arabe</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${showArabic ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'}`}>
                                            {showArabic && <Check size={12} strokeWidth={4} />}
                                        </div>
                                    </div>

                                    <div
                                        onClick={toggleShowFrench}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${showFrench ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg w-6 text-center">Fr</span>
                                            <span className="font-medium text-sm">Français</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${showFrench ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'}`}>
                                            {showFrench && <Check size={12} strokeWidth={4} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            {/* CONTENU PRINCIPAL */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">

                {surah.number !== 9 && surah.number !== 1 && (
                    <div className="text-center mb-16 opacity-80">
                        <p className={`font-serif text-4xl ${currentTheme.accent}`}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
                    </div>
                )}

                <div className="space-y-8">
                    {verses.map((verse) => (
                        <div
                            key={verse.number}
                            ref={(el) => { verseRefs.current[verse.number] = el; }}
                            onClick={() => saveProgress(verse.number)}
                            className={`group relative rounded-2xl p-6 transition-all duration-300 border cursor-pointer scroll-mt-40
                                ${lastReadVerse === verse.number
                                    ? `bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/20`
                                    : `border-transparent hover:bg-black/5 dark:hover:bg-white/5`}
                            `}
                        >
                            {/* Numéro & Outils */}
                            <div className="flex justify-between items-center mb-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold opacity-50 bg-black/5 dark:bg-white/10`}>
                                    {surah.number}:{verse.numberInSurah}
                                </span>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); copyText(verse); }} className="p-2 rounded-full hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors">
                                        {copiedVerse === verse.number ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(verse.number); }} className={`p-2 rounded-full hover:bg-pink-500/10 transition-colors ${bookmarks.includes(verse.number) ? "text-pink-500" : "hover:text-pink-500"}`}>
                                        <Heart size={16} fill={bookmarks.includes(verse.number) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>

                            {/* TEXTE ARABE */}
                            {showArabic && (
                                <p
                                    className="text-right leading-[2.4] font-serif mb-6 w-full"
                                    style={{ fontSize: `${fontSize}px` }}
                                    dir="rtl"
                                >
                                    {verse.text}
                                </p>
                            )}

                            {/* TEXTE FRANÇAIS */}
                            {showFrench && verse.translation && (
                                <div className={`relative ${showArabic ? "pt-6 border-t border-black/5 dark:border-white/5" : ""}`}>
                                    <p
                                        className="leading-relaxed font-light opacity-90"
                                        style={{ fontSize: `${frenchFontSize}px` }}
                                    >
                                        {verse.translation}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* NAVIGATION FOOTER */}
                <div className={`mt-24 pt-8 border-t flex justify-between ${currentTheme.panelBorder} opacity-60 hover:opacity-100 transition-opacity`}>
                    <div className="text-center w-full text-sm font-medium">Fin de la sourate {surah.englishName}</div>
                </div>
            </div>
        </div>
    );
}