import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Palette, Star, Check } from 'lucide-react';

export default async function AdminTemplatesPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const templates = await prisma.template.findMany({
    include: {
      category: true,
      _count: { select: { invitations: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#252525]">
          Manajemen Template Desain Undangan
        </h2>
        <p className="text-xs text-[#252525]/60 mt-1">
          Koleksi desain resmi Nuaone Studio dan jumlah pengguna yang memilih setiap template
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl bg-white border border-[#E9E1D6] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] bg-gray-100 relative">
                <Image
                  src={tpl.previewImage}
                  alt={tpl.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#252525]/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                  {tpl.tier}
                </span>
                {tpl.isFeatured && (
                  <span className="absolute top-2 right-2 p-1 rounded-full bg-[#B59E7B] text-white">
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-[#B59E7B] uppercase block">
                  {tpl.category.name}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#252525]">
                  {tpl.name}
                </h4>
                <p className="text-xs text-[#252525]/60 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#E9E1D6] flex items-center justify-between text-xs">
              <span className="text-[#252525]/60">Dipakai oleh:</span>
              <strong className="text-[#252525]">{tpl._count.invitations} undangan</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
