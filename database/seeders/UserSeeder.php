<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Kepala Sekolah
        User::create([
            'name' => 'Drs. H. Mulyadi, M.Pd',
            'email' => 'kepsek@smk.test',
            'password' => Hash::make('password'),
            'role' => 'kepala_sekolah',
        ]);

        // Staf TU
        User::create([
            'name' => 'Admin TU',
            'email' => 'tu@smk.test',
            'password' => Hash::make('password'),
            'role' => 'staf_tu',
        ]);

        // 5 Siswa — belum daftar beasiswa
        $siswaData = [
            ['nisn' => '0096871234', 'nama_siswa' => 'Rizky Pratama', 'jurusan' => 'Teknik Komputer & Jaringan', 'email' => 'rizky@smk.test'],
            ['nisn' => '0096871235', 'nama_siswa' => 'Ahmad Fauzi', 'jurusan' => 'Rekayasa Perangkat Lunak', 'email' => 'ahmad@smk.test'],
            ['nisn' => '0096871236', 'nama_siswa' => 'Siti Nurhaliza', 'jurusan' => 'Multimedia', 'email' => 'siti@smk.test'],
            ['nisn' => '0096871237', 'nama_siswa' => 'Budi Santoso', 'jurusan' => 'Otomotif', 'email' => 'budi@smk.test'],
            ['nisn' => '0096871238', 'nama_siswa' => 'Dewi Lestari', 'jurusan' => 'Rekayasa Perangkat Lunak', 'email' => 'dewi@smk.test'],
        ];

        foreach ($siswaData as $s) {
            $user = User::create([
                'name' => $s['nama_siswa'],
                'email' => $s['email'],
                'password' => Hash::make('password'),
                'role' => 'siswa',
            ]);

            Siswa::create([
                'nisn' => $s['nisn'],
                'nama_siswa' => $s['nama_siswa'],
                'jurusan' => $s['jurusan'],
                'kelas' => 'X (Sepuluh)',
                'user_id' => $user->id,
            ]);
        }
    }
}
