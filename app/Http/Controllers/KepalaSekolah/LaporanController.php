<?php

namespace App\Http\Controllers\KepalaSekolah;

use App\Http\Controllers\Controller;
use App\Models\PenilaianBeasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display the laporan/ranking page.
     */
    public function index(Request $request): Response
    {
        $penilaians = PenilaianBeasiswa::with('siswa')
            ->orderBy('ranking', 'asc')
            ->get();

        $approvedCount = $penilaians->where('status_approval', 'approved')->count();
        $pendingCount = $penilaians->where('status_approval', 'pending')->count();

        return Inertia::render('kepala-sekolah/laporan', [
            'penilaians' => $penilaians,
            'approvedCount' => $approvedCount,
            'pendingCount' => $pendingCount,
        ]);
    }

    /**
     * Approve a specific penilaian.
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $penilaian = PenilaianBeasiswa::findOrFail($id);

        $penilaian->update([
            'status_approval' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return redirect()->route('kepala-sekolah.laporan')
            ->with('success', 'Data beasiswa berhasil disetujui.');
    }

    /**
     * Reject a specific penilaian.
     */
    public function reject(Request $request, int $id): RedirectResponse
    {
        $penilaian = PenilaianBeasiswa::findOrFail($id);

        $penilaian->update([
            'status_approval' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return redirect()->route('kepala-sekolah.laporan')
            ->with('success', 'Data beasiswa berhasil ditolak.');
    }
}
