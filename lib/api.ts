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