"use client";

import { useState, useEffect } from "react";
import { X, BookOpenText } from "lucide-react";

export default function SyncTutorial({ reciterId }: { reciterId: number }) {
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        // Afficher le tuto uniquement pour Nasser (ID 87)
        if (reciterId === 87) {
            // Vérifie si l'utilisateur a déjà vu le tuto
            const hasSeen = localStorage.getItem("has_seen_sync_tutorial");
            if (!hasSeen) {
                setShowTutorial(true);
            }
        }
    }, [reciterId]);

    const closeTutorial = () => {
        setShowTutorial(false);
        localStorage.setItem("has_seen_sync_tutorial", "true");
    };

    if (!showTutorial) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0f172a] border border-emerald-500/30 p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-sm w-full relative overflow-hidden text-center">

                {/* Glow décoratif */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />

                <button onClick={closeTutorial} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 rounded-full p-1 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <BookOpenText size={32} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Lecture Synchronisée</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Pour <span className="text-emerald-400 font-bold">Nasser Al Qatami</span>, suivez les versets en temps réel pendant l'écoute.
                        </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-full">
                        <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Appuyez sur ce bouton :</p>
                        <div className="flex justify-center">
                            {/* BOUTON MIS À JOUR : Dégradé Vert-Bleu + Texte Blanc */}
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 pointer-events-none uppercase tracking-wide">
                                <BookOpenText size={16} />
                                SYNCHRO
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={closeTutorial}
                        className="mt-2 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        C'est parti !
                    </button>
                </div>
            </div>
        </div>
    );
}