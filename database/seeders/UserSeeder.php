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
        $kepsek = User::create([
            'name' => 'Drs. H. Mulyadi, M.Pd',
            'email' => 'kepsek@smk.test',
            'password' => Hash::make('password'),
            'role' => 'kepala_sekolah',
        ]);

        // Staf TU
        $tu = User::create([
            'name' => 'Admin TU',
            'email' => 'tu@smk.test',
            'password' => Hash::make('password'),
            'role' => 'staf_tu',
        ]);

        // 5 Siswa — semuanya kelas 10
        $siswaData = [
            ['nisn' => '0082716253', 'nama_siswa' => 'Ahmad Sulaiman', 'jurusan' => 'Teknik Komputer & Jaringan', 'email' => 'ahmad@smk.test'],
            ['nisn' => '0091827364', 'nama_siswa' => 'Siti Aminah', 'jurusan' => 'Rekayasa Perangkat Lunak', 'email' => 'siti@smk.test'],
            ['nisn' => '0081726354', 'nama_siswa' => 'Budi Dermawan', 'jurusan' => 'Multimedia', 'email' => 'budi@smk.test'],
            ['nisn' => '0092837465', 'nama_siswa' => 'Citra Lestari', 'jurusan' => 'Otomotif', 'email' => 'citra@smk.test'],
            ['nisn' => '0083928172', 'nama_siswa' => 'Dedi Kurniawan', 'jurusan' => 'Teknik Komputer & Jaringan', 'email' => 'dedi@smk.test'],
            ['nisn' => '0093847561', 'nama_siswa' => 'Eka Putri', 'jurusan' => 'Rekayasa Perangkat Lunak', 'email' => 'eka@smk.test'],
            ['nisn' => '0084938271', 'nama_siswa' => 'Fajar Ramadhan', 'jurusan' => 'Teknik Komputer & Jaringan', 'email' => 'fajar@smk.test'],
            ['nisn' => '0094857612', 'nama_siswa' => 'Gita Permata', 'jurusan' => 'Multimedia', 'email' => 'gita@smk.test'],
            ['nisn' => '0085948372', 'nama_siswa' => 'Hadi Saputra', 'jurusan' => 'Otomotif', 'email' => 'hadi@smk.test'],
            ['nisn' => '0095867713', 'nama_siswa' => 'Indah Sari', 'jurusan' => 'Rekayasa Perangkat Lunak', 'email' => 'indah@smk.test'],
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

        // Also create siswa entries for ahmad & siti that already have user accounts
        // (they are already created above)
    }
}
