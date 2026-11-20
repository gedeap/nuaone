import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateInvitationClient } from './CreateInvitationClient';

export default async function CreateInvitationPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const templates = await prisma.template.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  });

  return <CreateInvitationClient templates={templates} />;
}
