import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
    include: {
      template: true,
      events: { orderBy: { sortOrder: 'asc' } },
      galleries: { orderBy: { sortOrder: 'asc' } },
      gifts: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json({ invitation });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  const body = await req.json();

  const updated = await prisma.invitation.update({
    where: { id },
    data: {
      brideName: body.brideName ?? invitation.brideName,
      brideNickname: body.brideNickname ?? invitation.brideNickname,
      brideParents: body.brideParents ?? invitation.brideParents,
      brideInstagram: body.brideInstagram ?? invitation.brideInstagram,
      groomName: body.groomName ?? invitation.groomName,
      groomNickname: body.groomNickname ?? invitation.groomNickname,
      groomParents: body.groomParents ?? invitation.groomParents,
      groomInstagram: body.groomInstagram ?? invitation.groomInstagram,
      weddingDate: body.weddingDate ? new Date(body.weddingDate) : invitation.weddingDate,
      weddingTimezone: body.weddingTimezone ?? invitation.weddingTimezone,
      primaryLocation: body.primaryLocation ?? invitation.primaryLocation,
      quote: body.quote ?? invitation.quote,
      quoteSource: body.quoteSource ?? invitation.quoteSource,
      story: body.story ? JSON.stringify(body.story) : invitation.story,
      coverImage: body.coverImage ?? invitation.coverImage,
      closingImage: body.closingImage ?? invitation.closingImage,
      closingMessage: body.closingMessage ?? invitation.closingMessage,
      weddingHashtag: body.weddingHashtag ?? invitation.weddingHashtag,
      musicUrl: body.musicUrl ?? invitation.musicUrl,
      musicTitle: body.musicTitle ?? invitation.musicTitle,
      isMusicAutoPlay: body.isMusicAutoPlay ?? invitation.isMusicAutoPlay,
      isEnvelopeActive: body.isEnvelopeActive ?? invitation.isEnvelopeActive,
      isGuestbookActive: body.isGuestbookActive ?? invitation.isGuestbookActive,
      isRsvpActive: body.isRsvpActive ?? invitation.isRsvpActive,
      themeStyle: body.themeStyle ?? invitation.themeStyle,
      status: body.status ?? invitation.status,
    },
  });

  // If events provided, replace them
  if (Array.isArray(body.events)) {
    await prisma.invitationEvent.deleteMany({ where: { invitationId: id } });
    if (body.events.length > 0) {
      await prisma.invitationEvent.createMany({
        data: body.events.map((evt: any, idx: number) => ({
          invitationId: id,
          title: evt.title || 'Acara',
          eventDate: evt.eventDate ? new Date(evt.eventDate) : updated.weddingDate,
          startTime: evt.startTime || '08:00',
          endTime: evt.endTime || 'Selesai',
          timezone: evt.timezone || 'WIB',
          venueName: evt.venueName || updated.primaryLocation,
          address: evt.address || updated.primaryLocation,
          googleMapsUrl: evt.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.venueName || updated.primaryLocation)}`,
          sortOrder: idx + 1,
        })),
      });
    }
  }

  // If gifts provided, replace them
  if (Array.isArray(body.gifts)) {
    await prisma.invitationGift.deleteMany({ where: { invitationId: id } });
    if (body.gifts.length > 0) {
      await prisma.invitationGift.createMany({
        data: body.gifts.map((g: any, idx: number) => ({
          invitationId: id,
          type: g.type || 'BANK',
          providerName: g.providerName || 'BCA',
          accountName: g.accountName || 'Nama Penerima',
          accountNumber: g.accountNumber || '',
          qrisImageUrl: g.qrisImageUrl || null,
          notes: g.notes || '',
          sortOrder: idx + 1,
        })),
      });
    }
  }

  return NextResponse.json({ success: true, invitation: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  await prisma.invitation.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
