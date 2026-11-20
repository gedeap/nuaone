import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const invitation = await prisma.invitation.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { events: true },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const primaryEvent = invitation.events[0];
  const eventDate = primaryEvent ? new Date(primaryEvent.eventDate) : new Date(invitation.weddingDate);

  const formatDateToICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDate = formatDateToICS(eventDate);
  const endDate = formatDateToICS(new Date(eventDate.getTime() + 4 * 60 * 60 * 1000)); // +4 hours

  const title = `Pernikahan ${invitation.brideNickname} & ${invitation.groomNickname}`;
  const location = primaryEvent?.venueName || invitation.primaryLocation;
  const description = `Pernikahan ${invitation.brideName} & ${invitation.groomName}. Info lengkap: https://nuaone.my.id/invitation/${invitation.slug}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nuaone Studio//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="wedding-${invitation.slug}.ics"`,
    },
  });
}
