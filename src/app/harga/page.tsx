import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default async function PricingPage() {
  const user = await getCurrentUser();
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Paket & Biaya Investasi
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
              Pilihan Paket Undangan Digital Nuaone
            </h1>
            <p className="text-sm text-[#252525]/70">
              Pilih paket yang paling sesuai dengan kebutuhan jumlah tamu dan fitur pelengkap pesta pernikahan Anda. Tidak ada biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => {
              const features: string[] = JSON.parse(pkg.features || '[]');
              const isPopular = pkg.code === 'PREMIUM';

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-[#252525] text-[#F8F5F0] shadow-2xl scale-105 border-2 border-[#D8C3A5]'
                      : 'bg-white text-[#252525] border border-[#E9E1D6] shadow-sm'
                  }`}
                >
                  <div className="space-y-6">
                    <div>
                      {isPopular && (
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#B59E7B] text-[#F8F5F0] text-[10px] font-bold tracking-widest uppercase">
                          Rekomendasi Utama
                        </span>
                      )}
                      <h3 className={`font-serif text-2xl font-bold ${isPopular ? 'text-white' : 'text-[#252525]'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-xs mt-2 ${isPopular ? 'text-[#E9E1D6]/70' : 'text-[#252525]/60'}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                      {pkg.originalPrice && (
                        <span className={`text-xs line-through ${isPopular ? 'text-[#E9E1D6]/50' : 'text-[#252525]/40'}`}>
                          Rp {pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <div className={`pt-6 border-t ${isPopular ? 'border-[#3F3F3F]' : 'border-[#E9E1D6]'}`}>
                      <ul className="space-y-3.5 text-xs sm:text-sm">
                        {features.map((ftr, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isPopular ? 'text-[#D8C3A5]' : 'text-[#B59E7B]'
                              }`}
                            />
                            <span className={isPopular ? 'text-[#E9E1D6]' : 'text-[#252525]/80'}>
                              {ftr}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={`/order?packageId=${pkg.id}`}
                      className={`w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? 'bg-[#D8C3A5] text-[#252525] hover:bg-white'
                          : 'bg-[#252525] text-[#F8F5F0] hover:bg-[#3F3F3F]'
                      }`}
                    >
                      <span>PESAN SEKARANG</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
