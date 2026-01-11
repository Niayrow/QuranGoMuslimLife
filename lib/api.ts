import { ChaptersResponse } from "@/types";

const BASE_URL = 'https://api.quran.com/api/v4';

export async function getChapters(): Promise<ChaptersResponse> {
    try {
        const response = await fetch(`${BASE_URL}/chapters?language=fr`, {
            cache: 'force-cache',
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return { chapters: [] };
    }
}
// lib/api.ts

export const getSurahAudioData = async (reciterId: number, chapterId: number) => {
    try {
        // On utilise l'API V4 de Quran.com pour récupérer l'audio ET les timestamps
        // reciterId pour Nasser Al Qatami sur Quran.com est souvent 6 ou un autre ID. 
        // Pour cet exemple, on va utiliser une route générique qui renvoie les segments.

        const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}?segments=true`);
        const data = await res.json();
        return data.audio_file; // Contient audio_url et timestamps
    } catch (error) {
        console.error("Erreur audio", error);
        return null;
    }
};