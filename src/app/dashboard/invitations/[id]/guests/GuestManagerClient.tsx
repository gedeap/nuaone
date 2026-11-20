'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Share2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

interface GuestManagerProps {
  invitation: {
    id: string;
    slug: string;
    brideNickname: string;
    groomNickname: string;
  };
  initialGuests: any[];
}

export function GuestManagerClient({
  invitation,
  initialGuests,
}: GuestManagerProps) {
  const router = useRouter();
  const [guests, setGuests] = useState<any[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Single Guest Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('FRIENDS');
  const [phone, setPhone] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(2);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Import State
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nuaone.my.id';

  const handleCopyLink = (guestId: string, token: string) => {
    const link = `${baseUrl}/i/${invitation.slug}/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAllLinks = () => {
    const text = guests
      .map((g) => {
        const link = g.token?.token ? `${baseUrl}/i/${invitation.slug}/${g.token.token}` : '-';
        return `${g.name} (${g.category}): ${link}`;
      })
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const getWhatsAppShareUrl = (guest: any) => {
    const link = `${baseUrl}/i/${invitation.slug}/${guest.token?.token}`;
    const text = `Kepada Yth.
*${guest.name}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri momen istimewa pernikahan kami:

*${invitation.brideNickname} & ${invitation.groomNickname}*

Silakan buka tautan undangan resmi Anda di bawah ini:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih.`;

    const phoneNum = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phoneNum.startsWith('0') ? '62' + phoneNum.slice(1) : phoneNum;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          phone,
          maxAttendees,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.guest) {
        setGuests([data.guest, ...guests]);
        setShowAddModal(false);
        setName('');
        setPhone('');
        setNotes('');
        router.refresh();
      } else {
        alert(data.error || 'Gagal menambahkan tamu.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tamu ini? Tautan tamu akan hangus.')) return;
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/guests/${guestId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGuests(guests.filter((g) => g.id !== guestId));
        router.refresh();
      }
    } catch {
      alert('Gagal menghapus tamu.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        // Normalize keys
        const formatted = data.map((row) => ({
          name: row['Nama Tamu'] || row['Nama'] || row['name'] || '',
          phone: row['Nomor WhatsApp'] || row['WhatsApp'] || row['No Telp'] || row['phone'] || '',
          category: (row['Kategori'] || row['category'] || 'FRIENDS').toUpperCase(),
          maxAttendees: Number(row['Maksimal'] || row['Jumlah'] || 2) || 2,
        })).filter((r) => r.name);

        if (formatted.length === 0) {
          alert('Tidak ditemukan data tamu yang valid dalam file Excel.');
          setImporting(false);
          return;
        }

        const res = await fetch(`/api/invitations/${invitation.id}/guests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guests: formatted }),
        });

        const resData = await res.json();
        if (res.ok) {
          setImportCount(resData.count);
          setGuests([...resData.guests, ...guests]);
          setShowImportModal(false);
          router.refresh();
        } else {
          alert(resData.error || 'Gagal import file.');
        }
      } catch (err) {
        alert('Gagal memproses file spreadsheet.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Filtered List
  const filteredGuests = guests.filter((g) => {
    const matchQuery =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phone && g.phone.includes(searchQuery));
    const matchCategory =
      selectedCategory === 'ALL' || g.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#252525]/60 hover:text-[#B59E7B] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#252525]">
            Daftar Tamu & Tautan Undangan ({guests.length})
          </h2>
          <p className="text-xs text-[#252525]/60">
            Setiap tamu memiliki token unik aman. Tautan personal ini menjamin nama tamu tidak dapat dipalsukan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold hover:bg-[#3F3F3F] transition-all shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#D8C3A5]" />
            <span>Tambah Tamu</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-[#252525] text-xs font-semibold hover:bg-[#F8F5F0] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#B59E7B]" />
            <span>Import Excel</span>
          </button>
          <a
            href={`/api/invitations/${invitation.id}/guests/export`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-[#252525] text-xs font-semibold hover:bg-[#F8F5F0] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#B59E7B]" />
            <span>Unduh Excel</span>
          </a>
          <button
            onClick={handleCopyAllLinks}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-[#252525] text-xs font-semibold hover:bg-[#F8F5F0] transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin Semua!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#B59E7B]" />
                <span>Salin Semua Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau nomor WhatsApp..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none focus:ring-1 focus:ring-[#B59E7B]"
          />
          <Search className="w-3.5 h-3.5 text-[#252525]/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'VIP', 'FAMILY', 'FRIENDS', 'COLLEAGUES', 'OTHER'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#252525] text-[#F8F5F0]'
                  : 'bg-[#F8F5F0] text-[#252525]/70 hover:bg-[#E9E1D6]'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-[#E9E1D6] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#252525]">
            <thead className="bg-[#F8F5F0] text-[#252525]/70 uppercase tracking-wider text-[10px] border-b border-[#E9E1D6]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Nama Tamu & Kategori</th>
                <th className="py-3.5 px-4 font-semibold">Tautan Aman (Token)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status Buka</th>
                <th className="py-3.5 px-4 font-semibold text-center">RSVP Kehadiran</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D6]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#252525]/50">
                    Tidak ada tamu yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const token = guest.token?.token || '';
                  const link = `${baseUrl}/i/${invitation.slug}/${token}`;
                  const isCopied = copiedId === guest.id;

                  return (
                    <tr key={guest.id} className="hover:bg-[#F8F5F0]/50 transition-colors">
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#252525]">{guest.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#E9E1D6] text-[#252525]">
                            {guest.category}
                          </span>
                          {guest.phone && (
                            <span className="text-[10px] text-[#252525]/50">
                              {guest.phone}
                            </span>
                          )}
                          <span className="text-[10px] text-[#252525]/40">
                            (Maks. {guest.maxAttendees} org)
                          </span>
                        </div>
                      </td>

                      {/* Secure Token Link */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <code className="text-[11px] bg-[#F8F5F0] px-2 py-1 rounded border border-[#E9E1D6] text-[#252525]/80 truncate font-mono">
                            /i/{invitation.slug}/{token}
                          </code>
                          <button
                            onClick={() => handleCopyLink(guest.id, token)}
                            title="Salin Tautan"
                            className="p-1.5 rounded-lg border border-[#D8C3A5] hover:bg-[#F8F5F0] text-[#252525] transition-colors shrink-0"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#B59E7B]" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Visit Status */}
                      <td className="py-3.5 px-4 text-center">
                        {guest.token?.lastOpenedAt ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Dibuka ({guest.token.totalVisits}x)</span>
                            </span>
                            <span className="text-[9px] text-[#252525]/40 mt-0.5">
                              {new Date(guest.token.lastOpenedAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#252525]/50 bg-gray-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Belum dibuka</span>
                          </span>
                        )}
                      </td>

                      {/* RSVP Status */}
                      <td className="py-3.5 px-4 text-center">
                        {guest.rsvp ? (
                          guest.rsvp.attendanceStatus === 'ATTENDING' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                              Akan Hadir ({guest.rsvp.attendeeCount} org)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                              Berhalangan Hadir
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-[#252525]/40 italic">
                            Belum Konfirmasi
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getWhatsAppShareUrl(guest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Kirim Undangan via WhatsApp"
                            className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <Link
                            href={`/i/${invitation.slug}/${token}`}
                            target="_blank"
                            title="Buka Preview Tamu Ini"
                            className="p-1.5 rounded-lg bg-[#F8F5F0] text-[#252525] hover:bg-[#E9E1D6] transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#B59E7B]" />
                          </Link>
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            title="Hapus Tamu"
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Tamu Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-[#252525]">
              Tambah Tamu Baru
            </h3>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                  Nama Tamu & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bapak Ir. H. Bambang & Keluarga"
                  className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none focus:ring-1 focus:ring-[#B59E7B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="FAMILY">Keluarga (Family)</option>
                    <option value="FRIENDS">Sahabat (Friends)</option>
                    <option value="COLLEAGUES">Rekan Kerja (Colleagues)</option>
                    <option value="OTHER">Lainnya (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                    Batas Kehadiran
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Meja VIP Depan"
                  className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#252525] text-white text-xs font-semibold hover:bg-[#3F3F3F] disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan & Buat Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Import Excel */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-[#252525]">
              Import Daftar Tamu dari Excel / CSV
            </h3>
            <p className="text-xs text-[#252525]/70 leading-relaxed">
              Unggah file spreadsheet Anda (.xlsx atau .csv). Pastikan memiliki kolom:
              <br />
              <strong className="text-[#252525]">Nama Tamu</strong>, <strong className="text-[#252525]">Nomor WhatsApp</strong>, dan <strong className="text-[#252525]">Kategori</strong>.
            </p>

            <div className="border-2 border-dashed border-[#D8C3A5] rounded-2xl p-8 text-center space-y-3 bg-[#F8F5F0]">
              <FileSpreadsheet className="w-10 h-10 text-[#B59E7B] mx-auto" />
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold hover:bg-[#3F3F3F] transition-all">
                  <span>PILIH FILE EXCEL</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[10px] text-[#252525]/50">
                Format yang didukung: .xlsx, .xls, .csv
              </p>
            </div>

            {importing && (
              <div className="text-center text-xs text-[#B59E7B] font-semibold animate-pulse">
                Sedang memproses dan menerbitkan token acak terenkripsi...
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
