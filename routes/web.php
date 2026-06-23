<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Siswa\PendaftaranController as SiswaPendaftaranController;
use App\Http\Controllers\StafTU\DashboardController as StafTUDashboardController;
use App\Http\Controllers\KepalaSekolah\LaporanController as KepalaSekolahLaporanController;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

Route::middleware(['auth'])->group(function () {
    // Siswa routes
    Route::prefix('siswa')->name('siswa.')->middleware('role:siswa')->group(function () {
        Route::get('dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');
        Route::get('pendaftaran', [SiswaPendaftaranController::class, 'index'])->name('pendaftaran');
        Route::post('pendaftaran', [SiswaPendaftaranController::class, 'store'])->name('pendaftaran.store');
    });

    // Staf TU routes
    Route::prefix('staf-tu')->name('staf-tu.')->middleware('role:staf_tu')->group(function () {
        Route::get('dashboard', [StafTUDashboardController::class, 'index'])->name('dashboard');
        Route::post('proses-smart', [StafTUDashboardController::class, 'prosesHitung'])->name('proses-smart');
    });

    // Kepala Sekolah routes
    Route::prefix('kepala-sekolah')->name('kepala-sekolah.')->middleware('role:kepala_sekolah')->group(function () {
        Route::get('laporan', [KepalaSekolahLaporanController::class, 'index'])->name('laporan');
        Route::post('approve/{id}', [KepalaSekolahLaporanController::class, 'approve'])->name('approve');
    });
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
