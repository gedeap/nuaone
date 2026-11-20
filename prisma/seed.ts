import { PrismaClient, Role, UserStatus, OrderStatus, PaymentStatus, InvitationStatus, GuestCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Nuaone Studio...');

  // 1. Clean existing data (in dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.invitationView.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.guestbookMessage.deleteMany();
  await prisma.guestToken.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.invitationGift.deleteMany();
  await prisma.invitationGallery.deleteMany();
  await prisma.invitationEvent.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.package.deleteMany();
  await prisma.template.deleteMany();
  await prisma.templateCategory.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. System Settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'site_name', value: 'Nuaone Studio', description: 'Nama brand platform' },
      { key: 'site_domain', value: 'nuaone.my.id', description: 'Domain resmi website' },
      { key: 'site_tagline', value: 'Every Story Deserves a Beautiful Beginning', description: 'Tagline brand' },
      { key: 'whatsapp_number', value: '6281234567890', description: 'Nomor WhatsApp resmi untuk konsultasi & bantuan' },
      { key: 'contact_email', value: 'halo@nuaone.my.id', description: 'Email resmi customer support' },
      { key: 'instagram_handle', value: '@nuaone.studio', description: 'Akun Instagram resmi' },
      { key: 'bank_name', value: 'Bank Central Asia (BCA)', description: 'Bank transfer pembayaran platform' },
      { key: 'bank_account_number', value: '8735091244', description: 'Nomor rekening platform' },
      { key: 'bank_account_name', value: 'NUAONE STUDIO INDONESIA', description: 'Nama pemilik rekening' },
    ],
  });

  // 3. Admin & Demo Users
  const adminSalt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', adminSalt);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nuaone.my.id',
      passwordHash: adminPasswordHash,
      name: 'Super Administrator',
      phone: '081234567890',
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const userSalt = await bcrypt.genSalt(10);
  const userPasswordHash = await bcrypt.hash('UserPassword2026!', userSalt);
  const demoCustomer = await prisma.user.create({
    data: {
      email: 'user@nuaone.my.id',
      passwordHash: userPasswordHash,
      name: 'Budi Santoso',
      phone: '081987654321',
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  console.log('✅ Users seeded: Super Admin & Demo Customer');

  // 4. Packages
  const pkgBasic = await prisma.package.create({
    data: {
      code: 'BASIC',
      name: 'Paket Basic',
      price: 149000,
      originalPrice: 249000,
      description: 'Pilihan hemat dan esensial untuk undangan pernikahan digital elegan.',
      features: JSON.stringify([
        '1 Template Pilihan Minimalis',
        'Informasi Mempelai Lengkap',
        'Detail Acara & Google Maps',
        'Hitung Mundur (Countdown)',
        'Konfirmasi Kehadiran (RSVP)',
        'Buku Tamu Digital (Guestbook)',
        'Galeri Foto (Hingga 5 Foto)',
        'Tautan Nama Tamu Unik & Aman',
        'Masa Aktif 6 Bulan',
      ]),
      maxGuests: 200,
      maxEvents: 2,
      maxPhotos: 5,
      allowsMusic: false,
      allowsDigitalEnvelope: false,
      allowsQris: false,
      allowsCustomDomain: false,
      isActive: true,
      sortOrder: 1,
    },
  });

  const pkgPremium = await prisma.package.create({
    data: {
      code: 'PREMIUM',
      name: 'Paket Premium',
      price: 299000,
      originalPrice: 449000,
      description: 'Paling favorit! Fitur terlengkap dengan musik latar, amplop digital, dan galeri lengkap.',
      features: JSON.stringify([
        'Semua Fitur Paket Basic',
        'Galeri Foto Penuh (Hingga 15 Foto)',
        'Musik Latar Romantis (Audio Player)',
        'Amplop Digital (Transfer Bank & E-Wallet)',
        'Integrasi QRIS Pembayaran Hadiah',
        'Simpan ke Google Calendar & File ICS',
        'Kutipan Romantis & Kisah Cinta (Love Story)',
        'Kelola Tamu Tak Terbatas & Import Excel',
        'Statistik & Analisis RSVP Real-time',
        'Masa Aktif 12 Bulan',
      ]),
      maxGuests: 1000,
      maxEvents: 4,
      maxPhotos: 15,
      allowsMusic: true,
      allowsDigitalEnvelope: true,
      allowsQris: true,
      allowsCustomDomain: false,
      isActive: true,
      sortOrder: 2,
    },
  });

  const pkgExclusive = await prisma.package.create({
    data: {
      code: 'EXCLUSIVE',
      name: 'Paket Exclusive',
      price: 499000,
      originalPrice: 799000,
      description: 'Layanan VIP dengan desain eksklusif, animasi mewah, dan asistensi tim desainer profesional.',
      features: JSON.stringify([
        'Semua Fitur Paket Premium',
        'Desain Eksklusif Custom Palet Warna & Font',
        'Animasi Premium & Efek Transisi Sinematik',
        'Integrasi Video Prewedding (YouTube / HD)',
        'Dukungan Custom Domain (nama.my.id)',
        'Prioritas VIP Support via WhatsApp Khusus',
        'Bantuan Penginputan Data Tamu oleh Tim Studio',
        'QR Code Check-in Tamu di Meja Resepsi',
        'Masa Aktif Selamanya (Lifetime Archive)',
      ]),
      maxGuests: 5000,
      maxEvents: 6,
      maxPhotos: 30,
      allowsMusic: true,
      allowsDigitalEnvelope: true,
      allowsQris: true,
      allowsCustomDomain: true,
      isActive: true,
      sortOrder: 3,
    },
  });

  console.log('✅ Packages seeded: Basic, Premium, Exclusive');

  // 5. Template Categories
  const catMinimalist = await prisma.templateCategory.create({
    data: {
      name: 'Minimalist Luxury',
      slug: 'minimalist',
      description: 'Gaya modern bersih dengan tipografi serif elegan dan ruang bernafas lega.',
      sortOrder: 1,
    },
  });

  const catHeritage = await prisma.templateCategory.create({
    data: {
      name: 'Traditional & Cultural',
      slug: 'traditional',
      description: 'Sentuhan ornamen adat Indonesia yang agung dipadukan estetika modern.',
      sortOrder: 2,
    },
  });

  const catFloral = await prisma.templateCategory.create({
    data: {
      name: 'Botanical Romance',
      slug: 'floral',
      description: 'Nuansa alam lembut, kelopak bunga artistik, dan palet warna romantis.',
      sortOrder: 3,
    },
  });

  const catIslamic = await prisma.templateCategory.create({
    data: {
      name: 'Islamic Elegance',
      slug: 'islamic',
      description: 'Nuansa islami berbalut kaligrafi anggun, doa sakinah mawaddah, dan palet zamrud-emas.',
      sortOrder: 4,
    },
  });

  // 6. Templates
  const tmplClassic = await prisma.template.create({
    data: {
      slug: 'nuaone-classic',
      name: 'The Nuaone Editorial',
      categoryId: catMinimalist.id,
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'Karya signature Nuaone Studio dengan sentuhan editorial majalah mewah, warna warm ivory dan aksen sampanye.',
      tier: 'PREMIUM',
      colorScheme: 'classic',
      isFeatured: true,
      sortOrder: 1,
    },
  });

  const tmplHeritage = await prisma.template.create({
    data: {
      slug: 'royal-heritage',
      name: 'Keraton Royal Heritage',
      categoryId: catHeritage.id,
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      description: 'Keanggunan budaya Nusantara dengan aksen emas berwibawa dan motif khas kerajaan tradisional.',
      tier: 'EXCLUSIVE',
      colorScheme: 'heritage',
      isFeatured: true,
      sortOrder: 2,
    },
  });

  const tmplFloral = await prisma.template.create({
    data: {
      slug: 'botanical-romance',
      name: 'Secret Garden Romance',
      categoryId: catFloral.id,
      previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      description: 'Desain romantis terinspirasi kebun botani dengan palet sage green, kelopak mawar blush, dan ornamen dedaunan.',
      tier: 'PREMIUM',
      colorScheme: 'botanical',
      isFeatured: true,
      sortOrder: 3,
    },
  });

  const tmplIslamic = await prisma.template.create({
    data: {
      slug: 'islamic-elegance',
      name: 'Nur Al-Huda Elegance',
      categoryId: catIslamic.id,
      previewImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      description: 'Kemuliaan ikatan suci dengan kaligrafi Bismillah, ornamen arabesque kontemporer, dan ayat Al-Qur’an pilihan.',
      tier: 'PREMIUM',
      colorScheme: 'islamic',
      isFeatured: true,
      sortOrder: 4,
    },
  });

  console.log('✅ Templates seeded: 4 Signature Templates');

  // 7. Demo Order & Payment
  const demoOrder = await prisma.order.create({
    data: {
      orderNumber: 'NUA-2026-00088',
      userId: demoCustomer.id,
      packageId: pkgPremium.id,
      amount: pkgPremium.price,
      status: OrderStatus.PAID,
      customerNotes: 'Ingin tema Nuaone Classic dengan sentuhan foto prewedding outdoor.',
      adminNotes: 'Pembayaran transfer BCA berhasil diverifikasi.',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: demoOrder.id,
      paymentMethod: 'BANK_TRANSFER',
      amount: pkgPremium.price,
      status: PaymentStatus.VERIFIED,
      bankSource: 'BCA',
      accountNumber: '8735091244',
      accountName: 'Budi Santoso',
      notes: 'Transfer via m-BCA ref #998124',
      verifiedAt: new Date(),
      verifiedBy: admin.email,
    },
  });

  // 8. Demo Wedding Invitation (Andi & Ani)
  const weddingDate = new Date();
  weddingDate.setDate(weddingDate.getDate() + 45); // 45 days in future

  const sampleInvitation = await prisma.invitation.create({
    data: {
      slug: 'andi-ani',
      userId: demoCustomer.id,
      templateId: tmplClassic.id,
      orderId: demoOrder.id,
      status: InvitationStatus.PUBLISHED,
      
      brideName: 'dr. Anindya Kirana, Sp.A',
      brideNickname: 'Ani',
      brideParents: 'Putri pertama dari Bpk. Ir. Hendra Gunawan & Ibu Ratna Setyawati',
      brideInstagram: 'anindyakirana',

      groomName: 'Andi Pratama, S.T., M.Sc.',
      groomNickname: 'Andi',
      groomParents: 'Putra bungsu dari Bpk. Dr. Bambang Sudiro & Ibu Endang Lestari',
      groomInstagram: 'andipratama',

      quote: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      quoteSource: 'QS. Ar-Rum: 21',
      
      story: JSON.stringify([
        {
          year: '2019',
          title: 'Pertemuan Pertama di Kampus',
          description: 'Berawal dari diskusi di perpustakaan universitas, kami menemukan banyak kesamaan impian dan cara pandang hidup.',
        },
        {
          year: '2022',
          title: 'Menjalin Komitmen',
          description: 'Setelah melalui perjalanan pendidikan dan karir bersama, kami memutuskan untuk saling mendampingi dengan komitmen teguh.',
        },
        {
          year: '2025',
          title: 'Hari Pertunangan',
          description: 'Di hadapan kedua keluarga besar, Andi meminang Ani untuk melangkah bersama menuju babak baru yang suci.',
        },
      ]),

      weddingDate: weddingDate,
      weddingTimezone: 'WIB',
      primaryLocation: 'The Glass House Grand Ballroom, Jakarta Selatan',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      closingImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      closingMessage: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi lembaran baru perjalanan cinta kami.',
      weddingHashtag: '#AndiAniForever',

      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
      musicTitle: 'A Thousand Years - Romantic Piano Symphony',
      isMusicAutoPlay: true,
      isEnvelopeActive: true,
      isGuestbookActive: true,
      isRsvpActive: true,
      requireGuestbookModeration: false,
      maxAttendeesPerGuest: 2,
      themeStyle: 'classic',
    },
  });

  // Events for Andi & Ani
  const akadDate = new Date(weddingDate);
  const resepsiDate = new Date(weddingDate);

  await prisma.invitationEvent.createMany({
    data: [
      {
        invitationId: sampleInvitation.id,
        title: 'Akad Nikah',
        eventDate: akadDate,
        startTime: '08:00',
        endTime: '10:00 WIB',
        timezone: 'WIB',
        venueName: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja No.1, Kebayoran Baru, Jakarta Selatan',
        googleMapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
        coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        sortOrder: 1,
      },
      {
        invitationId: sampleInvitation.id,
        title: 'Resepsi Pernikahan',
        eventDate: resepsiDate,
        startTime: '11:00',
        endTime: '14:00 WIB',
        timezone: 'WIB',
        venueName: 'The Glass House Grand Ballroom',
        address: 'Jl. Wijaya Timur No. 45, Senopati, Jakarta Selatan',
        googleMapsUrl: 'https://maps.google.com/?q=The+Glass+House+Jakarta',
        coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        sortOrder: 2,
      },
    ],
  });

  // Galleries for Andi & Ani
  await prisma.invitationGallery.createMany({
    data: [
      {
        invitationId: sampleInvitation.id,
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        caption: 'Momen penuh tawa di bawah rindangnya pepohonan.',
        sortOrder: 1,
        isFeatured: true,
      },
      {
        invitationId: sampleInvitation.id,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        caption: 'Menatap masa depan bersama dengan penuh ketenangan.',
        sortOrder: 2,
        isFeatured: false,
      },
      {
        invitationId: sampleInvitation.id,
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Langkah awal merajut asa dalam satu tujuan.',
        sortOrder: 3,
        isFeatured: false,
      },
      {
        invitationId: sampleInvitation.id,
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
        caption: 'Janji suci yang akan selalu kami jaga.',
        sortOrder: 4,
        isFeatured: false,
      },
    ],
  });

  // Gifts / Digital Envelope
  await prisma.invitationGift.createMany({
    data: [
      {
        invitationId: sampleInvitation.id,
        type: 'BANK',
        providerName: 'BCA',
        accountName: 'Anindya Kirana',
        accountNumber: '5220918231',
        notes: 'Transfer Bank BCA',
        sortOrder: 1,
      },
      {
        invitationId: sampleInvitation.id,
        type: 'BANK',
        providerName: 'Mandiri',
        accountName: 'Andi Pratama',
        accountNumber: '1370019283741',
        notes: 'Transfer Bank Mandiri',
        sortOrder: 2,
      },
      {
        invitationId: sampleInvitation.id,
        type: 'QRIS',
        providerName: 'QRIS Semua Pembayaran',
        accountName: 'Andi & Ani Wedding Gift',
        accountNumber: 'NMID: ID102003928172',
        qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126580014ID.GO.GOPAY.WWW01189360091800000000005204581253033605802ID5919ANDI%20ANI%20WEDDING6007JAKARTA6105121906304A1B2',
        notes: 'Scan melalui BCA Mobile, GoPay, OVO, Dana, ShopeePay, dsb.',
        sortOrder: 3,
      },
    ],
  });

  // 9. Sample Guests with Unique Cryptographically Secure Tokens
  const guestData = [
    {
      name: 'Bapak Ahmad Faisal & Keluarga',
      category: GuestCategory.VIP,
      phone: '081233445566',
      maxAttendees: 2,
      rawToken: 'vip-ahmad-faisal-x7Kp92',
    },
    {
      name: 'Sahabat Rizky Ramadhan',
      category: GuestCategory.FRIENDS,
      phone: '081299887766',
      maxAttendees: 2,
      rawToken: 'rizky-ramadhan-q4LmW9',
    },
    {
      name: 'Ibu Siti Rahmawati',
      category: GuestCategory.FAMILY,
      phone: '081344556677',
      maxAttendees: 2,
      rawToken: 'siti-rahmawati-v2Nx8K',
    },
    {
      name: 'Keluarga Besar Bpk. Hendra Gunawan',
      category: GuestCategory.FAMILY,
      phone: '081566778899',
      maxAttendees: 4,
      rawToken: 'keluarga-hendra-p8Rt5Y',
    },
    {
      name: 'Rekan Kerja Tim Engineering Tech',
      category: GuestCategory.COLLEAGUES,
      phone: '081788990011',
      maxAttendees: 2,
      rawToken: 'tim-engineering-k3Lm7Z',
    },
  ];

  for (const g of guestData) {
    const guest = await prisma.guest.create({
      data: {
        invitationId: sampleInvitation.id,
        name: g.name,
        category: g.category,
        phone: g.phone,
        maxAttendees: g.maxAttendees,
        isSent: true,
      },
    });

    await prisma.guestToken.create({
      data: {
        guestId: guest.id,
        token: g.rawToken,
        totalVisits: 3,
        lastOpenedAt: new Date(),
      },
    });

    // Sample RSVP for Rizky
    if (g.name.includes('Rizky')) {
      await prisma.rsvp.create({
        data: {
          invitationId: sampleInvitation.id,
          guestId: guest.id,
          attendanceStatus: 'ATTENDING',
          attendeeCount: 2,
          message: 'Alhamdulillah, selamat untuk Andi & Ani! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
        },
      });

      await prisma.guestbookMessage.create({
        data: {
          invitationId: sampleInvitation.id,
          guestId: guest.id,
          senderName: g.name,
          message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fi khair. Selamat melangkah bersama Andi & Ani!',
          isApproved: true,
          isHidden: false,
        },
      });
    }

    // Sample RSVP for Ahmad Faisal
    if (g.name.includes('Ahmad Faisal')) {
      await prisma.rsvp.create({
        data: {
          invitationId: sampleInvitation.id,
          guestId: guest.id,
          attendanceStatus: 'ATTENDING',
          attendeeCount: 2,
          message: 'Insya Allah kami sekeluarga akan hadir memenuhi undangan.',
        },
      });

      await prisma.guestbookMessage.create({
        data: {
          invitationId: sampleInvitation.id,
          guestId: guest.id,
          senderName: g.name,
          message: 'Selamat berbahagia untuk kedua mempelai dan keluarga besar. Semoga rukun selalu hingga kakek-nenek.',
          isApproved: true,
          isHidden: false,
        },
      });
    }
  }

  // 10. Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        coupleNames: 'Dimas & Clarissa',
        weddingDate: '12 Oktober 2025',
        rating: 5,
        reviewText: 'Desain Nuaone Studio benar-benar mewah dan beda dari undangan web pasaran. Tamu-tamu kami sangat terkesan dengan personalized link dan musik latarnya yang anggun!',
        templateName: 'The Nuaone Editorial',
        isFeatured: true,
      },
      {
        coupleNames: 'Raditya & Vania',
        weddingDate: '28 Desember 2025',
        rating: 5,
        reviewText: 'Fitur RSVP dan import Excel memudahkan kami mengontrol jumlah porsi katering dengan sangat akurat. CS WhatsApp juga responsif membantu saat kami perlu edit jadwal.',
        templateName: 'Secret Garden Romance',
        isFeatured: true,
      },
      {
        coupleNames: 'Fajar & Nabila',
        weddingDate: '15 Januari 2026',
        rating: 5,
        reviewText: 'Amplop digital dan QRIS-nya bekerja tanpa kendala. Sangat praktis bagi kerabat luar kota yang berhalangan hadir secara fisik.',
        templateName: 'Nur Al-Huda Elegance',
        isFeatured: true,
      },
    ],
  });

  // 11. FAQs
  await prisma.faq.createMany({
    data: [
      {
        question: 'Berapa lama proses pembuatan undangan digital di Nuaone Studio?',
        answer: 'Undangan dapat langsung diedit dan dipublikasikan segera setelah pembayaran terkonfirmasi. Rata-rata pasangan hanya membutuhkan waktu 15–30 menit untuk melengkapi data dan menyebarkan tautan.',
        category: 'Pemesanan',
        sortOrder: 1,
        isPublished: true,
      },
      {
        question: 'Bagaimana cara membagikan tautan undangan kepada tamu agar nama tamu muncul secara otomatis?',
        answer: 'Di dashboard Nuaone Studio, Anda cukup memasukkan daftar nama tamu (atau import file Excel/CSV). Sistem kami secara otomatis membuat tautan acak terenkripsi yang aman untuk setiap tamu. Anda cukup mengklik tombol "Salin Tautan" atau "Kirim WhatsApp".',
        category: 'Fitur Tamu',
        sortOrder: 2,
        isPublished: true,
      },
      {
        question: 'Apakah tamu bisa mengubah nama mereka sendiri di tautan undangan?',
        answer: 'Tidak bisa! Nuaone Studio menggunakan sistem token acak kriptografis (misal: nuaone.my.id/i/andi-ani/x7Kp92LmQ4) yang tersimpan aman di database. Nama tamu tidak diambil dari query URL biasa sehingga tamu tidak dapat memanipulasi identitas undangan.',
        category: 'Keamanan',
        sortOrder: 3,
        isPublished: true,
      },
      {
        question: 'Metode pembayaran apa saja yang didukung untuk pemberian kado digital (Amplop Digital)?',
        answer: 'Kami mendukung transfer rekening bank lokal (BCA, Mandiri, BNI, BRI, dsb.), e-wallet (GoPay, OVO, DANA), serta pembayaran scan QRIS nasional yang dapat diunduh langsung oleh tamu.',
        category: 'Amplop Digital',
        sortOrder: 4,
        isPublished: true,
      },
      {
        question: 'Apakah ada batasan jumlah tamu yang bisa diundang?',
        answer: 'Paket Basic mencakup hingga 200 tamu, Paket Premium hingga 1.000 tamu, dan Paket Exclusive mendukung hingga 5.000 tamu dengan asistensi VIP dari tim kami.',
        category: 'Paket & Harga',
        sortOrder: 5,
        isPublished: true,
      },
    ],
  });

  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
