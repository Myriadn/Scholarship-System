import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronRight, ClipboardList, LayoutGrid, LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface FigmaSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    roleLabel?: string;
}

export default function FigmaSidebarLayout({ children, breadcrumbs = [], roleLabel = 'Siswa Dashboard' }: FigmaSidebarLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const page = usePage();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navItems = getNavItems((user as { role?: string }).role);

    return (
        <div className="flex min-h-screen bg-[#F7F9FB]">
            {/* ── Sidebar ── */}
            <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col justify-between bg-[#00236F] px-4 py-6">
                {/* Brand */}
                <div>
                    <div className="mb-10 px-2">
                        <h1 className="text-xl leading-7 font-bold text-white">SMK Negeri</h1>
                        <p className="text-xs font-semibold tracking-[0.05em] text-white/80 uppercase">{roleLabel}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = page.url.startsWith(item.url);
                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    className={`flex items-center gap-3 rounded px-4 py-3 text-xs font-semibold tracking-[0.05em] uppercase transition-colors ${
                                        isActive ? 'bg-[#1E3A8A] text-[#90A8FF]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.icon && <item.icon className="h-[18px] w-[18px]" />}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="ml-64 flex flex-1 flex-col">
                {/* ── Header ── */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#C5C5D3] bg-white px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.05em] uppercase">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={crumb.href} className="flex items-center gap-2">
                                {index > 0 && <ChevronRight className="h-[7px] w-[4.32px] text-[#757682]" />}
                                {index === breadcrumbs.length - 1 ? (
                                    <Link href={crumb.href} className="font-bold text-[#00236F]">
                                        {crumb.title}
                                    </Link>
                                ) : (
                                    <Link href={crumb.href} className="text-[#444651] transition-colors hover:text-[#00236F]">
                                        {crumb.title}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Right: Notification + User Profile */}
                    <div className="flex items-center gap-4">
                        {/* Bell Icon */}
                        <button className="text-[#444651] transition-colors hover:text-[#00236F]">
                            <Bell className="h-5 w-4" />
                        </button>

                        {/* User Profile with Dropdown */}
                        <div className="relative">
                            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D0E1FB]">
                                    <User className="h-5 w-5 text-[#54647A]" />
                                </div>
                                {/* Name & NISN */}
                                <div className="hidden flex-col text-left sm:flex">
                                    <span className="text-xs font-bold tracking-[0.05em] text-[#191C1E]">{user.name}</span>
                                    <span className="text-[10px] leading-[15px] text-[#444651]">{user.email}</span>
                                </div>
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                                        <div className="border-b border-[#C5C5D3] px-4 py-3">
                                            <p className="text-sm font-semibold text-[#191C1E]">{user.name}</p>
                                            <p className="text-xs text-[#444651]">{user.email}</p>
                                        </div>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#444651] transition-colors hover:bg-[#F2F4F6] hover:text-red-600"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Content ── */}
                <main className="flex-1">{children}</main>

                {/* ── Footer ── */}
                <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#C5C5D3] bg-[#E6E8EA] px-8 py-8 sm:flex-row">
                    <p className="text-sm leading-[21px] text-[#444651]">&copy; 2024 SMK Scholarship Management System. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="#"
                            className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase transition-colors hover:text-[#00236F]"
                        >
                            Kebijakan Privasi
                        </Link>
                        <Link
                            href="#"
                            className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase transition-colors hover:text-[#00236F]"
                        >
                            Syarat &amp; Ketentuan
                        </Link>
                        <Link
                            href="#"
                            className="text-xs font-semibold tracking-[0.05em] text-[#444651] uppercase transition-colors hover:text-[#00236F]"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function getNavItems(role?: string): { title: string; url: string; icon: typeof LayoutGrid }[] {
    switch (role) {
        case 'siswa':
            return [
                { title: 'Dashboard', url: '/siswa/dashboard', icon: LayoutGrid },
                { title: 'Daftar Beasiswa', url: '/siswa/pendaftaran', icon: ClipboardList },
            ];
        case 'staf_tu':
            return [{ title: 'Dashboard', url: '/staf-tu/dashboard', icon: LayoutGrid }];
        case 'kepala_sekolah':
            return [{ title: 'Laporan & Validasi', url: '/kepala-sekolah/laporan', icon: ClipboardList }];
        default:
            return [{ title: 'Dashboard', url: '/dashboard', icon: LayoutGrid }];
    }
}
