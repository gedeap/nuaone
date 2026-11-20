# Panduan Deployment Produksi (Production Deployment Guide)

Panduan lengkap untuk mendeploy **Nuaone Studio** ke server produksi menggunakan domain resmi `nuaone.my.id`.

---

## 1. Konfigurasi DNS Domain `nuaone.my.id`

Arahkan rekaman DNS di registrar domain Anda ke IP Public server VPS Anda:

| Tipe | Nama Host | Target / Nilai | TTL |
|---|---|---|---|
| **A** | `@` | `<IP_PUBLIC_SERVER>` | 300 |
| **CNAME** | `www` | `nuaone.my.id` | 300 |

---

## 2. Persiapan Server VPS (Ubuntu / Debian)

### 2.1 Update Paket & Instal Node.js 22 LTS
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql postgresql-contrib certbot python3-certbot-nginx
```

### 2.2 Buat Database PostgreSQL Produksi
```bash
sudo -u postgres psql
```
Di dalam psql prompt:
```sql
CREATE DATABASE nuaone_prod;
CREATE USER nuaone_user WITH ENCRYPTED PASSWORD 'StrongProductionPasswordHere!123';
GRANT ALL PRIVILEGES ON DATABASE nuaone_prod TO nuaone_user;
\q
```

---

## 3. Deployment Aplikasi Next.js

### 3.1 Kloning & Instal Dependensi
```bash
cd /var/www
sudo git clone https://github.com/gedeap/nuaone.git
sudo chown -R $USER:$USER /var/www/nuaone
cd /var/www/nuaone
npm install --omit=dev
```

### 3.2 Konfigurasi Environment Produksi (.env)
```bash
nano .env
```
Isi konfigurasi berikut:
```env
DATABASE_URL="postgresql://nuaone_user:StrongProductionPasswordHere!123@localhost:5432/nuaone_prod?schema=public"
JWT_SECRET="generate-kunci-acak-64-karakter-dengan-openssl-rand-hex-32"
NEXT_PUBLIC_APP_URL="https://nuaone.my.id"
NEXT_PUBLIC_APP_NAME="Nuaone Studio"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"

ADMIN_EMAIL="admin@nuaone.my.id"
ADMIN_PASSWORD="SuperSecretAdminPass2026!"
ADMIN_NAME="Super Administrator"
```

### 3.3 Migrasi & Build Produksi
```bash
npx prisma db push
npm run db:seed
npm run build
```

---

## 4. Konfigurasi Process Manager (PM2)

Instal PM2 untuk menjaga aplikasi tetap berjalan di latar belakang:
```bash
sudo npm install -g pm2
pm2 start npm --name "nuaone-studio" -- start
pm2 save
pm2 startup
```

---

## 5. Konfigurasi Nginx & Sertifikat SSL Gratis (HTTPS)

### 5.1 Blok Konfigurasi Nginx
Buat berkas `/etc/nginx/sites-available/nuaone`:
```nginx
server {
    server_name nuaone.my.id www.nuaone.my.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20M;
}
```

Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/nuaone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 Pasang Sertifikat SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d nuaone.my.id -d www.nuaone.my.id
```
Pilih opsi **Redirect** HTTP ke HTTPS secara otomatis.
Sertifikat SSL kini aktif dan akan diperbarui otomatis oleh certbot.

---

## 6. Verifikasi Akhir Deployment
1. Buka peramban di `https://nuaone.my.id`.
2. Pastikan ikon gembok aman (HTTPS) aktif.
3. Masuk ke `/admin` menggunakan kredensial admin produksi.
4. Lakukan pemesanan uji coba dan pastikan tautan tamu berfungsi dengan sempurna.
