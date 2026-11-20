'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  templates: any[];
}

export function CreateInvitationClient({ templates }: Props) {
  const router = useRouter();

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates[0]?.id || ''
  );
  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideNickname, setBrideNickname] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomName, setGroomName] = useState('');
  const [groomNickname, setGroomNickname] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [themeStyle, setThemeStyle] = useState('classic');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          slug: slug.toLowerCase().trim(),
          brideName,
          brideNickname,
          brideParents,
          groomName,
          groomNickname,
          groomParents,
          weddingDate,
          primaryLocation,
          themeStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat undangan.');
      }

      router.push(`/dashboard/invitations/${data.invitation.id}/edit`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#252525]/60 hover:text-[#B59E7B] mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard</span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
          Buat Undangan Pernikahan Baru
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Langkah pertama untuk merangkai kisah cintamu dalam balutan estetika digital modern
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Pilih Template */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#252525]">
              1. Pilih Desain Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tpl.id);
                    setThemeStyle(tpl.colorScheme || 'classic');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'border-[#252525] bg-[#F8F5F0] ring-2 ring-[#B59E7B]'
                      : 'border-[#E9E1D6] hover:border-[#D8C3A5]'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative mb-2">
                    <img
                      src={tpl.previewImage}
                      alt={tpl.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#252525] truncate">
                    {tpl.name}
                  </h4>
                  <span className="text-[10px] text-[#B59E7B] font-semibold block">
                    {tpl.category?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. URL Tautan */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#252525]">
              2. Kustomisasi Tautan Unik (Slug URL)
            </label>
            <div className="flex items-center">
              <span className="px-4 py-2.5 rounded-l-xl bg-[#F8F5F0] border border-r-0 border-[#D8C3A5] text-xs text-[#252525]/60 font-mono">
                nuaone.my.id/i/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="nama-panggilan-mempelai (contoh: andi-ani)"
                className="w-full px-4 py-2.5 rounded-r-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none focus:ring-1 focus:ring-[#B59E7B] font-mono"
              />
            </div>
            <p className="text-[10px] text-[#252525]/50">
              *Tiap tamu akan otomatis mendapatkan token acak unik aman di belakang URL ini.
            </p>
          </div>

          {/* 3. Data Mempelai */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#252525]">
              3. Data Mempelai Pria & Wanita
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mempelai Wanita */}
              <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6] space-y-3">
                <span className="text-xs font-bold text-[#B59E7B] block">Mempelai Wanita</span>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Contoh: dr. Anindya Kirana, Sp.A"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    value={brideNickname}
                    onChange={(e) => setBrideNickname(e.target.value)}
                    placeholder="Contoh: Ani"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    required
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                    placeholder="Contoh: Putri dari Bpk. Hendra & Ibu Ratna"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6] space-y-3">
                <span className="text-xs font-bold text-[#B59E7B] block">Mempelai Pria</span>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="Contoh: Andi Pratama, S.T., M.Sc."
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    value={groomNickname}
                    onChange={(e) => setGroomNickname(e.target.value)}
                    placeholder="Contoh: Andi"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    required
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                    placeholder="Contoh: Putra dari Bpk. Bambang & Ibu Endang"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tanggal & Lokasi Utama */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#252525]">
              4. Waktu & Lokasi Acara
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#252525]/70 mb-1">Tanggal Pernikahan</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#252525]/70 mb-1">Nama Gedung / Tempat Utama</label>
                <input
                  type="text"
                  required
                  value={primaryLocation}
                  onChange={(e) => setPrimaryLocation(e.target.value)}
                  placeholder="Contoh: The Glass House Grand Ballroom, Jakarta"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E9E1D6] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'MEMBUAT UNDANGAN...' : 'LANJUT KE PENGATURAN LENGKAP'}</span>
              <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
