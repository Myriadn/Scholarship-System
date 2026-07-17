import InputError from '@/components/input-error';
import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit3, Eye, Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/staf-tu/dashboard' },
    { title: 'Kelola Kriteria', href: '/staf-tu/kelola-kriteria' },
];

interface KriteriaItem {
    id: number;
    kode_kriteria: string;
    nama_kriteria: string;
    bobot_awal: number;
    bobot_normalisasi: number;
    sifat: string;
    is_active: boolean;
}

export default function KelolaKriteria() {
    const { kriteria } = usePage<{ kriteria: KriteriaItem[] }>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<KriteriaItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<KriteriaItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        kode_kriteria: '',
        nama_kriteria: '',
        bobot_awal: '',
        sifat: 'benefit',
    });

    const filteredData = (kriteria || []).filter(
        (k) =>
            k.nama_kriteria?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.kode_kriteria?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);
    const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, filteredData.length);

    const openAddModal = () => {
        reset();
        setEditTarget(null);
        setModalOpen(true);
    };

    const openEditModal = (k: KriteriaItem) => {
        setEditTarget(k);
        setData({
            kode_kriteria: k.kode_kriteria,
            nama_kriteria: k.nama_kriteria,
            bobot_awal: String(k.bobot_awal),
            sifat: k.sifat,
        });
        setModalOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editTarget) {
            post(route('staf-tu.kelola-kriteria.update', editTarget.id), {
                onSuccess: () => {
                    setModalOpen(false);
                    setEditTarget(null);
                    reset();
                },
            });
        } else {
            post(route('staf-tu.kelola-kriteria.store'), {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const toggleActive = (k: KriteriaItem) => {
        router.post(route('staf-tu.kelola-kriteria.toggle', k.id));
    };

    const confirmDelete = (k: KriteriaItem) => {
        setDeleteConfirm(k);
    };

    const executeDelete = () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        router.post(
            route('staf-tu.kelola-kriteria.delete', deleteConfirm.id),
            {},
            {
                onFinish: () => {
                    setDeleting(false);
                    setDeleteConfirm(null);
                },
            },
        );
    };

    const totalBobot = (kriteria || [])
        .filter((k) => k.is_active)
        .reduce((sum, k) => sum + k.bobot_awal, 0);

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Admin Sistem">
            <Head title="Kelola Kriteria" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Page Header ── */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Kelola Kriteria</h1>
                        <p className="mt-1 max-w-lg text-base leading-[25.6px] text-[#444651]">
                            Atur kriteria penilaian, bobot, dan sifat (benefit/cost) untuk perhitungan metode SMART.
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 rounded bg-[#00236F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#001B59]"
                    >
                        <Plus className="h-[14px] w-[14px]" />
                        Tambah Kriteria
                    </button>
                </div>

                {/* ── Summary Card ── */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">TOTAL KRITERIA</span>
                        <span className="text-2xl leading-[31.2px] font-bold text-[#00236F]">{kriteria?.length || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">KRITERIA AKTIF</span>
                        <span className="text-2xl leading-[31.2px] font-bold text-[#10B981]">
                            {kriteria?.filter((k) => k.is_active).length || 0}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 rounded border border-[#E2E8F0] bg-white p-6">
                        <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">TOTAL BOBOT AKTIF</span>
                        <span className="text-2xl leading-[31.2px] font-bold text-[#00236F]">{totalBobot}</span>
                    </div>
                </div>

                {/* ── Modal Tambah/Edit ── */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-lg rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                                <h2 className="text-lg font-bold text-[#191C1E]">
                                    {editTarget ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
                                </h2>
                                <button onClick={() => { setModalOpen(false); setEditTarget(null); reset(); }} className="text-[#757682] transition-colors hover:text-[#191C1E]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
                                {!editTarget && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Kode Kriteria</label>
                                        <input
                                            type="text"
                                            value={data.kode_kriteria}
                                            onChange={(e) => setData('kode_kriteria', e.target.value.toUpperCase())}
                                            placeholder="C6"
                                            className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                        />
                                        <InputError message={errors.kode_kriteria} />
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Nama Kriteria</label>
                                    <input
                                        type="text"
                                        value={data.nama_kriteria}
                                        onChange={(e) => setData('nama_kriteria', e.target.value)}
                                        placeholder="Contoh: Kedisiplinan"
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    />
                                    <InputError message={errors.nama_kriteria} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Bobot Awal</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={data.bobot_awal}
                                        onChange={(e) => setData('bobot_awal', e.target.value)}
                                        placeholder="Contoh: 10"
                                        className="rounded border border-[#C5C5D3] bg-white px-3 py-2.5 text-sm text-[#191C1E] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                    />
                                    <InputError message={errors.bobot_awal} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Sifat</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sifat"
                                                value="benefit"
                                                checked={data.sifat === 'benefit'}
                                                onChange={(e) => setData('sifat', e.target.value)}
                                                className="h-4 w-4 text-[#00236F] border-[#C5C5D3]"
                                            />
                                            <span className="text-sm text-[#191C1E]">
                                                <span className="font-semibold text-[#10B981]">Benefit</span>
                                                <span className="text-[#6B7280]"> (semakin tinggi semakin baik)</span>
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sifat"
                                                value="cost"
                                                checked={data.sifat === 'cost'}
                                                onChange={(e) => setData('sifat', e.target.value)}
                                                className="h-4 w-4 text-[#00236F] border-[#C5C5D3]"
                                            />
                                            <span className="text-sm text-[#191C1E]">
                                                <span className="font-semibold text-[#EF4444]">Cost</span>
                                                <span className="text-[#6B7280]"> (semakin rendah semakin baik)</span>
                                            </span>
                                        </label>
                                    </div>
                                    <InputError message={errors.sifat} />
                                </div>
                                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                                    <button
                                        type="button"
                                        onClick={() => { setModalOpen(false); setEditTarget(null); reset(); }}
                                        className="rounded border border-[#C5C5D3] px-5 py-2.5 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-[#00236F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001B59] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? 'Menyimpan...' : editTarget ? 'Simpan Perubahan' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Modal Konfirmasi Hapus ── */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-sm rounded-lg border border-[#C5C5D3] bg-white p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-[#191C1E]">Hapus Kriteria</h3>
                            <p className="mt-2 text-sm text-[#444651]">
                                Yakin ingin menghapus <strong>{deleteConfirm.kode_kriteria} — {deleteConfirm.nama_kriteria}</strong>?
                                Data kriteria akan dihapus permanen dari sistem.
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

                {/* ── Table ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#F2F4F6] px-4 py-4 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-72">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                                <Search className="h-[15px] w-[15px] text-[#757682]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari kriteria..."
                                className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] py-[10px] pr-4 pl-10 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex min-w-[800px] items-center bg-[#00236F] px-6 py-4">
                            <span className="w-[90px] text-xs font-semibold tracking-[0.05em] text-white uppercase">KODE</span>
                            <span className="flex-1 text-xs font-semibold tracking-[0.05em] text-white uppercase">NAMA KRITERIA</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">BOBOT AWAL</span>
                            <span className="w-[120px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">BOBOT NORMALISASI</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">SIFAT</span>
                            <span className="w-[90px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">STATUS</span>
                            <span className="w-[100px] text-center text-xs font-semibold tracking-[0.05em] text-white uppercase">AKSI</span>
                        </div>

                        {paginatedData.length === 0 ? (
                            <div className="px-6 py-16 text-center text-sm text-[#6B7280]">
                                {searchQuery ? 'Tidak ada hasil untuk pencarian Anda.' : 'Belum ada data kriteria.'}
                            </div>
                        ) : (
                            <div className="divide-y divide-[#E2E8F0]">
                                {paginatedData.map((k, idx) => {
                                    const globalIdx = (currentPage - 1) * perPage + idx;
                                    const rowBg = globalIdx % 2 === 1 ? 'bg-[#F2F4F6]/60' : '';
                                    return (
                                        <div
                                            key={k.id}
                                            className={`flex min-w-[800px] items-center px-6 py-3 transition-colors hover:bg-[#F8FAFC] ${rowBg} ${!k.is_active ? 'opacity-60' : ''}`}
                                        >
                                            {/* Kode */}
                                            <span className="w-[90px] text-sm leading-[19.6px] font-bold text-[#00236F]">
                                                {k.kode_kriteria}
                                            </span>

                                            {/* Nama */}
                                            <span className="flex-1 text-sm leading-[19.6px] font-semibold text-[#191C1E]">
                                                {k.nama_kriteria}
                                            </span>

                                            {/* Bobot Awal */}
                                            <div className="flex w-[100px] items-center justify-center">
                                                <span className="inline-flex items-center gap-1 rounded bg-[#DCE1FF] px-3 py-1 text-sm font-bold text-[#00236F]">
                                                    {k.bobot_awal}%
                                                </span>
                                            </div>

                                            {/* Bobot Normalisasi */}
                                            <div className="flex w-[120px] items-center justify-center">
                                                <span className="text-sm leading-[19.6px] font-semibold text-[#444651]">
                                                    {k.bobot_normalisasi.toFixed(4)}
                                                </span>
                                            </div>

                                            {/* Sifat */}
                                            <div className="flex w-[100px] items-center justify-center">
                                                {k.sifat === 'benefit' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#10B981]/10 px-3 py-1 text-[10px] leading-[14px] font-bold text-[#10B981] uppercase">
                                                        Benefit
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#EF4444]/10 px-3 py-1 text-[10px] leading-[14px] font-bold text-[#EF4444] uppercase">
                                                        Cost
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Aktif */}
                                            <div className="flex w-[90px] items-center justify-center">
                                                <button
                                                    onClick={() => toggleActive(k)}
                                                    className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                                                        k.is_active ? 'bg-[#10B981]' : 'bg-[#C5C5D3]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                                            k.is_active ? 'translate-x-[18px]' : 'translate-x-[2px]'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Aksi */}
                                            <div className="flex w-[100px] items-center justify-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(k)}
                                                    className="flex h-8 w-8 items-center justify-center rounded text-[#3B82F6] transition-colors hover:bg-[#F2F4F6]"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(k)}
                                                    className="flex h-8 w-8 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-[#F2F4F6]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
                            Menampilkan {startEntry}–{endEntry} dari {filteredData.length} data
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
