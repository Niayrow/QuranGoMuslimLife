import { MetadataRoute } from 'next';
import { POPULAR_RECITERS } from '@/lib/constants';

// ⚠️ REMPLACEZ PAR VOTRE VRAI NOM DE DOMAINE
const BASE_URL = 'https://gomuslimlife.com';

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. Pages Statiques
    const routes = [
        '',
        '/audio',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Pages Dynamiques (Récitateurs)
    const reciterRoutes = POPULAR_RECITERS.map((reciter) => ({
        url: `${BASE_URL}/audio/${reciter.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...reciterRoutes];
}