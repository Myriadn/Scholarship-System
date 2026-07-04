import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award, LoaderCircle, Lock, User } from 'lucide-react';
import { FormEventHandler } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
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
            <Head title="SMK Bina Karya Mandiri 2 Scholarship System" />

            <div className="flex min-h-screen flex-col bg-[#F7F9FB]">
                {/* ── Main Content ── */}
                <main className="flex-1">
                    {/* ── Hero & Login Section ── */}
                    <section className="relative flex min-h-screen items-start justify-center overflow-hidden px-6">
                        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 pt-32 pb-16 lg:grid-cols-12 lg:gap-12">
                            {/* ── Hero Content (Left) ── */}
                            <div className="flex flex-col justify-center gap-6 lg:col-span-7">
                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#00236F]/10 px-4 py-2">
                                    <Award className="h-[13.5px] w-[16.5px] text-[#00236F]" />
                                    <span className="text-xs font-bold tracking-[0.05em] text-[#00236F] uppercase">PENDAFTARAN TA 2025/2026</span>
                                </div>

                                {/* Heading */}
                                <h1 className="text-5xl leading-[60px] font-bold tracking-[-0.02em] text-[#00236F] lg:text-6xl">
                                    Wujudkan Masa Depan di <span className="text-[#00236F]">SMK Bina Karya</span>
                                    <br />
                                    <span className="text-[#00236F]">Mandiri 2</span>
                                </h1>

                                {/* Description */}
                                <p className="max-w-2xl text-base leading-[26px] text-[#444651]">
                                    Sistem manajemen beasiswa berbasis SMART (Simple Multi-Attribute Rating Technique). Kami berkomitmen memberikan
                                    apresiasi kepada siswa berprestasi dan membantu mereka yang membutuhkan melalui proses verifikasi yang transparan
                                    dan akurat.
                                </p>
                            </div>

                            {/* ── Login Form Card (Right) ── */}
                            <div className="flex items-center justify-center lg:col-span-5">
                                <div className="relative w-full max-w-md rounded-2xl border border-[#C5C5D3] bg-white/95 p-8 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-[5px]">
                                    {/* Card content */}
                                    <div className="flex flex-col gap-8">
                                        {/* Title */}
                                        <div className="flex flex-col items-center gap-2">
                                            <h2 className="text-2xl font-semibold text-[#00236F]">Login</h2>
                                            <p className="text-center text-sm leading-[21px] text-[#444651]">
                                                Masukkan email dan password untuk melanjutkan.
                                            </p>
                                        </div>

                                        {/* Status Message */}
                                        {status && (
                                            <div className="rounded-md bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
                                                {status}
                                            </div>
                                        )}

                                        {/* Form */}
                                        <form onSubmit={submit} className="flex flex-col gap-6">
                                            {/* Email Field */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="email" className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                                                        <User className="h-5 w-5 text-[#757682]" />
                                                    </div>
                                                    <input
                                                        id="email"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="username"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="email@mail.com"
                                                        className="w-full rounded border border-[#C5C5D3] bg-[#F2F4F6] py-[14px] pr-4 pl-10 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            {/* Kata Sandi Field */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="password" className="text-xs font-bold tracking-[0.05em] text-[#444651] uppercase">
                                                    Kata Sandi
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                                                        <Lock className="h-[21px] w-4 text-[#757682]" />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full rounded border border-[#C5C5D3] bg-[#F2F4F6] py-[14px] pr-4 pl-10 text-sm text-[#6B7280] placeholder-[#6B7280] transition-colors outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                                                    />
                                                </div>
                                                <InputError message={errors.password} />
                                            </div>

                                            {/* Remember Me & Forgot Password */}
                                            <div className="flex items-center justify-between">
                                                <label className="flex cursor-pointer items-center gap-2">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                        checked={data.remember}
                                                        onCheckedChange={(checked) => setData('remember', checked === true)}
                                                        className="h-4 w-4 rounded-[2px] border-[#C5C5D3]"
                                                    />
                                                    <span className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase">
                                                        Ingat Saya
                                                    </span>
                                                </label>

                                                {canResetPassword && (
                                                    <Link
                                                        href={route('password.request')}
                                                        tabIndex={5}
                                                        className="text-xs font-bold tracking-[0.05em] text-[#00236F] uppercase transition-colors hover:underline"
                                                    >
                                                        Lupa Password?
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                tabIndex={4}
                                                disabled={processing}
                                                className="relative flex w-full items-center justify-center rounded bg-[#00236F] py-4 text-sm font-semibold text-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#001B59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00236F] disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                                        Memproses...
                                                    </span>
                                                ) : (
                                                    'Masuk ke Dashboard'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
