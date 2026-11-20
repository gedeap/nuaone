import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nuaone.my.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/katalog', '/harga', '/tentang-kami', '/faq', '/kontak', '/invitation/*'],
        disallow: ['/dashboard/*', '/admin/*', '/api/*', '/i/*'], // Disallow private token links and admin pages
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
