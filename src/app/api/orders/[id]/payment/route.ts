import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const paymentSchema = z.object({
  paymentMethod: z.string().default('BANK_TRANSFER'),
  bankSource: z.string().min(2, 'Pilih bank asal.'),
  accountNumber: z.string().min(4, 'Masukkan nomor rekening pengirim.'),
  accountName: z.string().min(2, 'Masukkan nama pemilik rekening.'),
  notes: z.string().optional().nullable(),
  proofImage: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const body = await req.json();
    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Data pembayaran tidak valid.' },
        { status: 400 }
      );
    }

    const { paymentMethod, bankSource, accountNumber, accountName, notes, proofImage } = result.data;

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod,
        amount: order.amount,
        bankSource,
        accountNumber,
        accountName,
        notes,
        proofImage,
        status: 'PENDING', // Security rule: Never automatically marked verified!
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ error: 'Gagal mengirim konfirmasi pembayaran.' }, { status: 500 });
  }
}
