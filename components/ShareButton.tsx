"use client";

import { Share2, X, Copy, Check, MessageCircle, Twitter, Facebook, Mail, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- Import crucial pour le Portail

export default function ShareButton({ reciterName }: { reciterName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState("");
    const [mounted, setMounted] = useState(false); // Pour s'assurer que le DOM est prêt

    useEffect(() => {
        setUrl(window.location.href);
        setMounted(true); // Indique que le composant est monté côté client
    }, []);

    // --- LOGIQUE DE COPIE (Inchangée car robuste) ---
    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => triggerCopied()).catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    const fallbackCopy = () => {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed"; textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try { document.execCommand('copy'); triggerCopied(); } catch (err) { console.error('Erreur copie', err); }
        document.body.removeChild(textArea);
    };

    const triggerCopied = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- LIENS SOCIAUX ---
    const shareText = `Écoutez ${reciterName} sur GoMuslimLife Quran 🎧`;
    const links = [
        { name: "WhatsApp", icon: MessageCircle, color: "bg-[#25D366]", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}` },
        { name: "Twitter", icon: Twitter, color: "bg-[#1DA1F2]", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
        { name: "Facebook", icon: Facebook, color: "bg-[#4267B2]", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { name: "Email", icon: Mail, color: "bg-slate-600", href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent("Voici le lien : " + url)}` }
    ];

    // --- RENDU DU PORTAIL ---
    // C'est ici que la magie opère : on rend la modale hors du flux normal
    const modalContent = isOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 px-4 sm:px-0">
            {/* Backdrop flouté sombre */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={() => setIsOpen(false)}
            />

            {/* CARTE MODALE PREMIUM */}
            {/* Astuce : un div parent avec un padding de 1px et un background dégradé pour faire la bordure lumineuse */}
            <div className="relative w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 shadow-2xl shadow-emerald-500/20 animate-in zoom-in-95 duration-200">

                {/* Contenu intérieur sombre */}
                <div className="relative bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl p-6 overflow-hidden">

                    {/* Effet de lumière d'ambiance */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

                    {/* Header avec titre et message */}
                    <div className="relative z-10 mb-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles size={20} className="text-emerald-400" />
                            <h3 className="text-xl font-bold text-white">Partager la récitation</h3>
                        </div>
                        <p className="text-slate-300 text-sm">
                            Faites découvrir la voix de <span className="text-emerald-400 font-medium">{reciterName}</span> à vos proches et gagnez des hassanates !
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-[-10px] right-[-10px] p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Grille Sociale */}
                    <div className="relative z-10 grid grid-cols-4 gap-4 mb-8">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-lg shadow-black/30 ${link.color}`}>
                                    <link.icon size={22} fill="currentColor" className="text-white/90" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Zone de Copie Lien */}
                    <div className="relative z-10 space-y-2">
                        <label className="text-xs text-slate-400 font-medium ml-1">Lien direct</label>
                        <div className="flex items-center gap-2 bg-[#0f172a] border border-white/10 shadow-inner rounded-xl p-1.5 pr-1.5 group/input focus-within:border-emerald-500/50 transition-colors">
                            <input
                                type="text"
                                readOnly
                                value={url}
                                className="bg-transparent border-none text-slate-300 text-sm w-full focus:ring-0 px-3 truncate font-mono"
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shrink-0
                  ${copied
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                        : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? "Copié !" : "Copier"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* BOUTON DÉCLENCHEUR */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:self-center bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-full text-white transition-colors hover:scale-110 active:scale-95"
                aria-label="Partager"
            >
                <Share2 size={20} />
            </button>

            {/* Rendu du portail seulement si le composant est monté côté client */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}