import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { resolveGuestByToken } from '@/lib/guestToken';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

interface PageProps {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) return { title: 'Undangan Tidak Ditemukan — Nuaone Studio' };

  const resolved = await resolveGuestByToken(slug, token);
  const guestName = resolved?.guest?.name ? ` untuk ${resolved.guest.name}` : '';

  return {
    title: `The Wedding of ${invitation.brideNickname} & ${invitation.groomNickname}${guestName}`,
    description: `Undangan pernikahan digital resmi ${invitation.brideName} & ${invitation.groomName}.`,
    openGraph: {
      title: `The Wedding of ${invitation.brideNickname} & ${invitation.groomNickname}`,
      description: `Undangan pernikahan digital resmi ${invitation.brideName} & ${invitation.groomName}.`,
      images: invitation.coverImage ? [{ url: invitation.coverImage }] : [],
    },
  };
}

export default async function GuestInvitationPage({ params }: PageProps) {
  const { slug, token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      template: true,
      events: { orderBy: { sortOrder: 'asc' } },
      galleries: { orderBy: { sortOrder: 'asc' } },
      gifts: { orderBy: { sortOrder: 'asc' } },
      guestbookMessages: {
        where: { isApproved: true, isHidden: false },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!invitation || invitation.status !== 'PUBLISHED') {
    notFound();
  }

  // Resolve guest securely from cryptographic token in database
  const resolved = await resolveGuestByToken(slug, token);
  if (!resolved) {
    notFound();
  }

  return (
    <InvitationRenderer
      invitation={invitation}
      guest={resolved.guest}
      guestToken={token}
      isPublicPreview={false}
    />
  );
}
