<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
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
        $user = $request->user()->load('siswa');

        return Inertia::render('siswa/pendaftaran', [
            'siswa' => $user->siswa,
        ]);
    }

    /**
     * Store the pendaftaran data.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'nama_siswa' => 'required|string|max:100',
            'jurusan' => 'required|string|max:50',
            'kelas' => 'required|string|max:20',
        ]);

        $validated['user_id'] = $request->user()->id;

        Siswa::create($validated);

        return redirect()->route('siswa.dashboard')
            ->with('success', 'Pendaftaran berhasil disimpan.');
    }
}
