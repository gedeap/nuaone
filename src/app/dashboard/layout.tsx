import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  ShoppingBag,
  LogOut,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#252525] text-[#F8F5F0] flex flex-col justify-between shrink-0 border-r border-[#3A3A3A]">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-[#3A3A3A] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#D8C3A5] flex items-center justify-center text-[#252525] font-serif font-bold text-xs">
                N
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#F8F5F0]">
                NUAONE
              </span>
            </Link>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#3A3A3A] text-[#D8C3A5]">
              Customer
            </span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold tracking-wider">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#3A3A3A] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#D8C3A5]" />
              <span>OVERVIEW</span>
            </Link>
            <Link
              href="/dashboard/invitations"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#3A3A3A] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D8C3A5]" />
              <span>UNDANGAN SAYA</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F8F5F0] hover:bg-[#3A3A3A] transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#D8C3A5]" />
              <span>PESANAN & PAKET</span>
            </Link>
          </nav>
        </div>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-[#3A3A3A] space-y-3">
          <div className="px-4 py-2">
            <p className="text-xs font-serif font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-[#E9E1D6]/60 truncate">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[10px] text-center font-semibold text-[#D8C3A5] flex items-center justify-center gap-1.5"
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
              Dashboard Mempelai
            </h1>
            <p className="text-xs text-[#252525]/60">
              Kelola desain undangan, daftar tamu undangan, dan konfirmasi kehadiran
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/invitations/create"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold hover:bg-[#3F3F3F] transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#D8C3A5]" />
              <span>Buat Undangan Baru</span>
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
