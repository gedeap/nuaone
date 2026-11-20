import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { InvitationEditorClient } from './InvitationEditorClient';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvitationPage({ params }: EditPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
    include: {
      template: true,
      events: { orderBy: { sortOrder: 'asc' } },
      galleries: { orderBy: { sortOrder: 'asc' } },
      gifts: { orderBy: { sortOrder: 'asc' } },
      guests: { take: 5 },
    },
  });

  if (!invitation) notFound();

  return <InvitationEditorClient initialInvitation={invitation} />;
}
