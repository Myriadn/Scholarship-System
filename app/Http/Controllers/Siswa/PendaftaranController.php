<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\BerkasSiswa;
use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendaftaranController extends Controller
{
    /**
     * Show the pendaftaran form.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load('siswa.penilaianBeasiswa');

        return Inertia::render('siswa/pendaftaran', [
            'siswa' => $user->siswa,
        ]);
    }

    /**
     * Store the pendaftaran data (data diri + kriteria + berkas).
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return redirect()->route('siswa.pendaftaran')
                ->with('error', 'Data siswa tidak ditemukan. Silakan hubungi Staf TU.');
        }

        // Validasi
        $validated = $request->validate([
            'c1_rapor' => 'required|numeric|min:0|max:100',
            'c2_penghasilan' => 'required|numeric|min:0|max:999999999',
            'c3_tanggungan' => 'required|numeric|min:0|max:100',
            'c4_prestasi' => 'required|numeric|min:1|max:5',
            'c5_absensi' => 'required|numeric|min:0|max:100',
            'berkas_kk' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'berkas_rapor' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        // Simpan C1-C5 ke penilaian_beasiswa
        PenilaianBeasiswa::updateOrCreate(
            ['siswa_id' => $siswa->id],
            [
                'c1_nilai' => $validated['c1_rapor'],
                'c2_nilai' => $validated['c2_penghasilan'],
                'c3_nilai' => $validated['c3_tanggungan'],
                'c4_nilai' => $validated['c4_prestasi'],
                'c5_nilai' => $validated['c5_absensi'],
                'status_approval' => 'pending',
            ]
        );

        // Simpan berkas KK
        if ($request->hasFile('berkas_kk')) {
            $file = $request->file('berkas_kk');
            $path = $file->store('berkas/' . $siswa->id, 'public');

            BerkasSiswa::updateOrCreate(
                ['siswa_id' => $siswa->id, 'nama_berkas' => 'Kartu Keluarga'],
                [
                    'file_path' => $path,
                    'status_verifikasi' => 'pending',
                ]
            );
        }

        // Simpan berkas Rapor
        if ($request->hasFile('berkas_rapor')) {
            $file = $request->file('berkas_rapor');
            $path = $file->store('berkas/' . $siswa->id, 'public');

            BerkasSiswa::updateOrCreate(
                ['siswa_id' => $siswa->id, 'nama_berkas' => 'Rapor Terakhir'],
                [
                    'file_path' => $path,
                    'status_verifikasi' => 'pending',
                ]
            );
        }

        return redirect()->route('siswa.dashboard')
            ->with('success', 'Pendaftaran berhasil disimpan. Berkas Anda akan diverifikasi oleh Staf TU.');
    }
}
