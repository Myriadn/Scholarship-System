<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penilaian_beasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->float('c1_nilai', 8, 2)->default(0);
            $table->float('c2_nilai', 8, 2)->default(0);
            $table->float('c3_nilai', 8, 2)->default(0);
            $table->float('c4_nilai', 8, 2)->default(0);
            $table->float('c5_nilai', 8, 2)->default(0);
            $table->float('nilai_akhir_vi', 8, 4)->nullable();
            $table->integer('ranking')->nullable();
            $table->enum('status_approval', ['pending', 'approved'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->datetime('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaian_beasiswa');
    }
};
