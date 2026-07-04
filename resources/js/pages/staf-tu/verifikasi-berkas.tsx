import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Download, Edit2, Eye, Search, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/staf-tu/dashboard' },
    { title: 'Verifikasi Berkas', href: '/staf-tu/verifikasi-berkas' },
];

interface Penilaian {
    nilai_akhir_vi?: number;
    ranking?: number;
    status_approval?: string;
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
    const [selectedSiswa, setSelectedSiswa] = useState<SiswaItem | null>(null);
    const perPage = 5;

    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: 0,
        c1_nilai: '',
        c2_nilai: '',
        c3_nilai: '',
        c4_nilai: '',
        c5_nilai: '',
    });

    const getStatus = (s: SiswaItem): 'verified' | 'pending' | 'rejected' => {
        const pn = s.penilaian_beasiswa;
        if (!pn) return 'pending';
        if (pn.nilai_akhir_vi != null) return 'verified';
        return 'pending';
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

    const openVerifikasi = (s: SiswaItem) => {
        reset();
        setData('siswa_id', s.id);
        // Pre-fill from existing penilaian if any
        if (s.penilaian_beasiswa) {
            const p = s.penilaian_beasiswa as Record<string, unknown>;
            setData({
                siswa_id: s.id,
                c1_nilai: String(p.c1_nilai ?? ''),
                c2_nilai: String(p.c2_nilai ?? ''),
                c3_nilai: String(p.c3_nilai ?? ''),
                c4_nilai: String(p.c4_nilai ?? ''),
                c5_nilai: String(p.c5_nilai ?? ''),
            });
        }
        setSelectedSiswa(s);
    };

    const handleVerifikasi: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('staf-tu.verifikasi'), {
            onSuccess: () => {
                setSelectedSiswa(null);
                reset();
            },
        });
    };

    const pageNumbers = () => {
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
            <Head title="Verifikasi Berkas Siswa" />

            <div className="flex flex-col gap-6 p-8">
                {/* ── Page Header ── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Verifikasi Berkas Siswa</h1>
                    <p className="text-sm leading-[21px] text-[#444651]">
                        Kelola verifikasi berkas dan hitung skor akhir beasiswa menggunakan metode SMART.
                    </p>
                </div>

                {/* ── Modal Verifikasi ── */}
                {selectedSiswa && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-lg rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#191C1E]">Verifikasi Data Siswa</h2>
                                    <p className="mt-0.5 text-xs text-[#444651]">
                                        {selectedSiswa.nama_siswa} — {selectedSiswa.nisn}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedSiswa(null)} className="text-[#757682] transition-colors hover:text-[#191C1E]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleVerifikasi} className="flex flex-col gap-5 px-6 py-6">
                                {/* Info Siswa */}
                                <div className="rounded bg-[#F2F4F6] px-4 py-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">NISN</span>
                                            <p className="font-medium text-[#191C1E]">{selectedSiswa.nisn}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">Kelas</span>
                                            <p className="font-medium text-[#191C1E]">{selectedSiswa.kelas}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold tracking-[0.05em] text-[#757682] uppercase">Jurusan</span>
                                            <p className="font-medium text-[#191C1E]">{selectedSiswa.jurusan}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input C1-C5 */}
                                <p className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">Input Nilai Kriteria (C1–C5)</p>

                                {[
                                    { key: 'c1_nilai', label: 'C1 — Nilai Akademik', hint: 'Nilai rata-rata rapor (0–100)' },
                                    { key: 'c2_nilai', label: 'C2 — Penghasilan Orang Tua', hint: 'Rata-rata per bulan dalam skala (0–100)' },
                                    { key: 'c3_nilai', label: 'C3 — Jumlah Tanggungan', hint: 'Jumlah tanggungan dalam skala (0–100)' },
                                    { key: 'c4_nilai', label: 'C4 — Prestasi', hint: 'Tingkat prestasi dalam skala (0–100)' },
                                    { key: 'c5_nilai', label: 'C5 — Absensi', hint: 'Semakin tinggi = semakin banyak absen (0–100)' },
                                ].map((field) => (
                                    <div key={field.key} className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">{field.label}</label>
                                        <p className="text-xs leading-4 text-[#505F76]/70">{field.hint}</p>
                                        <input
                                            type="text"
                                            value={(data as unknown as Record<string, string>)[field.key]}
                                            onChange={(e) => setData(field.key as keyof typeof data, e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] px-3 py-2.5 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                        />
                                        {(errors as Record<string, string | undefined>)[field.key] && (
                                            <p className="text-sm text-red-600">{(errors as Record<string, string | undefined>)[field.key]}</p>
                                        )}
                                    </div>
                                ))}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSiswa(null)}
                                        className="rounded border border-[#C5C5D3] px-5 py-2.5 text-sm font-semibold text-[#444651] transition-colors hover:bg-[#F2F4F6]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-[#00236F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001B59] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? 'Memproses...' : 'Verifikasi & Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Table Section ── */}
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                    {/* Filters Bar */}
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#F2F4F6] px-4 py-3 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-[12px] w-[18px] text-[#444651]" />
                                <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">FILTER:</span>
                            </div>

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
                            <span className="w-[80px] text-left text-xs font-semibold tracking-[0.05em] text-white uppercase">AKSI</span>
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
                                    const nilai = s.penilaian_beasiswa?.nilai_akhir_vi;

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
                                            <div className="flex w-[100px] items-center justify-center">
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
                                            <div className="flex w-[80px] items-center justify-start gap-2">
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
                                                    <button
                                                        onClick={() => openVerifikasi(s)}
                                                        className="inline-flex items-center gap-1 rounded bg-[#00236F] px-3 py-1 text-xs font-semibold tracking-[0.05em] text-white transition-colors hover:bg-[#001B59]"
                                                    >
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
                            <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                                <svg width="7.4" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </PageBtn>

                            {pageNumbers().map((page, i) =>
                                page === 'ellipsis' ? (
                                    <span key={`e-${i}`} className="px-1 text-sm font-semibold text-[#444651]">
                                        ...
                                    </span>
                                ) : (
                                    <PageBtn key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </PageBtn>
                                ),
                            )}

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

/* ── Reusable Components ── */

function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-[#F2F4F6]">
            {children}
        </button>
    );
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
