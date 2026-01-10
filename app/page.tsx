"use client";

import { POPULAR_RECITERS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, BookOpen, Sparkles, Search, Headphones } from "lucide-react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// --- COMPOSANT CIEL ÉTOILÉ (CORRIGÉ) ---
const StarrySky = () => {
  const [stars, setStars] = useState<Array<{ id: number, left: string, top: string, size: number, delay: string, duration: string }>>([]);

  useEffect(() => {
    // On génère les étoiles seulement côté client pour éviter l'erreur d'hydratation
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`
    }));
    setStars(newStars);
  }, []);

  return (
    // CORRECTION 1 : La couleur de fond est DANS ce composant (-z-10)
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#020617]">
      {/* 1. Lueurs d'ambiance spécifiques à l'Accueil (Emerald & Blue) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* 2. Les Étoiles Scintillantes */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_2px_rgba(255,255,255,0.8)] animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: 0.7
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const featuredReciters = POPULAR_RECITERS.slice(0, 4);

  const popularSurahs = [
    { id: 18, name: "Al-Kahf", ar: "الكهف", meaning: "La Caverne" },
    { id: 36, name: "Ya-Sin", ar: "يس", meaning: "Ya-Sin" },
    { id: 67, name: "Al-Mulk", ar: "الملك", meaning: "La Royauté" },
    { id: 56, name: "Al-Waqi'ah", ar: "الواقعة", meaning: "L'Événement" },
  ];

  return (
    // CORRECTION 2 : On a RETIRÉ "bg-[#020617]" d'ici pour laisser voir les étoiles
    <div className="min-h-screen text-white selection:bg-emerald-500/30 relative">

      {/* Fond Global avec Étoiles */}
      <StarrySky />

      <main className="px-4 pt-24 md:pt-12 md:px-8 max-w-7xl mx-auto space-y-20 pb-20 relative z-10">

        {/* --- 1. HERO SECTION --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative p-8 md:p-16 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-white/5 to-transparent"
        >
          {/* Effets internes au Hero */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/20 blur-[80px] rounded-full" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">

            {/* --- AJOUT : LOGO ANIMÉ --- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-2"
            >
              {/* Petit halo lumineux derrière le logo */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150" />

              {/* Conteneur pour l'animation de flottement continu */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={120} // Ajuste la taille ici (ex: 100, 120, 150)
                  height={120}
                  className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                />
              </motion.div>
            </motion.div>
            {/* ------------------------- */}

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-emerald-400 backdrop-blur-md shadow-lg">
              <Sparkles size={12} />
              <span>Nouvelle Expérience</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
              Retrouvez la paix <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">
                dans la Parole d'Allah
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              Une plateforme d'écoute et de lecture immersive, conçue pour la concentration et la méditation. Haute qualité audio, sans distractions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/audio"
                className="
    flex items-center justify-center gap-3 
    rounded-full px-6 py-3 md:px-8 md:py-4
    bg-gradient-to-r from-blue-600/80 to-emerald-500/80 
    backdrop-blur-md 
    border border-white/20 
    text-white font-bold 
    shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] 
    transition-all duration-300 
    hover:scale-105 
    hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] 
    hover:from-blue-600 hover:to-emerald-500 hover:border-white/40
  "
              >
                <Play size={20} fill="currentColor" />
                Commencer l'écoute
              </Link>
              <Link href="/quran" className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-md">
                <BookOpen size={20} />
                Lire le Coran
              </Link>
            </div>
          </div>
        </motion.section>

        {/* --- 2. ACCÈS RAPIDE --- */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><BookOpen size={24} /></span>
              Lecture Essentielle
            </h2>
            <Link href="/quran" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
              Voir tout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularSurahs.map((surah, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={surah.id}
              >
                <Link href={`/quran?surah=${surah.id}`} className="group relative flex flex-col justify-between h-32 p-6 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-emerald-500/30 hover:bg-[#1e293b] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex justify-between items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-xs font-bold text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">{surah.id}</span>
                    <span className="font-serif text-2xl text-slate-600 group-hover:text-slate-400 transition-colors" dir="rtl">{surah.ar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{surah.name}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{surah.meaning}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- 3. RÉCITATEURS --- */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Headphones size={24} /></span>
              Récitateurs Populaires
            </h2>
            <Link href="/audio" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
              Tout écouter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredReciters.map((reciter, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={reciter.id}
              >
                <Link href={`/audio/${reciter.id}`} className="group block bg-[#0f172a] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={reciter.image} alt={reciter.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">{reciter.style}</p>
                      <h3 className="text-white font-bold text-lg leading-tight truncate group-hover:text-emerald-50 transition-colors">{reciter.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- 4. RECHERCHE --- */}
        <section className="relative py-12">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl -z-10" />
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Vous cherchez quelque chose de précis ?</h2>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500"></div>
              <div className="relative flex items-center bg-[#020617] rounded-full p-2 pl-6">
                <Search className="text-slate-400 mr-3" />
                <input type="text" placeholder="Sourate Al-Mulk, Sudais..." className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 w-full py-3 outline-none" />
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-colors ml-2">Chercher</button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}