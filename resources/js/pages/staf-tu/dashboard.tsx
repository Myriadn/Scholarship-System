import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    BadgeCheck,
    Calculator,
    CheckCircle,
    ClipboardList,
    Clock,
    Download,
    Edit,
    Eye,
    FileSpreadsheet,
    Filter,
    Search,
    UserPlus,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/staf-tu/dashboard' }];

const siswaColumns: Column[] = [
    { key: 'id_siswa', label: 'ID Siswa' },
    { key: 'nama_lengkap', label: 'Nama Lengkap' },
    { key: 'kelas', label: 'Kelas' },
    {
        key: 'status_berkas',
        label: 'Status Berkas',
        render: (value) => {
            const status = value as string;
            if (status === 'Terverifikasi') return <StatusBadge status="verified" label="Terverifikasi" />;
            if (status === 'Menunggu') return <StatusBadge status="pending" label="Menunggu" />;
            return <StatusBadge status="rejected" label="Ditolak" />;
        },
    },
    { key: 'nilai_akhir', label: 'Nilai Akhir (Vi)' },
    {
        key: 'aksi',
        label: 'Aksi',
        render: () => (
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B] hover:text-[#1E3A8A]">
                    <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B] hover:text-[#1E3A8A]">
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#10B981] hover:text-[#10B981]/80">
                    <BadgeCheck className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

const siswaData = [
    { id_siswa: 'SIS-001', nama_lengkap: 'Ahmad Fauzi', kelas: 'XII RPL', status_berkas: 'Terverifikasi', nilai_akhir: '—' },
    { id_siswa: 'SIS-002', nama_lengkap: 'Siti Nurhaliza', kelas: 'XI TKJ', status_berkas: 'Menunggu', nilai_akhir: '—' },
    { id_siswa: 'SIS-003', nama_lengkap: 'Bambang Suprapto', kelas: 'XII MM', status_berkas: 'Terverifikasi', nilai_akhir: '—' },
    { id_siswa: 'SIS-004', nama_lengkap: 'Dewi Sartika', kelas: 'X RPL', status_berkas: 'Ditolak', nilai_akhir: '—' },
    { id_siswa: 'SIS-005', nama_lengkap: 'Rizky Pratama', kelas: 'XI Animasi', status_berkas: 'Menunggu', nilai_akhir: '—' },
];

export default function StafTUDashboard() {
    const [showSmartSuccess, setShowSmartSuccess] = useState(false);

    const { post, processing } = useForm({});

    const handleProsesSMART: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('staf-tu.proses-smart'), {
            onSuccess: () => setShowSmartSuccess(true),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Staf TU" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3A8A]/10">
                                <Users className="h-5 w-5 text-[#1E3A8A]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
                                <p className="text-sm text-[#64748B]">Admin TU — Staff Pelaksana</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleProsesSMART}>
                        <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Memproses...
                                </span>
                            ) : (
                                <>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    Proses Hitung SMART
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Section Header */}
                <div>
                    <h2 className="text-lg font-semibold text-[#0F172A]">Manajemen Beasiswa</h2>
                    <p className="text-sm text-[#64748B]">Kelola data pendaftar dan proses verifikasi berkas beasiswa</p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={UserPlus} label="Total Pendaftar" value="1,248" trend="12%" trendUp variant="default" />
                    <StatCard icon={Clock} label="Belum Verifikasi" value="42" trend="+5" trendUp={false} variant="warning" />
                    <StatCard icon={BadgeCheck} label="Terverifikasi" value="1,186" trend="+8%" trendUp variant="success" />
                    <StatCard icon={ClipboardList} label="Kuota Tersedia" value="150" variant="default" />
                </div>

                {/* Filter + Export */}
                <Card className="border-[#E2E8F0]">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1 sm:max-w-xs">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                                    <Input placeholder="Cari siswa..." className="border-[#E2E8F0] pl-9" />
                                </div>
                                <div className="flex gap-3">
                                    <Select defaultValue="semua">
                                        <SelectTrigger className="w-[160px] border-[#E2E8F0]">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="semua">Semua</SelectItem>
                                            <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                                            <SelectItem value="menunggu">Menunggu</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select defaultValue="2025">
                                        <SelectTrigger className="w-[130px] border-[#E2E8F0]">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button variant="outline" className="border-[#E2E8F0] text-[#64748B]">
                                <Download className="mr-2 h-4 w-4" />
                                Ekspor .CSV
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0F172A]">Data Pendaftar Beasiswa</CardTitle>
                        <CardDescription>Total 1,248 pendaftar — Menampilkan halaman 1</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={siswaColumns} data={siswaData} />

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-[#64748B]">Menampilkan 1-5 dari 1,248</p>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-8 border-[#E2E8F0] px-3" disabled>
                                    Sebelumnya
                                </Button>
                                <Button variant="default" size="sm" className="h-8 w-8 bg-[#1E3A8A] p-0 hover:bg-[#1E3A8A]/90">
                                    1
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 border-[#E2E8F0] p-0">
                                    2
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 border-[#E2E8F0] p-0">
                                    3
                                </Button>
                                <span className="px-1 text-[#64748B]">...</span>
                                <Button variant="outline" size="sm" className="h-8 w-8 border-[#E2E8F0] p-0">
                                    250
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 border-[#E2E8F0] px-3">
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Success Modal */}
            <Dialog open={showSmartSuccess} onOpenChange={setShowSmartSuccess}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
                            <CheckCircle className="h-8 w-8 text-[#10B981]" />
                        </div>
                        <DialogTitle className="text-center text-xl text-[#0F172A]">Proses SMART Berhasil!</DialogTitle>
                        <DialogDescription className="text-center">
                            Perhitungan menggunakan metode Simple Multi-Attribute Rating Technique telah berhasil dilakukan. Hasil perankingan dapat
                            dilihat di halaman Laporan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center gap-3 pt-2">
                        <Button variant="outline" className="border-[#E2E8F0]" onClick={() => setShowSmartSuccess(false)}>
                            Tutup
                        </Button>
                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Lihat Laporan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
