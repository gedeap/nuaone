import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Users,
  ShoppingBag,
  DollarSign,
  Mail,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const [usersCount, orders, invitations, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.order.findMany({
      include: {
        user: true,
        package: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.invitation.findMany({
      include: { user: true, template: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const activeInvitations = invitations.filter((i) => i.status === 'PUBLISHED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Total Pengguna</span>
            <Users className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#252525]">
            {usersCount}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            Mempelai & akun terdaftar
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Pendapatan Terverifikasi</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            {paidOrders.length} transaksi berhasil
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Pesanan Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-700">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            Perlu dicek mutasi bank
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#252525]/60 text-xs font-semibold tracking-wider uppercase">
            <span>Undangan Aktif</span>
            <Mail className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#252525]">
            {activeInvitations}
          </div>
          <div className="text-[11px] text-[#252525]/50">
            {invitations.length} total dibuat
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#252525]">
              Pesanan Terbaru & Status Pembayaran
            </h2>
            <p className="text-xs text-[#252525]/60">
              Verifikasi transfer pelanggan untuk mengaktifkan paket undangan secara instan
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#B59E7B] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#252525]">
            <thead className="bg-[#F8F5F0] text-[#252525]/70 uppercase tracking-wider text-[10px] border-b border-[#E9E1D6]">
              <tr>
                <th className="py-3 px-4 font-semibold">No. Pesanan</th>
                <th className="py-3 px-4 font-semibold">Pelanggan</th>
                <th className="py-3 px-4 font-semibold">Paket</th>
                <th className="py-3 px-4 font-semibold">Total Tagihan</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D6]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F8F5F0]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#B59E7B]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#252525]">{ord.user.name}</div>
                    <div className="text-[10px] text-[#252525]/50">{ord.user.email}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold">{ord.package.name}</td>
                  <td className="py-3 px-4 font-bold">
                    Rp {ord.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status === 'PAID' ? 'LUNAS' : 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders`}
                      className="px-3 py-1.5 rounded-lg bg-[#252525] text-[#F8F5F0] text-[11px] font-semibold hover:bg-[#3F3F3F]"
                    >
                      Periksa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
