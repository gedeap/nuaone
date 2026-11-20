import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  PlusCircle,
  ExternalLink,
  Users,
  Edit,
  Sparkles,
  Calendar,
  MessageSquare,
} from 'lucide-react';

export default async function CustomerInvitationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.userId },
    include: {
      template: true,
      guests: true,
      rsvps: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#252525]">
            Daftar Undangan Anda
          </h2>
          <p className="text-xs text-[#252525]/60">
            Kelola data acara, foto galeri, musik, dan daftar tamu untuk setiap undangan pernikahan
          </p>
        </div>
        <Link
          href="/dashboard/invitations/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold hover:bg-[#3F3F3F] transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#D8C3A5]" />
          <span>Buat Undangan Baru</span>
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D6] space-y-4 shadow-sm">
          <p className="text-sm text-[#252525]/60">Belum ada undangan yang dibuat.</p>
          <Link
            href="/dashboard/invitations/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold"
          >
            <span>Mulai Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col justify-between space-y-6"
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
                  <p className="text-xs text-[#B59E7B] font-mono mt-2">
                    nuaone.my.id/i/{inv.slug}/[TOKEN]
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-[#252525]/70 pt-2 border-t border-[#E9E1D6]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B59E7B]" />
                    {new Date(inv.weddingDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B59E7B]" />
                    {inv.guests.length} Tamu Terdaftar
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E9E1D6]">
                <Link
                  href={`/dashboard/invitations/${inv.id}/guests`}
                  className="py-2.5 px-3 rounded-xl bg-[#252525] text-[#F8F5F0] text-xs font-semibold text-center hover:bg-[#3F3F3F] transition-colors"
                >
                  Kelola Tamu
                </Link>
                <Link
                  href={`/dashboard/invitations/${inv.id}/edit`}
                  className="py-2.5 px-3 rounded-xl border border-[#D8C3A5] bg-white text-[#252525] text-xs font-semibold text-center hover:bg-[#F8F5F0] transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
                <Link
                  href={`/i/${inv.slug}/vip-ahmad-faisal-x7Kp92`}
                  target="_blank"
                  className="py-2.5 px-3 rounded-xl border border-[#E9E1D6] bg-white text-[#252525] text-xs font-semibold text-center hover:bg-[#F8F5F0] transition-colors flex items-center justify-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B59E7B]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
