'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk ke akun.');
      }

      if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@nuaone.my.id');
      setPassword('AdminPassword2026!');
    } else {
      setEmail('user@nuaone.my.id');
      setPassword('UserPassword2026!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-[#D8C3A5] font-serif font-bold text-lg">
            N
          </div>
          <span className="font-serif text-2xl font-bold tracking-wider text-[#252525]">
            NUAONE STUDIO
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#252525]">
          Selamat Datang Kembali
        </h2>
        <p className="text-xs text-[#252525]/60">
          Masuk untuk mengelola undangan pernikahan dan daftar tamu Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E9E1D6] space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                />
                <Mail className="w-4 h-4 text-[#252525]/40 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#B59E7B] hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                />
                <Lock className="w-4 h-4 text-[#252525]/40 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'MEMVERIFIKASI...' : 'MASUK KE DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
            </button>
          </form>

          {/* Quick Demo Logins for review */}
          <div className="pt-4 border-t border-[#E9E1D6] space-y-2">
            <span className="text-[10px] font-semibold text-[#252525]/50 uppercase tracking-widest block text-center">
              Akses Cepat Pengujian (Demo)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('customer')}
                className="py-1.5 px-3 rounded-lg border border-[#D8C3A5] text-[11px] font-medium text-[#252525] hover:bg-[#F8F5F0] transition-colors"
              >
                Demo Mempelai
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-1.5 px-3 rounded-lg border border-[#D8C3A5] text-[11px] font-medium text-[#252525] hover:bg-[#F8F5F0] transition-colors"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#252525]/70">
            Belum memiliki akun Nuaone?{' '}
            <Link href="/register" className="font-semibold text-[#B59E7B] hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
