'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  ArrowRight,
  CreditCard,
  Copy,
  Check,
  Upload,
} from 'lucide-react';

interface Props {
  orders: any[];
  bankInfo: {
    name: string;
    number: string;
    holder: string;
  };
}

export function OrdersClient({ orders, bankInfo }: Props) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Payment form state
  const [bankSource, setBankSource] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const copyBankNumber = () => {
    navigator.clipboard.writeText(bankInfo.number);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankSource,
          accountNumber,
          accountName,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Konfirmasi pembayaran berhasil dikirim! Tim Admin Nuaone Studio akan segera memverifikasi transaksi Anda.');
        setSelectedOrder(null);
        router.refresh();
      } else {
        alert(data.error || 'Gagal mengirim pembayaran.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#252525]">
          Riwayat Pesanan & Tagihan
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Pantau status aktivasi paket undangan pernikahan dan konfirmasi transfer pembayaran Anda
        </p>
      </div>

      {/* Official Payment Account Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#252525] to-[#3A3A3A] text-[#F8F5F0] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-[#D8C3A5] uppercase">
            Rekening Resmi Pembayaran Nuaone Studio
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
            {bankInfo.name}
          </h3>
          <p className="text-xs text-[#E9E1D6]/70">
            A/N: <strong className="text-white">{bankInfo.holder}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
          <code className="font-mono text-lg font-bold text-[#D8C3A5]">
            {bankInfo.number}
          </code>
          <button
            onClick={copyBankNumber}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Salin Nomor Rekening"
          >
            {copiedBank ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D6] space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#D8C3A5] mx-auto" />
            <p className="text-sm text-[#252525]/70">Belum ada pesanan.</p>
            <Link
              href="/harga"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold"
            >
              <span>Lihat Paket Harga</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPaid = order.status === 'PAID';
              const hasPendingPayment = order.payments?.some(
                (p: any) => p.status === 'PENDING'
              );

              return (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#B59E7B]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'LUNAS / TERVERIFIKASI' : 'MENUNGGU PEMBAYARAN'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#252525]">
                      {order.package.name}
                    </h3>

                    <p className="text-xs text-[#252525]/60">
                      Dipesan pada {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-3">
                    <div className="text-xl font-bold text-[#252525]">
                      Rp {order.amount.toLocaleString('id-ID')}
                    </div>

                    {!isPaid && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-5 py-2 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-wider hover:bg-[#3F3F3F] transition-all shadow-sm"
                      >
                        {hasPendingPayment ? 'Update Bukti Transfer' : 'Konfirmasi Pembayaran'}
                      </button>
                    )}

                    {isPaid && (
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Paket Aktif & Siap Digunakan</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Pembayaran */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#252525]">
                  Konfirmasi Pembayaran
                </h3>
                <p className="text-xs text-[#252525]/60">
                  Tagihan: {selectedOrder.orderNumber} (Rp {selectedOrder.amount.toLocaleString('id-ID')})
                </p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Bank Pengirim Anda
                </label>
                <select
                  value={bankSource}
                  onChange={(e) => setBankSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                >
                  <option value="BCA">Bank BCA</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="BNI">Bank BNI</option>
                  <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                  <option value="CIMB">CIMB Niaga</option>
                  <option value="GoPay/OVO/Dana">E-Wallet (GoPay, OVO, DANA)</option>
                  <option value="Lainnya">Bank Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nomor Rekening Pengirim
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 5220918231"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Pemilik Rekening Pengirim
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Catatan / Keterangan Transfer (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nomor referensi m-banking..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#252525] text-white text-xs font-semibold hover:bg-[#3F3F3F] disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
