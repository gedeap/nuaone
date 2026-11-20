'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  Users,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Music,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface Props {
  initialInvitation: any;
}

export function InvitationEditorClient({ initialInvitation }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'media' | 'music' | 'envelope' | 'publish'>('info');

  // Form states
  const [brideName, setBrideName] = useState(initialInvitation.brideName || '');
  const [brideNickname, setBrideNickname] = useState(initialInvitation.brideNickname || '');
  const [brideParents, setBrideParents] = useState(initialInvitation.brideParents || '');
  const [brideInstagram, setBrideInstagram] = useState(initialInvitation.brideInstagram || '');

  const [groomName, setGroomName] = useState(initialInvitation.groomName || '');
  const [groomNickname, setGroomNickname] = useState(initialInvitation.groomNickname || '');
  const [groomParents, setGroomParents] = useState(initialInvitation.groomParents || '');
  const [groomInstagram, setGroomInstagram] = useState(initialInvitation.groomInstagram || '');

  const [quote, setQuote] = useState(initialInvitation.quote || '');
  const [quoteSource, setQuoteSource] = useState(initialInvitation.quoteSource || '');
  const [weddingDate, setWeddingDate] = useState(
    initialInvitation.weddingDate
      ? new Date(initialInvitation.weddingDate).toISOString().split('T')[0]
      : ''
  );
  const [primaryLocation, setPrimaryLocation] = useState(initialInvitation.primaryLocation || '');
  const [weddingHashtag, setWeddingHashtag] = useState(initialInvitation.weddingHashtag || '');
  const [closingMessage, setClosingMessage] = useState(initialInvitation.closingMessage || '');

  // Media
  const [coverImage, setCoverImage] = useState(initialInvitation.coverImage || '');
  const [closingImage, setClosingImage] = useState(initialInvitation.closingImage || '');

  // Music
  const [musicUrl, setMusicUrl] = useState(initialInvitation.musicUrl || '');
  const [musicTitle, setMusicTitle] = useState(initialInvitation.musicTitle || '');
  const [isMusicAutoPlay, setIsMusicAutoPlay] = useState(initialInvitation.isMusicAutoPlay ?? true);

  // Status & Theme
  const [status, setStatus] = useState(initialInvitation.status || 'PUBLISHED');
  const [themeStyle, setThemeStyle] = useState(initialInvitation.themeStyle || 'classic');

  // Events
  const [events, setEvents] = useState<any[]>(
    initialInvitation.events?.length > 0
      ? initialInvitation.events
      : [
          {
            title: 'Akad Nikah',
            startTime: '08:00',
            endTime: '10:00 WIB',
            venueName: 'Masjid Agung',
            address: 'Jl. Utama No. 1',
            googleMapsUrl: '',
          },
        ]
  );

  // Gifts
  const [gifts, setGifts] = useState<any[]>(
    initialInvitation.gifts?.length > 0
      ? initialInvitation.gifts
      : [
          {
            type: 'BANK',
            providerName: 'BCA',
            accountName: 'Nama Penerima',
            accountNumber: '1234567890',
            notes: 'Transfer Bank BCA',
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/invitations/${initialInvitation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brideName,
          brideNickname,
          brideParents,
          brideInstagram,
          groomName,
          groomNickname,
          groomParents,
          groomInstagram,
          quote,
          quoteSource,
          weddingDate,
          primaryLocation,
          weddingHashtag,
          closingMessage,
          coverImage,
          closingImage,
          musicUrl,
          musicTitle,
          isMusicAutoPlay,
          themeStyle,
          status,
          events,
          gifts,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        router.refresh();
      } else {
        alert('Gagal menyimpan perubahan.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  // Event handlers
  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        title: 'Resepsi Pernikahan',
        startTime: '11:00',
        endTime: '14:00 WIB',
        venueName: primaryLocation || 'Ballroom',
        address: primaryLocation || 'Alamat Acara',
        googleMapsUrl: '',
      },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  // Gift handlers
  const handleAddGift = () => {
    setGifts([
      ...gifts,
      {
        type: 'BANK',
        providerName: 'Mandiri',
        accountName: brideName || 'Nama Penerima',
        accountNumber: '',
        notes: 'Transfer Bank',
      },
    ]);
  };

  const handleRemoveGift = (index: number) => {
    setGifts(gifts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/invitations"
            className="inline-flex items-center gap-1.5 text-xs text-[#252525]/60 hover:text-[#B59E7B] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Undangan</span>
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#252525]">
              Edit Undangan: {brideNickname} & {groomNickname}
            </h2>
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status === 'PUBLISHED' ? 'Terpublikasi' : 'Draf'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/invitations/${initialInvitation.id}/guests`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
          >
            <Users className="w-3.5 h-3.5 text-[#B59E7B]" />
            <span>Kelola Daftar Tamu</span>
          </Link>
          <Link
            href={`/i/${initialInvitation.slug}/vip-ahmad-faisal-x7Kp92`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
          >
            <Eye className="w-3.5 h-3.5 text-[#B59E7B]" />
            <span>Live Preview</span>
            <ExternalLink className="w-3 h-3 text-[#252525]/40" />
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-wider hover:bg-[#3F3F3F] transition-all shadow-md disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>TERSAMPAN!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#D8C3A5]" />
                <span>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E9E1D6] overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'info'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <span>Mempelai & Cerita</span>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Jadwal Acara & Peta</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'media'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Foto Sampul & Galeri</span>
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'music'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Musik Latar</span>
        </button>
        <button
          onClick={() => setActiveTab('envelope')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'envelope'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Amplop Digital & QRIS</span>
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'publish'
              ? 'border-[#252525] text-[#252525]'
              : 'border-transparent text-[#252525]/60 hover:text-[#252525]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Tema & Publikasi</span>
        </button>
      </div>

      {/* Tab 1: Mempelai & Cerita */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mempelai Wanita */}
            <div className="p-6 rounded-2xl bg-[#F8F5F0] border border-[#E9E1D6] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#B59E7B]">Mempelai Wanita</h3>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={brideNickname}
                  onChange={(e) => setBrideNickname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Orang Tua & Keterangan
                </label>
                <input
                  type="text"
                  value={brideParents}
                  onChange={(e) => setBrideParents(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Instagram (Opsional)
                </label>
                <input
                  type="text"
                  value={brideInstagram}
                  onChange={(e) => setBrideInstagram(e.target.value)}
                  placeholder="anindyakirana"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Mempelai Pria */}
            <div className="p-6 rounded-2xl bg-[#F8F5F0] border border-[#E9E1D6] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#B59E7B]">Mempelai Pria</h3>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={groomNickname}
                  onChange={(e) => setGroomNickname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Nama Orang Tua & Keterangan
                </label>
                <input
                  type="text"
                  value={groomParents}
                  onChange={(e) => setGroomParents(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                  Instagram (Opsional)
                </label>
                <input
                  type="text"
                  value={groomInstagram}
                  onChange={(e) => setGroomInstagram(e.target.value)}
                  placeholder="andipratama"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Kutipan & Pesan */}
          <div className="space-y-4 pt-4 border-t border-[#E9E1D6]">
            <h3 className="font-serif text-lg font-bold text-[#252525]">Kutipan Cinta / Ayat Suci</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Teks Kutipan
              </label>
              <textarea
                rows={3}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Sumber Kutipan (Misal: QS. Ar-Rum: 21 atau 1 Korintus 13:4-7)
              </label>
              <input
                type="text"
                value={quoteSource}
                onChange={(e) => setQuoteSource(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Tagar Pernikahan (Hashtag)
              </label>
              <input
                type="text"
                value={weddingHashtag}
                onChange={(e) => setWeddingHashtag(e.target.value)}
                placeholder="#AndiAniForever"
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Jadwal Acara & Peta */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              Daftar Rangkaian Acara Pernikahan
            </h3>
            <button
              type="button"
              onClick={handleAddEvent}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
            >
              <Plus className="w-3.5 h-3.5 text-[#B59E7B]" />
              <span>Tambah Rangkaian Acara</span>
            </button>
          </div>

          <div className="space-y-6">
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8F5F0] border border-[#E9E1D6] space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B59E7B] uppercase">
                    Acara #{idx + 1}
                  </span>
                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(idx)}
                      className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#252525]/70 mb-1">
                      Nama Acara (Akad Nikah, Pemberkatan, Resepsi, dll)
                    </label>
                    <input
                      type="text"
                      value={evt.title}
                      onChange={(e) => {
                        const copy = [...events];
                        copy[idx].title = e.target.value;
                        setEvents(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#252525]/70 mb-1">
                      Waktu Mulai
                    </label>
                    <input
                      type="text"
                      value={evt.startTime}
                      onChange={(e) => {
                        const copy = [...events];
                        copy[idx].startTime = e.target.value;
                        setEvents(copy);
                      }}
                      placeholder="08:00"
                      className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#252525]/70 mb-1">
                      Waktu Selesai
                    </label>
                    <input
                      type="text"
                      value={evt.endTime}
                      onChange={(e) => {
                        const copy = [...events];
                        copy[idx].endTime = e.target.value;
                        setEvents(copy);
                      }}
                      placeholder="11:00 WIB / Selesai"
                      className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#252525]/70 mb-1">
                      Nama Tempat / Gedung
                    </label>
                    <input
                      type="text"
                      value={evt.venueName}
                      onChange={(e) => {
                        const copy = [...events];
                        copy[idx].venueName = e.target.value;
                        setEvents(copy);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#252525]/70 mb-1">
                      Link Google Maps Navigasi
                    </label>
                    <input
                      type="text"
                      value={evt.googleMapsUrl}
                      onChange={(e) => {
                        const copy = [...events];
                        copy[idx].googleMapsUrl = e.target.value;
                        setEvents(copy);
                      }}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#252525]/70 mb-1">
                    Alamat Lengkap Acara
                  </label>
                  <input
                    type="text"
                    value={evt.address}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[idx].address = e.target.value;
                      setEvents(copy);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Foto Sampul & Galeri */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-6 animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Foto Sampul & Media Penutup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase text-[#252525]/70">
                URL Foto Sampul Utama (Cover)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
              {coverImage && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 relative border border-[#E9E1D6]">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase text-[#252525]/70">
                URL Foto Penutup (Closing)
              </label>
              <input
                type="text"
                value={closingImage}
                onChange={(e) => setClosingImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
              {closingImage && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 relative border border-[#E9E1D6]">
                  <img src={closingImage} alt="Closing Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Musik Latar */}
      {activeTab === 'music' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-6 animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Pengaturan Musik Latar Romantis
          </h3>
          <p className="text-xs text-[#252525]/70 leading-relaxed">
            Musik akan diputar dengan anggun setelah tamu mengklik tombol &ldquo;Buka Undangan&rdquo;, sesuai dengan standar keamanan dan privasi peramban modern.
          </p>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Judul Lagu / Instrumen
              </label>
              <input
                type="text"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                placeholder="A Thousand Years - Romantic Piano"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                Tautan Audio MP3 (Direct Audio Stream)
              </label>
              <input
                type="text"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="https://.../music.mp3"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Amplop Digital & QRIS */}
      {activeTab === 'envelope' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#252525]">
                Amplop Digital & Rekening Transfer
              </h3>
              <p className="text-xs text-[#252525]/70">
                Tamu dapat memberikan kado pernikahan sukarela dengan tombol salin nomor rekening instan atau scan QRIS.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddGift}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
            >
              <Plus className="w-3.5 h-3.5 text-[#B59E7B]" />
              <span>Tambah Rekening</span>
            </button>
          </div>

          <div className="space-y-4">
            {gifts.map((g, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-[10px] uppercase text-[#252525]/60 mb-1">
                    Bank / Provider
                  </label>
                  <input
                    type="text"
                    value={g.providerName}
                    onChange={(e) => {
                      const copy = [...gifts];
                      copy[idx].providerName = e.target.value;
                      setGifts(copy);
                    }}
                    placeholder="BCA / Mandiri / QRIS"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#252525]/60 mb-1">
                    Nomor Rekening / NMID
                  </label>
                  <input
                    type="text"
                    value={g.accountNumber}
                    onChange={(e) => {
                      const copy = [...gifts];
                      copy[idx].accountNumber = e.target.value;
                      setGifts(copy);
                    }}
                    placeholder="8735091244"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#252525]/60 mb-1">
                    Atas Nama Pemilik
                  </label>
                  <input
                    type="text"
                    value={g.accountName}
                    onChange={(e) => {
                      const copy = [...gifts];
                      copy[idx].accountName = e.target.value;
                      setGifts(copy);
                    }}
                    placeholder="Anindya Kirana"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8C3A5] text-xs bg-white focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveGift(idx)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Tema & Publikasi */}
      {activeTab === 'publish' && (
        <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 sm:p-8 space-y-6 animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#252525]">
            Pengaturan Gaya Estetika & Status Terbit
          </h3>

          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-2">
                Pilih Gaya Tema Visual
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'classic', name: 'Nuaone Editorial Classic (Warm Ivory)' },
                  { id: 'heritage', name: 'Royal Heritage Nusantara (Gold & Navy)' },
                  { id: 'botanical', name: 'Botanical Romance (Sage & Blush)' },
                  { id: 'islamic', name: 'Islamic Elegance (Emerald & Gold)' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setThemeStyle(th.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      themeStyle === th.id
                        ? 'border-[#252525] bg-[#F8F5F0] ring-2 ring-[#B59E7B]'
                        : 'border-[#E9E1D6] hover:bg-[#F8F5F0]'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E1D6]">
              <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-2">
                Status Publikasi Undangan
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'PUBLISHED'}
                    onChange={() => setStatus('PUBLISHED')}
                    className="accent-[#252525]"
                  />
                  <span className="text-emerald-700">Terpublikasi (Dapat dibuka tamu via tautan unik)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'DRAFT'}
                    onChange={() => setStatus('DRAFT')}
                    className="accent-[#252525]"
                  />
                  <span className="text-amber-700">Draf (Hanya dapat dilihat pemilik)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
