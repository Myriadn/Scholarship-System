<?php

namespace Database\Seeders;

use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use App\Models\User;
use App\Services\SmartService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RealDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Memulai import 184 siswa real...');

        // ── 1. Bersihkan data siswa lama ──
        $this->bersihkanDataLama();

        // ── 2. Load semua CSV ──
        $beasiswaLookup = $this->loadBeasiswaData();
        $nilaiLookup = $this->loadNilaiData();

        $this->command->info('Data beasiswa: ' . count($beasiswaLookup) . ' entries');
        $this->command->info('Data nilai: ' . count($nilaiLookup) . ' entries');

        // ── 3. Ambil ID Kepsek untuk approved_by ──
        $kepsek = User::where('role', 'kepala_sekolah')->first();
        if (!$kepsek) {
            $this->command->error('Akun kepala sekolah tidak ditemukan! Jalankan UserSeeder dulu.');
            return;
        }

        // ── 4. Baca Daftar_184_siswa_valid.csv ──
        $daftarPath = base_path('dataset/Daftar_184_siswa_valid.csv');
        if (!file_exists($daftarPath)) {
            $this->command->error('File Daftar_184_siswa_valid.csv tidak ditemukan!');
            return;
        }

        $handle = fopen($daftarPath, 'r');
        $header = fgetcsv($handle, 0, ';'); // skip header

        $count = 0;
        $errors = [];
        $usedEmails = [];

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            if (count($row) < 3) continue;

            $namaBeasiswa = trim($row[1] ?? '');
            $namaKelulusan = trim($row[2] ?? '');
            $namaAbsen = trim($row[3] ?? '');

            if (empty($namaBeasiswa)) continue;

            // ── Lookup data dari beasiswa CSV ──
            $key = strtolower($namaBeasiswa);
            $beasiswaInfo = $beasiswaLookup[$key] ?? null;

            // ── Lookup data dari OLAH NILAI CSV ──
            $keyNilai = strtolower($namaKelulusan);
            $nilaiInfo = $nilaiLookup[$keyNilai] ?? null;

            // ── Tentukan nilai ──
            $nisn = $beasiswaInfo['nis'] ?? '0000000000';
            $nama = $beasiswaInfo['nama'] ?? $namaBeasiswa;
            $kelasLengkap = $nilaiInfo['kelas'] ?? '';
            $kelas = $this->parseKelas($kelasLengkap);
            $c1 = $nilaiInfo['na_us'] ?? 0;

            // ── Tentukan jurusan (prioritas: beasiswa CSV → parsing dari kelas) ──
            $kodeJurusan = $beasiswaInfo['jurusan'] ?? '';
            if (empty($kodeJurusan)) {
                $kodeJurusan = $this->parseJurusanDariKelas($kelasLengkap);
            }
            $jurusan = $this->mapJurusan($kodeJurusan);

            // ── Handle kemungkinan duplicate email ──
            $email = $nisn . '@smk.test';
            if (isset($usedEmails[$email])) {
                $email = $nisn . '_' . uniqid() . '@smk.test';
            }
            $usedEmails[$email] = true;

            try {
                // Buat user
                $user = User::create([
                    'name' => $nama,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role' => 'siswa',
                ]);

                // Buat siswa
                $siswa = Siswa::create([
                    'nisn' => $nisn,
                    'nama_siswa' => $nama,
                    'jurusan' => $jurusan,
                    'kelas' => $kelas,
                    'user_id' => $user->id,
                ]);

                // Buat penilaian beasiswa (langsung approved)
                PenilaianBeasiswa::create([
                    'siswa_id' => $siswa->id,
                    'c1_nilai' => $c1,
                    'c2_nilai' => 1500000,
                    'c3_nilai' => 3,
                    'c4_nilai' => 1,
                    'c5_nilai' => 0,
                    'status_approval' => 'approved',
                    'approved_by' => $kepsek->id,
                    'approved_at' => now(),
                ]);

                $count++;
            } catch (\Exception $e) {
                $errors[] = "Gagal insert {$nama}: {$e->getMessage()}";
            }
        }

        fclose($handle);

        $this->command->info("Berhasil import {$count} siswa.");

        if (count($errors) > 0) {
            $this->command->warn('Ada ' . count($errors) . ' error:');
            foreach (array_slice($errors, 0, 10) as $err) {
                $this->command->warn('  - ' . $err);
            }
        }

        // ── 5. Hitung SMART untuk semua siswa ──
        if ($count > 0) {
            $this->command->info('Menjalankan perhitungan SMART...');
            try {
                $smartService = app(SmartService::class);
                $hasil = $smartService->prosesLengkap();
                $this->command->info("SMART selesai: {$hasil->count()} siswa di-ranking.");
            } catch (\Exception $e) {
                $this->command->warn('SMART gagal: ' . $e->getMessage());
            }
        }

        $this->command->info('=== SELESAI ===');
    }

    /**
     * Map jurusan singkatan ke nama panjang
     */
    private function mapJurusan(string $kode): string
    {
        $map = [
            'TKJ' => 'Teknik Komputer & Jaringan',
            'TBSM' => 'Teknik Bisnis Sepeda Motor',
            'TSM' => 'Teknik Bisnis Sepeda Motor',
            'TKRO' => 'Teknik Kendaraan Ringan Otomotif',
            'TKR' => 'Teknik Kendaraan Ringan Otomotif',
            'TELIND' => 'Teknik Elektronika Industri',
            'PSPT' => 'Produksi dan Siaran Program Televisi',
        ];

        return $map[strtoupper($kode)] ?? $kode;
    }

    /**
     * Parse kelas dari format "XII TKJ 1" menjadi "XII"
     */
    private function parseKelas(string $kelas): string
    {
        $parts = explode(' ', trim($kelas));
        // Ambil kata pertama (X, XI, XII)
        return $parts[0] ?? $kelas;
    }

    /**
     * Parse jurusan dari format kelas "XII TKJ 1"
     */
    private function parseJurusanDariKelas(string $kelas): string
    {
        $parts = explode(' ', trim($kelas));
        if (count($parts) >= 2) {
            return strtoupper($parts[1]);
        }
        return '';
    }

    /**
     * Hapus data siswa & user siswa lama
     */
    private function bersihkanDataLama(): void
    {
        // Hapus penilaian & berkas (cascade)
        $siswaIds = Siswa::pluck('id');
        PenilaianBeasiswa::whereIn('siswa_id', $siswaIds)->delete();
        \App\Models\BerkasSiswa::whereIn('siswa_id', $siswaIds)->delete();

        // Hapus user siswa
        $userIds = Siswa::whereNotNull('user_id')->pluck('user_id');
        User::whereIn('id', $userIds)->delete();

        // Hapus siswa
        Siswa::query()->delete();

        $this->command->info('Data siswa lama berhasil dibersihkan.');
    }

    /**
     * Load data dari beasiswafreespp3tahun.csv
     * Return: [normalized_name => ['nis' => ..., 'nama' => ..., 'jurusan' => ...]]
     */
    private function loadBeasiswaData(): array
    {
        $path = base_path('dataset/beasiswafreespp3tahun.csv');
        if (!file_exists($path)) {
            $this->command->warn('File beasiswafreespp3tahun.csv tidak ditemukan.');
            return [];
        }

        $data = [];
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle, 0, ';'); // skip header

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            if (count($row) < 15) continue;

            $nis = trim($row[1] ?? '');
            $nama = trim($row[4] ?? '');
            $jurusan = trim($row[14] ?? '');

            if (empty($nama)) continue;

            $key = strtolower($nama);

            // Skip jika sudah ada (ambil first match)
            if (!isset($data[$key])) {
                $data[$key] = [
                    'nis' => $nis,
                    'nama' => $nama,
                    'jurusan' => $jurusan,
                ];
            }
        }

        fclose($handle);
        return $data;
    }

    /**
     * Load data dari OLAH NILAI NILAI KELULUSAN 2425.csv
     * Setiap siswa punya 9 baris data (SEMESTER 1-5, PORTOFOLIO, PENUGASAN, NILAI US, NA US)
     * NA US baris terakhir tiap blok siswa — kolom terakhir = rata-rata keseluruhan
     * Return: [normalized_name => ['na_us' => float, 'kelas' => string]]
     */
    private function loadNilaiData(): array
    {
        $path = base_path('dataset/OLAH NILAI NILAI KELULUSAN 2425.csv');
        if (!file_exists($path)) {
            $this->command->warn('File OLAH NILAI...csv tidak ditemukan.');
            return [];
        }

        $data = [];
        $handle = fopen($path, 'r');

        $currentNama = null;
        $currentKelas = null;
        $currentNaUs = null;

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            if (count($row) < 5) continue;

            $noInduk = trim($row[1] ?? '');
            $nama = trim($row[2] ?? '');
            $jenisNilai = trim($row[3] ?? '');
            $rataRata = trim($row[count($row) - 1] ?? '');

            // Baris awal siswa baru — skip header & empty rows
            if (!empty($noInduk) && !empty($nama) && is_numeric($noInduk)) {
                // Simpan data sebelumnya
                if ($currentNama && $currentNaUs !== null) {
                    $key = strtolower($currentNama);
                    if (!isset($data[$key])) {
                        $data[$key] = [
                            'na_us' => (float) $currentNaUs,
                            'kelas' => $currentKelas ?? '',
                        ];
                    }
                }

                $currentNama = $nama;
                $currentKelas = $rataRata; // kelas ada di kolom terakhir baris SEMESTER 1
                $currentNaUs = null;
            }

            // Baris NA US — ambil rata-rata
            if (strtoupper($jenisNilai) === 'NA US') {
                $currentNaUs = $rataRata;
            }
        }

        // Simpan data terakhir
        if ($currentNama && $currentNaUs !== null) {
            $key = strtolower($currentNama);
            if (!isset($data[$key])) {
                $data[$key] = [
                    'na_us' => (float) $currentNaUs,
                    'kelas' => $currentKelas ?? '',
                ];
            }
        }

        fclose($handle);
        return $data;
    }
}
