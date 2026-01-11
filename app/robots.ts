import { MetadataRoute } from 'next';

const BASE_URL = 'https://gomuslimlife.com'; // Remplacez par votre domaine

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Exemple si vous avez des pages admin
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}