# Kebijakan & Arsitektur Keamanan (Security Documentation)

Platform: **Nuaone Studio — Digital Wedding Invitation Platform**  
Domain Resmi: `nuaone.my.id`

---

## 1. Perlindungan Identitas Tamu (Guest Token Security)

### Masalah pada Undangan Konvensional
Banyak sistem undangan website biasa hanya menggunakan parameter query URL seperti:
`https://domain.com/invitation/andi-ani?to=Bapak+Ahmad`
Hal ini memiliki celah keamanan fatal:
1. Siapapun dapat mengganti teks `to=` menjadi nama orang lain dan mengunggah tangkapan layar palsu.
2. Tamu dapat membagikan link ke orang yang tidak diundang dengan nama baru.
3. Siapapun dapat mengisi form RSVP atas nama orang lain.

### Solusi Kriptografis Nuaone Studio
1. **High Entropy Token**: Setiap tamu menerima token unik berdaya acak 16 byte (`crypto.randomBytes(16).toString('base64url')`), menghasilkan string acak unguessable tanpa pola urut database.
2. **URL Bersih**: `nuaone.my.id/i/:slug/:token`.
3. **Validasi Sisi Server**: Identitas nama tamu diambil langsung dari query database berdasarkan kecocokan `:token` dan `:slug`.
4. **Pencegahan Manipulasi**: Jika URL diubah satu karakter saja, server mengembalikan respon HTTP 404 tanpa mengekspos data tamu.
5. **Token Revocation & Expiration**: Admin dan pengantin memiliki hak untuk mencabut (`revoke`) atau memperbarui (`regenerate`) token tamu.

---

## 2. Isolasi Data Pengguna & Pencegahan IDOR

- Setiap query operasi data di portal calon pengantin (`/dashboard/*`) diverifikasi secara ketat terhadap `userId` yang terdapat pada sesi JWT pengguna yang sedang aktif (`where: { userId: session.userId }`).
- Pengguna A tidak dapat melihat, mengubah, maupun menghapus daftar tamu, data acara, atau tagihan milik Pengguna B.
- Portal Administrator (`/admin/*`) dilindungi oleh middleware verifikasi peran tingkat server (`SUPER_ADMIN` atau `ADMIN`).

---

## 3. Keamanan Autentikasi & Sandi

- **Password Hashing**: Menggunakan algoritma `bcryptjs` dengan *salt rounds* 10 sebelum disimpan ke database. Kata sandi mentah tidak pernah disimpan atau dicatat di log.
- **Session Tokens**: Menggunakan JWT yang ditandatangani secara kriptografis menggunakan algoritma `HS256` via library `jose`.
- **Cookies**: Disimpan dalam cookie HTTP-only dengan atribut `SameSite=Lax` dan flag `Secure` aktif pada lingkungan produksi HTTPS untuk mencegah pencurian token melalui serangan XSS atau CSRF.

---

## 4. Pencegahan Serangan Web Umum

- **SQL Injection**: Seluruh interaksi database dilakukan melalui Prisma ORM dengan parameterized queries yang kebal terhadap injeksi SQL.
- **Cross-Site Scripting (XSS)**: Seluruh output dirender melalui React JSX yang secara otomatis melakukan sanitasi HTML escaping. Input teks formulir divalidasi dengan skema ketat runtime `zod`.
- **Privasi Finansial Tamu**: Platform tidak pernah meminta, mengumpulkan, atau menyimpan nomor kartu kredit/debit atau kredensial perbankan tamu undangan. Pengiriman kado dilakukan sukarela secara eksternal melalui aplikasi perbankan tamu masing-masing.
- **Log Audit Keamanan**: Seluruh aksi sensitif (login pengguna, registrasi, verifikasi pembayaran, persetujuan admin) dicatat dalam tabel `AuditLog` beserta stempel waktu dan ID entitas.
