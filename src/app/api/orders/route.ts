import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createOrderSchema = z.object({
  packageId: z.string(),
  templateId: z.string().optional().nullable(),
  customerNotes: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Data pesanan tidak valid.' }, { status: 400 });
    }

    const { packageId, customerNotes } = result.data;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 404 });
    }

    // Generate unique order number e.g. NUA-2026-XXXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NUA-2026-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        packageId: pkg.id,
        amount: pkg.price,
        status: 'PENDING',
        customerNotes,
      },
      include: {
        package: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    include: {
      package: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}
