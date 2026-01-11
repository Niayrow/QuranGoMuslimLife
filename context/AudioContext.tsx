"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Chapter } from "@/types";

interface ReciterInfo {
    id: number;
    name: string;
    image: string;
    server: string;
    style?: string; // Ajout optionnel pour éviter les erreurs de typage
}

interface Track {
    surah: Chapter;
    reciter: ReciterInfo;
}

interface AudioContextType {
    isPlaying: boolean;
    currentTrack: Track | null;
    progress: number;
    currentTime: number;
    duration: number;
    volume: number;
    isLoop: boolean;
    playTrack: (surah: Chapter, reciter: ReciterInfo, playlist: Chapter[]) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    toggleLoop: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Chapter[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isLoop, setIsLoop] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const stateRef = useRef({ playlist, currentTrack, isLoop, volume });

    // Maintient stateRef à jour pour les callbacks (évite les problèmes de closure)
    useEffect(() => {
        stateRef.current = { playlist, currentTrack, isLoop, volume };
        if (audioRef.current) audioRef.current.volume = volume;
    }, [playlist, currentTrack, isLoop, volume]);

    const playUrl = useCallback((url: string) => {
        if (!audioRef.current) return;
        audioRef.current.src = url;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((e) => {
                    if (e.name !== 'AbortError') console.error("Erreur lecture:", e);
                });
        }
    }, []);

    const handleNext = useCallback(() => {
        const { playlist, currentTrack, isLoop } = stateRef.current;
        if (!currentTrack || playlist.length === 0) return;

        if (isLoop && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
        }

        const currentIndex = playlist.findIndex(c => c.id === currentTrack.surah.id);
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            const nextSurah = playlist[currentIndex + 1];
            const reciter = currentTrack.reciter;
            setCurrentTrack({ surah: nextSurah, reciter });
            const paddedId = nextSurah.id.toString().padStart(3, '0');
            playUrl(`${reciter.server}${paddedId}.mp3`);
        } else {
            setIsPlaying(false);
        }
    }, [playUrl]);

    const handlePrev = useCallback(() => {
        const { playlist, currentTrack } = stateRef.current;
        if (!currentTrack || playlist.length === 0) return;

        const currentIndex = playlist.findIndex(c => c.id === currentTrack.surah.id);

        // Si on est à plus de 3 sec, on recommence la piste au début
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            const prevSurah = playlist[currentIndex - 1];
            const reciter = currentTrack.reciter;
            setCurrentTrack({ surah: prevSurah, reciter });
            const paddedId = prevSurah.id.toString().padStart(3, '0');
            playUrl(`${reciter.server}${paddedId}.mp3`);
        }
    }, [playUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    // --- MISE EN PLACE DE L'API MEDIA SESSION (Écran de verrouillage) ---
    useEffect(() => {
        if (!currentTrack || !('mediaSession' in navigator)) return;

        // 1. Définir les métadonnées (Titre, Image, etc.)
        navigator.mediaSession.metadata = new MediaMetadata({
            title: `Sourate ${currentTrack.surah.name_simple}`,
            artist: currentTrack.reciter.name,
            album: "Quran GoMuslimLife",
            artwork: [
                // On met votre logo ici dans différentes tailles pour être sûr qu'il soit pris
                { src: "/logo.png", sizes: "96x96", type: "image/png" },
                { src: "/logo.png", sizes: "128x128", type: "image/png" },
                { src: "/logo.png", sizes: "192x192", type: "image/png" },
                { src: "/logo.png", sizes: "512x512", type: "image/png" },
            ]
        });

        // 2. Lier les actions (Boutons de l'écran de verrouillage)
        navigator.mediaSession.setActionHandler("play", () => {
            audioRef.current?.play();
            setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            audioRef.current?.pause();
            setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
        navigator.mediaSession.setActionHandler("nexttrack", handleNext);

        // Optionnel : Permettre de scroller dans la barre de temps native
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if (details.seekTime && audioRef.current) {
                audioRef.current.currentTime = details.seekTime;
                setCurrentTime(details.seekTime);
            }
        });

    }, [currentTrack, handleNext, handlePrev]);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.preload = "auto";
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio.duration) {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => handleNext();

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        // Important pour que l'audio continue en background sur mobile
        audio.addEventListener("play", () => setIsPlaying(true));
        audio.addEventListener("pause", () => setIsPlaying(false));

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.src = "";
        };
    }, []); // on mount only

    const playTrack = (surah: Chapter, reciter: ReciterInfo, fullPlaylist: Chapter[]) => {
        setPlaylist(fullPlaylist);
        setCurrentTrack({ surah, reciter });

        if (currentTrack?.surah.id === surah.id && currentTrack?.reciter.id === reciter.id) {
            if (audioRef.current?.paused) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current?.pause();
                setIsPlaying(false);
            }
            return;
        }

        const paddedId = surah.id.toString().padStart(3, '0');
        const url = `${reciter.server}${paddedId}.mp3`;
        playUrl(url);
    };

    const seek = (time: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const setVolume = (vol: number) => {
        const safeVol = Math.max(0, Math.min(1, vol));
        if (audioRef.current) audioRef.current.volume = safeVol;
        setVolumeState(safeVol);
    };

    const toggleLoop = () => setIsLoop(!isLoop);

    return (
        <AudioContext.Provider value={{
            isPlaying, currentTrack, progress, currentTime, duration, volume, isLoop,
            playTrack, togglePlay, playNext: handleNext, playPrev: handlePrev, seek, setVolume, toggleLoop
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within an AudioProvider");
    return context;
};