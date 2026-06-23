<?php

namespace Database\Seeders;

use App\Models\Kriteria;
use Illuminate\Database\Seeder;

class KriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode_kriteria' => 'C1', 'nama_kriteria' => 'Nilai Akademik', 'bobot_awal' => 35, 'bobot_normalisasi' => 0.35, 'sifat' => 'benefit'],
            ['kode_kriteria' => 'C2', 'nama_kriteria' => 'Penghasilan Orang Tua', 'bobot_awal' => 25, 'bobot_normalisasi' => 0.25, 'sifat' => 'cost'],
            ['kode_kriteria' => 'C3', 'nama_kriteria' => 'Jumlah Tanggungan Orang Tua', 'bobot_awal' => 15, 'bobot_normalisasi' => 0.15, 'sifat' => 'benefit'],
            ['kode_kriteria' => 'C4', 'nama_kriteria' => 'Prestasi', 'bobot_awal' => 15, 'bobot_normalisasi' => 0.15, 'sifat' => 'benefit'],
            ['kode_kriteria' => 'C5', 'nama_kriteria' => 'Absensi', 'bobot_awal' => 10, 'bobot_normalisasi' => 0.10, 'sifat' => 'cost'],
        ];

        foreach ($data as $item) {
            Kriteria::create($item);
        }
    }
}
