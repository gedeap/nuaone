# Panduan Penggunaan Administrator (Admin User Guide)

Platform: **Nuaone Studio Management Portal**  
URL Akses: `https://nuaone.my.id/admin`

---

## 1. Akses & Peran Administrator (RBAC)

Platform mendukung 3 tingkatan peran:
1. **SUPER_ADMIN**: Hak akses penuh termasuk pengaturan nomor rekening resmi, domain, dan manajemen seluruh data platform.
2. **ADMIN**: Mengelola pemesanan, verifikasi transfer pembayaran pelanggan, memoderasi pesan buku tamu, dan mengelola template.
3. **CUSTOMER**: Pengguna biasa yang membuat dan mengelola undangan pernikahan digital mereka.

### Kredensial Bawaan Seeder:
- **Email**: `admin@nuaone.my.id`
- **Kata Sandi**: `AdminPassword2026!`

---

## 2. Alur Verifikasi Pembayaran Pesanan (Order Management)

Untuk mencegah penipuan, sistem Nuaone Studio memberlakukan aturan verifikasi ketat:
1. Masuk ke menu **Verifikasi Pesanan** (`/admin/orders`).
2. Setiap pesanan baru akan memiliki status badge kuning: **MENUNGGU VERIFIKASI**.
3. Klik tombol **Periksa** untuk melihat rincian:
   - Bank asal pengirim
   - Nama pemilik rekening pengirim
   - Nomor rekening & catatan referensi transfer
4. Buka mutasi rekening bank resmi Nuaone Studio (BCA/Mandiri).
5. Jika dana telah masuk sesuai nominal tagihan, klik tombol **SETUJUI PEMBAYARAN**.
   - Sistem secara otomatis mengubah status pesanan menjadi `PAID`.
   - Paket undangan pelanggan langsung aktif.
   - Tindakan ini dicatat ke dalam log audit (`AuditLog`).
6. Jika mutasi tidak ditemukan atau tidak sesuai, klik **Tolak**.

---

## 3. Manajemen Pelanggan (Customer Management)
Di menu `/admin/customers`, administrator dapat:
- Melihat seluruh daftar pengantin yang mendaftar.
- Memantau berapa banyak undangan yang telah dibuat oleh masing-masing akun.
- Melihat nomor WhatsApp pelanggan untuk kemudahan bantuan layanan (Customer Support).
- Memeriksa status akun (`ACTIVE` atau `SUSPENDED`).

---

## 4. Konfigurasi Sistem Platform (Settings)
Di menu `/admin/settings`:
- Ubah nomor WhatsApp resmi untuk tombol floating dan konsultasi (format `628...`).
- Atur nama rekening, nomor rekening bank, dan nama penerima yang ditampilkan kepada pelanggan saat checkout.
- Simpan perubahan dengan satu klik.

---

## 5. Membuat Akun Administrator Baru via Terminal
Untuk mempromosikan pengguna biasa menjadi Admin atau membuat Admin baru langsung melalui database:
```bash
npx prisma studio
```
Atau melalui SQL psql:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'email_petugas@nuaone.my.id';
```
