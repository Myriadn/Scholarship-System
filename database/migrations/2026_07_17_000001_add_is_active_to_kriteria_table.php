<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kriteria', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('sifat');
        });

        // Set C5 (Absensi) sebagai non-aktif secara default
        DB::table('kriteria')->where('kode_kriteria', 'C5')->update(['is_active' => false]);
    }

    public function down(): void
    {
        Schema::table('kriteria', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
