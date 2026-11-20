import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { assignGuestToken } from '@/lib/guestToken';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  const { id, guestId } = await params;
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

  await prisma.guest.delete({
    where: { id: guestId },
  });

  return NextResponse.json({ success: true });
}

// Regenerate or revoke token
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  const { id, guestId } = await params;
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

  if (body.action === 'REGENERATE_TOKEN') {
    const newToken = await assignGuestToken(guestId);
    return NextResponse.json({ success: true, token: newToken });
  }

  if (body.action === 'REVOKE_TOKEN') {
    await prisma.guestToken.update({
      where: { guestId },
      data: { isRevoked: true },
    });
    return NextResponse.json({ success: true, isRevoked: true });
  }

  return NextResponse.json({ error: 'Aksi tidak dikenali.' }, { status: 400 });
}
