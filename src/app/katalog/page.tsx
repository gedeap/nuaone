import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppFloating } from '@/components/public/WhatsAppFloating';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';

interface CatalogProps {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const { category, sort, q } = await searchParams;
  const user = await getCurrentUser();

  const categories = await prisma.templateCategory.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const whereClause: any = { isActive: true };
  if (category) {
    whereClause.category = { slug: category };
  }
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  const templates = await prisma.template.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: sort === 'popular' ? { isFeatured: 'desc' } : { sortOrder: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="flex-1 pt-32 pb-24 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Katalog Undangan Pernikahan
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#252525]">
              Koleksi Desain Eksklusif Nuaone
            </h1>
            <p className="text-sm text-[#252525]/70">
              Temukan gaya yang tepat untuk pesta pernikahan impianmu. Dari gaya minimalis modern hingga keanggunan budaya tradisional Nusantara.
            </p>
          </div>

          {/* Categories Tab Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href="/katalog"
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                !category
                  ? 'bg-[#252525] text-[#F8F5F0]'
                  : 'bg-white border border-[#E9E1D6] text-[#252525] hover:bg-[#E9E1D6]'
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  category === cat.slug
                    ? 'bg-[#252525] text-[#F8F5F0]'
                    : 'bg-white border border-[#E9E1D6] text-[#252525] hover:bg-[#E9E1D6]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl bg-white border border-[#E9E1D6] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E1D6]">
                  <Image
                    src={tpl.previewImage}
                    alt={tpl.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#252525]/80 backdrop-blur-sm text-[10px] font-semibold text-[#F8F5F0] uppercase tracking-wider">
                      {tpl.category.name}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#B59E7B] text-[10px] font-semibold text-white uppercase tracking-wider">
                      {tpl.tier}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#252525] group-hover:text-[#B59E7B] transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#252525]/60 mt-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E9E1D6] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#252525]/50 block">Mulai dari</span>
                      <span className="text-base font-bold text-[#252525]">
                        {tpl.tier === 'EXCLUSIVE'
                          ? 'Rp 499.000'
                          : tpl.tier === 'PREMIUM'
                          ? 'Rp 299.000'
                          : 'Rp 149.000'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/i/andi-ani/vip-ahmad-faisal-x7Kp92`}
                        target="_blank"
                        className="px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#E9E1D6] transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B59E7B]" />
                        <span>Preview</span>
                      </Link>
                      <Link
                        href={`/order?templateId=${tpl.id}`}
                        className="px-4 py-2 rounded-full bg-[#252525] text-xs font-semibold text-[#F8F5F0] hover:bg-[#3F3F3F] transition-colors flex items-center gap-1.5"
                      >
                        <span>Pesan</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
