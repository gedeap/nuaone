# EVALUASI & KOMPARASI ARSITEKTUR INFRASTRUKTUR
**Platform:** Nuaone Studio (`nuaone.my.id`)  
**Document Code:** `DOCS-INFRA-COMPARE-2026`  
**Date:** November 20, 2026  

---

## 1. Tabel Perbandingan Arsitektur Deployment

| Parameter | Opsi 1: Ekosistem Cloudflare (Serverless Edge) | Opsi 2: Single Linux VPS (Docker Compose) | Opsi 3: Arsitektur Hybrid (Cloudflare + VPS + DuckDB) |
|---|---|---|---|
| **Estimasi Biaya Bulanan** | **$0.00 / bulan (100% Free Tier)** | **$3.50 – $6.00 / bulan** | **$3.50 – $5.00 / bulan** |
| **Teknologi Aplikasi** | Cloudflare Pages / Workers (OpenNext) | Next.js Node.js Container (Docker) | Cloudflare Pages + VPS Node.js Worker |
| **Teknologi Basis Data (OLTP)**| **Cloudflare D1 (SQLite Serverless)** | **PostgreSQL 15 / SQLite (Container)** | Cloudflare D1 (OLTP) + DuckDB (OLAP) |
| **Teknologi Penyimpanan Media** | **Cloudflare R2 (10 GB Free + $0 Egress)**| Persistent Volume VPS / MinIO | Cloudflare R2 (Media) + Local VPS Volume |
| **Performa & Latensi** | Luar biasa kencang (300+ Edge Data Center di seluruh dunia, latensi < 50ms di Indonesia) | Baik (bergantung pada lokasi DC VPS: Singapura / Jakarta ~20-60ms) | Luar biasa kencang untuk frontend, proses analitik diisolasi di VPS |
| **Kompleksitas Operasional** | **Sangat Rendah (Serverless)** — Tidak perlu maintain OS, kernel patch, atau Docker daemon | Sedang — Perlu setup Docker, Nginx/Caddy, UFW firewall, fail2ban, dan cron backup | Tinggi — Perlu koordinasi dua lingkungan terpisah (Edge + VPS) |
| **Skalabilitas** | Otomatis skala horizontal tanpa downtime hingga 100.000 req/hari pada paket gratis | Skala vertikal (upgrade RAM/CPU VPS jika traffic membludak) | Frontend skala otomatis, worker backend terbatas kapasitas VPS |
| **Keterbatasan Utama** | - Batas harian 100k requests Workers gratis<br>- CPU time max 10ms/req<br>- D1 max 500MB/db | - Biaya berulang bulanan tetap ada ($4-6/bln)<br>- Beban pemeliharaan keamanan OS & sertifikat SSL manual | - Kompleksitas sinkronisasi data antar penyedia<br>- Biaya VPS tetap berjalan |

---

## 2. Evaluasi Penyedia VPS Terjangkau (Affordable VPS Benchmarks)

Jika pemilik platform di masa depan memutuskan untuk menggunakan dedicated VPS (Opsi 2):

| Penyedia VPS | Paket & Spesifikasi | Estimasi Biaya | Lokasi Data Center Terdekat | Batasan Bandwidth | Catatan Keandalan |
|---|---|---|---|---|---|
| **Hetzner Cloud** | CX22 (2 vCPU x86, 4 GB RAM, 40 GB NVMe) | **€3.79 / bln (~$4.10)** | Falkenstein, Nuremberg, Helsinki, Ashburn | 20 TB / bulan | Sangat stabil, rasio harga/performa terbaik di dunia, namun latensi dari Indonesia ~150-180ms (belum ada DC SEA). |
| **Hostinger** | KVM 1 (1 vCPU, 4 GB RAM, 50 GB NVMe) | **$4.99 / bln** | **Singapura (SG)** & Jakarta (ID) | 4 TB / bulan | Sangat cocok untuk pasar Indonesia, latensi rendah (<30ms ke Jakarta/Flores), NVMe cepat. |
| **DigitalOcean** | Basic Droplet (1 vCPU, 1 GB RAM, 25 GB SSD) | **$6.00 / bln** | **Singapura (SGP1)** | 1 TB / bulan | Reputasi tinggi, dokumentasi lengkap, namun kapasitas RAM lebih kecil (1GB) rawan OOM saat build Next.js. |

---

## 3. Evaluasi Khusus: DuckDB untuk Undangan Digital

### 3.1 Mengapa DuckDB TIDAK DIREKOMENDASIKAN sebagai Basis Data Transaksional Utama (OLTP)?
1. **File-Level Locking (Single Writer)**: DuckDB dirancang untuk pemrosesan analitis kolumnar (*column-store*). Saat sebuah proses menulis data, seluruh database dikunci secara eksklusif. Pada web aplikasi di mana banyak tamu melakukan RSVP dan ucapan serentak, hal ini akan memicu *database locked error*.
2. **Lingkungan Serverless / Ephemeral Storage**: Pada Cloudflare Workers, filesystem bersifat sementara (*stateless*). Menyimpan file `.duckdb` di memori atau ephemeral disk akan menyebabkan data hilang setiap kali isolate worker dimatikan.
3. **Risiko Kerusakan File pada Network Mount**: DuckDB secara tegas memperingatkan agar tidak membuka file database bersama melalui NFS / CIFS / network drive secara konkuren karena mekanisme penguncian OS POSIX tidak konsisten.

### 3.2 Di Mana DuckDB SANGAT UNGGUL (Direkomendasikan)?
- **Analitik Bisnis & Pelaporan Offline**: Mengolah ratusan ribu rekaman RSVP, konversi penjualan paket, dan demografi tamu secara *in-memory* dengan kecepatan 10-100x lebih cepat dibanding database baris konvensional.
- **Ekspor Parquet Terkompresi**: Mengekspor ringkasan analitik ke format Apache Parquet yang hemat ruang penyimpanan hingga 80% dibanding CSV/JSON.
- **Isolasi Analitik**: Proses analitik DuckDB dijalankan secara terpisah (misal: export batch mingguan) sehingga tidak membebani database transaksional operasional (D1 / PostgreSQL).

---

## 4. Rekomendasi Keputusan Akhir (Final Architecture Decision)

### 🏆 Pilihan Utama: **OPSI 1 — Cloudflare Free Tier Ecosystem**
- **Justifikasi**:
  1. **Biaya $0.00 / bulan**: Menjawab 100% mandat instruksi: *"Operate Nuaone Studio using Cloudflare Free Tier for as long as technically and commercially practical, without unexpected recurring infrastructure expenses."*
  2. **Kapasitas Free Tier Sangat Cukup**:
     - 100.000 requests/hari = ~3.000.000 requests/bulan. Rata-rata 1 undangan pernikahan dikunjungi 500 - 1.000 tamu, sehingga paket gratis dapat menampung **puluhan hingga ratusan pernikahan aktif per bulan** tanpa biaya.
     - 5.000.000 baris dibaca/hari pada D1 sangat melimpah untuk query berindeks.
     - 10 GB penyimpanan R2 gratis tanpa biaya transfer keluar (*$0 egress*).
  3. **Zero Maintenance**: Tidak perlu mengurus patch keamanan Linux, firewall, perpanjangan certbot, atau crash container.

### 🥈 Jalur Migrasi Masa Depan (Growth Path):
Jika di kemudian hari kuota harian Cloudflare Free Tier terlampaui karena skala bisnis telah mencapai ratusan pernikahan serentak:
1. Pilihan A: Upgrade ke Cloudflare Workers Paid ($5/bulan) setelah mendapat persetujuan tertulis pemilik platform (*Owner Approval*).
2. Pilihan B: Migrasi ke Single Linux VPS (Hostinger SG / Hetzner) menggunakan Docker Compose yang konfigurasinya telah kami sediakan secara lengkap.
