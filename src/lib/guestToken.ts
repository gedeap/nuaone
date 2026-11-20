import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Generate a cryptographically secure, URL-safe random token.
 * Default is 16 bytes (approx 22 base64url characters).
 */
export function generateSecureToken(byteLength = 16): string {
  return crypto.randomBytes(byteLength).toString('base64url');
}

/**
 * Resolve guest identity safely from invitation slug and guest token.
 * Prevents tampering with URL query parameters.
 */
export async function resolveGuestByToken(invitationSlug: string, token: string) {
  if (!invitationSlug || !token) return null;

  const invitation = await prisma.invitation.findUnique({
    where: { slug: invitationSlug },
    select: { id: true, status: true },
  });

  if (!invitation || invitation.status !== 'PUBLISHED') return null;

  const guestTokenRecord = await prisma.guestToken.findUnique({
    where: { token },
    include: {
      guest: {
        include: {
          rsvp: true,
        },
      },
    },
  });

  if (!guestTokenRecord || guestTokenRecord.isRevoked) return null;
  if (guestTokenRecord.expiresAt && guestTokenRecord.expiresAt < new Date()) return null;
  if (guestTokenRecord.guest.invitationId !== invitation.id) return null;

  // Track visit asynchronously
  await prisma.guestToken.update({
    where: { id: guestTokenRecord.id },
    data: {
      totalVisits: { increment: 1 },
      lastOpenedAt: new Date(),
    },
  }).catch(() => {});

  return {
    guest: guestTokenRecord.guest,
    token: guestTokenRecord.token,
    lastOpenedAt: guestTokenRecord.lastOpenedAt,
    totalVisits: guestTokenRecord.totalVisits + 1,
  };
}

/**
 * Create or replace a secure token for a guest.
 */
export async function assignGuestToken(guestId: string, customExpiresAt?: Date) {
  const token = generateSecureToken();

  return prisma.guestToken.upsert({
    where: { guestId },
    create: {
      guestId,
      token,
      expiresAt: customExpiresAt,
    },
    update: {
      token,
      isRevoked: false,
      expiresAt: customExpiresAt,
      lastOpenedAt: null,
      totalVisits: 0,
    },
  });
}

/**
 * Revoke a token.
 */
export async function revokeGuestToken(token: string) {
  return prisma.guestToken.updateMany({
    where: { token },
    data: { isRevoked: true },
  });
}
