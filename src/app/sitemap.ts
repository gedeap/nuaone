import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nuaone.my.id';

  const publishedInvitations = await prisma.invitation.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = [
    '',
    '/katalog',
    '/harga',
    '/tentang-kami',
    '/faq',
    '/kontak',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const invitationRoutes = publishedInvitations.map((inv) => ({
    url: `${baseUrl}/invitation/${inv.slug}`,
    lastModified: inv.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...invitationRoutes];
}
