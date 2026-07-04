import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Download, Printer, Search, Users, Wallet } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/kepala-sekolah/laporan' },
    { title: 'Laporan Akhir', href: '/kepala-sekolah/laporan' },
];

interface Penilaian {
    id: number;
    ranking?: number;
    nilai_akhir?: number;
    status_approval?: string;
    approved_by?: number | null;
    approved_at?: string | null;
    siswa?: {
        id: number;
        nama_siswa: string;
        nisn: string;
        jurusan: string;
        kelas: string;
    };
}

export default function LaporanKepalaSekolah() {
    const { penilaians } = usePage<{ penilaians: Penilaian[]; [key: string]: unknown }>().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [jurusanFilter, setJurusanFilter] = useState('semua');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const jurusanList = [...new Set((penilaians || []).map((p) => p.siswa?.jurusan).filter(Boolean))];

    const filteredData = (penilaians || []).filter((p) => {
        const s = p.siswa;
        const matchSearch = !searchQuery || s?.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase()) || s?.nisn?.includes(searchQuery);
        const matchJurusan = jurusanFilter === 'semua' || s?.jurusan === jurusanFilter;
        return matchSearch && matchJurusan;
    });

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);
    const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, filteredData.length);

    const totalPendaftar = penilaians?.length || 0;
    const rataRataNilai = totalPendaftar > 0 ? (penilaians?.reduce((sum, p) => sum + (p.nilai_akhir || 0), 0) / totalPendaftar).toFixed(3) : '0.000';

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('ellipsis');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Admin Sistem">
            <Head title="Laporan Hasil Seleksi Akhir" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Page Header ── */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Laporan Hasil Seleksi Akhir</h1>
                        <p className="mt-1 max-w-2xl text-sm leading-[21px] text-[#444651]">
                            Penentuan penerima beasiswa berdasarkan metode SMART (Simple Multi-Attribute Rating Technique). Silakan periksa hasil
                            pemeringkatan dan lakukan persetujuan akhir.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 rounded border border-[#C5C5D3] bg-white px-5 py-2.5 text-sm font-semibold text-[#00236F] shadow-sm transition-colors hover:bg-[#F2F4F6]">
                            <Printer className="h-4 w-5 text-[#00236F]" />
                            <span className="text-left leading-[14px]">
                                Cetak
                                <br />
                                Laporan
                            </span>
                        </button>
                        <button className="inline-flex items-center gap-2 rounded bg-[#00236F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#001B59]">
                            <Download className="h-4 w-4" />
                            <span className="text-left leading-[14px]">
                                Ekspor
                                <br />
                                PDF
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">TOTAL PENDAFTAR</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl leading-[31.2px] font-bold text-[#00236F]">{totalPendaftar}</span>
                            <Users className="h-3 w-6 text-[#757682]" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">QUOTA BEASISWA</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl leading-[31.2px] font-bold text-[#00236F]">25</span>
                            <Wallet className="h-5 w-4 text-[#757682]" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">RATA-RATA NILAI</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl leading-[31.2px] font-bold text-[#00236F]">{rataRataNilai}</span>
                            <Wallet className="h-3 w-5 text-[#757682]" />
                        </div>
                    </div>
                </div>

                {/* ── Ranking Table ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    {/* Filter Bar */}
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#F2F4F6] px-6 py-4 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                                <Search className="h-[15px] w-[15px] text-[#757682]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari nama atau NISN..."
                                className="w-full rounded border border-[#C5C5D3] bg-white py-[10px] pr-4 pl-10 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <select
                                value={jurusanFilter}
                                onChange={(e) => {
                                    setJurusanFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="rounded border border-[#C5C5D3] bg-white px-3 py-2 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                            >
                                <option value="semua">Semua Jurusan</option>
                                {jurusanList.map((j) => (
                                    <option key={j} value={j}>
                                        {j}
                                    </option>
                                ))}
                            </select>
                            <select className="rounded border border-[#C5C5D3] bg-white px-3 py-2 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]">
                                <option>Semua Status</option>
                                <option>Pending</option>
                                <option>Disetujui</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Header */}
                        <div className="flex items-center bg-[#00236F] px-6 py-4">
                            <span className="w-[60px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">RANK</span>
                            <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA LENGKAP</span>
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">NISN</span>
                            <span className="w-[100px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KELAS</span>
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">JURUSAN</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">SKOR AKHIR</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">STATUS</span>
                            <span className="w-[80px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">AKSI</span>
                        </div>

                        {/* Body */}
                        {paginatedData.length === 0 ? (
                            <div className="px-6 py-16 text-center text-sm text-[#6B7280]">Tidak ada data yang ditemukan.</div>
                        ) : (
                            <div className="divide-y divide-[#E2E8F0]">
                                {paginatedData.map((p, idx) => {
                                    const s = p.siswa;
                                    const rank = p.ranking || idx + 1;
                                    // Top 3 get a subtle green highlight
                                    const isGreenBg = rank <= 3;
                                    const rowStyle = isGreenBg ? 'bg-[#10B981]/5' : '';

                                    return (
                                        <div key={p.id} className={`flex items-center px-6 py-3 transition-colors hover:bg-[#F8FAFC] ${rowStyle}`}>
                                            {/* Rank */}
                                            <span
                                                className={`w-[60px] text-center text-sm leading-[19.6px] font-bold ${
                                                    rank <= 3 ? 'text-[#00236F]' : 'text-[#505F76]'
                                                }`}
                                            >
                                                #{rank}
                                            </span>

                                            {/* Nama */}
                                            <span className="flex-1 text-sm leading-[19.6px] font-semibold text-[#191C1E]">
                                                {s?.nama_siswa || '-'}
                                            </span>

                                            {/* NISN */}
                                            <span className="w-[120px] text-sm leading-[19.6px] text-[#444651]">{s?.nisn || '-'}</span>

                                            {/* Kelas */}
                                            <span className="w-[100px] text-sm leading-[19.6px] text-[#444651]">{s?.kelas || '-'}</span>

                                            {/* Jurusan */}
                                            <span className="w-[120px] text-sm leading-[19.6px] text-[#444651]">{s?.jurusan || '-'}</span>

                                            {/* Skor Akhir */}
                                            <div className="flex w-[100px] items-center justify-center py-1">
                                                <span className="text-sm leading-[19.6px] font-bold text-[#00236F]">
                                                    {p.nilai_akhir?.toFixed(3) || '-'}
                                                </span>
                                            </div>

                                            {/* Status */}
                                            <div className="flex w-[100px] items-center justify-center">
                                                {p.status_approval === 'approved' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#10B981]/20 px-3 py-1 text-[10px] leading-[14px] font-bold text-[#10B981] uppercase">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Disetujui
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#F59E0B]/10 px-3 py-1 text-[10px] leading-[14px] font-bold text-[#F59E0B] uppercase">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>

                                            {/* Aksi */}
                                            <div className="flex w-[80px] items-center justify-start">
                                                {p.status_approval === 'approved' ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-[#10B981]">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Sudah
                                                    </span>
                                                ) : (
                                                    <ApproveButton penilaianId={p.id} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] bg-white px-6 py-4 md:flex-row">
                        <p className="text-sm leading-[21px] font-bold text-[#444651]">
                            Showing <span className="font-bold text-[#191C1E]">{startEntry}</span> to{' '}
                            <span className="font-bold text-[#191C1E]">{endEntry}</span> of{' '}
                            <span className="font-bold text-[#191C1E]">{filteredData.length}</span> entries
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Prev */}
                            <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </PageBtn>

                            {getPageNumbers().map((page, i) =>
                                page === 'ellipsis' ? (
                                    <span key={`e-${i}`} className="px-2 text-base leading-[24px] text-[#444651]">
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

/* ── Inline Approve Button with POST ── */
function ApproveButton({ penilaianId }: { penilaianId: number }) {
    const { post, processing } = useForm({});

    const handleApprove: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kepala-sekolah.approve', penilaianId));
    };

    return (
        <form onSubmit={handleApprove}>
            <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-1 rounded bg-[#00236F] px-4 py-1.5 text-xs leading-[16.8px] font-medium text-white transition-colors hover:bg-[#001B59] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? '...' : 'Setujui'}
            </button>
        </form>
    );
}

/* ── Page Button ── */
function PageBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex h-10 w-10 items-center justify-center rounded text-base font-bold transition-colors disabled:cursor-not-allowed ${
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
