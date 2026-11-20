import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { ChevronRight } from 'lucide-react';

export default async function FaqPage() {
  const user = await getCurrentUser();
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Pusat Informasi & Bantuan
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-sm text-[#252525]/70 max-w-xl mx-auto">
              Pertanyaan umum seputar pemesanan, kustomisasi data, keamanan tautan nama tamu, dan amplop digital di Nuaone Studio.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-2xl bg-white border border-[#E9E1D6] p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm"
              >
                <summary className="flex items-center justify-between text-[#252525] font-serif text-lg font-medium">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 rounded-full p-1.5 text-[#B59E7B] group-open:-rotate-180 transition-transform duration-300">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-[#252525]/70 leading-relaxed border-t border-[#E9E1D6] pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
