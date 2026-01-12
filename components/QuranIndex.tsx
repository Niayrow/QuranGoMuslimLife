"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Surah {
    id: number;
    name_simple: string;
    name_arabic: string;
    translated_name: {
        name: string;
    };
    verses_count: number;
}

export default function QuranIndex({ chapters }: { chapters: Surah[] }) {
    const [search, setSearch] = useState("");

    const filtered = chapters.filter((c) =>
        c.name_simple.toLowerCase().includes(search.toLowerCase()) ||
        c.translated_name.name.toLowerCase().includes(search.toLowerCase()) ||
        String(c.id).includes(search)
    );

    return (
        <div className="w-full">

            {/* Barre de recherche */}
            <div className="relative max-w-lg mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 z-20">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-1000"></div>
                    <div className="relative flex items-center bg-[#0f172a] rounded-full border border-white/10 shadow-2xl">
                        <div className="pl-6 text-slate-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une sourate..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none placeholder-slate-500 text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                {filtered.map((surah) => (
                    <Link
                        key={surah.id}
                        href={`/quran/${surah.id}`}
                        className="group flex items-center justify-between p-4 bg-[#1e293b]/40 hover:bg-[#1e293b]/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 border border-white/5 transition-all">
                                {surah.id}
                            </div>

                            <div className="flex flex-col">
                                <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                                    {surah.name_simple}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400">
                                    {surah.translated_name.name}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block font-serif text-xl text-slate-400 group-hover:text-white transition-colors mb-1" dir="rtl">
                                {surah.name_arabic}
                            </span>
                            <span className="text-[10px] text-slate-600 group-hover:text-emerald-500/80 font-bold uppercase tracking-wide">
                                {surah.verses_count} Versets
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center text-slate-500 py-12">
                    Aucune sourate trouvée.
                </div>
            )}
        </div>
    );
}