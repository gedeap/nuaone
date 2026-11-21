import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveGuestByToken } from '@/lib/guestToken';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { recordRequestHit, isFeatureAllowed } from '@/lib/costProtection';
import { z } from 'zod';

const guestbookSchema = z.object({
  token: z.string().optional().nullable(),
  senderName: z.string().min(2, 'Nama pengirim minimal 2 karakter.'),
  message: z.string().min(3, 'Ucapan minimal 3 karakter.'),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    recordRequestHit();
    const allowed = await isFeatureAllowed('GUESTBOOK_SUBMISSION');
    if (!allowed) {
      return NextResponse.json(
        { error: 'Buku tamu sedang dalam mode pembatasan sumber daya sementara. Silakan coba kembali nanti.' },
        { status: 503 }
      );
    }

    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`guestbook:${ip}`, { limit: 5, windowMs: 5 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Terlalu sering mengirim ucapan. Harap beri jeda 5 menit.' },
        { status: 429 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const result = guestbookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Data ucapan tidak valid.' },
        { status: 400 }
      );
    }

    const { token, senderName, message } = result.data;

    const invitation = await prisma.invitation.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, slug: true, status: true, requireGuestbookModeration: true },
    });

    if (!invitation || invitation.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
    }

    let guestId: string | null = null;
    let verifiedName = senderName;

    if (token) {
      const resolved = await resolveGuestByToken(invitation.slug, token);
      if (resolved) {
        guestId = resolved.guest.id;
        verifiedName = resolved.guest.name;
      }
    }

    const newMessage = await prisma.guestbookMessage.create({
      data: {
        invitationId: invitation.id,
        guestId,
        senderName: verifiedName,
        message: message.trim(),
        isApproved: !invitation.requireGuestbookModeration,
        isHidden: false,
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Guestbook error:', error);
    return NextResponse.json({ error: 'Gagal mengirim ucapan.' }, { status: 500 });
  }
}
