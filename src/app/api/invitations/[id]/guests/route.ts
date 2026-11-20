import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assignGuestToken } from '@/lib/guestToken';
import { GuestCategory } from '@prisma/client';
import { z } from 'zod';

const addGuestSchema = z.object({
  name: z.string().min(1, 'Nama tamu wajib diisi.'),
  category: z.nativeEnum(GuestCategory).default(GuestCategory.FRIENDS),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  maxAttendees: z.number().min(1).default(2),
  notes: z.string().optional().nullable(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  const guests = await prisma.guest.findMany({
    where: { invitationId: id },
    include: {
      token: true,
      rsvp: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ guests, slug: invitation.slug });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  const body = await req.json();

  // Check if bulk import or single add
  if (Array.isArray(body.guests)) {
    const createdList = [];
    for (const g of body.guests) {
      if (!g.name || typeof g.name !== 'string') continue;

      const guest = await prisma.guest.create({
        data: {
          invitationId: id,
          name: g.name.trim(),
          category: g.category || GuestCategory.FRIENDS,
          phone: g.phone ? String(g.phone).trim() : null,
          maxAttendees: Number(g.maxAttendees) || 2,
          notes: g.notes || null,
        },
      });

      // Assign cryptographically secure token
      const tokenRecord = await assignGuestToken(guest.id);
      createdList.push({ ...guest, token: tokenRecord });
    }

    return NextResponse.json({
      success: true,
      count: createdList.length,
      guests: createdList,
    });
  }

  // Single guest
  const parsed = addGuestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Data tidak valid.' },
      { status: 400 }
    );
  }

  const { name, category, phone, email, maxAttendees, notes } = parsed.data;

  const guest = await prisma.guest.create({
    data: {
      invitationId: id,
      name: name.trim(),
      category,
      phone: phone ? phone.trim() : null,
      email: email ? email.trim() : null,
      maxAttendees,
      notes,
    },
  });

  const tokenRecord = await assignGuestToken(guest.id);

  return NextResponse.json({
    success: true,
    guest: { ...guest, token: tokenRecord },
  });
}
