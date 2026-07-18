import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BadgeCheck, Check, ClipboardList, FileSearch, HelpCircle, MessageCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'Ringkasan', href: '/siswa/dashboard' },
];

interface Penilaian {
    id: number;
    nilai_akhir_vi?: number;
    ranking?: number;
    status_approval?: string;
    approved_by?: number | null;
    approved_at?: string | null;
}

interface Siswa {
    id: number;
    nisn: string;
    nama_siswa: string;
    jurusan: string;
    kelas: string;
    penilaian_beasiswa?: Penilaian | null;
}

export default function SiswaDashboard() {
    const { auth } = usePage<SharedData>().props;
    const { siswa } = usePage<{ siswa: Siswa | null }>().props;
    const user = auth.user;

    const penilaian = siswa?.penilaian_beasiswa;

    // Determine stage: pendaftaran → verifikasi → pengumuman
    let stage: 'pendaftaran' | 'verifikasi' | 'pengumuman' = 'pendaftaran';
    if (penilaian) {
        stage = penilaian.status_approval === 'pending' ? 'verifikasi' : 'pengumuman';
    }

    const isLolos = stage === 'pengumuman' && penilaian?.status_approval === 'approved';

    const stepData = [
        { label: 'Pendaftaran', icon: Check, status: stage === 'pendaftaran' ? 'active' : ('completed' as const) },
        {
            label: 'Verifikasi',
            icon: FileSearch,
            status: stage === 'pendaftaran' ? 'pending' : stage === 'verifikasi' ? 'active' : ('completed' as const),
        },
        { label: 'Pengumuman', icon: BadgeCheck, status: stage === 'pengumuman' ? 'active' : ('pending' as const) },
    ];

    const statusBadge = () => {
        switch (stage) {
            case 'pendaftaran':
                return { label: 'BELUM MENDAFTAR', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
            case 'verifikasi':
                return { label: 'BERKAS SEDANG DIVERIFIKASI', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
            case 'pengumuman':
                return isLolos
                    ? { label: 'SELAMAT! ANDA LOLOS', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }
                    : { label: 'MOHON MAAF, TIDAK LOLOS', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
        }
    };

    const badge = statusBadge();

    const progressWidth = () => {
        switch (stage) {
            case 'pendaftaran':
                return '8%';
            case 'verifikasi':
                return '50%';
            case 'pengumuman':
                return '100%';
        }
    };

    const infoMessage = () => {
        switch (stage) {
            case 'pendaftaran':
                return (
                    <div className="flex flex-col items-start gap-4">
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Anda belum melakukan pendaftaran beasiswa. Silakan lengkapi data diri dan kriteriamu untuk mengikuti seleksi beasiswa SMK
                            Bina Karya Mandiri 2.
                        </p>
                        <Link
                            href={route('siswa.pendaftaran')}
                            className="inline-flex items-center gap-2 rounded bg-[#00236F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#001B59]"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Lakukan Pendaftaran
                        </Link>
                    </div>
                );
            case 'verifikasi':
                return (
                    <p className="text-sm leading-[21px] text-[#444651] italic">
                        &ldquo;Berkas Anda telah diterima oleh Staf TU dan sedang dalam tahap pemeriksaan keaslian dokumen. Mohon periksa dashboard
                        secara berkala untuk mengetahui perkembangan status pengajuan Anda.&rdquo;
                    </p>
                );
            case 'pengumuman':
                return isLolos ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-bold text-[#10B981]">
                            🎉 Selamat! Anda dinyatakan <span className="uppercase">Lolos</span> seleksi beasiswa.
                        </p>
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Berdasarkan hasil perhitungan SMART dan persetujuan Kepala Sekolah, Anda berhak menerima Beasiswa Free SPP Tahun Ajaran
                            2025/2026. Silakan hubungi pihak sekolah untuk informasi lebih lanjut.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-bold text-[#EF4444]">Mohon maaf, Anda belum berhasil lolos seleksi beasiswa.</p>
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Tetap semangat dan tingkatkan kembali prestasi serta kriteria lainnya untuk kesempatan beasiswa di tahun ajaran mendatang.
                        </p>
                    </div>
                );
        }
    };

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Siswa Dashboard">
            <Head title="Dashboard Siswa" />

            <div className="flex flex-col gap-8 p-8 pb-[610px]">
                {/* ── Welcome Header ── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Selamat Datang, {user.name}</h1>
                    <p className="text-sm leading-[21px] text-[#444651]">
                        Pantau status pengajuan beasiswa Anda dan lengkapi berkas yang diperlukan untuk meningkatkan peluang kelulusan seleksi Metode
                        SMART.
                    </p>
                </div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* ── Application Status Card (span 8) ── */}
                    <div className="flex flex-col gap-6 rounded-lg border border-[#C5C5D3] bg-white p-6 lg:col-span-8">
                        {/* Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl leading-7 font-semibold text-[#191C1E]">Status Pengajuan</h3>
                                <p className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                    Beasiswa Prestasi Akademik 2025/2025
                                </p>
                            </div>
                            <span
                                className="inline-flex w-fit items-center rounded-xl px-4 py-1.5 text-xs font-bold tracking-[0.05em] uppercase"
                                style={{ backgroundColor: badge.bg, color: badge.color }}
                            >
                                {badge.label}
                            </span>
                        </div>

                        {/* Progress Stepper — 3 tahap */}
                        <div className="relative px-4 pt-2 pb-2">
                            {/* Progress bar background */}
                            <div className="absolute top-[39px] right-4 left-4 h-0.5 bg-[#E6E8EA]" />
                            {/* Progress bar fill */}
                            <div
                                className="absolute top-[39px] left-4 h-0.5 bg-[#00236F] transition-all duration-500"
                                style={{ width: `calc(${progressWidth()} - 16px)` }}
                            />

                            <div className="relative flex justify-between">
                                {stepData.map((step) => (
                                    <div key={step.label} className="flex flex-col items-center gap-3">
                                        {/* Circle */}
                                        <div
                                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl ${
                                                step.status === 'completed'
                                                    ? 'bg-[#00236F]'
                                                    : step.status === 'active'
                                                      ? 'bg-[#00236F] ring-4 ring-[#F7F9FB]'
                                                      : 'bg-[#E0E3E5]'
                                            }`}
                                        >
                                            <step.icon className={`${step.status === 'pending' ? 'h-5 w-5 text-[#757682]' : 'h-5 w-5 text-white'}`} />
                                        </div>
                                        {/* Label */}
                                        <span
                                            className={`text-center text-xs font-semibold tracking-[0.05em] uppercase ${
                                                step.status === 'active'
                                                    ? 'text-[#00236F]'
                                                    : step.status === 'completed'
                                                      ? 'text-[#191C1E]'
                                                      : 'text-[#757682]'
                                            }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Box — dinamis per stage */}
                        <div
                            className={`rounded border-l-4 p-4 ${
                                stage === 'pengumuman'
                                    ? isLolos
                                        ? 'border-[#10B981] bg-[#10B981]/5'
                                        : 'border-[#EF4444] bg-[#EF4444]/5'
                                    : 'border-[#00236F] bg-[#F2F4F6]'
                            }`}
                        >
                            {infoMessage()}
                        </div>
                    </div>

                    {/* ── Quick Action Card (span 4) ── */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-lg bg-[#00236F] p-6 lg:col-span-4">
                        <div className="pointer-events-none absolute right-0 bottom-0 opacity-10">
                            <HelpCircle className="h-[120px] w-[133px] text-white" />
                        </div>

                        <div className="flex flex-col gap-2 pb-6">
                            <h3 className="text-xl leading-7 font-semibold text-white">Butuh Bantuan?</h3>
                            <p className="text-sm leading-[21px] text-white/80">
                                Jika Anda memiliki kendala dalam proses pendaftaran atau verifikasi, silakan hubungi tim sekretariat beasiswa.
                            </p>
                        </div>

                        <button className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-base font-bold text-[#00236F] transition-colors hover:bg-blue-50">
                            <MessageCircle className="h-5 w-5" />
                            Hubungi Admin
                        </button>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}
