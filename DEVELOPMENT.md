# Panduan Pengembangan (Development Guide)

Dokumentasi ini menjelaskan arsitektur kode, struktur direktori, dan panduan kontribusi untuk **Nuaone Studio** (`nuaone.my.id`).

---

## 1. Struktur Direktori Proyek

```
nuaone/
├── prisma/
│   ├── schema.prisma          # Definisi skema relasional 19 tabel
│   └── seed.ts                # Seeder data paket, template, admin, dan contoh undangan
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Portal Administrator (Role RBAC)
│   │   ├── api/               # REST API endpoints (auth, invitations, orders, guests)
│   │   ├── dashboard/         # Portal Customer / Calon Pengantin
│   │   ├── i/[slug]/[token]/  # Halaman undangan personal tamu dengan token aman
│   │   ├── invitation/[slug]/ # Pratinjau publik undangan
│   │   ├── katalog/           # Katalog template desain
│   │   ├── harga/             # Halaman paket & pricing
│   │   ├── tentang-kami/      # Profil studio
│   │   ├── kontak/            # Formulir & kanal komunikasi
│   │   ├── faq/               # Tanya jawab interaktif
│   │   ├── login/ & register/ # Autentikasi pengguna
│   │   ├── order/             # Alur checkout paket
│   │   ├── sitemap.ts         # Dynamic SEO Sitemap
│   │   └── robots.ts          # Robots.txt configuration
│   ├── components/
│   │   ├── icons/             # Custom SVG brand icons
│   │   ├── invitation/        # Master Invitation Renderer engine
│   │   └── public/            # Navbar, Footer, WhatsApp floating button
│   ├── lib/
│   │   ├── auth.ts            # Manajemen JWT session & bcrypt
│   │   ├── guestToken.ts      # Kriptografi token tamu & resolver aman
│   │   └── prisma.ts          # Singleton Prisma client instance
│   └── middleware.ts          # Proteksi rute RBAC admin & customer
├── test_platform.sh           # Test suite otomatis (19 pengujian)
└── package.json
```

---

## 2. Standar Rekayasa & Keamanan

### Sistem Identifikasi Tamu (Guest Token Security)
- Setiap tamu memiliki token acak berdaya keamanan tinggi (`crypto.randomBytes(16).toString('base64url')`).
- Format URL: `nuaone.my.id/i/:slug/:token`.
- Identitas nama tamu di-resolve langsung di server melalui pencarian token di database. Parameter `?to=...` tidak digunakan untuk mencegah tamu memanipulasi nama undangan.
- Token dapat dicabut (`revoke`) atau diperbarui (`regenerate`) kapan saja oleh admin atau calon pengantin.

### Alur Pembayaran & Validasi Transaksi
- Pelanggan memilih paket -> Order dibuat dengan nomor unik (e.g. `NUA-2026-XXXX`).
- Pelanggan melakukan transfer manual ke rekening resmi Nuaone Studio dan mengisi konfirmasi.
- Status pembayaran tetap `PENDING` sampai Admin memverifikasi bukti mutasi rekening bank secara manual di portal `/admin/orders`. Status tidak pernah otomatis berubah jadi lunas hanya karena ada input bukti transfer.

### Format Ekspor & Impor Tamu (Excel / CSV)
- Menggunakan library `xlsx`.
- Import membaca header: `Nama Tamu`, `Nomor WhatsApp`, `Kategori`, `Batas Kehadiran`.
- Export menghasilkan file `.xlsx` lengkap berisi nomor urut, nama, kategori, nomor telepon, tautan unik token, status buka, jumlah kunjungan, status RSVP, dan ucapan doa.
