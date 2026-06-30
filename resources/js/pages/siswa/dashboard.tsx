import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck, Calculator, Check, FileSearch, HelpCircle, MessageCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'Ringkasan', href: '/siswa/dashboard' },
];

const steps = [
    { label: 'Pendaftaran', icon: Check, status: 'completed' as const },
    { label: 'Verifikasi', icon: FileSearch, status: 'active' as const },
    { label: 'Perhitungan SMART', icon: Calculator, status: 'pending' as const },
    { label: 'Pengumuman', icon: BadgeCheck, status: 'pending' as const },
];

export default function SiswaDashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Siswa Dashboard">
            <Head title="Dashboard Siswa" />

            <div className="p-8 pb-[610px]">
                <div className="flex flex-col gap-10">
                    {/* ── Welcome Header ── */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Selamat Datang, {user.name}</h1>
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Pantau status pengajuan beasiswa Anda dan lengkapi berkas yang diperlukan untuk meningkatkan peluang kelulusan seleksi
                            Metode SMART.
                        </p>
                    </div>

                    {/* ── Bento Grid ── */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* ── Application Status Card (span 8) ── */}
                        <div className="flex flex-col gap-8 rounded-lg border border-[#C5C5D3] bg-white p-6 lg:col-span-8">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl leading-7 font-semibold text-[#191C1E]">Status Pengajuan</h3>
                                    <p className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                        Beasiswa Prestasi Akademik 2024
                                    </p>
                                </div>
                                <span className="rounded-xl bg-[#F59E0B]/10 px-4 py-1.5 text-xs font-bold tracking-[0.05em] text-[#F59E0B] uppercase">
                                    BERKAS SEDANG DIVERIFIKASI
                                </span>
                            </div>

                            {/* Progress Stepper */}
                            <div className="relative px-4 pb-2">
                                {/* Progress bar background */}
                                <div className="absolute top-[31px] right-4 left-4 h-0.5 bg-[#E6E8EA]" />
                                {/* Progress bar fill (1/3 done) */}
                                <div className="absolute top-[31px] left-4 h-0.5 w-[calc(33.33%-16px)] bg-[#00236F]" />

                                <div className="relative flex justify-between">
                                    {steps.map((step) => (
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
                                                <step.icon
                                                    className={`${
                                                        step.status === 'pending'
                                                            ? 'h-[10.5px] w-[10.5px] text-[#757682]'
                                                            : 'h-[10px] w-[10px] text-white'
                                                    }`}
                                                />
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

                            {/* Info Box */}
                            <div className="rounded border-l-4 border-[#00236F] bg-[#F2F4F6] p-4">
                                <p className="text-sm leading-[21px] text-[#444651] italic">
                                    &ldquo;Berkas Anda telah diterima oleh Staf TU dan sedang dalam tahap pemeriksaan keaslian dokumen. Mohon periksa
                                    dashboard secara berkala.&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* ── Quick Action Card (span 4) ── */}
                        <div className="relative flex flex-col justify-between overflow-hidden rounded-lg bg-[#00236F] p-6 lg:col-span-4">
                            {/* Decorative element */}
                            <div className="pointer-events-none absolute right-0 bottom-0 opacity-10">
                                <HelpCircle className="h-[120px] w-[133px] text-white" />
                            </div>

                            <div className="flex flex-col gap-2 pb-6">
                                <h3 className="text-xl leading-7 font-semibold text-white">Butuh Bantuan?</h3>
                                <p className="text-sm leading-[21px] text-white/80">
                                    Jika Anda memiliki kendala dalam mengunggah berkas, silakan hubungi tim sekretariat beasiswa.
                                </p>
                            </div>

                            <button className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-base font-bold text-[#00236F] transition-colors hover:bg-blue-50">
                                <MessageCircle className="h-5 w-5" />
                                Hubungi Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}
