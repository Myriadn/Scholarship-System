<?php

namespace Database\Seeders;

use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use Illuminate\Database\Seeder;

class PenilaianSeeder extends Seeder
{
    public function run(): void
    {
        $siswas = Siswa::all();

        $nilai = [
            ['c1' => 88, 'c2' => 30, 'c3' => 70, 'c4' => 80, 'c5' => 10],
            ['c1' => 92, 'c2' => 20, 'c3' => 60, 'c4' => 90, 'c5' => 5],
            ['c1' => 75, 'c2' => 40, 'c3' => 80, 'c4' => 60, 'c5' => 15],
            ['c1' => 85, 'c2' => 35, 'c3' => 50, 'c4' => 70, 'c5' => 8],
            ['c1' => 78, 'c2' => 25, 'c3' => 90, 'c4' => 50, 'c5' => 20],
            ['c1' => 82, 'c2' => 45, 'c3' => 65, 'c4' => 75, 'c5' => 12],
            ['c1' => 70, 'c2' => 50, 'c3' => 85, 'c4' => 55, 'c5' => 18],
            ['c1' => 90, 'c2' => 15, 'c3' => 55, 'c4' => 85, 'c5' => 7],
            ['c1' => 80, 'c2' => 28, 'c3' => 75, 'c4' => 65, 'c5' => 14],
            ['c1' => 86, 'c2' => 32, 'c3' => 45, 'c4' => 78, 'c5' => 9],
        ];

        // Status assignments:
        // Index 0-2 → Lolos (approved, ranking 1-3)
        // Index 3   → Tidak Lolos (approved, ranking 26)
        // Index 4-8 → Verifikasi (pending, no approval)
        // Index 9   → Tidak dibuat (Rizky - belum daftar)

        $statuses = [
            0 => ['status_approval' => 'approved', 'nilai_akhir_vi' => 0.954, 'ranking' => 1],
            1 => ['status_approval' => 'approved', 'nilai_akhir_vi' => 0.932, 'ranking' => 2],
            2 => ['status_approval' => 'approved', 'nilai_akhir_vi' => 0.911, 'ranking' => 3],
            3 => ['status_approval' => 'approved', 'nilai_akhir_vi' => 0.887, 'ranking' => 26],
            4 => ['status_approval' => 'pending',  'nilai_akhir_vi' => null,  'ranking' => null],
            5 => ['status_approval' => 'pending',  'nilai_akhir_vi' => null,  'ranking' => null],
            6 => ['status_approval' => 'pending',  'nilai_akhir_vi' => null,  'ranking' => null],
            7 => ['status_approval' => 'pending',  'nilai_akhir_vi' => null,  'ranking' => null],
            8 => ['status_approval' => 'pending',  'nilai_akhir_vi' => null,  'ranking' => null],
            // 9 = skipped (rizky)
        ];

        foreach ($siswas as $index => $siswa) {
            if (!isset($nilai[$index]) || !isset($statuses[$index])) {
                continue;
            }

            $s = $statuses[$index];
            $n = $nilai[$index];

            PenilaianBeasiswa::create([
                'siswa_id' => $siswa->id,
                'c1_nilai' => $n['c1'],
                'c2_nilai' => $n['c2'],
                'c3_nilai' => $n['c3'],
                'c4_nilai' => $n['c4'],
                'c5_nilai' => $n['c5'],
                'nilai_akhir_vi' => $s['nilai_akhir_vi'],
                'ranking' => $s['ranking'],
                'status_approval' => $s['status_approval'],
                'approved_by' => $s['status_approval'] === 'approved' ? 1 : null,
                'approved_at' => $s['status_approval'] === 'approved' ? now() : null,
            ]);
        }
    }
}
