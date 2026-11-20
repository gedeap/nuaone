# Nuaone Studio — Digital Wedding Invitation Platform

> **Official Domain:** `nuaone.my.id`  
> **Brand Tagline:** *"Every Story Deserves a Beautiful Beginning."*  
> **Primary Language:** Indonesian (Bahasa Indonesia)

---

## 🌟 Tentang Nuaone Studio

**Nuaone Studio** adalah platform bisnis ekosistem lengkap untuk undangan pernikahan digital berbasis website. Menghadirkan estetika editorial mewah, tipografi elegan, sistem identifikasi tautan tamu unik terenkripsi (*anti-tampering*), RSVP real-time, buku tamu digital termoderasi, dan amplop digital terpercaya.

---

## 🚀 Fitur Unggulan Platform

1. **Website Publik & Katalog Template:**
   - Halaman Utama editorial dengan live showcase, paket harga transparan, ulasan mempelai, dan FAQ.
   - Katalog template multi-gaya (*The Nuaone Editorial*, *Keraton Royal Heritage*, *Secret Garden Romance*, *Nur Al-Huda Elegance*).
   - Profil studio, formulir kontak, dan integrasi WhatsApp sales/support.

2. **Sistem Tautan Tamu Unik Kriptografis (Zero Tampering):**
   - Bukan parameter URL biasa (`?to=...`) yang rawan dipalsukan.
   - Menggunakan token acak berdaya tinggi (`/i/:slug/:token`) yang dipetakan ke database.
   - Pelacakan waktu buka pertama kali dan total kunjungan tamu.

3. **Mesin Undangan Interaktif (Invitation Renderer):**
   - Sampul amplop animasi interaktif dengan pemicu perayaan konfeti.
   - Pemutar musik latar romantis yang mematuhi kebijakan autoplay browser modern.
   - Hitung mundur (*countdown timer*) hari bahagia real-time.
   - Sinkronisasi jadwal ke Google Calendar & unduhan file `.ics` (Apple / Outlook).
   - Rute navigasi langsung Google Maps untuk setiap acara.
   - Galeri foto dengan modal penampil *lightbox* resolusi tinggi.
   - Konfirmasi kehadiran (RSVP) terikat token dan buku tamu digital langsung.
   - Amplop digital dengan tombol satu-klik salin rekening bank & unduh kode QRIS nasional.

4. **Dashboard Pelanggan (Customer Portal):**
   - Pembuatan dan editor undangan bertahap yang mudah digunakan.
   - Manajemen tamu: Tambah manual, **Import massal dari Excel/CSV**, salin link perorangan, dan tombol kirim WhatsApp otomatis.
   - **Unduh Rekap Daftar Tamu (.xlsx)** langsung dari sistem.
   - Statistik kehadiran RSVP dan moderasi pesan buku tamu.
   - Riwayat pesanan dan konfirmasi transfer pembayaran.

5. **Dashboard Administrator (Admin Panel):**
   - Otentikasi berbasis peran (Role-Based Access Control / RBAC).
   - Analitik pendapatan, pesanan, dan keaktifan undangan.
   - Alur verifikasi pembayaran transfer manual bank yang aman.
   - Pengelolaan template, pelanggan, dan konfigurasi sistem platform.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js (App Router, Server Actions, Server Components), React, Tailwind CSS
- **Desain & UI:** Typography Luxury Serif & Sans, Lucide React, Canvas Confetti
- **Backend:** Next.js Route Handlers, Runtime Zod Validation
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Keamanan:** Kriptografi Token `crypto.randomBytes`, Hashing `bcryptjs`, JWT `jose`
- **Pengolahan Data:** SheetJS (`xlsx`) untuk import & export spreadsheet

---

## ⚡ Memulai Cepat (Quick Start)

### 1. Kloning & Pasang Dependensi
```bash
git clone https://github.com/gedeap/nuaone.git
cd nuaone
npm install
```

### 2. Atur Environment Variable
```bash
cp .env.example .env
```
Sesuaikan koneksi PostgreSQL Anda pada berkas `.env`.

### 3. Migrasi & Seeder Database
```bash
npx prisma db push
npm run db:seed
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

---

## 🔑 Akun Uji Coba Bawaan (Demo Credentials)

| Peran | Email | Kata Sandi | Halaman Akses |
|---|---|---|---|
| **Super Admin** | `admin@nuaone.my.id` | `AdminPassword2026!` | `/admin` |
| **Pelanggan Demo** | `user@nuaone.my.id` | `UserPassword2026!` | `/dashboard` |

Contoh Undangan Nyata:  
`http://localhost:3000/i/andi-ani/vip-ahmad-faisal-x7Kp92`

---

## 📚 Dokumentasi Lengkap

- [Panduan Instalasi (INSTALLATION.md)](./INSTALLATION.md)
- [Panduan Pengembangan (DEVELOPMENT.md)](./DEVELOPMENT.md)
- [Panduan Deployment Produksi (DEPLOYMENT.md)](./DEPLOYMENT.md)
- [Panduan Administrator (ADMIN_GUIDE.md)](./ADMIN_GUIDE.md)
- [Panduan Calon Pengantin (USER_GUIDE.md)](./USER_GUIDE.md)
- [Dokumentasi Pengujian (TESTING.md)](./TESTING.md)
- [Kebijakan Keamanan (SECURITY.md)](./SECURITY.md)
- [Pencadangan & Pemulihan (BACKUP_RECOVERY.md)](./BACKUP_RECOVERY.md)

---

## 📄 Lisensi & Hak Cipta
© 2026 Nuaone Studio (`nuaone.my.id`). Seluruh Hak Cipta Dilindungi.
