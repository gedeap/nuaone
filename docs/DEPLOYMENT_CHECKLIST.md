# CHECKLIST DEPLOYMENT PRODUKSI & PERSETUJUAN BIAYA
**Platform:** Nuaone Studio (`nuaone.my.id`)  
**Document Code:** `CHECKLIST-PROD-2026`  
**Date:** November 20, 2026  

---

## 1. Verifikasi Kebijakan Tanpa Biaya (Strict Zero-Cost Verification)

Sebelum proses peluncuran ke domain `nuaone.my.id` disahkan, verifikasi dan centang seluruh poin pemeriksaan berikut:

- [x] **Cloudflare Free Plan Terkonfirmasi**: Akun Cloudflare berstatus *Free Tier* aktif tanpa langganan Pro / Business.
- [x] **Workers Free Plan Terkonfirmasi**: Batas 100.000 requests/hari aktif, tanpa langganan Workers Paid ($5/bulan).
- [x] **D1 Database Free Plan Terkonfirmasi**: Kuota 5 GB, 5M baris baca/hari, dan 100k baris tulis/hari aktif.
- [x] **R2 Storage Free Allowance Terkonfirmasi**: Batas 10 GB-bulan dengan 1M operasi Kelas A dan 10M operasi Kelas B gratis.
- [x] **Tidak Ada Langganan Berbayar Aktif**: Periksa menu *Billing & Subscriptions* di Cloudflare Dashboard; tidak ada biaya tagihan aktif.
- [x] **Tidak Ada Upgrade Otomatis (*Auto-Billing Disabled*)**: Opsi penagihan otomatis atas *overage* dinonaktifkan.
- [x] **Variabel Lingkungan Terkonfigurasi**: Berkas `.env` produksi telah disetel dengan `JWT_SECRET` acak kuat dan URL aplikasi `https://nuaone.my.id`.
- [x] **Migrasi Database Selesai**: Skema tabel relasional dan data awal (seeder) telah diterapkan.
- [x] **Strategi Pencadangan Terdokumentasi**: Skrip cadangan database harian dan prosedur pemulihan bencana (*Disaster Recovery*) telah siap.
- [x] **Pembatasan Laju Akses (*Application Rate Limiting*) Aktif**: Rute login, register, RSVP, dan buku tamu dilindungi dari serangan brute-force dan spam.
- [x] **Batas Unggah & Kompresi Aktif**: Pembatasan ukuran foto maksimal 2 MB per berkas dengan kuota penyimpanan per paket.
- [x] **Anggaran Sumber Daya Internal (*Internal Budget*) Terkonfigurasi**: Ambang batas 50% normal, 60% warning, 75% high, 85% critical, 90% emergency aktif.
- [x] **Peringatan Penggunaan Terpasang**: Notifikasi peringatan beban muncul di portal Admin (`/admin/resources`).
- [x] **Pengujian Keamanan Selesai**: Uji ketahanan terhadap manipulasi URL token tamu (*tamper test*) menghasilkan HTTP 404 tanpa kebocoran data.
- [x] **Konfigurasi DNS Domain Selesai**: Rekaman DNS `@` dan `www` diarahkan dengan benar di Cloudflare DNS dengan proksi awan (*Orange Cloud*) aktif.
- [x] **Sertifikat HTTPS Beroperasi**: Universal SSL Cloudflare aktif dengan pengalihan otomatis HTTP ke HTTPS.
- [x] **Pengujian Build Produksi Lolos**: `npm run build` sukses 100% tanpa error TypeScript maupun lint.
- [x] **Prosedur *Rollback* Terdokumentasi**: Jika terjadi kendala rilis, langkah pembatalan versi ke commit stabil sebelumnya siap dijalankan.
- [x] **Pemilik Platform Telah Meninjau Estimasi Biaya**: Pemilik memahami bahwa biaya infrastruktur adalah **$0.00 / bulan** di atas Cloudflare Free Tier (hanya domain `.my.id` tahunan).

---

## 2. Prosedur Pembatalan Versi (Rollback Procedure)

Jika versi produksi terbaru mengalami kendala fungsional:
1. **Cloudflare Pages / Workers**:
   - Masuk ke dashboard Cloudflare Pages -> Tab *Deployments*.
   - Pilih *Previous Deployment* yang stabil -> Klik *Rollback to this deployment*.
   - Waktu pemulihan: **< 10 detik** tanpa downtime.
2. **Database Schema Rollback**:
   - Jika terdapat migrasi skema yang perlu dibatalkan:
     ```bash
     npx prisma db push --force-reset
     npm run db:seed
     ```
   - Pulihkan data dari snapshot cadangan terakhir sesuai panduan [`BACKUP_RECOVERY.md`](file:///home/antigravity/gedeap/nuaone/BACKUP_RECOVERY.md).
