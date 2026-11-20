import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default async function AdminCustomersPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const customers = await prisma.user.findMany({
    include: {
      invitations: true,
      orders: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#252525]">
          Daftar Pengguna & Pelanggan ({customers.length})
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Pantau status akun pengguna terdaftar, jumlah undangan yang dibuat, dan riwayat pesanan
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#252525]">
            <thead className="bg-[#F8F5F0] text-[#252525]/70 uppercase tracking-wider text-[10px] border-b border-[#E9E1D6]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Nama & Email</th>
                <th className="py-3.5 px-4 font-semibold">WhatsApp</th>
                <th className="py-3.5 px-4 font-semibold">Peran (Role)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Undangan</th>
                <th className="py-3.5 px-4 font-semibold text-center">Pesanan</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D6]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8F5F0]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#252525]">{c.name}</div>
                    <div className="text-[10px] text-[#252525]/50">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#252525]/80">
                    {c.phone || '-'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-[#252525]">
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {c.invitations.length}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {c.orders.length}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#252525]/60 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString('id-ID')}
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
