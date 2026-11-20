import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createInvitationSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip.'),
  templateId: z.string(),
  brideName: z.string().min(2),
  brideNickname: z.string().min(1),
  brideParents: z.string().min(3),
  groomName: z.string().min(2),
  groomNickname: z.string().min(1),
  groomParents: z.string().min(3),
  weddingDate: z.string(),
  primaryLocation: z.string().min(3),
  quote: z.string().optional().nullable(),
  quoteSource: z.string().optional().nullable(),
  themeStyle: z.string().default('classic'),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = createInvitationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Data tidak valid.' },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check unique slug
    const existing = await prisma.invitation.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Tautan URL (slug) ini sudah digunakan. Silakan gunakan nama lain.' },
        { status: 409 }
      );
    }

    const invitation = await prisma.invitation.create({
      data: {
        slug: data.slug,
        userId: user.userId,
        templateId: data.templateId,
        status: 'PUBLISHED',
        brideName: data.brideName,
        brideNickname: data.brideNickname,
        brideParents: data.brideParents,
        groomName: data.groomName,
        groomNickname: data.groomNickname,
        groomParents: data.groomParents,
        weddingDate: new Date(data.weddingDate),
        primaryLocation: data.primaryLocation,
        quote: data.quote,
        quoteSource: data.quoteSource,
        themeStyle: data.themeStyle,
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        closingImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        closingMessage: 'Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian.',
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
        musicTitle: 'Romantic Wedding Piano Symphony',
      },
    });

    // Create default event: Akad & Resepsi
    await prisma.invitationEvent.createMany({
      data: [
        {
          invitationId: invitation.id,
          title: 'Akad Nikah / Pemberkatan',
          eventDate: new Date(data.weddingDate),
          startTime: '08:00',
          endTime: '10:00 WIB',
          venueName: data.primaryLocation,
          address: data.primaryLocation,
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(data.primaryLocation)}`,
          sortOrder: 1,
        },
        {
          invitationId: invitation.id,
          title: 'Resepsi Pernikahan',
          eventDate: new Date(data.weddingDate),
          startTime: '11:00',
          endTime: '14:00 WIB',
          venueName: data.primaryLocation,
          address: data.primaryLocation,
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(data.primaryLocation)}`,
          sortOrder: 2,
        },
      ],
    });

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    console.error('Create invitation error:', error);
    return NextResponse.json({ error: 'Gagal membuat undangan.' }, { status: 500 });
  }
}
