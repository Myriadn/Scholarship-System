import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { Bell, Calculator, ChevronRight, GraduationCap, LogIn, School, ShieldCheck, TrendingUp } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Landing() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="SMK Scholarship System" />

            <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
                {/* ── Navigation ── */}
                <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A8A]">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-[#0F172A]">SMK Scholarship System</span>
                        </Link>

                        <Link href={route('login')}>
                            <Button variant="default" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                <LogIn className="mr-2 h-4 w-4" />
                                Masuk
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1">
                    {/* ── Hero Section ── */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1E3A8A]">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                                {/* Left side: Branding */}
                                <div className="flex flex-col justify-center">
                                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur">
                                        <School className="h-4 w-4" />
                                        SMK Bina Karya Mandiri 2
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                        Wujudkan Masa Depan di{' '}
                                        <span className="bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
                                            SMK Bina Karya Mandiri 2
                                        </span>
                                    </h1>
                                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100">
                                        Program beasiswa untuk siswa berprestasi dan kurang mampu. Daftar sekarang dan raih kesempatan mendapatkan
                                        bantuan pendidikan terbaik.
                                    </p>

                                    {/* Stats row */}
                                    <div className="mt-10 grid grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold text-white">500+</p>
                                            <p className="text-xs text-blue-200">Siswa Terdaftar</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold text-white">12</p>
                                            <p className="text-xs text-blue-200">Kategori Beasiswa</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold text-white">Rp 2M+</p>
                                            <p className="text-xs text-blue-200">Total Dana Hibah</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Login Form */}
                                <div className="flex items-center justify-center">
                                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
                                        <div className="mb-6 text-center">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A]/10">
                                                <LogIn className="h-6 w-6 text-[#1E3A8A]" />
                                            </div>
                                            <h2 className="text-xl font-bold text-[#0F172A]">Selamat Datang Kembali</h2>
                                            <p className="mt-1 text-sm text-[#64748B]">Masuk ke akun beasiswa Anda</p>
                                        </div>

                                        <form onSubmit={submit} className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="text"
                                                    placeholder="email@smk.test"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="border-[#E2E8F0] focus-visible:ring-[#1E3A8A]"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Password</Label>
                                                    <Link
                                                        href={route('password.request')}
                                                        className="text-xs font-medium text-[#1E3A8A] hover:text-[#1E3A8A]/80 hover:underline"
                                                    >
                                                        Lupa Password?
                                                    </Link>
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Masukkan password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="border-[#E2E8F0] focus-visible:ring-[#1E3A8A]"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    id="remember"
                                                    checked={data.remember}
                                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                                />
                                                <Label htmlFor="remember" className="text-sm font-normal text-[#64748B]">
                                                    Ingat Saya
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-[#1E3A8A] py-5 text-base hover:bg-[#1E3A8A]/90"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        Memproses...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Masuk ke Dashboard
                                                        <ChevronRight className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>

                                        <p className="mt-6 text-center text-sm text-[#64748B]">
                                            Belum punya akun?{' '}
                                            <Link
                                                href={route('register')}
                                                className="font-semibold text-[#1E3A8A] hover:text-[#1E3A8A]/80 hover:underline"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Features Section ── */}
                    <section className="border-b border-[#E2E8F0] bg-white py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">Kenapa Memilih Beasiswa Kami?</h2>
                                <p className="mt-3 text-[#64748B]">Sistem beasiswa transparan dengan metode perhitungan yang terpercaya</p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Feature 1 */}
                                <div className="group rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all hover:border-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] transition-colors group-hover:bg-[#1E3A8A] group-hover:text-white">
                                        <Calculator className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Algoritma SMART</h3>
                                    <p className="text-sm leading-relaxed text-[#64748B]">
                                        Menggunakan metode Simple Multi-Attribute Rating Technique untuk seleksi yang objektif dan akurat.
                                    </p>
                                </div>

                                {/* Feature 2 */}
                                <div className="group rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all hover:border-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] transition-colors group-hover:bg-[#1E3A8A] group-hover:text-white">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Verifikasi Digital</h3>
                                    <p className="text-sm leading-relaxed text-[#64748B]">
                                        Verifikasi berkas secara digital dengan sistem validasi otomatis yang efisien dan transparan.
                                    </p>
                                </div>

                                {/* Feature 3 */}
                                <div className="group rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all hover:border-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] transition-colors group-hover:bg-[#1E3A8A] group-hover:text-white">
                                        <Bell className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Notifikasi Instan</h3>
                                    <p className="text-sm leading-relaxed text-[#64748B]">
                                        Dapatkan pemberitahuan real-time tentang status pengajuan dan pengumuman terbaru.
                                    </p>
                                </div>

                                {/* Feature 4 */}
                                <div className="group rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all hover:border-[#1E3A8A]/20 hover:shadow-lg hover:shadow-[#1E3A8A]/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] transition-colors group-hover:bg-[#1E3A8A] group-hover:text-white">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">Transparansi Penuh</h3>
                                    <p className="text-sm leading-relaxed text-[#64748B]">
                                        Pantau seluruh proses seleksi secara real-time dengan akses data yang lengkap dan terbuka.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── School Branding Section ── */}
                    <section className="bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                                    <School className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white sm:text-4xl">SMK Bina Karya Mandiri 2</h2>
                                <p className="mt-3 max-w-2xl text-lg text-blue-200">
                                    Mencetak generasi unggul berkarakter melalui pendidikan vokasi berkualitas. Bergabunglah bersama kami untuk
                                    membangun masa depan gemilang.
                                </p>
                                <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur">
                                        <p className="text-2xl font-bold text-white">500+</p>
                                        <p className="text-xs text-blue-200">Siswa Terdaftar</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur">
                                        <p className="text-2xl font-bold text-white">12</p>
                                        <p className="text-xs text-blue-200">Kategori Beasiswa</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur">
                                        <p className="text-2xl font-bold text-white">Rp 2M+</p>
                                        <p className="text-xs text-blue-200">Total Dana Hibah</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Footer ── */}
                    <footer className="border-t border-[#E2E8F0] bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                    <GraduationCap className="h-4 w-4 text-[#1E3A8A]" />
                                    &copy; {new Date().getFullYear()} SMK Scholarship System. Hak Cipta Dilindungi.
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <Link href="/kebijakan-privasi" className="text-[#64748B] transition-colors hover:text-[#1E3A8A]">
                                        Kebijakan Privasi
                                    </Link>
                                    <Link href="/syarat-ketentuan" className="text-[#64748B] transition-colors hover:text-[#1E3A8A]">
                                        Syarat &amp; Ketentuan
                                    </Link>
                                    <Link href="/kontak" className="text-[#64748B] transition-colors hover:text-[#1E3A8A]">
                                        Hubungi Kami
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
