<?php

use App\Models\Kriteria;
use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use App\Services\SmartService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ──────────────────────────────────────────────
// DATA SETUP
// ──────────────────────────────────────────────

beforeEach(function () {
    // Buat 5 kriteria sesuai PRD
    Kriteria::create(['kode_kriteria' => 'C1', 'nama_kriteria' => 'Nilai Akademik', 'bobot_awal' => 35, 'bobot_normalisasi' => 0.35, 'sifat' => 'benefit']);
    Kriteria::create(['kode_kriteria' => 'C2', 'nama_kriteria' => 'Penghasilan Orang Tua', 'bobot_awal' => 25, 'bobot_normalisasi' => 0.25, 'sifat' => 'cost']);
    Kriteria::create(['kode_kriteria' => 'C3', 'nama_kriteria' => 'Jumlah Tanggungan', 'bobot_awal' => 15, 'bobot_normalisasi' => 0.15, 'sifat' => 'benefit']);
    Kriteria::create(['kode_kriteria' => 'C4', 'nama_kriteria' => 'Prestasi', 'bobot_awal' => 15, 'bobot_normalisasi' => 0.15, 'sifat' => 'benefit']);
    Kriteria::create(['kode_kriteria' => 'C5', 'nama_kriteria' => 'Absensi', 'bobot_awal' => 10, 'bobot_normalisasi' => 0.10, 'sifat' => 'cost']);

    // Buat 5 siswa dengan nilai yang sudah ditentukan
    $siswa = [
        ['nama_siswa' => 'Ahmad Sulaiman', 'c1' => 88, 'c2' => 30, 'c3' => 70, 'c4' => 80, 'c5' => 10],
        ['nama_siswa' => 'Siti Aminah',    'c1' => 92, 'c2' => 20, 'c3' => 60, 'c4' => 90, 'c5' => 5],
        ['nama_siswa' => 'Budi Dermawan',  'c1' => 75, 'c2' => 40, 'c3' => 80, 'c4' => 60, 'c5' => 15],
        ['nama_siswa' => 'Citra Lestari',  'c1' => 85, 'c2' => 35, 'c3' => 50, 'c4' => 70, 'c5' => 8],
        ['nama_siswa' => 'Dedi Kurniawan', 'c1' => 78, 'c2' => 25, 'c3' => 90, 'c4' => 50, 'c5' => 20],
    ];

    foreach ($siswa as $s) {
        $siswaModel = Siswa::create([
            'nisn' => fake()->unique()->numerify('##########'),
            'nama_siswa' => $s['nama_siswa'],
            'jurusan' => 'XII RPL',
            'kelas' => 'XII',
        ]);

        PenilaianBeasiswa::create([
            'siswa_id' => $siswaModel->id,
            'c1_nilai' => $s['c1'],
            'c2_nilai' => $s['c2'],
            'c3_nilai' => $s['c3'],
            'c4_nilai' => $s['c4'],
            'c5_nilai' => $s['c5'],
        ]);
    }
});

// ──────────────────────────────────────────────
// TEST 1: Normalisasi Bobot
// ──────────────────────────────────────────────

test('normalisasi bobot menghasilkan total 1.0', function () {
    $service = new SmartService();
    $kriteria = Kriteria::all();
    $result = $service->normalisasiBobot($kriteria);

    $totalNormalisasi = $result->sum('bobot_normalisasi');
    expect($totalNormalisasi)->toBe(1.0);

    // Cek masing-masing nilai
    expect($result->where('kode_kriteria', 'C1')->first()->bobot_normalisasi)->toBe(0.35);
    expect($result->where('kode_kriteria', 'C2')->first()->bobot_normalisasi)->toBe(0.25);
    expect($result->where('kode_kriteria', 'C3')->first()->bobot_normalisasi)->toBe(0.15);
    expect($result->where('kode_kriteria', 'C4')->first()->bobot_normalisasi)->toBe(0.15);
    expect($result->where('kode_kriteria', 'C5')->first()->bobot_normalisasi)->toBe(0.10);
});

// ──────────────────────────────────────────────
// TEST 2: Nilai Minimum & Maksimum (untuk utilitas)
// ──────────────────────────────────────────────

test('nilai ekstrem C1-C5 dihitung dengan benar', function () {
    $penilaians = PenilaianBeasiswa::all();

    expect($penilaians->min('c1_nilai'))->toBe(75.0);  // Budi
    expect($penilaians->max('c1_nilai'))->toBe(92.0);  // Siti
    expect($penilaians->min('c2_nilai'))->toBe(20.0);  // Siti
    expect($penilaians->max('c2_nilai'))->toBe(40.0);  // Budi
    expect($penilaians->min('c5_nilai'))->toBe(5.0);   // Siti
    expect($penilaians->max('c5_nilai'))->toBe(20.0);  // Dedi
});

// ──────────────────────────────────────────────
// TEST 3: Hitung Utilitas (BENEFIT)
// ──────────────────────────────────────────────

test('utilitas kriteria benefit C1 dihitung dengan rumus (Xij-Xmin)/(Xmax-Xmin)', function () {
    $service = new SmartService();
    $kriteria = Kriteria::where('kode_kriteria', 'C1')->get();
    $penilaians = PenilaianBeasiswa::all();
    $result = $service->hitungUtilitas($penilaians, $kriteria);

    // C1: min=75 (Budi), max=92 (Siti)
    // Ahmad (88): (88-75)/(92-75) = 13/17 = 0.7647
    $ahmad = $result->where('c1_nilai', 88)->first();
    expect($ahmad->u_c1)->toBe(0.7647);

    // Siti (92): (92-75)/(92-75) = 1.0
    $siti = $result->where('c1_nilai', 92)->first();
    expect($siti->u_c1)->toBe(1.0);

    // Budi (75): (75-75)/(92-75) = 0.0
    $budi = $result->where('c1_nilai', 75)->first();
    expect($budi->u_c1)->toBe(0.0);
});

// ──────────────────────────────────────────────
// TEST 4: Hitung Utilitas (COST)
// ──────────────────────────────────────────────

test('utilitas kriteria cost C2 dihitung dengan rumus (Xmax-Xij)/(Xmax-Xmin)', function () {
    $service = new SmartService();
    $kriteria = Kriteria::where('kode_kriteria', 'C2')->get();
    $penilaians = PenilaianBeasiswa::all();
    $result = $service->hitungUtilitas($penilaians, $kriteria);

    // C2: min=20 (Siti), max=40 (Budi) — sifat COST
    // Siti (20): (40-20)/(40-20) = 1.0 (nilai rendah = prioritaskan)
    $siti = $result->where('c2_nilai', 20)->first();
    expect($siti->u_c2)->toBe(1.0);

    // Budi (40): (40-40)/(40-20) = 0.0 (nilai tinggi = kurang diprioritaskan)
    $budi = $result->where('c2_nilai', 40)->first();
    expect($budi->u_c2)->toBe(0.0);

    // Ahmad (30): (40-30)/(40-20) = 10/20 = 0.5
    $ahmad = $result->where('c2_nilai', 30)->first();
    expect($ahmad->u_c2)->toBe(0.5);
});

// ──────────────────────────────────────────────
// TEST 5: Hitung Nilai Akhir Vi
// ──────────────────────────────────────────────

test('nilai akhir Vi = Σ(Wj × uij) dihitung dengan benar', function () {
    $service = new SmartService();
    $kriteria = $service->normalisasiBobot(Kriteria::all());
    $penilaians = PenilaianBeasiswa::all();

    // Hitung utilitas dulu
    $penilaians = $service->hitungUtilitas($penilaians, $kriteria);
    // Hitung Vi
    $result = $service->hitungNilaiAkhir($penilaians, $kriteria);

    $data = $result->keyBy(function ($item) {
        return $item->siswa->nama_siswa;
    });

    // Verifikasi manual untuk Ahmad
    // u_C1=0.7647 × 0.35 = 0.2676
    // u_C2=0.5    × 0.25 = 0.1250
    // u_C3=0.5    × 0.15 = 0.0750  → (70-50)/(90-50)=20/40=0.5
    // u_C4=0.75   × 0.15 = 0.1125  → (80-50)/(90-50)=30/40=0.75
    // u_C5=0.6667 × 0.10 = 0.0667  → (20-10)/(20-5)=10/15=0.6667
    // TOTAL Vi = 0.2676 + 0.1250 + 0.0750 + 0.1125 + 0.0667 = 0.6468

    $ahmad = $data->get('Ahmad Sulaiman');
    expect($ahmad->nilai_akhir_vi)->toBeGreaterThan(0.64);
    expect($ahmad->nilai_akhir_vi)->toBeLessThan(0.65);
});

// ──────────────────────────────────────────────
// TEST 6: Ranking
// ──────────────────────────────────────────────

test('ranking mengurutkan dari Vi tertinggi ke terendah', function () {
    $service = new SmartService();
    $kriteria = $service->normalisasiBobot(Kriteria::all());
    $penilaians = PenilaianBeasiswa::all();

    $penilaians = $service->hitungUtilitas($penilaians, $kriteria);
    $penilaians = $service->hitungNilaiAkhir($penilaians, $kriteria);
    $result = $service->ranking($penilaians);

    // Ranking harus urut: 1, 2, 3, 4, 5
    expect($result->pluck('ranking')->toArray())->toBe([1, 2, 3, 4, 5]);

    // Nilai Vi harus descending
    $viValues = $result->pluck('nilai_akhir_vi')->toArray();
    for ($i = 0; $i < count($viValues) - 1; $i++) {
        expect($viValues[$i])->toBeGreaterThanOrEqual($viValues[$i + 1]);
    }
});

// ──────────────────────────────────────────────
// TEST 7: Full Pipeline
// ──────────────────────────────────────────────

test('prosesLengkap menghasilkan perankingan lengkap dengan data valid', function () {
    $service = new SmartService();
    $result = $service->prosesLengkap();

    // Harus 5 data
    expect($result)->toHaveCount(5);

    // Ranking 1-5
    expect($result->pluck('ranking')->toArray())->toBe([1, 2, 3, 4, 5]);

    // Semua nilai Vi tidak null
    $result->each(function ($item) {
        expect($item->nilai_akhir_vi)->not->toBeNull();
    });

    // Data tersimpan di database
    $saved = PenilaianBeasiswa::whereNotNull('nilai_akhir_vi')->whereNotNull('ranking')->get();
    expect($saved)->toHaveCount(5);
});

// ──────────────────────────────────────────────
// TEST 8: Benefit vs Cost consistency
// ──────────────────────────────────────────────

test('siswa dengan nilai akademik tinggi dan penghasilan rendah mendapat rank lebih baik', function () {
    $service = new SmartService();
    $result = $service->prosesLengkap();

    $data = $result->keyBy(function ($item) {
        return $item->siswa->nama_siswa;
    });

    // Siti (C1=92, C2=20) harus rank 1 atau 2
    $siti = $data->get('Siti Aminah');
    expect($siti->ranking)->toBeLessThanOrEqual(2);

    // Budi (C1=75, C2=40) harus rank lebih rendah
    $budi = $data->get('Budi Dermawan');
    expect($budi->ranking)->toBeGreaterThanOrEqual(3);
});
