import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import FigmaSidebarLayout from '@/layouts/app/sidebar-figma-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, ClipboardList, Send, Upload, User } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/siswa/dashboard' },
    { title: 'Beasiswa Saya', href: '/siswa/pendaftaran' },
];

interface SiswaData {
    id: number;
    nisn: string;
    nama_siswa: string;
    jurusan: string;
    kelas: string;
}

const prestasiOptions = [
    { value: '1', label: '1 - Tidak Ada' },
    { value: '2', label: '2 - Sekolah' },
    { value: '3', label: '3 - Kabupaten/Kota' },
    { value: '4', label: '4 - Provinsi' },
    { value: '5', label: '5 - Nasional' },
];

export default function Pendaftaran() {
    const { auth } = usePage<SharedData>().props;
    const { siswa, sudah_daftar } = usePage<{ siswa: SiswaData | null; sudah_daftar: boolean }>().props;
    const user = auth.user;
    const [showSuccess, setShowSuccess] = useState(false);

    // File states
    const [fileKK, setFileKK] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const kkRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, errors, reset } = useForm({
        nisn: siswa?.nisn || '',
        nama: siswa?.nama_siswa || user.name || '',
        jurusan: siswa?.jurusan || '',
        kelas: siswa?.kelas || '',
        c1_rapor: '',
        c2_penghasilan: '',
        c3_tanggungan: '',
        c4_prestasi: '',
        agreement: false,
    });

    const formatRupiah = (value: string) => {
        const angka = value.replace(/\D/g, '');
        if (!angka) return '';
        return 'Rp ' + angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePenghasilan = (value: string) => {
        const angka = value.replace(/[^\d]/g, '');
        setData('c2_penghasilan', angka);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('c1_rapor', data.c1_rapor);
        formData.append('c2_penghasilan', data.c2_penghasilan);
        formData.append('c3_tanggungan', data.c3_tanggungan);
        formData.append('c4_prestasi', data.c4_prestasi);
        if (fileKK) formData.append('berkas_kk', fileKK);

        router.post(route('siswa.pendaftaran.store'), formData, {
            onSuccess: () => {
                setShowSuccess(true);
                setUploading(false);
                reset();
                setFileKK(null);
            },
            onError: () => setUploading(false),
        });
    };

    return (
        <FigmaSidebarLayout breadcrumbs={breadcrumbs} roleLabel="Siswa Dashboard">
            <Head title="Pendaftaran Beasiswa" />

            {sudah_daftar ? (
                <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
                        <CheckCircle className="h-10 w-10 text-[#10B981]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#191C1E]">Anda Sudah Mendaftar</h2>
                    <p className="mt-2 max-w-md text-sm leading-[21px] text-[#444651]">
                        Data pendaftaran beasiswa Anda sudah diterima dan sedang diproses. Silakan pantau status pengajuan melalui dashboard.
                    </p>
                    <a
                        href={route('siswa.dashboard')}
                        className="mt-6 rounded bg-[#00236F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#001B59]"
                    >
                        Kembali ke Dashboard
                    </a>
                </div>
            ) : (
                <div className="p-8 pb-16">
                    {/* ── Header Section ── */}
                    <div className="mb-8">
                        <h1 className="text-[32px] leading-[38.4px] font-bold tracking-[-0.02em] text-[#00236F]">Formulir Pendaftaran Beasiswa</h1>
                        <p className="mt-1.5 max-w-2xl text-base leading-[25.6px] text-[#444651]">
                            Lengkapi data diri dan kriteria di bawah ini secara akurat. Data ini akan diproses menggunakan metode SMART untuk
                            menentukan kelayakan penerima beasiswa.
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* ── Left Column ── */}
                            <div className="flex flex-col gap-8 lg:col-span-7">
                                {/* Section: Data Pribadi (read-only, dari database) */}
                                <div className="flex flex-col gap-6 rounded-lg border border-[#E2E8F0] bg-white p-8">
                                    <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
                                        <User className="h-4 w-4 text-[#00236F]" />
                                        <h2 className="text-xl leading-7 font-semibold text-[#191C1E]">Data Pribadi Siswa</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {/* NISN */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                                NISN (10 Digit)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nisn}
                                                disabled
                                                className="w-full rounded border border-[#C5C5D3] bg-[#ECEEF0] px-3 py-3 text-sm text-[#6B7280] outline-none"
                                            />
                                        </div>

                                        {/* Nama Lengkap */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.nama}
                                                disabled
                                                className="w-full rounded border border-[#C5C5D3] bg-[#ECEEF0] px-3 py-3 text-sm text-[#6B7280] outline-none"
                                            />
                                        </div>

                                        {/* Jurusan */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">Jurusan</label>
                                            <input
                                                type="text"
                                                value={data.jurusan}
                                                disabled
                                                className="w-full rounded border border-[#C5C5D3] bg-[#ECEEF0] px-3 py-3 text-sm text-[#6B7280] outline-none"
                                            />
                                        </div>

                                        {/* Kelas */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">Kelas</label>
                                            <input
                                                type="text"
                                                value={data.kelas}
                                                disabled
                                                className="w-full rounded border border-[#C5C5D3] bg-[#ECEEF0] px-3 py-3 text-sm text-[#6B7280] outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Input Kriteria */}
                                <div className="flex flex-col gap-6 rounded-lg border border-[#E2E8F0] bg-white p-8">
                                    <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
                                        <ClipboardList className="h-[18px] w-[18px] text-[#00236F]" />
                                        <h2 className="text-xl leading-7 font-semibold text-[#191C1E]">Input Kriteria</h2>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        {/* C1 */}
                                        <KriteriaField
                                            label="Nilai Rata-rata Rapor"
                                            hint="Masukan nilai 0-100"
                                            value={data.c1_rapor}
                                            onChange={(v) => setData('c1_rapor', v)}
                                            placeholder="85.50"
                                            error={errors.c1_rapor}
                                        />

                                        {/* C2 — dengan format Rp */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex w-[237px] flex-col gap-1.5 pt-0.5">
                                                <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                                    Penghasilan Orang Tua
                                                </label>
                                                <p className="text-xs leading-4 text-[#505F76]/70">Rata-rata per bulan (Rp)</p>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={formatRupiah(data.c2_penghasilan)}
                                                    onChange={(e) => handlePenghasilan(e.target.value)}
                                                    placeholder="Rp 2.000.000"
                                                    className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] px-3 py-3 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                                />
                                                <InputError message={errors.c2_penghasilan} />
                                            </div>
                                        </div>

                                        {/* C3 */}
                                        <KriteriaField
                                            label="Jumlah Tanggungan"
                                            hint="Jumlah anak/anggota keluarga"
                                            value={data.c3_tanggungan}
                                            onChange={(v) => setData('c3_tanggungan', v)}
                                            placeholder="3"
                                            error={errors.c3_tanggungan}
                                        />

                                        {/* C4 */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex w-[237px] flex-col gap-1.5 pt-0.5">
                                                <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                                    Prestasi (Akademik dan Non-Akademik)
                                                </label>
                                                <p className="text-xs leading-4 text-[#505F76]/70">1: Rendah, 5: Nasional</p>
                                            </div>
                                            <div className="flex-1">
                                                <select
                                                    value={data.c4_prestasi}
                                                    onChange={(e) => setData('c4_prestasi', e.target.value)}
                                                    className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] px-3 py-3 text-sm text-[#191C1E] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                                >
                                                    <option value="">Pilih tingkat prestasi</option>
                                                    {prestasiOptions.map((p) => (
                                                        <option key={p.value} value={p.value}>
                                                            {p.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.c4_prestasi} />
                                            </div>
                                        </div>

                                        {/* C5 */}
                                    </div>
                                </div>
                            </div>

                            {/* ── Right Column ── */}
                            <div className="flex flex-col gap-8 lg:col-span-5">
                                {/* Section: Unggah Berkas */}
                                <div className="flex flex-col gap-6 rounded-lg border border-[#E2E8F0] bg-white p-8">
                                    <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
                                        <Upload className="h-4 w-[22px] text-[#00236F]" />
                                        <h2 className="text-xl leading-7 font-semibold text-[#191C1E]">Unggah Berkas Pendukung</h2>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        {/* Upload 1: Kartu Keluarga */}
                                        <UploadZone
                                            label="Scan Kartu Keluarga (PDF/JPG)"
                                            maxSize="Maksimal 2MB"
                                            file={fileKK}
                                            onChoose={() => kkRef.current?.click()}
                                            onRemove={() => setFileKK(null)}
                                        />
                                        <input
                                            ref={kkRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setFileKK(e.target.files?.[0] || null)}
                                        />

                                        {/* Info Box */}
                                        <div className="rounded-r border-l-4 border-[#3B82F6] bg-[#3B82F6]/10 p-4">
                                            <p className="text-xs font-semibold tracking-[0.05em] text-[#00236F] uppercase">Penting:</p>
                                            <p className="mt-1 text-xs leading-4 text-[#444651]">
                                                Pastikan semua berkas terlihat jelas dan tidak buram untuk mempercepat proses verifikasi oleh Staf TU.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Final Action */}
                                <div className="flex flex-col gap-2 rounded-lg bg-[#00236F] p-8">
                                    <h3 className="text-xl leading-7 font-semibold text-white">Siap untuk mengirim?</h3>
                                    <p className="text-sm leading-[21px] text-white/90">
                                        Pastikan seluruh data sudah benar. Setelah dikirim, Anda tidak dapat mengubah data ini secara mandiri.
                                    </p>

                                    <label className="flex cursor-pointer items-start gap-3 py-4">
                                        <Checkbox
                                            checked={data.agreement}
                                            onCheckedChange={(checked) => setData('agreement', checked === true)}
                                            className="mt-0.5 h-4 w-4 rounded-sm border-white/20 bg-white/20"
                                        />
                                        <span className="text-xs font-semibold tracking-[0.05em] text-white uppercase">
                                            Saya menyatakan bahwa data ini benar dan akurat.
                                        </span>
                                    </label>
                                    <InputError message={errors.agreement} />

                                    <button
                                        type="submit"
                                        disabled={processing || uploading}
                                        className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-4 text-base font-bold text-[#00236F] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing || uploading ? (
                                            'Mengirim...'
                                        ) : (
                                            <>
                                                Kirim Pendaftaran
                                                <Send className="h-4 w-[19px]" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* ── Success Dialog ── */}
                    {showSuccess && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-[#191C1E]">Pendaftaran Berhasil!</h2>
                                <p className="mt-2 text-sm text-[#444651]">
                                    Data Anda telah terkirim dan akan diproses oleh Staf TU. Pantau status pengajuan melalui dashboard.
                                </p>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="mt-6 w-full rounded bg-[#00236F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#001B59]"
                                >
                                    Kembali ke Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </FigmaSidebarLayout>
    );
}

/* ── Komponen Pembantu ── */

function KriteriaField({
    label,
    hint,
    value,
    onChange,
    placeholder,
    error,
}: {
    label: string;
    hint: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex w-[237px] flex-col gap-1.5 pt-0.5">
                <label className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">{label}</label>
                <p className="text-xs leading-4 text-[#505F76]/70">{hint}</p>
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded border border-[#C5C5D3] bg-[#F7F9FB] px-3 py-3 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                />
                <InputError message={error} />
            </div>
        </div>
    );
}

function UploadZone({
    label,
    maxSize,
    file,
    onChoose,
    onRemove,
}: {
    label: string;
    maxSize: string;
    file: File | null;
    onChoose: () => void;
    onRemove: () => void;
}) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">{label}</p>
            {file ? (
                <div className="flex items-center justify-between rounded border border-[#10B981] bg-[#10B981]/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-[#10B981]" />
                        <div>
                            <p className="text-sm font-medium text-[#191C1E]">{file.name}</p>
                            <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button type="button" onClick={onRemove} className="text-sm text-[#EF4444] hover:underline">
                        Hapus
                    </button>
                </div>
            ) : (
                <div
                    onClick={onChoose}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-[#C5C5D3] bg-[#F7F9FB] px-6 py-6 text-center transition-colors hover:border-[#00236F] hover:bg-[#F2F4F6]"
                >
                    <Upload className="h-5 w-4 text-[#757682]" />
                    <p className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">Klik untuk pilih file atau drag & drop</p>
                    <p className="text-[10px] leading-[15px] text-[#757682]">{maxSize}</p>
                </div>
            )}
        </div>
    );
}
