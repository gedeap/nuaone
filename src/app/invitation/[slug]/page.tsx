import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) return { title: 'Undangan Tidak Ditemukan — Nuaone Studio' };

  return {
    title: `The Wedding of ${invitation.brideNickname} & ${invitation.groomNickname} — Nuaone Studio`,
    description: `Undangan pernikahan digital resmi ${invitation.brideName} & ${invitation.groomName}.`,
    openGraph: {
      title: `The Wedding of ${invitation.brideNickname} & ${invitation.groomNickname}`,
      description: `Undangan pernikahan digital resmi ${invitation.brideName} & ${invitation.groomName}.`,
      images: invitation.coverImage ? [{ url: invitation.coverImage }] : [],
    },
  };
}

export default async function PublicInvitationPreviewPage({ params }: PageProps) {
  const { slug } = await params;

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

  if (!invitation) {
    notFound();
  }

  return (
    <InvitationRenderer
      invitation={invitation}
      guest={null}
      guestToken={null}
      isPublicPreview={true}
    />
  );
}
