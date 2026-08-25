# SMK Bina Karya Mandiri 2 Scholarship System

Aplikasi ini adalah sistem manajemen beasiswa berbasis **SMART (Simple Multi-Attribute Rating Technique)** untuk proses seleksi beasiswa siswa di SMK Bina Karya Mandiri 2.

## Nama Aplikasi

**SMK Bina Karya Mandiri 2 Scholarship System**  
(juga ditampilkan di antarmuka sebagai **SMK Scholarship System**)

## Fitur Utama

- Login dan otorisasi berbasis peran: `siswa`, `staf_tu`, `kepala_sekolah`
- Pendaftaran beasiswa oleh siswa
- Verifikasi berkas dan pengelolaan data siswa oleh Staf TU
- Pengelolaan kriteria penilaian
- Perhitungan dan rekomendasi hasil seleksi dengan metode SMART
- Validasi akhir oleh Kepala Sekolah

## Teknologi

- Laravel 12 (PHP 8.2+)
- Inertia.js + React + TypeScript
- Vite + Tailwind CSS
- Pest untuk pengujian

## Menjalankan Proyek (Lokal)

1. Install dependency:
   ```bash
   composer install
   npm install
   ```
2. Siapkan environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Jalankan migrasi dan seeder:
   ```bash
   php artisan migrate:fresh --seed
   php artisan db:seed --class=RealDataSeeder
   ```
4. Jalankan aplikasi:
   ```bash
   composer run dev
   ```

## Perintah Penting

- Build frontend: `npm run build`
- Lint frontend: `npm run lint`
- Format frontend: `npm run format`
- Jalankan test: `./vendor/bin/pest`
