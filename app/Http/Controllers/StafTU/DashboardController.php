<?php

namespace App\Http\Controllers\StafTU;

use App\Http\Controllers\Controller;
use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use App\Services\SmartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Staf TU dashboard.
     */
    public function index(Request $request): Response
    {
        $siswa = Siswa::with('penilaianBeasiswa')->get();
        $penilaians = PenilaianBeasiswa::with('siswa')
            ->orderBy('ranking', 'asc')
            ->get();

        return Inertia::render('staf-tu/dashboard', [
            'siswa' => $siswa,
            'penilaians' => $penilaians,
        ]);
    }

    /**
     * Display the Data Siswa page.
     */
    public function dataSiswa(Request $request): Response
    {
        $siswa = Siswa::with('penilaianBeasiswa')->get();

        return Inertia::render('staf-tu/data-siswa', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Display the Verifikasi Berkas page.
     */
    public function verifikasiBerkas(Request $request): Response
    {
        $siswa = Siswa::with('penilaianBeasiswa')->get();

        return Inertia::render('staf-tu/verifikasi-berkas', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Process the SMART calculation.
     */
    public function prosesHitung(Request $request, SmartService $smartService): RedirectResponse
    {
        try {
            $hasil = $smartService->prosesLengkap();

            return redirect()->route('staf-tu.dashboard')
                ->with('success', 'Perhitungan SMART berhasil diproses. ' . $hasil->count() . ' data siswa telah di-ranking.');
        } catch (\Exception $e) {
            return redirect()->route('staf-tu.dashboard')
                ->with('error', 'Terjadi kesalahan saat memproses perhitungan: ' . $e->getMessage());
        }
    }
}
