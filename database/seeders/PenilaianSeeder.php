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
        ];

        foreach ($siswas as $index => $siswa) {
            if (isset($nilai[$index])) {
                PenilaianBeasiswa::create([
                    'siswa_id' => $siswa->id,
                    'c1_nilai' => $nilai[$index]['c1'],
                    'c2_nilai' => $nilai[$index]['c2'],
                    'c3_nilai' => $nilai[$index]['c3'],
                    'c4_nilai' => $nilai[$index]['c4'],
                    'c5_nilai' => $nilai[$index]['c5'],
                ]);
            }
        }
    }
}
