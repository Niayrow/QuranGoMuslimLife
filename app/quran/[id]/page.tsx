import { Metadata } from "next";
import QuranReader from "@/components/QuranReader";
import { notFound } from "next/navigation";

// --- RÉCUPÉRATION DES DONNÉES (Server Side) ---
async function getSurahData(id: string) {
    try {
        // On récupère le texte Arabe (uthmani) et la traduction Française (fr.hamidullah par exemple)
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,fr.hamidullah`);

        if (!res.ok) return null;

        const data = await res.json();

        // On vérifie qu'on a bien les données
        if (!data.data || data.data.length < 2) return null;

        const arabicSurah = data.data[0];
        const frenchSurah = data.data[1];

        // On fusionne les deux tableaux de versets pour n'en faire qu'un propre
        const verses = arabicSurah.ayahs.map((ayah: any, index: number) => ({
            number: ayah.number,
            text: ayah.text,
            translation: frenchSurah.ayahs[index] ? frenchSurah.ayahs[index].text : "",
            numberInSurah: ayah.numberInSurah,
        }));

        return {
            info: {
                number: arabicSurah.number,
                name: arabicSurah.name,
                englishName: arabicSurah.englishName,
                englishNameTranslation: arabicSurah.englishNameTranslation,
                revelationType: arabicSurah.revelationType,
                numberOfAyahs: arabicSurah.numberOfAyahs,
            },
            verses: verses
        };

    } catch (error) {
        console.error("Erreur récupération sourate:", error);
        return null;
    }
}

// --- GÉNÉRATION DES METADATA SEO ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const data = await getSurahData(id);

    if (!data) return { title: "Sourate introuvable" };

    return {
        title: `Lire Sourate ${data.info.englishName} (${data.info.name}) - Coran en ligne`,
        description: `Lecture de la sourate ${data.info.englishName} en arabe et français. ${data.info.englishNameTranslation}.`,
    };
}

// --- PAGE PRINCIPALE ---
export default async function QuranPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getSurahData(id);

    if (!data) return notFound();

    return (
        <QuranReader
            surah={data.info}
            verses={data.verses}
        />
    );
}