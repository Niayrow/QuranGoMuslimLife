// Fonction pour ajouter des zéros (ex: 1 -> "001")
const pad = (num: number) => num.toString().padStart(3, '0');

export const getAyahAudioUrl = (surahId: number, ayahId: number) => {
    // URL spécifique pour Nasser Al Qatami sur EveryAyah
    const baseUrl = "https://everyayah.com/data/Nasser_Alqatami_128kbps";

    // Format : 001001.mp3 (Sourate 001 + Verset 001)
    const fileName = `${pad(surahId)}${pad(ayahId)}.mp3`;

    return `${baseUrl}/${fileName}`;
};