'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppFloating({
  phoneNumber = '6281234567890',
  defaultMessage = 'Halo Nuaone Studio, saya ingin konsultasi mengenai pembuatan undangan pernikahan digital...',
}: WhatsAppFloatingProps) {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <div className="hidden md:flex items-center bg-[#252525] text-[#F8F5F0] text-xs px-3.5 py-1.5 rounded-l-full shadow-lg border border-r-0 border-[#D8C3A5]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <span>Konsultasi WhatsApp</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Nuaone Studio"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </aside>
  );
}
