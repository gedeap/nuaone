import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

export function Footer() {
  return (
    <footer className="bg-[#252525] text-[#F8F5F0] pt-16 pb-12 border-t border-[#3A3A3A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3A3A3A]/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D8C3A5] flex items-center justify-center text-[#252525] font-serif font-bold text-sm">
                N
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#F8F5F0]">
                NUAONE STUDIO
              </span>
            </div>
            <p className="text-[#E9E1D6]/70 text-sm leading-relaxed max-w-sm">
              Platform undangan pernikahan digital premium dengan estetika editorial modern, tautan tamu unik terenkripsi, konfirmasi kehadiran otomatis, dan amplop digital terpercaya.
            </p>
            <p className="font-serif italic text-xs text-[#D8C3A5]">
              &ldquo;Every Story Deserves a Beautiful Beginning.&rdquo;
            </p>
          </div>

          {/* Navigasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8C3A5]">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-[#E9E1D6]/70">
              <li>
                <Link href="/" className="hover:text-[#D8C3A5] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#D8C3A5] transition-colors">
                  Katalog Template
                </Link>
              </li>
              <li>
                <Link href="/harga" className="hover:text-[#D8C3A5] transition-colors">
                  Paket & Harga
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-[#D8C3A5] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D8C3A5] transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitur Unggulan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8C3A5]">
              Fitur Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#E9E1D6]/70">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>Tautan Tamu Kriptografis</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>RSVP & Buku Tamu Digital</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>Amplop Digital & QRIS</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>Audio Musik Otomatis</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>Import Tamu via Excel</span>
              </li>
            </ul>
          </div>

          {/* Kontak & Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8C3A5]">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E9E1D6]/70">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D8C3A5] shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#D8C3A5]">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D8C3A5] shrink-0" />
                <a href="mailto:halo@nuaone.my.id" className="hover:text-[#D8C3A5]">
                  halo@nuaone.my.id
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#D8C3A5] shrink-0" />
                <a href="https://instagram.com/nuaone.studio" target="_blank" rel="noopener noreferrer" className="hover:text-[#D8C3A5]">
                  @nuaone.studio
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D8C3A5] shrink-0 mt-0.5" />
                <span>Jakarta & Flores, Nusa Tenggara Timur, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9E1D6]/50">
          <p>© {new Date().getFullYear()} Nuaone Studio (nuaone.my.id). Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#D8C3A5] fill-[#D8C3A5]" />
            <span>untuk setiap momen cinta terindah</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#D8C3A5]">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:text-[#D8C3A5]">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
