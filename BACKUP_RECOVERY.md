# Panduan Cadangan & Pemulihan (Backup & Disaster Recovery)

Platform: **Nuaone Studio — Digital Wedding Invitation Platform**  
Domain Resmi: `nuaone.my.id`

---

## 1. Strategi Pencadangan Database (PostgreSQL)

Pencadangan basis data PostgreSQL dilakukan secara otomatis setiap hari menggunakan utilitas bawaan `pg_dump`.

### 1.1 Skrip Cadangan Otomatis (`/usr/local/bin/backup_nuaone.sh`)
Buat berkas skrip cadangan:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nuaone"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="nuaone_prod"
DB_USER="nuaone_user"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# Eksekusi pg_dump dengan kompresi gzip
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" | gzip > "$BACKUP_DIR/nuaone_backup_$TIMESTAMP.sql.gz"

# Hapus cadangan yang lebih tua dari 30 hari
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully: nuaone_backup_$TIMESTAMP.sql.gz"
```

Berikan hak eksekusi:
```bash
chmod +x /usr/local/bin/backup_nuaone.sh
```

### 1.2 Penjadwalan Cron Job
Jalankan pencadangan setiap hari pukul 02:00 dini hari:
```bash
crontab -e
```
Tambahkan baris berikut:
```cron
0 2 * * * /usr/local/bin/backup_nuaone.sh >> /var/log/nuaone_backup.log 2>&1
```

---

## 2. Prosedur Pemulihan Bencana (Disaster Recovery)

Jika terjadi kerusakan server atau kegagalan data, ikuti langkah pemulihan berikut:

### Langkah 1: Siapkan Database Baru
```bash
sudo -u postgres psql
```
```sql
DROP DATABASE IF EXISTS nuaone_prod;
CREATE DATABASE nuaone_prod;
GRANT ALL PRIVILEGES ON DATABASE nuaone_prod TO nuaone_user;
\q
```

### Langkah 2: Pulihkan Data dari Berkas Cadangan Terakhir
```bash
gunzip < /var/backups/nuaone/nuaone_backup_YYYYMMDD_HHMMSS.sql.gz | psql -U nuaone_user -h localhost -d nuaone_prod
```

### Langkah 3: Verifikasi Integritas Data
Periksa jumlah tabel dan rekaman:
```bash
psql -U nuaone_user -h localhost -d nuaone_prod -c "SELECT count(*) FROM \"User\";"
psql -U nuaone_user -h localhost -d nuaone_prod -c "SELECT count(*) FROM \"Invitation\";"
psql -U nuaone_user -h localhost -d nuaone_prod -c "SELECT count(*) FROM \"Guest\";"
```

### Langkah 4: Mulai Ulang Layanan Next.js
```bash
pm2 restart nuaone-studio
```
Platform kembali beroperasi penuh tanpa kehilangan data undangan maupun respon RSVP tamu.
