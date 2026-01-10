"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Chapter } from "@/types";

interface ReciterInfo {
    id: number;
    name: string;
    image: string;
    serverUrl: string;
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
    // États
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Chapter[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isLoop, setIsLoop] = useState(false);

    // Refs (Pour garder l'accès aux valeurs à jour dans les event listeners sans re-render)
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const stateRef = useRef({
        playlist,
        currentTrack,
        isLoop,
        volume
    });

    // Mettre à jour les refs quand le state change
    useEffect(() => {
        stateRef.current = { playlist, currentTrack, isLoop, volume };
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [playlist, currentTrack, isLoop, volume]);

    // --- FONCTION DE LECTURE URL (Interne) ---
    const playUrl = useCallback((url: string) => {
        if (!audioRef.current) return;

        // On évite l'erreur "The play() request was interrupted"
        // en s'assurant que l'audio est prêt ou stoppé proprement
        audioRef.current.src = url;
        audioRef.current.load(); // Force le rechargement propre

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((e) => {
                    // On ignore l'erreur d'interruption si on change vite de piste
                    if (e.name !== 'AbortError') console.error("Erreur lecture:", e);
                });
        }
    }, []);

    // --- LOGIQUE SUIVANT / PRÉCÉDENT ---
    const handleNext = useCallback(() => {
        const { playlist, currentTrack, isLoop } = stateRef.current;

        if (!currentTrack || playlist.length === 0) return;

        // Si Loop activé, on replay la même
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
            playUrl(`${reciter.serverUrl}${paddedId}.mp3`);
        } else {
            setIsPlaying(false);
        }
    }, [playUrl]);

    const handlePrev = useCallback(() => {
        const { playlist, currentTrack } = stateRef.current;
        if (!currentTrack || playlist.length === 0) return;

        const currentIndex = playlist.findIndex(c => c.id === currentTrack.surah.id);

        // Si on a écouté plus de 3 sec, on remet au début
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            const prevSurah = playlist[currentIndex - 1];
            const reciter = currentTrack.reciter;

            setCurrentTrack({ surah: prevSurah, reciter });
            const paddedId = prevSurah.id.toString().padStart(3, '0');
            playUrl(`${reciter.serverUrl}${paddedId}.mp3`);
        }
    }, [playUrl]);

    // --- INITIALISATION AUDIO (Une seule fois !) ---
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

        const handleEnded = () => {
            // On appelle la logique "Suivant" qui lira les refs à jour
            handleNext();
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        // Cleanup propre
        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.src = ""; // Libère la ressource
        };
    }, []); // <-- Dépendances vides : Ne se relance jamais = Pas de coupure !

    // --- FONCTIONS PUBLIQUES ---

    const playTrack = (surah: Chapter, reciter: ReciterInfo, fullPlaylist: Chapter[]) => {
        // Mise à jour des données
        setPlaylist(fullPlaylist);
        setCurrentTrack({ surah, reciter });

        // Si c'est la même piste qui joue, on toggle juste
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

        // Sinon on lance la nouvelle
        const paddedId = surah.id.toString().padStart(3, '0');
        const url = `${reciter.serverUrl}${paddedId}.mp3`;
        playUrl(url);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
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