import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Hubungi Kami
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
              Konsultasikan Pernikahan Impianmu
            </h1>
            <p className="text-sm text-[#252525]/70">
              Tim Nuaone Studio selalu siap mendengarkan cerita cintamu dan memberikan rekomendasi desain undangan digital yang paling tepat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Channels */}
            <div className="space-y-8">
              <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#252525]">
                  Saluran Komunikasi Resmi
                </h3>

                <div className="space-y-5 text-sm text-[#252525]/80">
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F5F0] hover:bg-[#E9E1D6] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#252525] block group-hover:text-[#B59E7B] transition-colors">
                        WhatsApp Konsultasi
                      </span>
                      <span className="text-xs text-[#252525]/60">+62 812-3456-7890 (Respon Cepat)</span>
                    </div>
                  </a>

                  <a
                    href="mailto:halo@nuaone.my.id"
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F5F0] hover:bg-[#E9E1D6] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#252525] text-[#D8C3A5] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#252525] block group-hover:text-[#B59E7B] transition-colors">
                        Email Resmi
                      </span>
                      <span className="text-xs text-[#252525]/60">halo@nuaone.my.id</span>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/nuaone.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F5F0] hover:bg-[#E9E1D6] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E1306C] text-white flex items-center justify-center shrink-0">
                      <InstagramIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-[#252525] block group-hover:text-[#B59E7B] transition-colors">
                        Instagram
                      </span>
                      <span className="text-xs text-[#252525]/60">@nuaone.studio</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F5F0]">
                    <div className="w-10 h-10 rounded-full bg-[#252525] text-[#D8C3A5] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#252525] block">Studio & Wilayah Layanan</span>
                      <span className="text-xs text-[#252525]/60">
                        Jakarta & Flores, Nusa Tenggara Timur (Melayani pasangan di seluruh Indonesia & mancanegara)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Form */}
            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#252525]">
                Kirim Pesan Langsung
              </h3>
              <form action="/api/contact" method="POST" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1.5">
                    Nama Anda / Calon Pasangan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Andi Pratama"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1.5">
                    Rencana Tanggal Pernikahan
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]/70 mb-1.5">
                    Pesan / Pertanyaan
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan konsep acara Anda atau pertanyaan seputar template..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] focus:outline-none focus:ring-2 focus:ring-[#B59E7B] text-sm bg-[#F8F5F0]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>KIRIM PESAN KE STUDIO</span>
                  <Send className="w-3.5 h-3.5 text-[#D8C3A5]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
