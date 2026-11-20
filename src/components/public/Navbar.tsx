'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, User, ArrowRight } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F8F5F0]/95 backdrop-blur-md shadow-sm py-4 border-b border-[#E9E1D6]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center text-[#D8C3A5] font-serif font-bold text-sm tracking-widest group-hover:bg-[#B59E7B] transition-colors">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#252525]">
              NUAONE
            </span>
            <span className="text-[10px] tracking-[0.25em] -mt-1 text-[#252525]/70 uppercase">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#252525]/80">
          <Link href="/" className="hover:text-[#B59E7B] transition-colors">
            Home
          </Link>
          <Link href="/katalog" className="hover:text-[#B59E7B] transition-colors">
            Katalog Undangan
          </Link>
          <Link href="/harga" className="hover:text-[#B59E7B] transition-colors">
            Harga Paket
          </Link>
          <Link href="/tentang-kami" className="hover:text-[#B59E7B] transition-colors">
            Tentang Kami
          </Link>
          <Link href="/faq" className="hover:text-[#B59E7B] transition-colors">
            FAQ
          </Link>
          <Link href="/kontak" className="hover:text-[#B59E7B] transition-colors">
            Kontak
          </Link>
        </div>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <Link
              href={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C3A5] text-[#252525] text-xs font-semibold hover:bg-[#E9E1D6] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#B59E7B]" />
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold tracking-wider text-[#252525] hover:text-[#B59E7B] transition-colors px-3 py-2"
            >
              MASUK
            </Link>
          )}

          <Link
            href="/katalog"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold tracking-wider hover:bg-[#3F3F3F] transition-all shadow-sm hover:shadow group"
          >
            <span>BUAT UNDANGAN</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5] group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-[#252525] hover:text-[#B59E7B] focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#F8F5F0] border-b border-[#E9E1D6] px-6 py-6 space-y-4 shadow-lg animate-fade-in">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            Home
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            Katalog Undangan
          </Link>
          <Link
            href="/harga"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            Harga Paket
          </Link>
          <Link
            href="/tentang-kami"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            Tentang Kami
          </Link>
          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            FAQ
          </Link>
          <Link
            href="/kontak"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-[#252525] hover:text-[#B59E7B]"
          >
            Kontak
          </Link>
          <div className="pt-4 border-t border-[#E9E1D6] flex flex-col gap-3">
            {user ? (
              <Link
                href={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525]"
              >
                Dashboard ({user.name})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525]"
              >
                Masuk ke Akun
              </Link>
            )}
            <Link
              href="/katalog"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold tracking-wider"
            >
              <span>PILIH DESAIN & PESAN</span>
              <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
