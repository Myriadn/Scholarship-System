<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenilaianBeasiswa extends Model
{
    protected $table = 'penilaian_beasiswa';

    protected $fillable = [
        'siswa_id',
        'c1_nilai',
        'c2_nilai',
        'c3_nilai',
        'c4_nilai',
        'c5_nilai',
        'nilai_akhir_vi',
        'ranking',
        'status_approval',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'c1_nilai' => 'float',
            'c2_nilai' => 'float',
            'c3_nilai' => 'float',
            'c4_nilai' => 'float',
            'c5_nilai' => 'float',
            'nilai_akhir_vi' => 'float',
            'ranking' => 'integer',
            'status_approval' => 'string',
            'approved_at' => 'datetime',
        ];
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
