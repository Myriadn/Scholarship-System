<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the siswa dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load('siswa.penilaianBeasiswa');

        return Inertia::render('siswa/dashboard', [
            'siswa' => $user->siswa,
        ]);
    }
}
