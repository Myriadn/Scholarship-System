import InputError from '@/components/input-error';
import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Download, Eye, Search, SlidersHorizontal, Trash2, UserPlus, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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

const KELAS_OPTIONS = ['X (Sepuluh)', 'XI (Sebelas)', 'XII (Dua Belas)'];

export default function DataSiswa() {
    const { siswa } = usePage<{ siswa: SiswaItem[] }>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [viewSiswa, setViewSiswa] = useState<SiswaItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<SiswaItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const { data, setData, post, processing, errors, reset } = useForm({
        nisn: '',
        nama_siswa: '',
        jurusan: '',
        kelas: '',
    });

    const jurusanList = [...new Set((siswa || []).map((s) => s.jurusan).filter(Boolean))];

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

    const openModal = () => {
        reset();
        setModalOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('staf-tu.siswa.store'), {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    const confirmDelete = (s: SiswaItem) => {
        setDeleteConfirm(s);
    };

    const executeDelete = () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        router.post(
            route('staf-tu.siswa.delete', deleteConfirm.id),
            {},
            {
                onFinish: () => {
                    setDeleting(false);
                    setDeleteConfirm(null);
                },
            },
        );
    };

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
                    <button
                        onClick={openModal}
                        className="inline-flex items-center gap-2 rounded bg-[#00236F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#001B59]"
                    >
                        <UserPlus className="h-[14px] w-[14px]" />
                        Tambah Siswa
                    </button>
                </div>

                {/* ── Modal Tambah Siswa ── */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-lg rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                                <h2 className="text-lg font-bold text-[#191C1E]">Tambah Siswa Baru</h2>
                                <button onClick={() => setModalOpen(false)} className="text-[#757682] transition-colors hover:text-[#191C1E]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">NISN</label>
                                    <input
                                        type="text"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                        placeholder="0082716253"
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    />
                                    <InputError message={errors.nisn} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.nama_siswa}
                                        onChange={(e) => setData('nama_siswa', e.target.value)}
                                        placeholder="Ahmad Fauzi"
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    />
                                    <InputError message={errors.nama_siswa} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Jurusan</label>
                                    <select
                                        value={data.jurusan}
                                        onChange={(e) => setData('jurusan', e.target.value)}
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        {jurusanList.map((j) => (
                                            <option key={j} value={j}>
                                                {j}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.jurusan} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Kelas</label>
                                    <select
                                        value={data.kelas}
                                        onChange={(e) => setData('kelas', e.target.value)}
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    >
                                        <option value="">Pilih Kelas</option>
                                        {KELAS_OPTIONS.map((k) => (
                                            <option key={k} value={k}>
                                                {k}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.kelas} />
                                </div>
                                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="rounded border border-[#C5C5D3] px-5 py-2.5 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-[#00236F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001B59] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Modal Detail Siswa ── */}
                {viewSiswa && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-md rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                                <h2 className="text-lg font-bold text-[#191C1E]">Detail Siswa</h2>
                                <button onClick={() => setViewSiswa(null)} className="text-[#757682] transition-colors hover:text-[#191C1E]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="px-6 py-6">
                                <div className="mb-4 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DCE1FF] text-lg font-bold text-[#00164E]">
                                        {getInitials(viewSiswa.nama_siswa)}
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-[#191C1E]">{viewSiswa.nama_siswa}</p>
                                        <p className="text-sm text-[#444651]">#{viewSiswa.nisn}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 rounded bg-[#F2F4F6] p-4 text-sm">
                                    <div>
                                        <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">ID</span>
                                        <p className="font-medium text-[#191C1E]">#SW-{String(viewSiswa.id).padStart(4, '0')}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">NISN</span>
                                        <p className="font-medium text-[#191C1E]">{viewSiswa.nisn}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">KELAS</span>
                                        <p className="font-medium text-[#191C1E]">{viewSiswa.kelas}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">JURUSAN</span>
                                        <p className="font-medium text-[#191C1E]">{viewSiswa.jurusan}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewSiswa(null)}
                                    className="mt-5 w-full rounded bg-[#00236F] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001B59]"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Konfirmasi Hapus ── */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-sm rounded-lg border border-[#C5C5D3] bg-white p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-[#191C1E]">Hapus Siswa</h3>
                            <p className="mt-2 text-sm text-[#444651]">
                                Yakin ingin menghapus <strong>{deleteConfirm.nama_siswa}</strong>? Semua data terkait (penilaian, user akun) akan ikut
                                terhapus.
                            </p>
                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="rounded border border-[#C5C5D3] px-5 py-2 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeDelete}
                                    disabled={deleting}
                                    className="rounded bg-[#EF4444] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {deleting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Data Table Card ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#F2F4F6] px-4 py-4 sm:flex-row sm:items-center">
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

                    <div className="overflow-x-auto">
                        <div className="flex min-w-[800px] items-center bg-[#00236F] px-6 py-4">
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">ID SISWA</span>
                            <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA LENGKAP</span>
                            <span className="w-[100px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KELAS</span>
                            <span className="w-[120px] text-xs font-semibold tracking-[0.05em] text-white uppercase">JURUSAN</span>
                            <span className="flex w-[120px] items-center justify-center text-xs font-semibold tracking-[0.05em] text-white uppercase">
                                AKSI
                            </span>
                        </div>

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
                                            <span className="w-[120px] text-sm leading-[19.6px] font-bold text-[#00236F]">
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
                                            <span className="w-[100px] text-sm leading-[19.6px] text-[#444651]">{s.kelas || '-'}</span>
                                            <span className="w-[120px] text-sm leading-[19.6px] text-[#444651]">{s.jurusan || '-'}</span>
                                            <div className="flex w-[120px] items-center justify-center gap-1">
                                                <button
                                                    onClick={() => setViewSiswa(s)}
                                                    className="flex h-8 w-8 items-center justify-center rounded text-[#3B82F6] transition-colors hover:bg-[#F2F4F6]"
                                                >
                                                    <Eye className="h-4 w-[16.67px]" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(s)}
                                                    className="flex h-8 w-8 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-[#F2F4F6]"
                                                >
                                                    <Trash2 className="h-[14.99px] w-[15.83px]" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] bg-[#F2F4F6] px-4 py-3 sm:flex-row">
                        <p className="text-sm leading-[21px] text-[#444651]">
                            Showing {startEntry} to {endEntry} of {filteredData.length} entries
                        </p>
                        <div className="flex items-center gap-2">
                            <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </PageBtn>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNum =
                                    totalPages <= 5
                                        ? i + 1
                                        : currentPage <= 3
                                          ? i + 1
                                          : currentPage >= totalPages - 2
                                            ? totalPages - 4 + i
                                            : currentPage - 2 + i;
                                return (
                                    <PageBtn key={pageNum} active={pageNum === currentPage} onClick={() => setCurrentPage(pageNum)}>
                                        {pageNum}
                                    </PageBtn>
                                );
                            })}
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

function PageBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex h-10 w-10 items-center justify-center rounded text-sm font-bold transition-colors disabled:cursor-not-allowed ${
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
