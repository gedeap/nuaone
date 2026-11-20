import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShoppingBag, CheckCircle, Clock, ArrowRight, CreditCard, Copy } from 'lucide-react';
import { OrdersClient } from './OrdersClient';

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    include: {
      package: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const systemBank = await prisma.systemSetting.findMany({
    where: {
      key: { in: ['bank_name', 'bank_account_number', 'bank_account_name'] },
    },
  });

  const bankInfo = {
    name: systemBank.find((s) => s.key === 'bank_name')?.value || 'Bank Central Asia (BCA)',
    number: systemBank.find((s) => s.key === 'bank_account_number')?.value || '8735091244',
    holder: systemBank.find((s) => s.key === 'bank_account_name')?.value || 'NUAONE STUDIO INDONESIA',
  };

  return <OrdersClient orders={orders} bankInfo={bankInfo} />;
}
