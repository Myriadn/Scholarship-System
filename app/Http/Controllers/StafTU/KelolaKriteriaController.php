<?php

namespace App\Http\Controllers\StafTU;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelolaKriteriaController extends Controller
{
    /**
     * Display the criteria management page.
     */
    public function index(): Response
    {
        $kriteria = Kriteria::orderBy('kode_kriteria', 'asc')->get();

        return Inertia::render('staf-tu/kelola-kriteria', [
            'kriteria' => $kriteria,
        ]);
    }

    /**
     * Store a newly created criteria.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kriteria' => 'required|string|max:10|unique:kriteria,kode_kriteria',
            'nama_kriteria' => 'required|string|max:100',
            'bobot_awal' => 'required|integer|min:1|max:100',
            'sifat' => 'required|in:benefit,cost',
        ]);

        $totalBobot = Kriteria::where('is_active', true)->sum('bobot_awal') + $validated['bobot_awal'];

        Kriteria::create([
            'kode_kriteria' => $validated['kode_kriteria'],
            'nama_kriteria' => $validated['nama_kriteria'],
            'bobot_awal' => $validated['bobot_awal'],
            'bobot_normalisasi' => $totalBobot > 0 ? round($validated['bobot_awal'] / $totalBobot, 4) : 0,
            'sifat' => $validated['sifat'],
            'is_active' => true,
        ]);

        // Re-normalize all active criteria
        $this->normalisasiUlang();

        return redirect()->route('staf-tu.kelola-kriteria')
            ->with('success', 'Kriteria berhasil ditambahkan.');
    }

    /**
     * Update the specified criteria.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $kriteria = Kriteria::findOrFail($id);

        $validated = $request->validate([
            'nama_kriteria' => 'required|string|max:100',
            'bobot_awal' => 'required|integer|min:1|max:100',
            'sifat' => 'required|in:benefit,cost',
        ]);

        $kriteria->update([
            'nama_kriteria' => $validated['nama_kriteria'],
            'bobot_awal' => $validated['bobot_awal'],
            'sifat' => $validated['sifat'],
        ]);

        // Re-normalize bobot after update
        $this->normalisasiUlang();

        return redirect()->route('staf-tu.kelola-kriteria')
            ->with('success', 'Kriteria berhasil diperbarui.');
    }

    /**
     * Toggle active status of the specified criteria.
     */
    public function toggleActive(int $id): RedirectResponse
    {
        $kriteria = Kriteria::findOrFail($id);

        $kriteria->update([
            'is_active' => !$kriteria->is_active,
        ]);

        // Re-normalize after toggling
        $this->normalisasiUlang();

        $status = $kriteria->fresh()->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->route('staf-tu.kelola-kriteria')
            ->with('success', "Kriteria {$kriteria->kode_kriteria} berhasil {$status}.");
    }

    /**
     * Remove the specified criteria from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $kriteria = Kriteria::findOrFail($id);

        // Prevent deletion if only 1 active criteria remains
        $activeCount = Kriteria::where('is_active', true)->count();
        if ($activeCount <= 1 && $kriteria->is_active) {
            return redirect()->route('staf-tu.kelola-kriteria')
                ->with('error', 'Tidak dapat menghapus kriteria terakhir yang aktif.');
        }

        $kriteria->delete();

        // Re-normalize after deletion
        $this->normalisasiUlang();

        return redirect()->route('staf-tu.kelola-kriteria')
            ->with('success', 'Kriteria berhasil dihapus.');
    }

    /**
     * Recalculate bobot_normalisasi for all active criteria.
     */
    private function normalisasiUlang(): void
    {
        $activeKriteria = Kriteria::where('is_active', true)->get();
        $totalBobot = $activeKriteria->sum('bobot_awal');

        foreach ($activeKriteria as $k) {
            $k->update([
                'bobot_normalisasi' => $totalBobot > 0 ? round($k->bobot_awal / $totalBobot, 4) : 0,
            ]);
        }
    }
}
