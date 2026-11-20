# Dokumentasi Pengujian Sistem (Testing Documentation)

Platform: **Nuaone Studio — Digital Wedding Invitation Platform**  
Domain: `nuaone.my.id`

---

## 1. Ikhtisar Strategi Pengujian

Nuaone Studio dilengkapi dengan suite pengujian otomatis (`test_platform.sh`) yang menguji seluruh alur bisnis kritis dari sisi publik, perbankan/pesanan, otorisasi berbasis peran (RBAC), integritas token tamu terenkripsi, hingga ekspor file binary Excel dan kalender ICS.

---

## 2. Cara Menjalankan Test Suite Otomatis

Pastikan server berjalan pada port 3000, kemudian jalankan:
```bash
./test_platform.sh
```

---

## 3. Rincian Kasus Uji (19 Automated Test Cases)

| No | Modul / Skenario Uji | Endpoint Target | Kondisi Lolos | Hasil |
|---|---|---|---|---|
| 1 | Halaman Beranda Publik | `GET /` | HTTP 200 & Render HTML Editorial | ✅ PASS |
| 2 | Katalog Template | `GET /katalog` | HTTP 200 & Menampilkan daftar template | ✅ PASS |
| 3 | Paket & Harga | `GET /harga` | HTTP 200 & Matriks komparasi paket | ✅ PASS |
| 4 | Profil Tentang Kami | `GET /tentang-kami` | HTTP 200 & Narasi visi studio | ✅ PASS |
| 5 | Pusat Bantuan (FAQ) | `GET /faq` | HTTP 200 & Komponen accordion FAQ | ✅ PASS |
| 6 | Kontak & Form Pesan | `GET /kontak` | HTTP 200 & Saluran resmi WhatsApp/email | ✅ PASS |
| 7 | SEO Sitemap XML | `GET /sitemap.xml` | HTTP 200 & Valid XML sitemap | ✅ PASS |
| 8 | SEO Robots TXT | `GET /robots.txt` | HTTP 200 & Blokir token privat & admin | ✅ PASS |
| 9 | Pratinjau Undangan Publik | `GET /invitation/andi-ani` | HTTP 200 & Cover pembuka umum | ✅ PASS |
| 10 | Validasi Token Tamu Kriptografis | `GET /i/andi-ani/vip-ahmad-faisal-x7Kp92` | HTTP 200 & Nama tamu teridentifikasi aman | ✅ PASS |
| 11 | Uji Ketahanan Manipulasi Token | `GET /i/andi-ani/invalid-tampered-token` | HTTP 404 Tamper ditolak tanpa kompromi | ✅ PASS |
| 12 | Sinkronisasi Kalender (ICS) | `GET /api/invitations/andi-ani/calendar` | HTTP 200 & Header text/calendar RFC 5545 | ✅ PASS |
| 13 | Autentikasi Pengguna (Login) | `POST /api/auth/login` | HTTP 200 & JWT Cookie session terbit | ✅ PASS |
| 14 | Proteksi Dashboard Mempelai | `GET /dashboard` | HTTP 200 (Dengan cookie sesi valid) | ✅ PASS |
| 15 | RSVP Terikat Token Aman | `POST /api/invitations/andi-ani/rsvp` | HTTP 200 & Status tersimpan di database | ✅ PASS |
| 16 | Autentikasi Super Admin | `POST /api/auth/login` | HTTP 200 & Hak peran SUPER_ADMIN diverifikasi | ✅ PASS |
| 17 | Portal Admin Utama | `GET /admin` | HTTP 200 & Metrik pendapatan & analitik | ✅ PASS |
| 18 | Verifikasi Pembayaran Pesanan | `GET /admin/orders` | HTTP 200 & Rincian mutasi transfer | ✅ PASS |
| 19 | Ekspor Rekap Tamu Excel (.xlsx) | `GET /api/invitations/andi-ani/guests/export` | HTTP 200 & Valid application/vnd.openxmlformats | ✅ PASS |

---

## 4. Hasil Eksekusi Test Suite Terakhir
```
=======================================================
🧪 RUNNING COMPREHENSIVE NUAONE PLATFORM TEST SUITE
=======================================================
1. Testing Public Homepage (/)... ✅ OK (200)
2. Testing Catalog Page (/katalog)... ✅ OK (200)
3. Testing Pricing Page (/harga)... ✅ OK (200)
4. Testing About Page (/tentang-kami)... ✅ OK (200)
5. Testing FAQ Page (/faq)... ✅ OK (200)
6. Testing Contact Page (/kontak)... ✅ OK (200)
7. Testing Sitemap (/sitemap.xml)... ✅ OK (200)
8. Testing Robots (/robots.txt)... ✅ OK (200)
9. Testing Public Preview Invitation (/invitation/andi-ani)... ✅ OK (200)
10. Testing Valid Cryptographic Guest Token (/i/andi-ani/vip-ahmad-faisal-x7Kp92)... ✅ OK (Guest identity verified & displayed safely)
11. Testing Tampered / Invalid Guest Token (/i/andi-ani/invalid-tampered-token)... ✅ OK (404 Tamper attempt safely rejected)
12. Testing ICS Calendar Download (/api/invitations/andi-ani/calendar)... ✅ OK (Valid RFC 5545 iCalendar stream)
13. Testing User Login API (/api/auth/login)... ✅ OK (Authenticated session established)
14. Testing Customer Dashboard (/dashboard) with Session Cookie... ✅ OK (200)
15. Testing Token-bound RSVP API (/api/invitations/andi-ani/rsvp)... ✅ OK (RSVP saved and bound to token in DB)
16. Testing Admin Login (/api/auth/login as Super Admin)... ✅ OK (Super Admin session granted)
17. Testing Admin Overview (/admin)... ✅ OK (200)
18. Testing Admin Orders Verification Page (/admin/orders)... ✅ OK (200)
19. Testing Excel Guest Export Route... ✅ OK (Real Excel .xlsx binary generated)
=======================================================
🎉 ALL 19 AUTOMATED TESTS PASSED WITH 100% SUCCESS!
=======================================================
```
