import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Music,
  CreditCard,
  Users,
  CheckCircle2,
  Calendar,
  MessageSquareHeart,
  ChevronRight,
  Star,
  ExternalLink,
} from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();

  const [templates, packages, testimonials, faqs] = await Promise.all([
    prisma.template.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    }),
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.testimonial.findMany({
      where: { isFeatured: true },
      take: 3,
    }),
    prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      take: 5,
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#F8F5F0] via-[#F4EFEA] to-[#F8F5F0]">
        <div className="absolute inset-0 bg-[radial-gradient(#D8C3A5_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E1D6]/80 border border-[#D8C3A5]/60 text-xs font-semibold tracking-widest text-[#252525] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#B59E7B]" />
              <span>Studio Undangan Pernikahan Digital Premium</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#252525] leading-[1.15]">
              Rayakan Kisah Cintamu dengan Undangan Digital yang{' '}
              <span className="italic font-normal text-[#B59E7B]">Berkesan.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#252525]/75 leading-relaxed max-w-2xl mx-auto">
              Hadirkan kesan pertama yang abadi melalui undangan pernikahan berbasis website berestetika editorial mewah, tautan nama tamu unik terenkripsi, RSVP instan, dan amplop digital modern.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/katalog"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-sm font-semibold tracking-wider hover:bg-[#3F3F3F] transition-all shadow-md group"
              >
                <span>LIHAT KATALOG DESAIN</span>
                <ArrowRight className="w-4 h-4 text-[#D8C3A5] group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Nuaone%20Studio,%20saya%20ingin%20konsultasi%20desain%20undangan%20pernikahan%20digital."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#D8C3A5] bg-[#F8F5F0] text-[#252525] text-sm font-semibold tracking-wider hover:bg-[#E9E1D6] transition-all"
              >
                <span>KONSULTASI VIA WHATSAPP</span>
              </a>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#252525]/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B59E7B]" />
                Tautan Tamu Bebas Manipulasi
              </span>
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-[#B59E7B]" />
                Audio Musik Otomatis
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#B59E7B]" />
                Amplop Digital & QRIS
              </span>
            </div>
          </div>

          {/* Hero Showcase Preview Card */}
          <div className="mt-14 relative max-w-4xl mx-auto rounded-2xl p-3 sm:p-4 bg-white/70 backdrop-blur-md shadow-2xl border border-[#D8C3A5]/40">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#252525]">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
                alt="Nuaone Studio Wedding Showcase"
                fill
                priority
                className="object-cover opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#D8C3A5]/30 backdrop-blur-md text-[11px] font-semibold tracking-widest text-[#D8C3A5] uppercase border border-[#D8C3A5]/30">
                    Live Demo Contoh Nyata
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-normal text-white">
                    dr. Anindya Kirana & Andi Pratama
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E9E1D6]/80 max-w-xl">
                    Contoh undangan terbitan asli dengan fitur lengkap pembuka amplop, pemutar musik, peta navigasi, dan buku tamu.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/i/andi-ani/vip-ahmad-faisal-x7Kp92"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D8C3A5] text-[#252525] text-xs font-bold tracking-wider hover:bg-white transition-colors"
                  >
                    <span>BUKA UNDANGAN CONTOH</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Templates */}
      <section className="py-20 sm:py-28 bg-[#F8F5F0] border-t border-[#E9E1D6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Koleksi Desain Terkurasi
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
                Pilih Tema yang Mencerminkan Kepribadianmu
              </h2>
              <p className="text-sm text-[#252525]/70 max-w-xl">
                Setiap desain dirancang oleh desainer berpengalaman dengan standar editorial majalah modern untuk menghadirkan nuansa mewah dan bermartabat.
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#252525] uppercase hover:text-[#B59E7B] group"
            >
              <span>LIHAT SEMUA TEMPLATE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl bg-white border border-[#E9E1D6] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E9E1D6]">
                  <Image
                    src={tpl.previewImage}
                    alt={tpl.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#252525]/80 backdrop-blur-sm text-[10px] font-semibold text-[#F8F5F0] uppercase tracking-wider">
                      {tpl.category.name}
                    </span>
                    {tpl.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full bg-[#B59E7B] text-[10px] font-semibold text-white uppercase tracking-wider">
                        Favorit
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#252525] group-hover:text-[#B59E7B] transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#252525]/60 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E9E1D6] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#252525]/50 block">Mulai dari</span>
                      <span className="text-sm font-bold text-[#252525]">Rp 149.000</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/i/andi-ani/vip-ahmad-faisal-x7Kp92`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#E9E1D6] transition-colors"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/order?templateId=${tpl.id}`}
                        className="px-3 py-1.5 rounded-full bg-[#252525] text-xs font-semibold text-[#F8F5F0] hover:bg-[#3F3F3F] transition-colors"
                      >
                        Pilih
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Nuaone Studio */}
      <section className="py-20 sm:py-28 bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Keunggulan Nuaone Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
              Lebih dari Sekadar Undangan Website Biasa
            </h2>
            <p className="text-sm text-[#252525]/70">
              Dibangun dengan standar rekayasa perangkat lunak modern untuk kenyamanan Anda dan keluarga besar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Tautan Tamu Aman Kriptografis
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Setiap tamu menerima token tautan acak berdaya keamanan tinggi. Nama tamu tidak bisa diganti seenaknya oleh penerima melalui URL parameter.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Import & Export Data Tamu Excel
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Punya ratusan tamu? Cukup unggah file Excel/CSV, dan ribuan tautan personalisasi akan langsung terbentuk otomatis siap dibagikan via WhatsApp.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Amplop Digital & QRIS Terpadu
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Dukungan transfer rekening bank nasional dengan tombol salin nomor rekening instan, serta kode QRIS standar Indonesia untuk kemudahan tamu.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Musik Romantis Sesuai Regulasi Browser
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Pemutar musik otomatis beroperasi anggun setelah tamu mengklik tombol pembuka undangan, dilengkapi kontrol jeda dan volume audio.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Sinkronisasi Kalender & Google Maps
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Tamu dapat menyimpan jadwal akad maupun resepsi ke Google Calendar / Apple Calendar dan membuka rute navigasi akurat langsung.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center text-[#B59E7B]">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252525]">
                Buku Tamu Digital & Moderasi Pesan
              </h3>
              <p className="text-sm text-[#252525]/70 leading-relaxed">
                Koleksi ucapan dan doa tulus dari para kerabat secara real-time, dengan hak penuh bagi calon mempelai untuk menyaring pesan yang tampil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 sm:py-28 bg-[#F8F5F0] border-t border-[#E9E1D6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Langkah Sederhana
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
              Cara Mudah Membuat Undangan di Nuaone Studio
            </h2>
            <p className="text-sm text-[#252525]/70">
              Hanya butuh 5 langkah cepat untuk menyebarkan kabar bahagiamu ke seluruh penjuru dunia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Pilih Template',
                desc: 'Temukan tema editorial yang selaras dengan konsep pesta pernikahanmu.',
              },
              {
                step: '02',
                title: 'Lengkapi Data',
                desc: 'Isi identitas mempelai, lokasi acara, galeri foto romantis, dan nomor amplop.',
              },
              {
                step: '03',
                title: 'Konfirmasi Order',
                desc: 'Selesaikan transaksi dengan mudah via transfer bank atau QRIS resmi.',
              },
              {
                step: '04',
                title: 'Import Daftar Tamu',
                desc: 'Unggah file Excel daftar kerabat untuk menghasilkan tautan unik personal.',
              },
              {
                step: '05',
                title: 'Publikasi & Bagikan',
                desc: 'Undangan siap dibagikan via WhatsApp dengan pesan pengantar ramah.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E9E1D6] text-center space-y-3 relative group hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#252525] text-[#D8C3A5] font-serif font-bold text-sm flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#252525]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#252525]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Packages */}
      <section className="py-20 sm:py-28 bg-[#F4EFEA] border-t border-[#E9E1D6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Paket Transparan & Terjangkau
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
              Investasi Terbaik untuk Momen Bersejarah
            </h2>
            <p className="text-sm text-[#252525]/70">
              Semua paket sudah termasuk hosting kencang, sertifikat keamanan SSL, dan perlindungan privasi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const features: string[] = JSON.parse(pkg.features || '[]');
              const isPopular = pkg.code === 'PREMIUM';

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'bg-[#252525] text-[#F8F5F0] shadow-2xl scale-105 z-10 border-2 border-[#D8C3A5]'
                      : 'bg-white text-[#252525] border border-[#E9E1D6] shadow-sm'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B59E7B] text-[#F8F5F0] text-[10px] font-bold tracking-widest uppercase">
                      Paling Populer & Direkomendasikan
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
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
                      <ul className="space-y-3 text-xs sm:text-sm">
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
                      <span>PILIH PAKET INI</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 sm:py-28 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Kisah Bahagia
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
              Dipercaya Ratusan Pasangan Berbahagia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-8 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex text-[#B59E7B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#252525]/80 italic leading-relaxed">
                    &ldquo;{t.reviewText}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E9E1D6] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-bold text-[#252525] block">
                      {t.coupleNames}
                    </span>
                    <span className="text-[#252525]/50">{t.weddingDate}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F4EFEA] text-[10px] text-[#B59E7B] font-semibold">
                    {t.templateName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="py-20 sm:py-28 bg-[#F4EFEA] border-t border-[#E9E1D6]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Pertanyaan yang Sering Diajukan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#252525]">
              Semua Jawaban untuk Kebutuhan Anda
            </h2>
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
      </section>

      {/* 8. WhatsApp Consultation CTA */}
      <section className="py-20 bg-[#252525] text-[#F8F5F0] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D8C3A5]">
            Mulai Cerita Indahmu Hari Ini
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Ingin Konsultasi Desain Khusus atau Ada Pertanyaan?
          </h2>
          <p className="text-sm sm:text-base text-[#E9E1D6]/70 max-w-xl mx-auto">
            Tim konsultan Nuaone Studio siap membantu Anda memilih konsep undangan digital terbaik sesuai kepribadian kedua mempelai.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Nuaone%20Studio,%20saya%20ingin%20konsultasi%20pembuatan%20undangan%20pernikahan%20digital."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-bold tracking-widest uppercase hover:bg-emerald-600 transition-colors shadow-lg"
            >
              CHAT WHATSAPP DENGAN TIM STUDIO
            </a>
            <Link
              href="/katalog"
              className="px-8 py-3.5 rounded-full border border-[#D8C3A5] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-colors"
            >
              PILIH TEMPLATE SENDIRI
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
