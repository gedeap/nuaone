import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { GuestManagerClient } from './GuestManagerClient';

interface GuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const invitation = await prisma.invitation.findFirst({
    where: {
      id,
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
    include: {
      guests: {
        include: {
          token: true,
          rsvp: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!invitation) notFound();

  return (
    <GuestManagerClient
      invitation={{
        id: invitation.id,
        slug: invitation.slug,
        brideNickname: invitation.brideNickname,
        groomNickname: invitation.groomNickname,
      }}
      initialGuests={invitation.guests}
    />
  );
}
