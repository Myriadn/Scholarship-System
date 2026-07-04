import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ClipboardList, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/staf-tu/dashboard' },
    { title: 'Beranda', href: '/staf-tu/dashboard' },
];

interface SiswaItem {
    id: number;
    nisn: string;
    nama_siswa: string;
    jurusan: string;
    kelas: string;
    penilaian_beasiswa?: { nilai_akhir_vi?: number; ranking?: number } | null;
}

export default function StafTUDashboard() {
    const { siswa } = usePage<{ siswa: SiswaItem[] }>().props;

    const totalPendaftar = siswa?.length || 0;
    const terverifikasi = siswa?.filter((s) => s.penilaian_beasiswa?.nilai_akhir_vi).length || 0;
    const belumVerifikasi = totalPendaftar - terverifikasi;

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Admin Sistem">
            <Head title="Dashboard Staf TU" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Welcome Header ── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Manajemen Beasiswa</h1>
                    <p className="text-sm leading-[21px] text-[#444651]">
                        Kelola verifikasi berkas dan hitung skor akhir beasiswa menggunakan metode SMART.
                    </p>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Pendaftar */}
                    <div className="flex flex-col gap-2 rounded border border-[#E2E8F0] bg-white p-6">
                        <Users className="h-4 w-4 text-[#191C1E]" />
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">TOTAL PENDAFTAR</span>
                        <span className="text-2xl leading-[31.2px] font-semibold text-[#191C1E]">{totalPendaftar.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-2 w-[13.33px] text-[#10B981]" />
                            <span className="text-xs font-semibold tracking-[0.05em] text-[#10B981]">+12% dr bln lalu</span>
                        </div>
                    </div>

                    {/* Belum Verifikasi */}
                    <div className="flex flex-col gap-2 rounded border border-[#E2E8F0] bg-white p-6">
                        <ClipboardList className="h-[21px] w-[21px] text-[#F59E0B]" />
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">BELUM VERIFIKASI</span>
                        <span className="text-2xl leading-[31.2px] font-semibold text-[#191C1E]">{belumVerifikasi}</span>
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651]">Perlu tindakan segera</span>
                    </div>

                    {/* Terverifikasi */}
                    <div className="flex flex-col gap-2 rounded border border-[#E2E8F0] bg-white p-6">
                        <UserCheck className="h-[21px] w-[21px] text-[#10B981]" />
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">TERVERIFIKASI</span>
                        <span className="text-2xl leading-[31.2px] font-semibold text-[#191C1E]">{terverifikasi.toLocaleString()}</span>
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651]">Sudah masuk database</span>
                    </div>

                    {/* Kuota Tersedia */}
                    <div className="flex flex-col gap-2 rounded border border-[#E2E8F0] bg-white p-6">
                        <Wallet className="h-5 w-5 text-[#3B82F6]" />
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">KUOTA TERSEDIA</span>
                        <span className="text-2xl leading-[31.2px] font-semibold text-[#191C1E]">150</span>
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651]">Tahun Pelajaran 2025</span>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}
