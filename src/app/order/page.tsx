import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { OrderCheckoutClient } from './OrderCheckoutClient';

interface Props {
  searchParams: Promise<{ packageId?: string; templateId?: string }>;
}

export default async function OrderPage({ searchParams }: Props) {
  const { packageId, templateId } = await searchParams;
  const user = await getCurrentUser();

  const [packages, templates] = await Promise.all([
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.template.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <OrderCheckoutClient
          packages={packages}
          templates={templates}
          initialPackageId={packageId}
          initialTemplateId={templateId}
          user={user}
        />
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
