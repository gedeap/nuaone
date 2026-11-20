'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2 } from 'lucide-react';

interface Props {
  initialSettings: Record<string, string>;
}

export function AdminSettingsClient({ initialSettings }: Props) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initialSettings.site_name || 'Nuaone Studio');
  const [siteDomain, setSiteDomain] = useState(initialSettings.site_domain || 'nuaone.my.id');
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.whatsapp_number || '6281234567890');
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || 'halo@nuaone.my.id');
  const [bankName, setBankName] = useState(initialSettings.bank_name || 'Bank Central Asia (BCA)');
  const [bankNumber, setBankNumber] = useState(initialSettings.bank_account_number || '8735091244');
  const [bankHolder, setBankHolder] = useState(initialSettings.bank_account_name || 'NUAONE STUDIO INDONESIA');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: siteName,
          site_domain: siteDomain,
          whatsapp_number: whatsappNumber,
          contact_email: contactEmail,
          bank_name: bankName,
          bank_account_number: bankNumber,
          bank_account_name: bankHolder,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        alert('Gagal menyimpan pengaturan.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#252525]">
          Pengaturan Sistem & Konfigurasi Platform
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Konfigurasi domain resmi nuaone.my.id, kontak WhatsApp admin, dan rekening penerima pembayaran
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Website */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Identitas Brand & Domain
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Nama Platform
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Domain Resmi
              </label>
              <input
                type="text"
                value={siteDomain}
                onChange={(e) => setSiteDomain(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Kontak CS */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Kontak WhatsApp & Email Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Nomor WhatsApp Resmi (Format: 628...)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Email Dukungan
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
            </div>
          </div>
        </div>

        {/* Rekening Bank Platform */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E1D6] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Rekening Bank Pembayaran Platform
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Nama Pemilik Rekening
              </label>
              <input
                type="text"
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-all shadow-md disabled:opacity-50"
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PENGATURAN DISIMPAN!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#D8C3A5]" />
                <span>{saving ? 'MENYIMPAN...' : 'SIMPAN PENGATURAN'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
