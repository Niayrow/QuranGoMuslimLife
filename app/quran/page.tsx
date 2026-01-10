import Link from "next/link";
import { Home, Headphones, Sparkles, DraftingCompass } from "lucide-react";

export default function QuranPage() {
    return (
        // CORRECTION ICI :
        // 1. "w-full" pour prendre toute la largeur
        // 2. "flex flex-col justify-center" pour centrer verticalement le contenu
        // 3. "py-12 md:py-20" : Juste assez d'espace pour ne pas coller aux bords, mais pas trop pour éviter le vide
        // 4. J'ai RETIRÉ "min-h-screen" qui causait le grand espace vide avant le footer
        <main className="w-full flex flex-col items-center justify-center py-12 md:py-24 px-4 text-center bg-[#0f172a] relative overflow-hidden">

            {/* --- FOND D'AMBIANCE --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-500/10 to-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />


            <div className="relative z-10 max-w-4xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-700 slide-in-from-bottom-10">

                {/* --- 1. ILLUSTRATION --- */}
                <div className="relative flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />

                    <div className="relative z-10 p-6 md:p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-md shadow-2xl group">
                        <DraftingCompass size={60} strokeWidth={1} className="text-slate-400 group-hover:text-emerald-400 transition-colors duration-500 md:w-20 md:h-20" />
                        <Sparkles size={20} className="absolute top-5 right-5 text-emerald-400 animate-pulse" />
                    </div>
                </div>


                {/* --- 2. TEXTES --- */}
                <div className="space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs md:text-sm font-medium text-emerald-400 uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Zone en travaux
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        Le meilleur est <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shine">
                            à venir
                        </span>.
                    </h1>

                    <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                        Nous bâtissons une interface de lecture du Noble Coran unique, pensée pour la concentration et la sérénité.
                    </p>
                </div>


                {/* --- 3. VERSET --- */}
                <div className="relative py-8 md:py-10">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                    <div className="space-y-4 md:space-y-6">
                        <p className="font-serif text-3xl md:text-5xl text-white/90 leading-relaxed drop-shadow-lg" dir="rtl">
                            إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
                        </p>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <p className="text-emerald-400 text-lg md:text-xl font-medium italic">
                                "En vérité, Allah est avec les patients."
                            </p>
                            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-medium">
                                — Sourate Al-Baqarah, 153
                            </p>
                        </div>
                    </div>

                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                </div>


                {/* --- 4. BOUTONS --- */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
                    <Link
                        href="/audio"
                        className="group flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 w-full sm:w-auto justify-center text-base md:text-lg"
                    >
                        <Headphones size={20} className="group-hover:animate-bounce md:w-6 md:h-6" />
                        Patienter en écoutant
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-3 bg-transparent hover:bg-white/5 border-2 border-white/10 text-slate-300 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold transition-colors w-full sm:w-auto justify-center text-base md:text-lg hover:border-white/30 hover:text-white"
                    >
                        <Home size={20} className="md:w-6 md:h-6" />
                        Retour à l'accueil
                    </Link>
                </div>

            </div>
        </main>
    );
}