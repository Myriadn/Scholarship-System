import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Edit2, Eye, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/staf-tu/dashboard' },
    { title: 'Verifikasi Berkas', href: '/staf-tu/verifikasi-berkas' },
];

interface Penilaian {
    nilai_akhir?: number;
    ranking?: number;
    // other fields...
}

interface SiswaItem {
    id: number;
    nisn: string;
    nama_siswa: string;
    jurusan: string;
    kelas: string;
    penilaian_beasiswa?: Penilaian | null;
}

type StatusFilter = 'semua' | 'verified' | 'pending' | 'rejected';

const AVATAR_COLORS = [
    { bg: '#DCE1FF', text: '#00164E' },
    { bg: '#DAE2FD', text: '#131B2E' },
    { bg: '#D3E4FE', text: '#0B1C30' },
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#D1FAE5', text: '#065F46' },
];

export default function VerifikasiBerkas() {
    const { siswa } = usePage<{ siswa: SiswaItem[] }>().props;
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('semua');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const getStatus = (s: SiswaItem): 'verified' | 'pending' | 'rejected' => {
        const pn = s.penilaian_beasiswa;
        if (!pn?.nilai_akhir) return 'pending';
        return 'verified';
    };

    const getStatusLabel = (s: SiswaItem) => {
        const st = getStatus(s);
        if (st === 'verified') return 'VERIFIED';
        if (st === 'rejected') return 'REJECTED';
        return 'PENDING';
    };

    const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
        verified: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', border: 'rgba(16, 185, 129, 0.2)' },
        pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' },
        rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' },
    };

    const filteredData = (siswa || []).filter((s) => {
        const matchStatus = statusFilter === 'semua' || getStatus(s) === statusFilter;
        return matchStatus;
    });

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);
    const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, filteredData.length);

    const getInitials = (name: string) =>
        name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || '--';

    const pageNumbers = () => {
        const pages: number[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push(-1); // ellipsis
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push(-1);
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push(-1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push(-1);
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Admin Sistem">
            <Head title="Verifikasi Berkas Siswa" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Page Header ── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Verifikasi Berkas Siswa</h1>
                    <p className="text-sm leading-[21px] text-[#444651]">
                        Kelola verifikasi berkas dan hitung skor akhir beasiswa menggunakan metode SMART.
                    </p>
                </div>

                {/* ── Table Section ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    {/* Filters Bar */}
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#F2F4F6] px-4 py-3 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-[12px] w-[18px] text-[#444651]" />
                                <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">FILTER:</span>
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as StatusFilter);
                                    setCurrentPage(1);
                                }}
                                className="rounded border border-[#C5C5D3] bg-white px-3 py-1.5 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                            >
                                <option value="semua">Semua Status</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <select className="rounded border border-[#C5C5D3] bg-white px-3 py-1.5 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]">
                                <option>Tahun 2024</option>
                                <option>Tahun 2025</option>
                            </select>
                        </div>

                        <button className="inline-flex items-center gap-2 rounded bg-[#505F76] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3D4A5E]">
                            <Download className="h-4 w-4" />
                            Ekspor .CSV
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Header */}
                        <div className="flex items-center bg-[#00236F] px-6 py-4">
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">ID SISWA</span>
                            <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA LENGKAP</span>
                            <span className="w-[100px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KELAS</span>
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">JURUSAN</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">STATUS</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">NILAI AKHIR</span>
                            <span className="w-[80px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">AKSI</span>
                        </div>

                        {/* Body */}
                        {paginatedData.length === 0 ? (
                            <div className="px-6 py-16 text-center text-sm text-[#6B7280]">Belum ada data verifikasi.</div>
                        ) : (
                            <div className="divide-y divide-[#E2E8F0]">
                                {paginatedData.map((s, idx) => {
                                    const globalIdx = (currentPage - 1) * perPage + idx;
                                    const rowBg = globalIdx % 2 === 1 ? 'bg-[#F2F4F6]/60' : '';
                                    const avatar = AVATAR_COLORS[globalIdx % AVATAR_COLORS.length];
                                    const status = getStatus(s);
                                    const style = statusStyle[status];
                                    const nilai = s.penilaian_beasiswa?.nilai_akhir;

                                    return (
                                        <div key={s.id} className={`flex items-center px-6 py-3 transition-colors hover:bg-[#F8FAFC] ${rowBg}`}>
                                            {/* ID */}
                                            <span className="w-[120px] font-mono text-[13px] leading-[19.5px] text-[#191C1E]">
                                                #SMK-2024-{String(s.id).padStart(3, '0')}
                                            </span>

                                            {/* Nama */}
                                            <div className="flex flex-1 items-center gap-3">
                                                <div
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                                                    style={{ backgroundColor: avatar.bg, color: avatar.text }}
                                                >
                                                    {getInitials(s.nama_siswa)}
                                                </div>
                                                <span className="text-sm leading-[19.6px] font-semibold text-[#191C1E]">{s.nama_siswa}</span>
                                            </div>

                                            {/* Kelas */}
                                            <span className="w-[100px] text-sm leading-[19.6px] text-[#444651]">{s.kelas || '-'}</span>

                                            {/* Jurusan */}
                                            <span className="w-[120px] text-sm leading-[19.6px] text-[#444651]">{s.jurusan || '-'}</span>

                                            {/* Status Badge */}
                                            <div className="flex w-[100px] items-center justify-center gap-2">
                                                <span
                                                    className="inline-block rounded-xl px-3 py-[2.5px] text-[11px] leading-[16.5px] font-bold"
                                                    style={{
                                                        backgroundColor: style.bg,
                                                        color: style.text,
                                                        border: `1px solid ${style.border}`,
                                                    }}
                                                >
                                                    {getStatusLabel(s)}
                                                </span>
                                            </div>

                                            {/* Nilai Akhir */}
                                            <div className="flex w-[100px] items-center justify-center">
                                                <span className="text-sm leading-[21px] font-bold text-[#00236F]">
                                                    {nilai != null ? nilai.toFixed(3) : '-'}
                                                </span>
                                            </div>

                                            {/* Aksi */}
                                            <div className="flex w-[80px] items-center justify-center text-center">
                                                {status === 'verified' && (
                                                    <>
                                                        <ActionBtn>
                                                            <Eye className="h-[15px] w-[22px] text-[#00236F]" />
                                                        </ActionBtn>
                                                        <ActionBtn>
                                                            <Edit2 className="h-5 w-[18px] text-[#444651]" />
                                                        </ActionBtn>
                                                    </>
                                                )}
                                                {status === 'pending' && (
                                                    <button className="inline-flex items-center gap-1 rounded bg-[#00236F] px-3 py-1 text-xs font-semibold tracking-[0.05em] text-white transition-colors hover:bg-[#001B59]">
                                                        Verifikasi
                                                    </button>
                                                )}
                                                {status === 'rejected' && (
                                                    <ActionBtn>
                                                        <Eye className="h-5 w-5 text-[#444651]" />
                                                    </ActionBtn>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] bg-[#F2F4F6] px-4 py-3 sm:flex-row">
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Menampilkan {startEntry}-{endEntry} dari {filteredData.length} data
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Prev */}
                            <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </PageBtn>

                            {/* Pages */}
                            {pageNumbers().map((page, i) =>
                                page === -1 ? (
                                    <span key={`ellipsis-${i}`} className="px-1 text-sm font-semibold text-[#444651]">
                                        ...
                                    </span>
                                ) : (
                                    <PageBtn key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </PageBtn>
                                ),
                            )}

                            {/* Next */}
                            <PageBtn
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </PageBtn>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}

/* ── Reusable Sub-components ── */

function ActionBtn({ children }: { children: React.ReactNode }) {
    return <button className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-[#F2F4F6]">{children}</button>;
}

function PageBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex h-10 w-10 items-center justify-center rounded text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                active
                    ? 'bg-[#00236F] text-white'
                    : disabled
                      ? 'cursor-not-allowed border border-[#C5C5D3] bg-white text-[#191C1E] opacity-50'
                      : 'border border-[#C5C5D3] bg-white text-[#191C1E] hover:bg-[#F2F4F6]'
            }`}
        >
            {children}
        </button>
    );
}
