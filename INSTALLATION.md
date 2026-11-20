# Panduan Instalasi Nuaone Studio (Installation Guide)

Platform: **Nuaone Studio — Digital Wedding Invitation Platform**  
Domain Resmi: `nuaone.my.id`

---

## 1. Prasyarat Sistem (Prerequisites)
- **Node.js**: Versi 20 LTS atau 22/24 LTS
- **Package Manager**: `npm` (atau `pnpm` / `yarn`)
- **Database**: PostgreSQL versi 14, 15, atau 16
- **Sistem Operasi**: Linux / macOS / Windows WSL2

---

## 2. Langkah-langkah Instalasi

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/gedeap/nuaone.git
cd nuaone
```

### Langkah 2: Instal Dependensi
```bash
npm install
```

### Langkah 3: Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Buka `.env` dan sesuaikan nilainya:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nuaone?schema=public"
JWT_SECRET="ganti-dengan-kunci-rahasia-jwt-minimal-32-karakter"
NEXT_PUBLIC_APP_URL="https://nuaone.my.id"
NEXT_PUBLIC_APP_NAME="Nuaone Studio"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"

ADMIN_EMAIL="admin@nuaone.my.id"
ADMIN_PASSWORD="AdminPassword2026!"
ADMIN_NAME="Super Administrator"
```

### Langkah 4: Sinkronisasi Database Schema (Prisma)
Pastikan PostgreSQL sedang berjalan, kemudian jalankan:
```bash
npx prisma db push
```

### Langkah 5: Jalankan Database Seeder
Untuk memuat data awal paket (Basic, Premium, Exclusive), template terkurasi, akun Super Admin, akun demo pelanggan, dan undangan pernikahan contoh (Andi & Ani):
```bash
npm run db:seed
```

### Langkah 6: Jalankan Server Pengembangan
```bash
npm run dev
```
Akses platform di peramban pada alamat `http://localhost:3000`.

---

## 3. Akun Bawaan untuk Pengujian
| Peran | Email | Kata Sandi | Halaman Akses |
|---|---|---|---|
| **Super Admin** | `admin@nuaone.my.id` | `AdminPassword2026!` | `/admin` |
| **Pelanggan Demo** | `user@nuaone.my.id` | `UserPassword2026!` | `/dashboard` |
