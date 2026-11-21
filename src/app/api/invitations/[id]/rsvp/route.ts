import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveGuestByToken } from '@/lib/guestToken';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { recordRequestHit } from '@/lib/costProtection';
import { AttendanceStatus } from '@prisma/client';
import { z } from 'zod';

const rsvpSchema = z.object({
  token: z.string().min(1),
  attendanceStatus: z.nativeEnum(AttendanceStatus),
  attendeeCount: z.number().min(1).default(1),
  message: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    recordRequestHit();
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`rsvp:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan RSVP dari perangkat ini. Harap tunggu beberapa saat.' },
        { status: 429 }
      );
    }
    const { id } = await params;
    const body = await req.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Data RSVP tidak valid.' }, { status: 400 });
    }

    const { token, attendanceStatus, attendeeCount, message } = result.data;

    const invitation = await prisma.invitation.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, slug: true, status: true },
    });

    if (!invitation || invitation.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
    }

    // Resolve guest securely by token
    const resolved = await resolveGuestByToken(invitation.slug, token);
    if (!resolved) {
      return NextResponse.json(
        { error: 'Tautan undangan tidak valid atau telah kedaluwarsa.' },
        { status: 403 }
      );
    }

    const guest = resolved.guest;

    // Validate attendee limit
    const validCount = Math.min(attendeeCount, guest.maxAttendees);

    // Upsert RSVP
    const rsvp = await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      create: {
        invitationId: guest.invitationId,
        guestId: guest.id,
        attendanceStatus,
        attendeeCount: attendanceStatus === 'ATTENDING' ? validCount : 0,
        message: message?.trim() || null,
      },
      update: {
        attendanceStatus,
        attendeeCount: attendanceStatus === 'ATTENDING' ? validCount : 0,
        message: message?.trim() || null,
        submittedAt: new Date(),
      },
    });

    // Also add to guestbook if message is provided
    if (message?.trim()) {
      await prisma.guestbookMessage.create({
        data: {
          invitationId: guest.invitationId,
          guestId: guest.id,
          senderName: guest.name,
          message: message.trim(),
          isApproved: true,
          isHidden: false,
        },
      });
    }

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ error: 'Gagal mengirim RSVP.' }, { status: 500 });
  }
}
