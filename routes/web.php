<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Siswa\PendaftaranController as SiswaPendaftaranController;
use App\Http\Controllers\StafTU\DashboardController as StafTUDashboardController;
use App\Http\Controllers\StafTU\KelolaKriteriaController as StafTUKelolaKriteriaController;
use App\Http\Controllers\KepalaSekolah\LaporanController as KepalaSekolahLaporanController;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        return redirect(match ($user->role) {
            'siswa' => route('siswa.dashboard'),
            'staf_tu' => route('staf-tu.dashboard'),
            'kepala_sekolah' => route('kepala-sekolah.laporan'),
            default => route('dashboard'),
        });
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Siswa routes
    Route::prefix('siswa')->name('siswa.')->middleware('role:siswa')->group(function () {
        Route::get('dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');
        Route::get('pendaftaran', [SiswaPendaftaranController::class, 'index'])->name('pendaftaran');
        Route::post('pendaftaran', [SiswaPendaftaranController::class, 'store'])->name('pendaftaran.store');
    });

        // Staf TU routes
        Route::prefix('staf-tu')->name('staf-tu.')->middleware('role:staf_tu')->group(function () {
            Route::get('dashboard', [StafTUDashboardController::class, 'index'])->name('dashboard');
            Route::get('data-siswa', [StafTUDashboardController::class, 'dataSiswa'])->name('data-siswa');
            Route::get('verifikasi-berkas', [StafTUDashboardController::class, 'verifikasiBerkas'])->name('verifikasi-berkas');
            Route::post('siswa/store', [StafTUDashboardController::class, 'storeSiswa'])->name('siswa.store');
            Route::post('siswa/delete/{id}', [StafTUDashboardController::class, 'deleteSiswa'])->name('siswa.delete');
            Route::post('verifikasi', [StafTUDashboardController::class, 'verifikasi'])->name('verifikasi');
            Route::get('berkas/download/{id}', [StafTUDashboardController::class, 'downloadBerkas'])->name('berkas.download');
            Route::post('proses-smart', [StafTUDashboardController::class, 'prosesHitung'])->name('proses-smart');

            // Kelola Kriteria routes
            Route::get('kelola-kriteria', [StafTUKelolaKriteriaController::class, 'index'])->name('kelola-kriteria');
            Route::post('kelola-kriteria/store', [StafTUKelolaKriteriaController::class, 'store'])->name('kelola-kriteria.store');
            Route::post('kelola-kriteria/update/{id}', [StafTUKelolaKriteriaController::class, 'update'])->name('kelola-kriteria.update');
            Route::post('kelola-kriteria/toggle/{id}', [StafTUKelolaKriteriaController::class, 'toggleActive'])->name('kelola-kriteria.toggle');
            Route::post('kelola-kriteria/delete/{id}', [StafTUKelolaKriteriaController::class, 'destroy'])->name('kelola-kriteria.delete');
        });

    // Kepala Sekolah routes
    Route::prefix('kepala-sekolah')->name('kepala-sekolah.')->middleware('role:kepala_sekolah')->group(function () {
        Route::get('laporan', [KepalaSekolahLaporanController::class, 'index'])->name('laporan');
        Route::post('approve/{id}', [KepalaSekolahLaporanController::class, 'approve'])->name('approve');
        Route::post('reject/{id}', [KepalaSekolahLaporanController::class, 'reject'])->name('reject');
    });
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
