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

        // 5 Siswa
        $siswaData = [
            ['nisn' => '0082716253', 'nama_siswa' => 'Ahmad Sulaiman', 'jurusan' => 'XII TKJ 1', 'email' => 'ahmad@smk.test'],
            ['nisn' => '0091827364', 'nama_siswa' => 'Siti Aminah', 'jurusan' => 'XII RPL 2', 'email' => 'siti@smk.test'],
            ['nisn' => '0081726354', 'nama_siswa' => 'Budi Dermawan', 'jurusan' => 'XI Multimedia', 'email' => 'budi@smk.test'],
            ['nisn' => '0092837465', 'nama_siswa' => 'Citra Lestari', 'jurusan' => 'X Otomotif 3', 'email' => 'citra@smk.test'],
            ['nisn' => '0083928172', 'nama_siswa' => 'Dedi Kurniawan', 'jurusan' => 'XII TKJ 2', 'email' => 'dedi@smk.test'],
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
                'jurusan' => explode(' ', $s['jurusan'], 2)[1] ?? $s['jurusan'],
                'kelas' => explode(' ', $s['jurusan'], 2)[0] ?? $s['jurusan'],
                'user_id' => $user->id,
            ]);
        }

        // Also create siswa entries for ahmad & siti that already have user accounts
        // (they are already created above)
    }
}
