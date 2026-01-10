import { POPULAR_RECITERS } from "@/lib/constants";
import { PlayCircle, Mic2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AudioPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 pt-6">

            {/* Header "Ambilight" */}
            <header className="mb-12 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400 font-medium mb-4 backdrop-blur-md">
                        <Sparkles size={12} />
                        Sélection Premium
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Espace <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Écoute</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Profitez d'une qualité audio haute définition avec les plus grandes voix du monde musulman.
                    </p>
                </div>
            </header>

            {/* Grille des Récitateurs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
                {POPULAR_RECITERS.map((reciter) => (
                    <Link
                        href={`/audio/${reciter.id}`}
                        key={reciter.id}
                        className="group relative glass-card rounded-3xl p-3 md:p-4 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                    >
                        {/* Background Gradient au survol */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${reciter.color} transition-opacity duration-500`} />

                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg">
                            <Image
                                src={reciter.image}
                                alt={reciter.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* Overlay sombre en bas de l'image */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                            {/* Bouton Play Flottant */}
                            <div className="absolute bottom-3 right-3 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <PlayCircle size={24} className="text-white fill-emerald-500" />
                            </div>
                        </div>

                        {/* Informations */}
                        <div className="px-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-sm md:text-lg leading-tight group-hover:text-emerald-300 transition-colors line-clamp-1">
                                {reciter.name}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs text-slate-400">
                                <Mic2 size={12} className="text-emerald-500/70" />
                                <span className="uppercase tracking-wider font-medium">{reciter.style}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}