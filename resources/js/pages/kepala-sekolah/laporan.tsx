import { Head, useForm } from '@inertiajs/react';
import {
    Award,
    BadgeCheck,
    CheckCircle,
    Download,
    Eye,
    FileText,
    Printer,
    Search,
    Trophy,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Column } from '@/components/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/kepala-sekolah/dashboard' },
    { title: 'Laporan Akhir', href: '/kepala-sekolah/laporan' },
];

const rankingColumns: Column[] = [
    {
        key: 'rank',
        label: 'Rank',
        className: 'w-16',
        render: (value) => {
            const rank = value as number;
            let badgeClass = 'bg-[#1E3A8A]/10 text-[#1E3A8A]';
            if (rank === 1) badgeClass = 'bg-[#F59E0B]/10 text-[#F59E0B] font-bold';
            if (rank === 2) badgeClass = 'bg-[#64748B]/10 text-[#64748B] font-semibold';
            if (rank === 3) badgeClass = 'bg-[#B45309]/10 text-[#B45309] font-semibold';
            return (
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}>
                    {rank}
                </span>
            );
        },
    },
    { key: 'nama', label: 'Nama Lengkap Siswa' },
    { key: 'nisn', label: 'NISN' },
    { key: 'kelas', label: 'Kelas' },
    {
        key: 'skor_vi',
        label: 'Skor Vi',
        className: 'font-semibold',
        render: (value) => {
            const score = value as number;
            let color = 'text-[#0F172A]';
            if (score >= 0.9) color = 'text-[#10B981]';
            else if (score >= 0.75) color = 'text-[#3B82F6]';
            else if (score >= 0.6) color = 'text-[#F59E0B]';
            else color = 'text-[#EF4444]';
            return <span className={color}>{score.toFixed(4)}</span>;
        },
    },
    {
        key: 'status',
        label: 'Status Rekomendasi',
        render: (value) => {
            const status = value as string;
            if (status === 'Sangat Layak') return <StatusBadge status="sangat_layak" />;
            return <StatusBadge status="layak" />;
        },
    },
];

const rankingData = [
    { rank: 1, nama: 'Siti Nurhaliza', nisn: '1234567891', kelas: 'XII TKJ', skor_vi: 0.9567, status: 'Sangat Layak' },
    { rank: 2, nama: 'Ahmad Fauzi', nisn: '1234567890', kelas: 'XII RPL', skor_vi: 0.9234, status: 'Sangat Layak' },
    { rank: 3, nama: 'Dewi Sartika', nisn: '1234567894', kelas: 'X RPL', skor_vi: 0.8912, status: 'Sangat Layak' },
    { rank: 4, nama: 'Bambang Suprapto', nisn: '1234567893', kelas: 'XII MM', skor_vi: 0.8456, status: 'Layak' },
    { rank: 5, nama: 'Rizky Pratama', nisn: '1234567895', kelas: 'XI Animasi', skor_vi: 0.7989, status: 'Layak' },
];

export default function LaporanKepalaSekolah() {
    const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const { post, processing } = useForm({});

    const handleApprove: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kepala-sekolah.laporan.approve'), {
            onSuccess: () => setShowApprovalSuccess(true),
        });
    };

    const handleReject: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kepala-sekolah.laporan.reject'), {
            onSuccess: () => setShowRejectConfirm(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan & Validasi" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3A8A]/10">
                                <FileText className="h-5 w-5 text-[#1E3A8A]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0F172A]">Laporan Akhir</h1>
                                <p className="text-sm text-[#64748B]">
                                    Kepala Sekolah — Pimpinan Satuan Pendidikan
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-[#E2E8F0] text-[#64748B]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Laporan
                        </Button>
                        <Button variant="outline" className="border-[#E2E8F0] text-[#64748B]">
                            <Download className="mr-2 h-4 w-4" />
                            Ekspor PDF
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Total Pendaftar"
                        value="1,248"
                        variant="default"
                    />
                    <StatCard
                        icon={Award}
                        label="Quota Beasiswa"
                        value="150"
                        variant="default"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Rata-rata Nilai Vi"
                        value="0.7421"
                        trend="+0.05"
                        trendUp
                        variant="success"
                    />
                    <StatCard
                        icon={BadgeCheck}
                        label="Status Persetujuan"
                        value="Menunggu"
                        variant="warning"
                    />
                </div>

                {/* Ranking Table */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base text-[#0F172A]">
                                Tabel Hasil Perhitungan SMART
                            </CardTitle>
                            <CardDescription>
                                Periode 2025 — Beasiswa Prestasi Akademik
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                                <Input
                                    placeholder="Cari siswa..."
                                    className="h-9 border-[#E2E8F0] pl-9 text-sm"
                                />
                            </div>
                            <Select defaultValue="10">
                                <SelectTrigger className="h-9 w-24 border-[#E2E8F0] text-sm">
                                    <SelectValue placeholder="Tampilkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 Baris</SelectItem>
                                    <SelectItem value="25">25 Baris</SelectItem>
                                    <SelectItem value="50">50 Baris</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={rankingColumns} data={rankingData} />

                        <p className="mt-3 text-xs text-[#64748B]">
                            * Menampilkan 5 hasil terbaik dari total 1,248 pendaftar. Nilai Vi menunjukkan skor
                            akhir hasil perhitungan metode SMART.
                        </p>
                    </CardContent>
                </Card>

                {/* Approval Section */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0F172A]">Persetujuan Laporan</CardTitle>
                        <CardDescription>
                            Tandatangani dan setujui laporan hasil seleksi beasiswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A]/10">
                                        <UserCheck className="h-7 w-7 text-[#1E3A8A]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0F172A]">
                                            Drs. H. Mulyadi, M.Pd
                                        </p>
                                        <p className="text-sm text-[#64748B]">
                                            Kepala Sekolah SMK Negeri
                                        </p>
                                        <div className="mt-2 flex items-center gap-4 text-xs text-[#94A3B8]">
                                            <span className="flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                                                Tanda tangan digital
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                                                Stempel elektronik
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Signature area */}
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 h-16 w-48 rounded border-2 border-dashed border-[#CBD5E1] bg-white" />
                                    <p className="text-xs text-[#64748B]">Area tanda tangan</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col justify-end gap-3 border-t border-[#E2E8F0] pt-6 sm:flex-row">
                                <Button
                                    variant="outline"
                                    className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/5"
                                    onClick={() => setShowRejectConfirm(true)}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Tolak / Revisi
                                </Button>
                                <form onSubmit={handleApprove}>
                                    <Button
                                        type="submit"
                                        className="bg-[#10B981] hover:bg-[#10B981]/90"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Memproses...
                                            </span>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Setujui & Terbitkan
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Success Modal */}
            <Dialog open={showApprovalSuccess} onOpenChange={setShowApprovalSuccess}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
                            <CheckCircle className="h-8 w-8 text-[#10B981]" />
                        </div>
                        <DialogTitle className="text-center text-xl text-[#0F172A]">
                            Laporan Disetujui!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Hasil seleksi beasiswa telah disetujui dan diterbitkan. Para siswa akan mendapatkan
                            notifikasi hasil secara otomatis melalui sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-2">
                        <Button
                            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                            onClick={() => setShowApprovalSuccess(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Confirmation Modal */}
            <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF4444]/10">
                            <X className="h-8 w-8 text-[#EF4444]" />
                        </div>
                        <DialogTitle className="text-center text-xl text-[#0F172A]">
                            Konfirmasi Penolakan
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menolak atau merevisi laporan ini? Tindakan ini akan
                            mengembalikan data ke tahap sebelumnya untuk dilakukan perbaikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button
                            variant="outline"
                            className="border-[#E2E8F0]"
                            onClick={() => setShowRejectConfirm(false)}
                        >
                            Batal
                        </Button>
                        <form onSubmit={handleReject}>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Memproses...
                                    </span>
                                ) : (
                                    'Ya, Tolak Laporan'
                                )}
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
