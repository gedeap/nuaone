import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  ShieldAlert,
  BarChart3,
  ShoppingBag,
  Users,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E1E1E] text-[#F8F5F0] flex flex-col justify-between shrink-0 border-r border-[#333333]">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-[#333333] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#B59E7B] flex items-center justify-center text-[#252525] font-serif font-bold text-xs">
                N
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#F8F5F0]">
                ADMIN PANEL
              </span>
            </Link>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              {user.role}
            </span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 text-xs font-semibold tracking-wider">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#2A2A2A] transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-[#D8C3A5]" />
              <span>RINGKASAN & ANALITIK</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#2A2A2A] transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#D8C3A5]" />
              <span>VERIFIKASI PESANAN</span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#2A2A2A] transition-colors"
            >
              <Users className="w-4 h-4 text-[#D8C3A5]" />
              <span>PELANGGAN & AKUN</span>
            </Link>
            <Link
              href="/admin/templates"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#2A2A2A] transition-colors"
            >
              <Palette className="w-4 h-4 text-[#D8C3A5]" />
              <span>MANAJEMEN TEMPLATE</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#2A2A2A] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#D8C3A5]" />
              <span>PENGATURAN SISTEM</span>
            </Link>
          </nav>
        </div>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-[#333333] space-y-3">
          <div className="px-4 py-1">
            <p className="text-xs font-serif font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-[#E9E1D6]/60 truncate">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[10px] text-center font-semibold text-[#D8C3A5] flex items-center justify-center gap-1.5"
            >
              <span>Lihat Web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <a
              href="/api/auth/logout"
              className="py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[10px] flex items-center justify-center"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#E9E1D6] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#252525]">
              Nuaone Studio Management System
            </h1>
            <p className="text-xs text-[#252525]/60">
              Pengelolaan operasional, verifikasi pembayaran, dan pemantauan transaksi platform
            </p>
          </div>
          <div className="text-xs text-right">
            <span className="text-[10px] uppercase font-bold text-[#B59E7B] block">Domain Resmi</span>
            <span className="font-mono font-bold text-[#252525]">nuaone.my.id</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
