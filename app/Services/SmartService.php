<?php

namespace App\Services;

use App\Models\PenilaianBeasiswa;
use App\Models\Kriteria;
use Illuminate\Support\Collection;

class SmartService
{
    /**
     * Hitung normalisasi bobot dari total bobot awal
     */
    public function normalisasiBobot(Collection $kriteria): Collection
    {
        $totalBobot = $kriteria->sum('bobot_awal');
        return $kriteria->map(function ($k) use ($totalBobot) {
            $k->bobot_normalisasi = $k->bobot_awal / $totalBobot;
            return $k;
        });
    }

    /**
     * Hitung nilai utilitas untuk semua siswa
     */
    public function hitungUtilitas(Collection $penilaians, Collection $kriteria): Collection
    {
        // Cari nilai min/max untuk tiap kriteria
        $min = [];
        $max = [];
        foreach ($kriteria as $k) {
            $field = strtolower($k->kode_kriteria) . '_nilai';
            $min[$k->kode_kriteria] = $penilaians->min($field);
            $max[$k->kode_kriteria] = $penilaians->max($field);
        }

        return $penilaians->map(function ($p) use ($kriteria, $min, $max) {
            foreach ($kriteria as $k) {
                $field = strtolower($k->kode_kriteria) . '_nilai';
                $xij = $p->$field;
                $xmin = $min[$k->kode_kriteria];
                $xmax = $max[$k->kode_kriteria];

                if ($xmax == $xmin) {
                    $uij = 1;
                } elseif ($k->sifat === 'benefit') {
                    $uij = ($xij - $xmin) / ($xmax - $xmin);
                } else {
                    $uij = ($xmax - $xij) / ($xmax - $xmin);
                }

                $p->{'u_' . strtolower($k->kode_kriteria)} = round($uij, 4);
            }
            return $p;
        });
    }

    /**
     * Hitung nilai akhir Vi untuk semua siswa
     */
    public function hitungNilaiAkhir(Collection $penilaians, Collection $kriteria): Collection
    {
        return $penilaians->map(function ($p) use ($kriteria) {
            $vi = 0;
            foreach ($kriteria as $k) {
                $uField = 'u_' . strtolower($k->kode_kriteria);
                $vi += ($k->bobot_normalisasi * ($p->$uField ?? 0));
            }
            $p->nilai_akhir_vi = round($vi * 100, 2);
            return $p;
        });
    }

    /**
     * Proses ranking berdasarkan nilai Vi (descending)
     */
    public function ranking(Collection $penilaians): Collection
    {
        $sorted = $penilaians->sortByDesc('nilai_akhir_vi')->values();
        $sorted->each(function ($p, $index) {
            $p->ranking = $index + 1;
        });
        return $sorted;
    }

    /**
     * Proses lengkap SMART: normalisasi bobot -> hitung utilitas -> hitung Vi -> ranking
     */
    public function prosesLengkap(): Collection
    {
        $kriteria = Kriteria::where('is_active', true)->get();
        $kriteria = $this->normalisasiBobot($kriteria);

        $penilaians = PenilaianBeasiswa::with('siswa')->get();

        $penilaians = $this->hitungUtilitas($penilaians, $kriteria);
        $penilaians = $this->hitungNilaiAkhir($penilaians, $kriteria);
        $penilaians = $this->ranking($penilaians);

        // Simpan hasil ke database (hanya nilai_akhir_vi dan ranking)
        foreach ($penilaians as $p) {
            PenilaianBeasiswa::where('id', $p->id)->update([
                'nilai_akhir_vi' => $p->nilai_akhir_vi,
                'ranking' => $p->ranking,
            ]);
        }

        return $penilaians;
    }
}
