'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface Props {
  packages: any[];
  templates: any[];
  initialPackageId?: string;
  initialTemplateId?: string;
  user: any;
}

export function OrderCheckoutClient({
  packages,
  templates,
  initialPackageId,
  initialTemplateId,
  user,
}: Props) {
  const router = useRouter();

  const [selectedPkgId, setSelectedPkgId] = useState(
    initialPackageId || packages.find((p) => p.code === 'PREMIUM')?.id || packages[0]?.id
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTemplateId || templates[0]?.id || ''
  );
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPackage = packages.find((p) => p.id === selectedPkgId);
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleOrder = async () => {
    if (!user) {
      router.push(`/login?redirect=/order?packageId=${selectedPkgId}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPkgId,
          templateId: selectedTemplateId,
          customerNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan.');
      }

      router.push('/dashboard/orders');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
          Formulir Pemesanan Resmi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
          Pesan Undangan Digital Nuaone Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#252525]/70 max-w-lg mx-auto">
          Pilih paket dan tema desain pilihan Anda untuk melangkah ke tahap kustomisasi data pernikahan
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Package & Template Selection */}
        <div className="md:col-span-2 space-y-8">
          {/* 1. Paket Pilihan */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              1. Pilih Paket Layanan
            </h3>
            <div className="space-y-3">
              {packages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#252525] bg-[#F8F5F0] ring-2 ring-[#B59E7B]'
                        : 'border-[#E9E1D6] hover:bg-[#F8F5F0]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#252525]">
                          {pkg.name}
                        </span>
                        {pkg.code === 'PREMIUM' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#B59E7B] text-white">
                            Populer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#252525]/60 mt-1 max-w-sm">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#252525] block">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-[10px] text-[#252525]/40 line-through">
                          Rp {pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Template Pilihan */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              2. Pilih Desain Template
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'border-[#252525] bg-[#F8F5F0] ring-2 ring-[#B59E7B]'
                      : 'border-[#E9E1D6] hover:border-[#D8C3A5]'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative mb-1.5">
                    <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-bold text-xs text-[#252525] block truncate">
                    {tpl.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Catatan Tambahan */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] space-y-3 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              3. Catatan Khusus untuk Tim Studio (Opsional)
            </h3>
            <textarea
              rows={3}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Misal: Ingin warna aksen rose gold atau ada penambahan acara adat khusus..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-3 text-xs border-b border-[#E9E1D6] pb-4">
              <div className="flex justify-between">
                <span className="text-[#252525]/60">Paket:</span>
                <span className="font-bold text-[#252525]">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252525]/60">Template:</span>
                <span className="font-bold text-[#252525]">{selectedTemplate?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252525]/60">Masa Aktif:</span>
                <span className="font-bold text-[#252525]">
                  {selectedPackage?.code === 'EXCLUSIVE' ? 'Selamanya (Lifetime)' : '12 Bulan'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-[#252525]/70">Total Tagihan:</span>
              <span className="font-serif text-2xl font-bold text-[#252525]">
                Rp {selectedPackage?.price.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'MEMPROSES PESANAN...' : user ? 'LANJUT KE PEMBAYARAN' : 'MASUK UNTUK PESAN'}</span>
              <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
            </button>

            <p className="text-[10px] text-center text-[#252525]/50 leading-relaxed">
              Pembayaran aman melalui transfer bank BCA / Mandiri & verifikasi tim Nuaone Studio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
