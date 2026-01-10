import { POPULAR_RECITERS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, BookOpen, Sparkles, Search } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const featuredReciters = POPULAR_RECITERS.slice(0, 4);

  const popularSurahs = [
    { id: 18, name: "Al-Kahf", ar: "الكهف", meaning: "La Caverne" },
    { id: 36, name: "Ya-Sin", ar: "يس", meaning: "Ya-Sin" },
    { id: 67, name: "Al-Mulk", ar: "الملك", meaning: "La Royauté" },
    { id: 56, name: "Al-Waqi'ah", ar: "الواقعة", meaning: "L'Événement" },
  ];

  return (
    <>
      {/* CORRECTION ICI : 
         - "pt-28" : Ajoute de l'espace en haut sur mobile pour descendre sous le logo "GoMuslim Life".
         - "md:pt-0" : Sur PC, le layout gère déjà l'espace (md:pt-28), donc on met 0 ici pour ne pas avoir un double espace.
      */}
      <main className="min-h-screen px-4 pt-28 md:pt-0 md:px-8 max-w-7xl mx-auto space-y-12 md:space-y-20">

        {/* --- 1. HERO SECTION --- */}
        <section className="relative p-6 md:p-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">

          {/* Fond animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/20 blur-[80px] rounded-full" />
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400">
                <Sparkles size={14} />
                <span>Version Premium</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Retrouvez la paix <br /> dans la <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Parole d'Allah</span>.
              </h1>

              <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                Une expérience d'écoute immersive, sans distraction. Accédez aux plus grandes voix du monde musulman en haute définition.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <Link
                  href="/audio"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
                >
                  <Play size={20} fill="currentColor" />
                  Commencer l'écoute
                </Link>

                <Link
                  href="/quran"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-semibold transition-colors backdrop-blur-sm"
                >
                  <BookOpen size={20} />
                  Lire le Coran
                </Link>
              </div>
            </div>

            {/* LOGO FLOTTANT */}
            <div className="relative hidden md:block">
              <div className="w-64 h-64 bg-gradient-to-t from-emerald-500/20 to-transparent rounded-full blur-3xl absolute inset-0" />

              {/* Carte Logo 3D */}
              <div className="relative w-64 h-64 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-700 flex items-center justify-center shadow-2xl">
                <div className="relative w-40 h-40 drop-shadow-2xl">
                  <Image
                    src="/logo.png"
                    alt="GoMuslim Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. ACCÈS RAPIDE --- */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold text-white">Lecture Rapide</h2>
            <Link href="/quran" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSurahs.map((surah) => (
              <Link
                key={surah.id}
                href={`/quran?surah=${surah.id}`}
                className="group relative bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-emerald-500/30 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs font-bold text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    {surah.id}
                  </span>
                  <span className="font-serif text-xl text-slate-600 group-hover:text-slate-400 transition-colors" dir="rtl">{surah.ar}</span>
                </div>
                <h3 className="text-white font-bold">{surah.name}</h3>
                <p className="text-xs text-slate-500 group-hover:text-emerald-400/80 transition-colors">{surah.meaning}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 3. RÉCITATEURS --- */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold text-white">Voix d'Or</h2>
            <Link href="/audio" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Tous les récitateurs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredReciters.map((reciter) => (
              <Link
                key={reciter.id}
                href={`/audio/${reciter.id}`}
                className="group bg-[#1e293b]/30 hover:bg-[#1e293b] rounded-2xl overflow-hidden transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={reciter.image}
                    alt={reciter.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute bottom-3 right-3 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    <Play size={20} fill="currentColor" className="text-white ml-1" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-bold truncate group-hover:text-emerald-400 transition-colors">{reciter.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{reciter.style}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/50" />)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 4. RECHERCHE --- */}
        <section className="relative py-12 md:py-20 text-center">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Vous cherchez quelque chose de précis ?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">
            Trouvez une sourate spécifique, un verset ou un récitateur parmi notre bibliothèque.
          </p>

          <div className="relative z-10 max-w-xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative flex items-center bg-[#0f172a] border border-white/10 rounded-full p-2 pl-6 shadow-2xl">
              <Search className="text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Rechercher 'Al-Mulk' ou 'Sudais'..."
                className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 w-full py-2"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors ml-2">
                Chercher
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}