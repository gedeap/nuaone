import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invitation = await prisma.invitation.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      ...(user.role === 'CUSTOMER' ? { userId: user.userId } : {}),
    },
    include: {
      guests: {
        include: {
          token: true,
          rsvp: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan.' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nuaone.my.id';

  const rows = invitation.guests.map((g, index) => {
    const link = g.token?.token
      ? `${baseUrl}/i/${invitation.slug}/${g.token.token}`
      : '-';

    let rsvpStatusText = 'Belum Konfirmasi';
    if (g.rsvp) {
      if (g.rsvp.attendanceStatus === 'ATTENDING') rsvpStatusText = 'Akan Hadir';
      else if (g.rsvp.attendanceStatus === 'DECLINED') rsvpStatusText = 'Berhalangan Hadir';
      else rsvpStatusText = 'Ragu-ragu / Belum Pasti';
    }

    return {
      'No': index + 1,
      'Nama Tamu': g.name,
      'Kategori': g.category,
      'Nomor WhatsApp': g.phone || '-',
      'Batas Kehadiran (Orang)': g.maxAttendees,
      'Tautan Undangan Khusus': link,
      'Status Dibuka': g.token?.lastOpenedAt ? 'Sudah Dibuka' : 'Belum Dibuka',
      'Total Kunjungan': g.token?.totalVisits || 0,
      'Terakhir Dibuka': g.token?.lastOpenedAt
        ? new Date(g.token.lastOpenedAt).toLocaleString('id-ID')
        : '-',
      'Status RSVP': rsvpStatusText,
      'Jumlah Konfirmasi Hadir': g.rsvp?.attendeeCount || 0,
      'Pesan Doa Tamu': g.rsvp?.message || '-',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Tamu Nuaone');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="Daftar-Tamu-${invitation.slug}.xlsx"`,
    },
  });
}
