import { Metadata } from "next";
import QuranIndex from "@/components/QuranIndex";
import StarrySky from "@/components/StarrySky";
import { BookOpen, Layers, Star } from "lucide-react";

export const metadata: Metadata = {
    title: "Le Saint Coran - Lecture",
    description: "Lisez le Saint Coran avec traduction française.",
};

async function getChapters() {
    try {
        const res = await fetch("https://api.quran.com/api/v4/chapters?language=fr");
        if (!res.ok) return [];
        const data = await res.json();
        return data.chapters;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function QuranPage() {
    const chapters = await getChapters();

    return (
        <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden selection:bg-emerald-500/30">

            {/* Fond étoilé */}
            <div className="fixed inset-0 z-0">
                <StarrySky />
            </div>

            {/* Lumière d'ambiance */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Calligraphie Arabe (Watermark) */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[20rem] opacity-[0.03] select-none pointer-events-none whitespace-nowrap z-0 font-serif text-white blur-sm">
                القرآن
            </div>

            {/* --- CONTENEUR PRINCIPAL AVEC MARGES AJUSTÉES --- */}
            <main className="relative z-10 pt-32 px-6 md:px-12 lg:px-20 pb-24 ">
                <div className="max-w-4xl mx-auto"> {/* Largeur optimisée pour la lecture */}

                    {/* --- HERO SECTION --- */}
                    <div className="text-center mb-16">

                        {/* Basmalah */}
                        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <p className="font-serif text-3xl md:text-4xl text-emerald-400/90 drop-shadow-md">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </p>
                        </div>

                        {/* Titre & Description */}
                        <h1 className="text-4xl md:text-6xl font-black  text-emerald-400/90  drop-shadow-md">
                            Le Saint Coran
                        </h1>
                        <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed font-light">
                            Lecture intégrale avec traduction française et phonétique.
                        </p>

                        {/* Stats Centrées */}
                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            <StatBadge icon={<BookOpen size={16} />} value="114" label="Sourates" />
                            <StatBadge icon={<Layers size={16} />} value="30" label="Juz" />
                            <StatBadge icon={<Star size={16} />} value="6236" label="Versets" />
                        </div>
                    </div>

                    {/* --- LISTE DES SOURATES --- */}
                    <QuranIndex chapters={chapters} />

                </div>
            </main>
        </div>
    );
}

// Badge de statistique
function StatBadge({ icon, value, label }: { icon: any, value: string, label: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
            <div className="text-emerald-400">{icon}</div>
            <div className="text-left flex items-baseline gap-1.5">
                <span className="font-bold text-white text-sm">{value}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{label}</span>
            </div>
        </div>
    );
}