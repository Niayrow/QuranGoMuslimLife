import { getChapters } from "@/lib/api";
import { POPULAR_RECITERS } from "@/lib/constants";
import SurahList from "@/components/SurahList";
import ShareButton from "@/components/ShareButton";
import StarrySky from "@/components/StarrySky"; // On importe le composant créé
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic2, Music4, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return POPULAR_RECITERS.map((reciter) => ({
        id: reciter.id.toString(),
    }));
}

export default async function ReciterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const reciter = POPULAR_RECITERS.find((r) => r.id.toString() === id);
    if (!reciter) return notFound();

    const { chapters } = await getChapters();

    return (
        <div className="min-h-screen text-white relative">

            {/* Fond Étoilé */}
            <StarrySky />

            <main className="relative z-10">

                {/* --- HERO HEADER --- */}
                <div className="relative pt-28 pb-12 px-6 overflow-hidden">

                    {/* Bouton Retour Glassmorphism */}
                    <div className="absolute top-6 left-6 z-20">
                        <Link
                            href="/audio"
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full transition-all text-sm font-medium group shadow-lg"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </Link>
                    </div>

                    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-center md:text-left">

                        {/* Avatar Cercle avec Glow */}
                        <div className="relative shrink-0 group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
                            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-[#020617]">
                                <Image
                                    src={reciter.image}
                                    alt={reciter.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                            </div>
                            {/* Badge Style */}
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-4 border-[#020617] shadow-lg flex items-center gap-1">
                                <Mic2 size={12} />
                                {reciter.style}
                            </div>
                        </div>

                        {/* Infos Texte */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                                    <Sparkles size={12} />
                                    Récitateur Officiel
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl">
                                    {reciter.name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 text-sm font-medium">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                                    <Music4 size={14} className="text-emerald-400" />
                                    114 Sourates
                                </span>
                                <span className="hidden md:inline w-1 h-1 bg-slate-600 rounded-full" />
                                <span className="text-emerald-400">Qualité Studio (HQ)</span>
                            </div>
                        </div>

                        {/* Bouton Partager */}
                        <div className="md:self-center">
                            <ShareButton reciterName={reciter.name} />
                        </div>
                    </div>
                </div>

                {/* --- LISTE DES SOURATES --- */}
                <div className="relative max-w-7xl mx-auto px-4 pb-20">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
                        {/* CORRECTION DU BUG ICI : reciter.server au lieu de serverUrl */}
                        <SurahList
                            chapters={chapters}
                            reciterId={reciter.id}
                            serverUrl={reciter.server}
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}