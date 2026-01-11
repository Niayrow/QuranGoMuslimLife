"use client";

import { useState, useEffect } from "react";

export default function StarrySky() {
    // On initialise avec un tableau vide pour éviter le mismatch serveur/client
    const [stars, setStars] = useState<any[]>([]);

    useEffect(() => {
        // Cette génération ne se lance que sur le navigateur (Client)
        const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            delay: `${Math.random() * 5}s`,
            duration: `${Math.random() * 3 + 2}s`
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Fond Nuit Profonde (Statique, donc pas de problème) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b]" />

            {/* Étoiles (Ne s'affichent qu'une fois le composant monté sur le client) */}
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

            {/* Lueurs d'ambiance */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>
    );
}