<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BerkasSiswa extends Model
{
    protected $table = 'berkas_siswa';

    protected $fillable = [
        'siswa_id',
        'nama_berkas',
        'file_path',
        'status_verifikasi',
        'keterangan',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'status_verifikasi' => 'string',
        ];
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
