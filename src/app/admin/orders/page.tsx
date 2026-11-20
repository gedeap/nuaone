import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminOrdersClient } from './AdminOrdersClient';

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      package: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminOrdersClient initialOrders={orders} />;
}
