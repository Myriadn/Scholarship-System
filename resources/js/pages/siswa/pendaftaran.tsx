import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    ChevronRight,
    FileText,
    Home,
    Upload,
    X,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'Beasiswa Saya', href: '/siswa/pendaftaran' },
];

export default function Pendaftaran() {
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nisn: '1234567890',
        nama: 'Ahmad Fauzi',
        jurusan: '',
        kelas: '',
        c1_rapor: '',
        c2_penghasilan: '',
        c3_tanggungan: '',
        c4_prestasi: '',
        c5_absensi: '',
        agreement: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('siswa.pendaftaran.store'), {
            onSuccess: () => {
                setShowSuccess(true);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pendaftaran Beasiswa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Pendaftaran Beasiswa</h1>
                    <p className="mt-1 text-sm text-[#64748B]">
                        Lengkapi data diri, input kriteria, dan unggah berkas pendukung untuk mendaftar beasiswa.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Data Pribadi Siswa */}
                    <Card className="border-[#E2E8F0]">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A8A]/10">
                                    <FileText className="h-5 w-5 text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-[#0F172A]">Data Pribadi Siswa</CardTitle>
                                    <CardDescription>Data diri sesuai dengan data sekolah</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nisn">NISN</Label>
                                <Input
                                    id="nisn"
                                    value={data.nisn}
                                    disabled
                                    className="border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    disabled
                                    className="border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jurusan">Jurusan</Label>
                                <Select
                                    value={data.jurusan}
                                    onValueChange={(value) => setData('jurusan', value)}
                                >
                                    <SelectTrigger id="jurusan" className="border-[#E2E8F0]">
                                        <SelectValue placeholder="Pilih Jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RPL">Rekayasa Perangkat Lunak</SelectItem>
                                        <SelectItem value="TKJ">Teknik Komputer & Jaringan</SelectItem>
                                        <SelectItem value="Multimedia">Multimedia</SelectItem>
                                        <SelectItem value="Animasi">Animasi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.jurusan} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kelas">Kelas</Label>
                                <Select
                                    value={data.kelas}
                                    onValueChange={(value) => setData('kelas', value)}
                                >
                                    <SelectTrigger id="kelas" className="border-[#E2E8F0]">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="X">X (Sepuluh)</SelectItem>
                                        <SelectItem value="XI">XI (Sebelas)</SelectItem>
                                        <SelectItem value="XII">XII (Dua Belas)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kelas} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Input Kriteria C1-C5 */}
                    <Card className="border-[#E2E8F0]">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A8A]/10">
                                    <AlertCircle className="h-5 w-5 text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-[#0F172A]">Input Kriteria</CardTitle>
                                    <CardDescription>
                                        Masukkan data kriteria untuk perhitungan SMART
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="c1_rapor">C1: Nilai Rata-rata Rapor</Label>
                                <Input
                                    id="c1_rapor"
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="0 - 100"
                                    value={data.c1_rapor}
                                    onChange={(e) => setData('c1_rapor', e.target.value)}
                                    className="border-[#E2E8F0]"
                                />
                                <InputError message={errors.c1_rapor} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c2_penghasilan">C2: Penghasilan Orang Tua</Label>
                                <Input
                                    id="c2_penghasilan"
                                    type="number"
                                    placeholder="Rp"
                                    value={data.c2_penghasilan}
                                    onChange={(e) => setData('c2_penghasilan', e.target.value)}
                                    className="border-[#E2E8F0]"
                                />
                                <InputError message={errors.c2_penghasilan} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c3_tanggungan">C3: Jumlah Tanggungan</Label>
                                <Input
                                    id="c3_tanggungan"
                                    type="number"
                                    min={0}
                                    placeholder="Jumlah anak"
                                    value={data.c3_tanggungan}
                                    onChange={(e) => setData('c3_tanggungan', e.target.value)}
                                    className="border-[#E2E8F0]"
                                />
                                <InputError message={errors.c3_tanggungan} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c4_prestasi">C4: Prestasi</Label>
                                <Select
                                    value={data.c4_prestasi}
                                    onValueChange={(value) => setData('c4_prestasi', value)}
                                >
                                    <SelectTrigger id="c4_prestasi" className="border-[#E2E8F0]">
                                        <SelectValue placeholder="Pilih Tingkat Prestasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 - Tidak Ada</SelectItem>
                                        <SelectItem value="2">2 - Sekolah</SelectItem>
                                        <SelectItem value="3">3 - Kota</SelectItem>
                                        <SelectItem value="4">4 - Provinsi</SelectItem>
                                        <SelectItem value="5">5 - Nasional</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.c4_prestasi} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="c5_absensi">C5: Absensi</Label>
                                <Input
                                    id="c5_absensi"
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="0 - 100"
                                    value={data.c5_absensi}
                                    onChange={(e) => setData('c5_absensi', e.target.value)}
                                    className="border-[#E2E8F0]"
                                />
                                <InputError message={errors.c5_absensi} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Berkas */}
                    <Card className="border-[#E2E8F0]">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A8A]/10">
                                    <Upload className="h-5 w-5 text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-[#0F172A]">Upload Berkas</CardTitle>
                                    <CardDescription>
                                        Unggah dokumen pendukung dalam format PDF atau gambar
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <FileUpload
                                label="Scan Kartu Keluarga"
                                accept=".pdf,.jpg,.jpeg,.png"
                                maxSize="2 MB"
                            />
                            <FileUpload
                                label="Scan Rapor Terakhir"
                                accept=".pdf,.jpg,.jpeg,.png"
                                maxSize="5 MB"
                            />
                        </CardContent>
                    </Card>

                    {/* Agreement & Submit */}
                    <Card className="border-[#E2E8F0]">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="agreement"
                                        checked={data.agreement}
                                        onCheckedChange={(checked) =>
                                            setData('agreement', checked === true)
                                        }
                                        className="mt-0.5"
                                    />
                                    <Label
                                        htmlFor="agreement"
                                        className="text-sm font-normal leading-relaxed text-[#64748B]"
                                    >
                                        Saya menyatakan bahwa seluruh data dan dokumen yang saya unggah adalah benar
                                        dan dapat dipertanggungjawabkan. Apabila ditemukan ketidaksesuaian, saya
                                        bersedia menerima sanksi sesuai ketentuan yang berlaku.
                                    </Label>
                                </div>
                                <InputError message={errors.agreement} />

                                <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F8FAFC] p-4">
                                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                        <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                                        Pastikan semua data telah terisi dengan benar sebelum mengirim
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                                        disabled={processing || !data.agreement}
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Memproses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Kirim Pendaftaran
                                                <ChevronRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
                            <CheckCircle className="h-8 w-8 text-[#10B981]" />
                        </div>
                        <DialogTitle className="text-center text-xl text-[#0F172A]">
                            Pendaftaran Berhasil!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Data pengajuan beasiswa Anda telah berhasil dikirim dan akan segera diproses oleh Tim
                            Tata Usaha. Silakan pantau status pengajuan Anda melalui dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-2">
                        <Link href="/siswa/dashboard">
                            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                <Home className="mr-2 h-4 w-4" />
                                Kembali ke Dashboard
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
