import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye, Search, SlidersHorizontal, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/staf-tu/dashboard' },
    { title: 'Data Siswa', href: '/staf-tu/data-siswa' },
];

interface SiswaItem {
    id: number;
    nisn: string;
    nama_siswa: string;
    jurusan: string;
    kelas: string;
}

const AVATAR_COLORS = [
    { bg: '#DCE1FF', text: '#00164E' },
    { bg: '#DAE2FD', text: '#131B2E' },
    { bg: '#D3E4FE', text: '#0B1C30' },
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#D1FAE5', text: '#065F46' },
];

export default function DataSiswa() {
    const { siswa } = usePage<{ siswa: SiswaItem[] }>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const filteredData = (siswa || []).filter(
        (s) =>
            s.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn?.includes(searchQuery) ||
            s.jurusan?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Admin Sistem">
            <Head title="Kelola Data Siswa" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Page Header ── */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Kelola Data Siswa</h1>
                        <p className="mt-1 max-w-lg text-base leading-[25.6px] text-[#444651]">
                            Manajemen data profil dan akademik siswa pendaftar beasiswa.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded bg-[#00236F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#001B59]">
                        <UserPlus className="h-[14px] w-[14px]" />
                        Tambah Siswa
                    </button>
                </div>

                {/* ── Data Table Card ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    {/* Controls */}
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] px-4 py-4 sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="relative w-full sm:w-96">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                                <Search className="h-[18px] w-[18px] text-[#757682]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari nama, NISN, atau jurusan..."
                                className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] py-[10px] pr-4 pl-10 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                            />
                        </div>

                        {/* Filter + Export */}
                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-2 rounded border border-[#C5C5D3] px-4 py-2 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]">
                                <SlidersHorizontal className="h-[15px] w-[15px]" />
                                Filter
                            </button>
                            <button className="inline-flex items-center gap-2 rounded border border-[#C5C5D3] px-4 py-2 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]">
                                <Download className="h-[13.33px] w-[13.33px]" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {/* Table Header */}
                        <div className="flex min-w-[800px] items-center bg-[#00236F] px-6 py-4">
                            <span className="w-[140px] text-xs font-semibold tracking-[0.05em] text-white uppercase">ID SISWA</span>
                            <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA LENGKAP</span>
                            <span className="w-[130px] text-xs font-semibold tracking-[0.05em] text-white uppercase">NISN</span>
                            <span className="w-[100px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KELAS</span>
                            <span className="w-[130px] text-xs font-semibold tracking-[0.05em] text-white uppercase">JURUSAN</span>
                            <span className="flex w-[120px] items-center justify-center text-xs font-semibold tracking-[0.05em] text-white uppercase">
                                AKSI
                            </span>
                        </div>

                        {/* Table Body */}
                        {paginatedData.length === 0 ? (
                            <div className="px-6 py-16 text-center text-sm text-[#6B7280]">
                                {searchQuery ? 'Tidak ada hasil untuk pencarian Anda.' : 'Belum ada data siswa.'}
                            </div>
                        ) : (
                            <div className="divide-y divide-[#E2E8F0]">
                                {paginatedData.map((s, idx) => {
                                    const colorIdx = (currentPage - 1) * perPage + idx;
                                    const avatar = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
                                    const rowBg = colorIdx % 2 === 1 ? 'bg-[#F2F4F6]/60' : '';

                                    return (
                                        <div
                                            key={s.id}
                                            className={`flex min-w-[800px] items-center px-6 py-3 transition-colors hover:bg-[#F8FAFC] ${rowBg}`}
                                        >
                                            <span className="w-[140px] text-sm leading-[19.6px] font-bold text-[#00236F]">
                                                #SW-{String(s.id).padStart(4, '0')}
                                            </span>
                                            <div className="flex flex-1 items-center gap-3">
                                                <div
                                                    className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold"
                                                    style={{ backgroundColor: avatar.bg, color: avatar.text }}
                                                >
                                                    {getInitials(s.nama_siswa)}
                                                </div>
                                                <span className="text-sm leading-[19.6px] font-semibold text-[#191C1E]">{s.nama_siswa}</span>
                                            </div>
                                            <span className="w-[130px] text-sm leading-[19.6px] text-[#444651]">{s.nisn || '-'}</span>
                                            <span className="w-[100px] text-sm leading-[19.6px] text-[#444651]">{s.kelas || '-'}</span>
                                            <span className="w-[130px] text-sm leading-[19.6px] text-[#444651]">{s.jurusan || '-'}</span>
                                            <div className="flex w-[120px] items-center justify-center gap-1">
                                                <button className="flex h-8 w-8 items-center justify-center rounded text-[#3B82F6] transition-colors hover:bg-[#F2F4F6]">
                                                    <Eye className="h-4 w-[16.67px]" />
                                                </button>
                                                <button className="flex h-8 w-8 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-[#F2F4F6]">
                                                    <Trash2 className="h-[14.99px] w-[15.83px]" />
                                                </button>
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
                            Showing {startEntry} to {endEntry} of {filteredData.length} entries
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Prev Button */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="flex h-10 w-10 items-center justify-center rounded border border-[#C5C5D3] bg-white text-sm font-bold text-[#191C1E] transition-colors hover:bg-[#F2F4F6] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`flex h-10 w-10 items-center justify-center rounded text-sm font-semibold transition-colors ${
                                            pageNum === currentPage
                                                ? 'bg-[#00236F] text-white'
                                                : 'border border-[#C5C5D3] bg-white text-[#191C1E] hover:bg-[#F2F4F6]'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Next Button */}
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="flex h-10 w-10 items-center justify-center rounded border border-[#C5C5D3] bg-white text-sm font-bold text-[#191C1E] transition-colors hover:bg-[#F2F4F6] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaSidebarLayout>
    );
}
