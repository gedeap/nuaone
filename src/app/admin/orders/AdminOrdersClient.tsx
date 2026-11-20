'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  Search,
  Filter,
} from 'lucide-react';

interface Props {
  initialOrders: any[];
}

export function AdminOrdersClient({ initialOrders }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleVerify = async (orderId: string, action: 'VERIFY' | 'REJECT') => {
    if (!confirm(`Konfirmasi untuk ${action === 'VERIFY' ? 'MENYETUJUI & MENGAKTIFKAN' : 'MENOLAK'} pesanan ini?`)) {
      return;
    }

    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: action === 'VERIFY' ? 'PAID' : 'PENDING',
                  payments: o.payments.map((p: any) => ({
                    ...p,
                    status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
                  })),
                }
              : o
          )
        );
        router.refresh();
      } else {
        alert('Gagal memproses aksi verifikasi.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#252525]">
          Manajemen & Verifikasi Pembayaran Pesanan
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Cek konfirmasi transfer manual pelanggan dan setujui untuk memberikan akses penuh pembuatan undangan
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor pesanan atau nama..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#252525]/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PAID'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-[#252525] text-[#F8F5F0]'
                  : 'bg-[#F8F5F0] text-[#252525]/70 hover:bg-[#E9E1D6]'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st === 'PENDING' ? 'Menunggu' : 'Lunas'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D6]">
            <p className="text-sm text-[#252525]/60">Tidak ada pesanan ditemukan.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isPaid = order.status === 'PAID';
            const latestPayment = order.payments?.[0];
            const isProcessing = processingId === order.id;

            return (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#B59E7B]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isPaid ? 'LUNAS (TERVERIFIKASI)' : 'MENUNGGU VERIFIKASI'}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#252525]">
                    {order.package.name} — Rp {order.amount.toLocaleString('id-ID')}
                  </h3>

                  <div className="text-xs text-[#252525]/70 space-y-0.5">
                    <p>
                      Pelanggan: <strong className="text-[#252525]">{order.user.name}</strong> ({order.user.email} - {order.user.phone || 'No WA -'})
                    </p>
                    {order.customerNotes && (
                      <p className="text-[11px] italic text-[#252525]/60">
                        Catatan: &ldquo;{order.customerNotes}&rdquo;
                      </p>
                    )}
                  </div>

                  {latestPayment && (
                    <div className="p-3 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6] text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#B59E7B] block">
                        Detail Konfirmasi Transfer Pelanggan:
                      </span>
                      <p>
                        Bank Asal: <strong>{latestPayment.bankSource || 'BCA'}</strong> | A/N: <strong>{latestPayment.accountName}</strong> | Rek: <strong>{latestPayment.accountNumber}</strong>
                      </p>
                      {latestPayment.notes && (
                        <p className="text-[11px] text-[#252525]/60">Ref: {latestPayment.notes}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2">
                  {!isPaid ? (
                    <>
                      <button
                        onClick={() => handleVerify(order.id, 'VERIFY')}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SETUJUI PEMBAYARAN</span>
                      </button>
                      <button
                        onClick={() => handleVerify(order.id, 'REJECT')}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        Tolak
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
                      <Check className="w-4 h-4" />
                      <span>Pembayaran Sah & Terverifikasi</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
