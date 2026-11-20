import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const action = body.action; // 'VERIFY' or 'REJECT'

    const order = await prisma.order.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    if (action === 'VERIFY') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id },
          data: { status: 'PAID', adminNotes: `Diverifikasi oleh ${user.name} pada ${new Date().toISOString()}` },
        }),
        prisma.payment.updateMany({
          where: { orderId: id },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
            verifiedBy: user.email,
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: user.userId,
            action: 'PAYMENT_VERIFIED',
            entity: 'Order',
            entityId: id,
            details: JSON.stringify({ amount: order.amount, verifiedBy: user.email }),
          },
        }),
      ]);

      return NextResponse.json({ success: true, status: 'PAID' });
    } else if (action === 'REJECT') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id },
          data: { status: 'PENDING', adminNotes: `Pembayaran ditolak: ${body.reason || 'Mutasi belum masuk'}` },
        }),
        prisma.payment.updateMany({
          where: { orderId: id },
          data: { status: 'REJECTED' },
        }),
      ]);

      return NextResponse.json({ success: true, status: 'REJECTED' });
    }

    return NextResponse.json({ error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Gagal memverifikasi pembayaran.' }, { status: 500 });
  }
}
