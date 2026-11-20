import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { Heart, Sparkles, ShieldCheck, Gem } from 'lucide-react';

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Tentang Nuaone Studio
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
              Every Story Deserves a Beautiful Beginning
            </h1>
            <p className="text-base text-[#252525]/75 leading-relaxed">
              Nuaone Studio lahir dari keyakinan bahwa setiap perjalanan cinta memiliki keunikan dan keindahan yang layak dirayakan dengan sentuhan penuh rasa hormat, estetika tinggi, dan kemudahan teknologi modern.
            </p>
          </div>

          {/* Editorial Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#D8C3A5]">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Tentang Nuaone Studio"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Visi & Misi Kami
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#252525]">
                Menghubungkan Hati Melalui Karya Digital Bermartabat
              </h2>
              <p className="text-sm text-[#252525]/80 leading-relaxed">
                Kami bukan sekadar pembuat halaman web undangan. Di Nuaone Studio, kami merancang karya digital yang memperlakukan setiap tamu undangan sebagai sosok istimewa.
              </p>
              <p className="text-sm text-[#252525]/80 leading-relaxed">
                Melalui arsitektur token tamu kriptografis, kami memastikan privasi dan integritas nama tamu tetap terlindungi tanpa celah manipulasi. Dari Flores hingga ke seluruh pelosok Indonesia, kami bangga mendampingi ribuan pasangan melangkah ke jenjang suci.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white border border-[#E9E1D6]">
                  <Gem className="w-5 h-5 text-[#B59E7B] mb-2" />
                  <h4 className="font-serif font-bold text-sm text-[#252525]">Estetika Mewah</h4>
                  <p className="text-[11px] text-[#252525]/60 mt-1">Tipografi editorial & palet warna berkelas.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E9E1D6]">
                  <ShieldCheck className="w-5 h-5 text-[#B59E7B] mb-2" />
                  <h4 className="font-serif font-bold text-sm text-[#252525]">Teknologi Aman</h4>
                  <p className="text-[11px] text-[#252525]/60 mt-1">Tautan tamu terenkripsi tanpa celah spoofing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
