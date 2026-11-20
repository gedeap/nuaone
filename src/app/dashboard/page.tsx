import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Mail,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  PlusCircle,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.userId },
    include: {
      template: true,
      guests: {
        include: {
          token: true,
          rsvp: true,
        },
      },
      rsvps: true,
      guestbookMessages: true,
      views: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalInvitations = invitations.length;
  const publishedInvitations = invitations.filter((i) => i.status === 'PUBLISHED').length;

  let totalGuests = 0;
  let totalOpened = 0;
  let rsvpAttending = 0;
  let rsvpDeclined = 0;
  let rsvpPending = 0;

  invitations.forEach((inv) => {
    totalGuests += inv.guests.length;
    inv.guests.forEach((g) => {
      if (g.token?.lastOpenedAt) totalOpened++;
      if (g.rsvp) {
        if (g.rsvp.attendanceStatus === 'ATTENDING') rsvpAttending++;
        else if (g.rsvp.attendanceStatus === 'DECLINED') rsvpDeclined++;
      } else {
        rsvpPending++;
      }
    });
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Total Undangan</span>
            <Mail className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#252525]">
            {totalInvitations}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            {publishedInvitations} terpublikasi aktif
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Tamu Terdaftar</span>
            <Users className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#252525]">
            {totalGuests}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            {totalOpened} tamu telah membuka undangan
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Konfirmasi Hadir (RSVP)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700">
            {rsvpAttending}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            {rsvpDeclined} berhalangan hadir
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Menunggu Konfirmasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-700">
            {rsvpPending}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            Belum mengisi form RSVP
          </div>
        </div>
      </div>

      {/* Invitations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#252525]">
              Undangan Pernikahan Anda
            </h2>
            <p className="text-xs text-[#252525]/60">
              Pilih undangan untuk mengedit data, mengelola daftar tamu, atau membagikan link
            </p>
          </div>
          <Link
            href="/dashboard/invitations/create"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#B59E7B]" />
            <span>Tambah Undangan</span>
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D6] space-y-4 shadow-sm">
            <Mail className="w-12 h-12 text-[#D8C3A5] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#252525]">
                Belum Ada Undangan Dibuat
              </h3>
              <p className="text-xs text-[#252525]/60 max-w-sm mx-auto">
                Mulai buat undangan pernikahan digital pertamamu sekarang dan bagikan momen bahagiamu.
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold tracking-wider hover:bg-[#3F3F3F]"
            >
              <span>PILIH DARI KATALOG</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        inv.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'PUBLISHED' ? 'Terpublikasi' : 'Draf'}
                    </span>
                    <span className="text-xs text-[#252525]/50">
                      Template: {inv.template.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#252525]">
                      {inv.brideNickname} & {inv.groomNickname}
                    </h3>
                    <p className="text-xs text-[#252525]/60 mt-1">
                      {inv.brideName} & {inv.groomName}
                    </p>
                    <p className="text-xs text-[#B59E7B] font-medium mt-2">
                      URL: nuaone.my.id/i/{inv.slug}/[TOKEN_TAMU]
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E9E1D6] text-center">
                    <div>
                      <span className="text-[10px] text-[#252525]/50 uppercase block">Total Tamu</span>
                      <span className="text-base font-bold text-[#252525]">{inv.guests.length}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#252525]/50 uppercase block">Hadir</span>
                      <span className="text-base font-bold text-emerald-700">
                        {inv.rsvps.filter((r) => r.attendanceStatus === 'ATTENDING').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#252525]/50 uppercase block">Ucapan Doa</span>
                      <span className="text-base font-bold text-[#252525]">
                        {inv.guestbookMessages.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <Link
                    href={`/dashboard/invitations/${inv.id}/guests`}
                    className="py-2.5 px-3 rounded-xl bg-[#252525] text-[#F8F5F0] text-xs font-semibold text-center hover:bg-[#3F3F3F] transition-colors"
                  >
                    Kelola Tamu ({inv.guests.length})
                  </Link>
                  <Link
                    href={`/dashboard/invitations/${inv.id}/edit`}
                    className="py-2.5 px-3 rounded-xl border border-[#D8C3A5] bg-white text-[#252525] text-xs font-semibold text-center hover:bg-[#F8F5F0] transition-colors"
                  >
                    Edit Undangan
                  </Link>
                  <Link
                    href={`/i/${inv.slug}/vip-ahmad-faisal-x7Kp92`}
                    target="_blank"
                    className="py-2.5 px-3 rounded-xl border border-[#E9E1D6] bg-white text-[#252525] text-xs font-semibold text-center hover:bg-[#F8F5F0] transition-colors flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3 text-[#B59E7B]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
