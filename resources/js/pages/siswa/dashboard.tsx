import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCheck,
    ChevronRight,
    Download,
    Edit,
    Eye,
    FileText,
    HelpCircle,
    Mail,
    MessageCircle,
    Phone,
    Printer,
    SearchCheck,
    Upload,
    UserCheck,
    UserPlus,
    FileCheck,
    BadgeCheck,
    FileSpreadsheet,
    Calculator,
    TrendingUp,
    Users,
    Wallet,
    ClipboardList,
} from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { ProgressSteps } from '@/components/progress-steps';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Column } from '@/components/data-table';
import type { ProgressStep } from '@/components/progress-steps';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
];

const dokumenColumns: Column[] = [
    { key: 'nama', label: 'Nama Dokumen' },
    { key: 'kategori', label: 'Kategori' },
    {
        key: 'status',
        label: 'Status',
        render: (value) => <StatusBadge status={value as 'verified' | 'pending' | 'rejected'} />,
    },
    { key: 'terakhir', label: 'Terakhir Diperbarui' },
    {
        key: 'aksi',
        label: 'Aksi',
        render: () => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B] hover:text-[#1E3A8A]">
                    <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B] hover:text-[#1E3A8A]">
                    <Upload className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

const dokumenData = [
    { nama: 'Scan Kartu Keluarga', kategori: 'Identitas', status: 'verified', terakhir: '12 Jan 2025' },
    { nama: 'Scan Rapor Semester 1-5', kategori: 'Akademik', status: 'verified', terakhir: '10 Jan 2025' },
    { nama: 'Surat Keterangan Tidak Mampu', kategori: 'Ekonomi', status: 'pending', terakhir: '15 Jan 2025' },
    { nama: 'Sertifikat Prestasi', kategori: 'Prestasi', status: 'rejected', terakhir: '08 Jan 2025' },
];

const statusSteps: ProgressStep[] = [
    { label: 'Pendaftaran', icon: FileText, status: 'completed', description: 'Pengajuan diterima' },
    { label: 'Verifikasi', icon: SearchCheck, status: 'active', description: 'Sedang diperiksa' },
    { label: 'Perhitungan SMART', icon: Calculator, status: 'pending', description: 'Menunggu antrian' },
    { label: 'Pengumuman', icon: BadgeCheck, status: 'pending', description: 'Hasil akhir' },
];

export default function SiswaDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Siswa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Dashboard"
                    description="Pantau status pengajuan beasiswa Anda di sini."
                />

                {/* Greeting Card */}
                <Card className="border-[#E2E8F0] bg-gradient-to-r from-[#1E3A8A] to-[#0F172A]">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white">Selamat Datang, Ahmad</h2>
                                <p className="text-sm text-blue-200">NISN: 1234567890</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" className="bg-white text-[#1E3A8A] hover:bg-blue-50">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Aplikasi
                                </Button>
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <Download className="mr-2 h-4 w-4" />
                                    Unduh Kartu
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Progress + Info + Help */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status Timeline */}
                        <Card className="border-[#E2E8F0]">
                            <CardHeader>
                                <CardTitle className="text-base text-[#0F172A]">Status Pengajuan</CardTitle>
                                <CardDescription>Beasiswa Prestasi Akademik 2025</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProgressSteps steps={statusSteps} />
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
                            <CardContent className="flex items-start gap-4 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10">
                                    <AlertCircle className="h-5 w-5 text-[#3B82F6]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#0F172A]">Informasi Status</h4>
                                    <p className="mt-1 text-sm text-[#64748B]">
                                        Berkas Anda sedang dalam proses verifikasi oleh Tim Tata Usaha. Proses
                                        verifikasi biasanya memakan waktu 3-5 hari kerja. Anda akan mendapatkan
                                        notifikasi ketika status pengajuan berubah.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Butuh Bantuan */}
                        <Card className="border-[#E2E8F0]">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]/10">
                                            <HelpCircle className="h-5 w-5 text-[#F59E0B]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-[#0F172A]">Butuh Bantuan?</h4>
                                            <p className="text-xs text-[#64748B]">
                                                Hubungi admin jika ada kendala dalam pengajuan
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Hubungi Admin
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Stats + Dokumen info */}
                    <div className="space-y-6">
                        <StatCard
                            icon={FileCheck}
                            label="Total Berkas"
                            value="4"
                            trend="1 baru"
                            trendUp
                            variant="default"
                        />
                        <StatCard
                            icon={BadgeCheck}
                            label="Terverifikasi"
                            value="2"
                            trend="+1"
                            trendUp
                            variant="success"
                        />
                        <StatCard
                            icon={AlertCircle}
                            label="Menunggu"
                            value="1"
                            variant="warning"
                        />
                        <StatCard
                            icon={AlertCircle}
                            label="Ditolak"
                            value="1"
                            trend="Perbaiki"
                            variant="danger"
                        />
                    </div>
                </div>

                {/* Dokumen Table */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base text-[#0F172A]">Dokumen Terunggah</CardTitle>
                            <CardDescription>Kelola dokumen pendukung pengajuan Anda</CardDescription>
                        </div>
                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                            <Upload className="mr-2 h-4 w-4" />
                            Tambah Dokumen
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={dokumenColumns} data={dokumenData} />
                    </CardContent>
                </Card>

                {/* Metode Perhitungan SMART */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0F172A]">Metode Perhitungan SMART</CardTitle>
                        <CardDescription>
                            Simple Multi-Attribute Rating Technique — bobot kriteria penilaian
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#0F172A]">C1: Nilai Rata-rata Rapor</span>
                                    <span className="text-[#64748B]">30%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                                    <div className="h-full w-[30%] rounded-full bg-[#1E3A8A]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#0F172A]">C2: Penghasilan Orang Tua</span>
                                    <span className="text-[#64748B]">25%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                                    <div className="h-full w-[25%] rounded-full bg-[#1E3A8A]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#0F172A]">C3: Jumlah Tanggungan</span>
                                    <span className="text-[#64748B]">15%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                                    <div className="h-full w-[15%] rounded-full bg-[#1E3A8A]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#0F172A]">C4: Prestasi</span>
                                    <span className="text-[#64748B]">20%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                                    <div className="h-full w-[20%] rounded-full bg-[#1E3A8A]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#0F172A]">C5: Absensi</span>
                                    <span className="text-[#64748B]">10%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                                    <div className="h-full w-[10%] rounded-full bg-[#1E3A8A]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Seleksi */}
                <Card className="border-[#E2E8F0]">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0F172A]">Informasi Seleksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                <p className="text-xs text-[#64748B]">Total Pendaftar</p>
                                <p className="mt-1 text-2xl font-bold text-[#0F172A]">1.248</p>
                            </div>
                            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                <p className="text-xs text-[#64748B]">Kuota Beasiswa</p>
                                <p className="mt-1 text-2xl font-bold text-[#0F172A]">150</p>
                            </div>
                            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                <p className="text-xs text-[#64748B]">Deadline Pendaftaran</p>
                                <p className="mt-1 text-sm font-bold text-[#EF4444]">28 Feb 2025</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
