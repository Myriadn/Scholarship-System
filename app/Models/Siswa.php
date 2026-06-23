<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'nisn',
        'nama_siswa',
        'jurusan',
        'kelas',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function berkasSiswa(): HasMany
    {
        return $this->hasMany(BerkasSiswa::class);
    }

    public function penilaianBeasiswa(): HasOne
    {
        return $this->hasOne(PenilaianBeasiswa::class);
    }
}
