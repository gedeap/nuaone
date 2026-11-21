# CLOUDFLARE FREE TIER LIMITS & INTERNAL RESOURCE BUDGET
**Platform:** Nuaone Studio (`nuaone.my.id`)  
**Document Code:** `DOCS-CF-FREE-2026`  
**Last Verified Date:** November 20, 2026  
**Policy Status:** STRICT ZERO-COST ENFORCEMENT (NON-NEGOTIABLE)

---

## 1. Kebijakan Tanpa Biaya (Strict Zero-Cost Policy)

Sesuai dengan ketentuan bagian 21:
- Seluruh infrastruktur Nuaone Studio beroperasi di atas **Cloudflare Free Tier**.
- **TIDAK ADA** aktivasi Cloudflare Workers Paid ($5/bln).
- **TIDAK ADA** upgrade otomatis ke layanan berbayar.
- **TIDAK ADA** ketergantungan API pihak ketiga berbayar.
- **TIDAK ADA** langganan database atau monitoring berbayar.
- Jika kuota bulanan/harian mendekati batas, sistem akan mengaktifkan mekanisme proteksi biaya adaptif (*adaptive throttling*) daripada mengorbankan biaya pemilik platform.

---

## 2. Kuota Resmi Cloudflare Free Tier (Official Quota Verification)

| Layanan | Metrik Kuota | Batas Free Tier Resmi | Periode Reset | Perilaku Saat Melebihi Kuota (Overage) | Sumber Dokumentasi Resmi |
|---|---|---|---|---|---|
| **Workers** | Total Permintaan (*Requests*) | **100.000 permintaan / hari** | Harian (00:00 UTC) | HTTP 1010 / 1027 (Hard block, tanpa tagihan) | [CF Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| **Workers** | Waktu CPU (*CPU Time*) | **10 ms / request** | Per eksekusi | Worker dihentikan (*CPU Exceeded*) | [CF Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| **Workers** | Subrequest | **50 subrequest / request** | Per eksekusi | Subrequest berikutnya ditolak | [CF Workers Limits](https://developers.cloudflare.com/workers/platform/limits/) |
| **D1 Database** | Penyimpanan (*Storage*) | **5 GB total** | Akumulatif | Penulisan baru ditolak | [CF D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| **D1 Database** | Baris Dibaca (*Rows Read*) | **5.000.000 baris / hari** | Harian (00:00 UTC) | Query SELECT ditolak (*Rate Limited*) | [CF D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| **D1 Database** | Baris Ditulis (*Rows Written*) | **100.000 baris / hari** | Harian (00:00 UTC) | Query INSERT/UPDATE ditolak | [CF D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| **R2 Storage** | Penyimpanan Media | **10 GB-bulan / bulan** | Bulanan | Upload baru ditolak (*Quota Exceeded*) | [CF R2 Pricing](https://developers.cloudflare.com/r2/pricing/) |
| **R2 Storage** | Operasi Kelas A (Tulis/Upload) | **1.000.000 operasi / bulan** | Bulanan | PUT/DELETE ditolak | [CF R2 Pricing](https://developers.cloudflare.com/r2/pricing/) |
| **R2 Storage** | Operasi Kelas B (Baca/Download)| **10.000.000 operasi / bulan**| Bulanan | GET objek ditolak | [CF R2 Pricing](https://developers.cloudflare.com/r2/pricing/) |
| **R2 Storage** | Bandwidth Egress (Transfer Data)| **GRATIS ($0.00 / Unlimited)**| Selamanya | Tidak ada biaya keluar sama sekali | [CF R2 Pricing](https://developers.cloudflare.com/r2/pricing/) |
| **Pages** | Build Proyek | **500 build / bulan** | Bulanan | Build antrean dihentikan sampai reset | [CF Pages Limits](https://developers.cloudflare.com/pages/platform/limits/) |
| **Pages / DNS** | Bandwidth Web Publik | **Unlimited (Tanpa Batas)** | Selamanya | CDN Edge caching otomatis | [CF Pages Overview](https://developers.cloudflare.com/pages/) |
| **SSL / TLS** | Sertifikat Keamanan HTTPS | **Universal SSL Gratis** | Otomatis | Diperbarui otomatis tanpa biaya | [CF SSL Docs](https://developers.cloudflare.com/ssl/) |

---

## 3. Anggaran Sumber Daya Internal (Internal Safety Resource Budgets)

Untuk memastikan platform tidak pernah menyentuh 100% kuota penyedia, Nuaone Studio menerapkan **ambang batas keamanan internal** bertingkat:

```
[0% -------------- 50%] Normal: Semua fitur beroperasi optimal
[51% ------------- 60%] Warning: Peringatan visual di dashboard admin
[61% ------------- 75%] High: Pengurangan background analytics, caching diperketat
[76% ------------- 85%] Critical: Pembatasan upload foto baru, formulir rate-limit ketat
[86% ------------- 90%] Emergency: Pembatasan darurat non-esensial, lindungi data inti
[> 90%] Hard Cap: Tolak bot/spam, pertahankan akses buka undangan & RSVP
```

### Rincian Alokasi Anggaran Harian & Bulanan:

| Komponen Sumber Daya | Kuota Resmi Cloudflare | Target Normal (<= 50%) | Peringatan (60%) | Penggunaan Tinggi (75%) | Kritis (85%) | Batas Darurat (90%) |
|---|---|---|---|---|---|---|
| **Workers Requests (Harian)** | 100.000 req | <= 50.000 req | 60.000 req | 75.000 req | 85.000 req | 90.000 req |
| **D1 Rows Read (Harian)** | 5.000.000 baris | <= 2.500.000 baris | 3.000.000 baris | 3.750.000 baris | 4.250.000 baris | 4.500.000 baris |
| **D1 Rows Written (Harian)** | 100.000 baris | <= 50.000 baris | 60.000 baris | 75.000 baris | 85.000 baris | 90.000 baris |
| **R2 Storage (Bulanan)** | 10.000 MB (10 GB) | <= 5.000 MB | 6.000 MB | 7.500 MB | 8.500 MB | 9.000 MB |
| **R2 Class A Ops (Bulanan)** | 1.000.000 ops | <= 500.000 ops | 600.000 ops | 750.000 ops | 850.000 ops | 900.000 ops |
| **R2 Class B Ops (Bulanan)** | 10.000.000 ops | <= 5.000.000 ops | 6.000.000 ops | 7.500.000 ops | 8.500.000 ops | 9.000.000 ops |

---

## 4. Mekanisme Proteksi Biaya Otomatis (Automatic Cost Protection)

Platform mengimplementasikan modul [`src/lib/costProtection.ts`](file:///home/antigravity/gedeap/nuaone/src/lib/costProtection.ts) yang melakukan *graceful degradation* bertahap:

1. **Ambang Warning (60%)**:
   - Memunculkan notifikasi indikator kuning di Portal Admin (`/admin`).
   - Merekam pemicu beban kerja ke `AuditLog`.
2. **Ambang High (75%)**:
   - Mematikan pencatatan log kunjungan user-agent mendalam (`InvitationView`).
   - Mengaktifkan *Edge Cache-Control* lebih agresif (misal: 1 jam untuk aset publik).
   - Membatasi polling background.
3. **Ambang Critical (85%)**:
   - Membatasi ukuran upload foto maksimal menjadi 1 MB per berkas.
   - Mengaktifkan rate limiter ketat: maksimal 3 kali pengiriman RSVP per IP per 10 menit.
   - Mematikan fungsi animasi audio background otomatis (tamu membuka secara manual).
4. **Ambang Emergency (90%)**:
   - Menghentikan penerimaan upload galeri baru sementara waktu.
   - Melindungi integritas data: **Sistem tidak pernah menghapus data pelanggan** yang sudah ada untuk menghemat ruang.
   - Menjamin fitur KRITIS tetap berjalan 100%: Pembukaan halaman undangan pengantin dan konfirmasi kehadiran RSVP tamu.

---

## 5. Tautan Pemantauan Resmi Cloudflare Dashboard

Administrator dapat memverifikasi penggunaan real-time dari penyedia melalui tautan resmi berikut:
- **Workers Analytics**: `https://dash.cloudflare.com/?to=/:account/workers/analytics`
- **D1 Database Metrics**: `https://dash.cloudflare.com/?to=/:account/d1`
- **R2 Storage Usage**: `https://dash.cloudflare.com/?to=/:account/r2`
- **Billing & Subscriptions**: `https://dash.cloudflare.com/?to=/:account/billing`
