<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'kriteria';

    protected $fillable = [
        'kode_kriteria',
        'nama_kriteria',
        'bobot_awal',
        'bobot_normalisasi',
        'sifat',
    ];

    protected function casts(): array
    {
        return [
            'bobot_awal' => 'integer',
            'bobot_normalisasi' => 'float',
        ];
    }
}
