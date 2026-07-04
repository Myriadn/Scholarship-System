import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ClipboardList, Eye, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react';

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
    penilaian_beasiswa?: { nilai_akhir?: number; ranking?: number } | null;
}

export default function StafTUDashboard() {
    const { siswa } = usePage<{ siswa: SiswaItem[] }>().props;

    const totalPendaftar = siswa?.length || 0;
    const terverifikasi = siswa?.filter((s) => s.penilaian_beasiswa?.nilai_akhir).length || 0;
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
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651]">Tahun Pelajaran 2024</span>
                    </div>
                </div>

                {/* ── Tabel Data Siswa ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    {/* Tabel Header */}
                    <div className="flex items-center bg-[#00236F] px-6 py-4">
                        <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">ID SISWA</span>
                        <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA LENGKAP</span>
                        <span className="w-[100px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KELAS</span>
                        <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">JURUSAN</span>
                        <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">STATUS</span>
                        <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">NILAI AKHIR</span>
                        <span className="w-[80px] text-right text-xs font-semibold tracking-[0.05em] text-white uppercase">AKSI</span>
                    </div>

                    {/* Tabel Body */}
                    {!siswa || siswa.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-[#6B7280]">Belum ada data pendaftar.</div>
                    ) : (
                        <div className="divide-y divide-[#E2E8F0]">
                            {siswa.slice(0, 5).map((s, idx) => {
                                const initials = s.nama_siswa
                                    ? s.nama_siswa
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .slice(0, 2)
                                          .toUpperCase()
                                    : '--';
                                const avatarColors = ['#DCE1FF', '#DAE2FD', '#D3E4FE', '#FEF3C7', '#D1FAE5'];
                                const avatarColor = avatarColors[idx % avatarColors.length];
                                const textColor = ['#00164E', '#131B2E', '#0B1C30', '#92400E', '#065F46'][idx % 5];
                                const hasNilai = s.penilaian_beasiswa?.nilai_akhir != null;

                                return (
                                    <div
                                        key={s.id}
                                        className={`flex items-center px-6 py-3 transition-colors hover:bg-[#F8FAFC] ${
                                            idx % 2 === 1 ? 'bg-[#F2F4F6]/60' : ''
                                        }`}
                                    >
                                        <span className="w-[120px] text-sm leading-[19.6px] font-bold text-[#00236F]">
                                            #SW-{String(s.id).padStart(4, '0')}
                                        </span>
                                        <div className="flex flex-1 items-center gap-3">
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold"
                                                style={{ backgroundColor: avatarColor, color: textColor }}
                                            >
                                                {initials}
                                            </div>
                                            <span className="text-sm leading-[19.6px] font-semibold text-[#191C1E]">{s.nama_siswa}</span>
                                        </div>
                                        <span className="w-[100px] text-sm leading-[19.6px] text-[#444651]">{s.kelas || '-'}</span>
                                        <span className="w-[120px] text-sm leading-[19.6px] text-[#444651]">{s.jurusan || '-'}</span>
                                        <div className="flex w-[100px] items-center justify-center">
                                            <span
                                                className={`inline-block rounded-xl px-3 py-1 text-[11px] leading-[16.5px] font-bold ${
                                                    hasNilai
                                                        ? 'bg-[#10B981]/10 text-[#10B981] ring-1 ring-[#10B981]/20'
                                                        : 'bg-[#F59E0B]/10 text-[#F59E0B] ring-1 ring-[#F59E0B]/20'
                                                }`}
                                            >
                                                {hasNilai ? 'VERIFIED' : 'PENDING'}
                                            </span>
                                        </div>
                                        <div className="flex w-[100px] items-center justify-center">
                                            <span className="text-sm leading-[21px] font-bold text-[#00236F]">
                                                {hasNilai ? s.penilaian_beasiswa!.nilai_akhir!.toFixed(3) : '-'}
                                            </span>
                                        </div>
                                        <div className="flex w-[80px] items-center justify-end gap-2">
                                            <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#3B82F6] transition-colors hover:bg-[#F2F4F6]">
                                                <Eye className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination Info */}
                    <div className="border-t border-[#E2E8F0] bg-[#F2F4F6] px-6 py-3">
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Menampilkan 1-{Math.min(5, totalPendaftar)} dari {totalPendaftar} data
                        </p>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}
