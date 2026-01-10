import { getChapters } from "@/lib/api";
import { POPULAR_RECITERS } from "@/lib/constants";
import SurahList from "@/components/SurahList";
import ShareButton from "@/components/ShareButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic2, Music4 } from "lucide-react";
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
        <main className="min-h-screen bg-[#0f172a]">

            {/* --- HERO HEADER --- */}
            <div className="relative h-[45vh] lg:h-[50vh] flex flex-col justify-end overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={reciter.image}
                        alt={reciter.name}
                        fill
                        className="object-cover blur-2xl opacity-40 scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
                </div>

                {/* Bouton Retour */}
                <div className="absolute top-12 left-6 z-20">
                    <Link
                        href="/audio"
                        className="flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-xl border border-white/10 text-white px-4 py-2 rounded-full transition-all text-sm font-medium group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Retour
                    </Link>
                </div>

                {/* Contenu Principal du Hero */}
                <div className="relative z-10 px-6 pb-12 md:pb-16 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 text-center md:text-left">

                    {/* Avatar Cercle */}
                    <div className="relative shrink-0">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-[#0f172a] shadow-2xl relative overflow-hidden group">
                            <Image
                                src={reciter.image}
                                alt={reciter.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Badge Style */}
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-[#0f172a] shadow-lg flex items-center gap-1">
                            <Mic2 size={12} />
                            {reciter.style}
                        </div>
                    </div>

                    {/* Textes */}
                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                            {reciter.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Music4 size={14} className="text-emerald-400" />
                                114 Sourates
                            </span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full" />
                            <span className="text-emerald-400 font-medium">Qualité Studio</span>
                        </div>
                    </div>

                    {/* BOUTON PARTAGER */}
                    <ShareButton reciterName={reciter.name} />

                </div>
            </div>

            {/* --- LISTE DES SOURATES --- */}
            <div className="relative z-20 -mt-6 bg-[#0f172a] rounded-t-[2.5rem] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                    {/* CORRECTION ICI : serverUrl={reciter.server} au lieu de reciter.serverUrl */}
                    <SurahList chapters={chapters} reciterId={reciter.id} serverUrl={reciter.server} />
                </div>
            </div>

        </main>
    );
}