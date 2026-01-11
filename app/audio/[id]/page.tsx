import { getChapters } from "@/lib/api";
import { POPULAR_RECITERS } from "@/lib/constants";
import SurahList from "@/components/SurahList";
import ShareButton from "@/components/ShareButton";
import StarrySky from "@/components/StarrySky";
import GaplessPlayer from "@/components/GaplessPlayer";
import SyncTutorial from "@/components/SyncTutorial";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic2, Music4, Sparkles, BookOpenCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next"; // IMPORTANT POUR LE SEO

// --- GÉNÉRATION STATIQUE DES ROUTES (Pour que ça charge vite) ---
export async function generateStaticParams() {
    return POPULAR_RECITERS.map((reciter) => ({
        id: reciter.id.toString(),
    }));
}

// --- SEO DYNAMIQUE (Titre, Description, Image de partage) ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const reciter = POPULAR_RECITERS.find((r) => r.id.toString() === id);

    if (!reciter) {
        return { title: "Récitateur introuvable" };
    }

    return {
        title: `Écouter ${reciter.name} - Coran Complet MP3`,
        description: `Écoutez la récitation du Saint Coran par ${reciter.name} (${reciter.style}). Audio haute qualité, téléchargement et lecture synchronisée disponible sur GoMuslimLife.`,
        openGraph: {
            title: `${reciter.name} - Saint Coran Audio`,
            description: `Découvrez la magnifique récitation de ${reciter.name}.`,
            images: [{
                url: reciter.image,
                width: 800,
                height: 800,
                alt: reciter.name,
            }],
        },
    };
}

// --- COMPOSANT PAGE PRINCIPAL ---
export default async function ReciterPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ surah?: string }>
}) {
    const { id } = await params;
    const { surah } = await searchParams;

    const reciter = POPULAR_RECITERS.find((r) => r.id.toString() === id);
    if (!reciter) return notFound();

    const { chapters } = await getChapters();
    const isSyncEnabled = reciter.id === 87;

    // --- MODE LECTURE IMMERSIVE (Quand ?surah=X est présent et synchro active) ---
    if (surah && isSyncEnabled) {
        const surahId = parseInt(surah);
        return (
            <div className="min-h-screen text-white relative">
                <StarrySky />
                <main className="relative z-10 pt-24 md:pt-8 px-4">

                    {/* HEADER FIXE (Mobile) & FLOTTANT (Desktop) */}
                    <div className="
                        max-w-4xl mx-auto flex items-center justify-between z-50
                        fixed top-0 left-0 right-0 p-3 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl rounded-none
                        md:sticky md:top-4 md:left-auto md:right-auto md:p-4 md:bg-white/5 md:border md:border-white/10 md:rounded-full md:mb-8
                    ">
                        <Link
                            href={`/audio/${id}`}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full hover:bg-white/10"
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline font-medium text-sm">Retour</span>
                        </Link>

                        <div className="flex items-center gap-3 pr-2">
                            <div className="text-right">
                                <p className="font-bold text-white text-sm leading-tight">{reciter.name}</p>
                                <p className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold">Sourate {surahId}</p>
                            </div>
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-lg">
                                <Image src={reciter.image} alt={reciter.name} fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* LECTEUR SYNCHRONISÉ */}
                    <GaplessPlayer
                        surahId={surahId}
                        reciter={reciter}
                        chapters={chapters}
                    />
                </main>
            </div>
        );
    }

    // --- MODE PROFIL CLASSIQUE (Liste des sourates) ---
    return (
        <div className="min-h-screen text-white relative">
            <StarrySky />

            {/* POPUP TUTORIEL (S'affiche une seule fois pour Nasser) */}
            <SyncTutorial reciterId={reciter.id} />

            <main className="relative z-10">
                <div className="relative pt-28 pb-12 px-6 overflow-hidden">
                    <div className="absolute top-18 left-6 z-20 md:left-12 md:top-10">
                        <Link href="/audio" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full transition-all text-sm font-medium group shadow-lg">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </Link>
                    </div>

                    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-center md:text-left">
                        <div className="relative shrink-0 group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
                            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-[#020617]">
                                <Image src={reciter.image} alt={reciter.name} fill className="object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-4 border-[#020617] shadow-lg flex items-center gap-1">
                                <Mic2 size={12} /> {reciter.style}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                                    <Sparkles size={12} /> Récitateur Officiel
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl">
                                    {reciter.name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 text-sm font-medium">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                                    <Music4 size={14} className="text-emerald-400" /> 114 Sourates
                                </span>
                                <span className="hidden md:inline w-1 h-1 bg-slate-600 rounded-full" />
                                <span className="text-emerald-400">Qualité Studio (HQ)</span>

                                {/* BADGE : SYNCHRONISATION DISPONIBLE */}
                                {isSyncEnabled && (
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/80 to-blue-600/80 border border-white/20 text-white text-xs font-bold shadow-lg shadow-emerald-500/10 backdrop-blur-md ml-0 md:ml-4 animate-in fade-in zoom-in duration-700">
                                        <BookOpenCheck size={14} />
                                        Synchronisation Audio/Verset Disponible
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="md:self-center">
                            <ShareButton reciterName={reciter.name} />
                        </div>
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 pb-20">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
                        <SurahList
                            chapters={chapters}
                            reciterId={reciter.id}
                            serverUrl={reciter.server}
                            isSyncEnabled={isSyncEnabled}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}