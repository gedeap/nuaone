# ESTIMASI BIAYA BULANAN & ARSITEKTUR OPTIMASI BIAYA
**Platform:** Nuaone Studio (`nuaone.my.id`)  
**Document Code:** `DOCS-COST-OPTIMIZE-2026`  
**Date:** November 20, 2026  

---

## 1. Rincian Estimasi Biaya Operasional Bulanan (Monthly Cost Estimation)

Tabel ini menghitung seluruh komponen operasional nyata yang dibutuhkan untuk menjalankan platform Nuaone Studio:

| Komponen Layanan | Penyedia Layanan | Kuota Paket Gratis (Free Tier) | Estimasi Biaya Bulanan (IDR) | Estimasi Biaya Bulanan (USD) | Catatan / Kondisi Upgrade |
|---|---|---|---|---|---|
| **Domain Resmi** | PANDI / Registrar Domain `.my.id` | N/A (Biaya domain tahunan ~Rp 15.000 / tahun) | **Rp 1.250 / bln** | **~$0.08 / bln** | Biaya registrasi & perpanjangan domain resmi tahunan. |
| **Hosting Aplikasi** | Cloudflare Pages & Workers | 100.000 requests / hari, Unlimited Bandwidth | **Rp 0 / bln** | **$0.00 / bln** | Gratis selamanya di Cloudflare Free Tier. |
| **Basis Data Transaksional** | Cloudflare D1 (SQLite Edge) | 5 GB storage, 5.000.000 read/hari, 100.000 write/hari | **Rp 0 / bln** | **$0.00 / bln** | Cukup untuk ribuan tamu undangan aktif harian. |
| **Penyimpanan Media (Foto & QRIS)** | Cloudflare R2 | 10 GB-bulan, 1M write, 10M read, $0 Egress | **Rp 0 / bln** | **$0.00 / bln** | Tidak ada biaya transfer data keluar (Zero Egress Fee). |
| **Bandwidth & CDN Caching** | Cloudflare Global CDN | Unlimited transfer data di 300+ kota dunia | **Rp 0 / bln** | **$0.00 / bln** | Aset publik di-cache di edge terdekat. |
| **DNS & Sertifikat Keamanan SSL** | Cloudflare DNS & Universal SSL | Unlimited DNS query, auto-renew SSL HTTPS | **Rp 0 / bln** | **$0.00 / bln** | Sertifikat wildcard HTTPS aktif otomatis. |
| **Notifikasi / Integrasi WhatsApp** | Tautan Resmi `wa.me` Native Protocol | Unlimited pesan langsung via WhatsApp Web/App | **Rp 0 / bln** | **$0.00 / bln** | Tidak menggunakan API gateway berbayar per-pesan. |
| **Verifikasi Pembayaran** | Manual Transfer Bank & QRIS Statis Nasional | Bebas biaya transaksi pihak ketiga (*zero fee*) | **Rp 0 / bln** | **$0.00 / bln** | Dana transfer langsung 100% masuk ke rekening studio. |
| **Pemantauan & Analitik** | Cloudflare Web Analytics + Admin Resource Panel | Unlimited traffic analytics tanpa cookie pelacak | **Rp 0 / bln** | **$0.00 / bln** | Panel pemantauan sumber daya bawaan platform. |
| **Pencadangan Data (Backup)** | D1 Automated Snapshots & Script Ekspor SQL | Cloudflare D1 Time Travel (7 hari gratis) | **Rp 0 / bln** | **$0.00 / bln** | Snapshot harian otomatis tanpa biaya storage tambahan. |
| **TOTAL BIAYA OPERASIONAL** | | | **~Rp 1.250 / BULAN** | **~$0.08 / BULAN** | **100% Bebas Biaya Server Berulang!** |

---

## 2. Strategi Efisiensi Basis Data (Database Optimization)

1. **Prepared Statements & Parameterized Queries**: Seluruh query Prisma / D1 dipersiapkan terlebih dahulu untuk meminimalkan beban komputasi CPU worker.
2. **Eliminasi `SELECT *` yang Tidak Perlu**: Menggunakan klausa `select` spesifik saat merender cover undangan, memverifikasi token tamu, atau menghitung jumlah RSVP.
3. **Pemberian Indeks Kolom Kritis**:
   - `GuestToken(token)`: Pencarian token instan O(1) untuk menjamin waktu buka < 10ms.
   - `Invitation(slug)`: Pencarian slug unik berindeks.
   - `Guest(invitationId)`: Pengelompokan tamu terindeks.
   - `Rsvp(guestId)`: Relasi 1-to-1 instan.
4. **Pencegahan Polling Berulang**: Dashboard menggunakan event-driven UI atau refresh manual terjadwal, bukan polling loop tanpa henti yang menghabiskan kuota *read* D1.

---

## 3. Strategi Optimasi Penyimpanan Media (Storage Protection)

1. **Larangan Simpan Objek Biner di Database**: Foto mempelai, album galeri, dan bukti transfer **TIDAK PERNAH** disimpan sebagai BLOB di basis data transaksional. Semua disimpan di Cloudflare R2 / Object Storage.
2. **Kuota Penyimpanan Berdasarkan Paket**:
   - **Paket Basic**: Maksimal 5 foto galeri (Maks total 5 MB).
   - **Paket Premium**: Maksimal 15 foto galeri (Maks total 15 MB).
   - **Paket Exclusive**: Maksimal 30 foto galeri (Maks total 30 MB).
3. **Kompresi Gambar Sisi Klien (*Client-Side WebP Compression*)**:
   - Sebelum foto diunggah ke server/R2, skrip JavaScript di peramban otomatis mengompresi gambar ke resolusi optimal (maksimal 1600x1200 px) dengan format WebP, memangkas ukuran berkas dari 5–10 MB menjadi hanya 150–300 KB (penghematan 95% kuota R2).
4. **Validasi Tipe Berkas Ketat**: Hanya menerima `image/jpeg`, `image/png`, dan `image/webp`. Semua jenis berkas eksekutabel (`.exe`, `.sh`, `.php`, `.zip`) langsung ditolak di gerbang pertama.
5. **Pembersihan Berkas Terhapus (*Orphan File Cleanup*)**: Ketika calon pengantin menghapus foto galeri, sistem otomatis menghapus objek berkas terkait di penyimpanan R2 untuk membebaskan ruang kuota gratis.

---

## 4. Pipeline Analitik DuckDB & Format Parquet (Opsional / Offline)

Untuk kebutuhan laporan bisnis, analitik konversi paket, dan segmentasi tamu tanpa mengganggu database operasional:
- Disediakan endpoint ekspor data analitis: `/api/admin/analytics/export`.
- Mengonversi data ringkasan ke format **Apache Parquet / DuckDB-ready format**.
- Proses analitik dijalankan secara terisolasi di sisi admin (*offline / local DuckDB engine*), menjaga D1 tetap berfokus pada kecepatan transaksi tamu undangan.
