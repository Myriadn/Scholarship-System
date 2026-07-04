<?php

namespace App\Http\Controllers\StafTU;

use App\Http\Controllers\Controller;
use App\Models\BerkasSiswa;
use App\Models\PenilaianBeasiswa;
use App\Models\Siswa;
use App\Models\User;
use App\Services\SmartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        $siswa = Siswa::with(['penilaianBeasiswa', 'berkasSiswa'])->get();

        return Inertia::render('staf-tu/verifikasi-berkas', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Delete a siswa record and its associated user.
     */
    public function deleteSiswa(Request $request, int $id): RedirectResponse
    {
        $siswa = Siswa::findOrFail($id);

        $siswa->penilaianBeasiswa()->delete();
        $siswa->berkasSiswa()->delete();

        if ($siswa->user_id) {
            User::where('id', $siswa->user_id)->delete();
        }

        $siswa->delete();

        return redirect()->route('staf-tu.data-siswa')
            ->with('success', 'Siswa berhasil dihapus.');
    }

    /**
     * Store a new siswa (created by Staff TU).
     */
    public function storeSiswa(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'nama_siswa' => 'required|string|max:100',
            'jurusan' => 'required|string|max:50',
            'kelas' => 'required|string|max:20',
        ]);

        $email = $validated['nisn'] . '@siswa.smk.test';

        $user = User::create([
            'name' => $validated['nama_siswa'],
            'email' => $email,
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        Siswa::create([
            'nisn' => $validated['nisn'],
            'nama_siswa' => $validated['nama_siswa'],
            'jurusan' => $validated['jurusan'],
            'kelas' => $validated['kelas'],
            'user_id' => $user->id,
        ]);

        return redirect()->route('staf-tu.data-siswa')
            ->with('success', 'Siswa berhasil ditambahkan. Email: ' . $email);
    }

    /**
     * Download a student's berkas file.
     */
    public function downloadBerkas(int $id)
    {
        $berkas = BerkasSiswa::findOrFail($id);

        $path = storage_path('app/public/' . $berkas->file_path);

        if (!file_exists($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        return response()->file($path);
    }

    /**
     * Verify a student's berkas and auto-run SMART.
     */
    public function verifikasi(Request $request, SmartService $smartService): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'status' => 'required|in:verified,rejected',
        ]);

        // Update status verifikasi berkas
        BerkasSiswa::where('siswa_id', $validated['siswa_id'])
            ->update(['status_verifikasi' => $validated['status']]);

        if ($validated['status'] === 'verified') {
            try {
                $smartService->prosesLengkap();
            } catch (\Exception $e) {
                return redirect()->route('staf-tu.verifikasi-berkas')
                    ->with('error', 'Berkas terverifikasi tapi gagal proses SMART: ' . $e->getMessage());
            }
        }

        return redirect()->route('staf-tu.verifikasi-berkas')
            ->with('success', 'Berkas siswa berhasil ' . ($validated['status'] === 'verified' ? 'diverifikasi' : 'ditolak') . '.');
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
