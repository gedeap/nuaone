'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  HardDrive,
  Database,
  ExternalLink,
  Layers,
  Users,
  Mail,
  CalendarCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { ResourceBudgetSummary } from '@/lib/costProtection';

interface Props {
  summary: ResourceBudgetSummary;
}

export function AdminResourcesClient({ summary }: Props) {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'EMERGENCY':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#252525]">
              Pemantauan Sumber Daya & Anggaran Biaya
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(
                summary.status
              )}`}
            >
              STATUS: {summary.status} ({summary.percentageUsed}% Terpakai)
            </span>
          </div>
          <p className="text-xs text-[#252525]/60 mt-1">
            Pengawasan ketat kuota Cloudflare Free Tier ($0/bln) dan ambang batas keamanan internal
          </p>
        </div>

        <a
          href="/api/admin/analytics/export"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C3A5] bg-white text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0] transition-colors shadow-sm"
        >
          <Database className="w-3.5 h-3.5 text-[#B59E7B]" />
          <span>Ekspor Analitik DuckDB</span>
          <ExternalLink className="w-3 h-3 text-[#252525]/40" />
        </a>
      </div>

      {/* Cloudflare Free Tier Policy Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#252525] to-[#3A3A3A] text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-[#D8C3A5] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Kebijakan Biaya Nol (Zero-Cost Enforcement Active)</span>
        </div>
        <p className="text-xs text-[#E9E1D6]/80 leading-relaxed max-w-3xl">
          Nuaone Studio beroperasi secara eksklusif dalam batas Cloudflare Free Tier. Sistem secara otomatis menerapkan *adaptive throttling* untuk mencegah lonjakan tanpa pernah mengaktifkan langganan berbayar tanpa persetujuan pemilik platform.
        </p>
        <div className="flex flex-wrap gap-3 pt-2 text-[11px]">
          <a
            href="https://dash.cloudflare.com/?to=/:account/workers/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8C3A5] transition-colors"
          >
            <span>Workers Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://dash.cloudflare.com/?to=/:account/d1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8C3A5] transition-colors"
          >
            <span>D1 Database Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://dash.cloudflare.com/?to=/:account/r2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8C3A5] transition-colors"
          >
            <span>R2 Storage Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Resource Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Workers Requests */}
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#252525]/70">
            <span>Workers Requests</span>
            <Activity className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#252525]">
              {summary.workers.estimatedToday.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#252525]/50 block mt-0.5">
              dari batas 100.000 / hari
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#252525] h-2 rounded-full transition-all"
              style={{ width: `${Math.max(summary.workers.percentage, 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#252525]/60 pt-1">
            <span>Target Safety: 50.000</span>
            <span className="font-bold">{summary.workers.percentage}%</span>
          </div>
        </div>

        {/* D1 Rows Read */}
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#252525]/70">
            <span>D1 Rows Read</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#252525]">
              {summary.d1Reads.estimatedToday.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#252525]/50 block mt-0.5">
              dari batas 5.000.000 / hari
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.max(summary.d1Reads.percentage, 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#252525]/60 pt-1">
            <span>Target Safety: 2.5M</span>
            <span className="font-bold">{summary.d1Reads.percentage}%</span>
          </div>
        </div>

        {/* D1 Rows Written */}
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#252525]/70">
            <span>D1 Rows Written</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#252525]">
              {summary.d1Writes.estimatedToday.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#252525]/50 block mt-0.5">
              dari batas 100.000 / hari
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.max(summary.d1Writes.percentage, 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#252525]/60 pt-1">
            <span>Target Safety: 50.000</span>
            <span className="font-bold">{summary.d1Writes.percentage}%</span>
          </div>
        </div>

        {/* R2 Storage */}
        <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#252525]/70">
            <span>R2 Storage Media</span>
            <HardDrive className="w-4 h-4 text-[#B59E7B]" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-[#252525]">
              {summary.storageMb.estimatedUsed} MB
            </span>
            <span className="text-xs text-[#252525]/50 block mt-0.5">
              dari batas 10.000 MB (10 GB)
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#B59E7B] h-2 rounded-full transition-all"
              style={{ width: `${Math.max(summary.storageMb.percentage, 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#252525]/60 pt-1">
            <span>Target Safety: 5.000 MB</span>
            <span className="font-bold">{summary.storageMb.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Database Entity Footprint Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E9E1D6] p-6 shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#252525]">
          Statistik Entitas & Volume Data Transaksional
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <Users className="w-5 h-5 text-[#B59E7B] mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-[#252525] block">
              {summary.counts.users}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Pengguna</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <Mail className="w-5 h-5 text-[#B59E7B] mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-[#252525] block">
              {summary.counts.invitations}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Total Undangan</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-emerald-700 block">
              {summary.counts.publishedInvitations}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Terpublikasi</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <Users className="w-5 h-5 text-[#B59E7B] mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-[#252525] block">
              {summary.counts.guests}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Tamu Terdaftar</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <CalendarCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-emerald-700 block">
              {summary.counts.rsvps}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Konfirmasi RSVP</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5F0] border border-[#E9E1D6]">
            <Layers className="w-5 h-5 text-[#B59E7B] mx-auto mb-1" />
            <span className="text-xl font-serif font-bold text-[#252525] block">
              {summary.counts.guestbookMessages}
            </span>
            <span className="text-[10px] uppercase text-[#252525]/60">Pesan Ucapan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">
              Verifikasi Metrik Resmi Penyedia:
            </p>
            <p>
              *Metrik di atas dihitung berdasarkan volume query aplikasi internal. Untuk memeriksa statistik lalu lintas global dan latensi edge yang dicatat langsung oleh jaringan Cloudflare, silakan kunjungi langsung dashboard resmi melalui tautan di bagian atas panel ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
