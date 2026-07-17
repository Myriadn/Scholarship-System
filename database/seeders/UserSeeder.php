<?php

namespace Database\Seeders;

use App\Models\User;
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
    }
}
