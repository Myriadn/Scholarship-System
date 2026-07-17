import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronRight, ClipboardList, FileCheck, GraduationCap, LayoutGrid, LogOut, SlidersHorizontal, User, Users } from 'lucide-react';
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

    const userRole = (user as { role?: string }).role;
    const navItems = getNavItems(userRole);

    const roleDisplay: Record<string, string> = {
        siswa: 'Siswa',
        staf_tu: 'Staff Tata Usaha',
        kepala_sekolah: 'Kepala Sekolah',
    };

    return (
        <div className="flex min-h-screen bg-[#F7F9FB]">
            {/* ── Sidebar ── */}
            <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col justify-between bg-[#00236F] px-4 py-6">
                {/* Brand */}
                <div>
                    <div className="mb-10 flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white">
                            <GraduationCap className="h-[18px] w-[22px] text-[#00236F]" />
                        </div>
                        <div>
                            <h1 className="text-xl leading-7 font-bold text-white">SMK Negeri</h1>
                            <p className="text-xs font-semibold tracking-[0.05em] text-white/80 uppercase">{roleLabel}</p>
                        </div>
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
                            <span key={crumb.href + '-' + index} className="flex items-center gap-2">
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
                        <div className="h-6 w-px bg-[#C5C5D3]" />
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all ${
                                    userMenuOpen ? 'bg-[#F2F4F6] ring-1 ring-[#C5C5D3]' : 'hover:bg-[#F2F4F6] hover:ring-1 hover:ring-[#C5C5D3]'
                                }`}
                            >
                                {/* Avatar */}
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D0E1FB]">
                                    <User className="h-5 w-5 text-[#54647A]" />
                                </div>
                                {/* Name & Role */}
                                <div className="hidden flex-col text-left sm:flex">
                                    <span className="text-xs font-bold tracking-[0.05em] text-[#191C1E]">{user.name}</span>
                                    <span className="text-[10px] leading-[15px] tracking-[0.05em] text-[#444651] uppercase">
                                        {roleDisplay[userRole || ''] || ''}
                                    </span>
                                </div>
                                {/* Chevron */}
                                <svg
                                    className={`h-3 w-3 text-[#757682] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[#C5C5D3] bg-white shadow-lg">
                                        {/* Arrow */}
                                        <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-t border-l border-[#C5C5D3] bg-white" />
                                        <div className="border-b border-[#C5C5D3] px-4 py-3">
                                            <p className="text-sm font-semibold text-[#191C1E]">{user.name}</p>
                                            <p className="text-xs text-[#444651]">{roleDisplay[userRole || ''] || ''}</p>
                                        </div>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[#444651] transition-colors hover:bg-red-50 hover:text-red-600"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F2F4F6] transition-colors group-hover:bg-red-100">
                                                <LogOut className="h-3.5 w-3.5" />
                                            </div>
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
                    <p className="text-sm leading-[21px] text-[#444651]">&copy; 2026 SMK Scholarship Management System. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

function getNavItems(role?: string): { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[] {
    switch (role) {
        case 'siswa':
            return [
                { title: 'Dashboard', url: '/siswa/dashboard', icon: LayoutGrid },
                { title: 'Daftar Beasiswa', url: '/siswa/pendaftaran', icon: ClipboardList },
            ];
        case 'staf_tu':
            return [
                { title: 'Dashboard', url: '/staf-tu/dashboard', icon: LayoutGrid },
                { title: 'Kelola Kriteria', url: '/staf-tu/kelola-kriteria', icon: SlidersHorizontal },
                { title: 'Data Siswa', url: '/staf-tu/data-siswa', icon: Users },
                { title: 'Verifikasi Berkas', url: '/staf-tu/verifikasi-berkas', icon: FileCheck },
            ];
        case 'kepala_sekolah':
            return [{ title: 'Dashboard', url: '/kepala-sekolah/laporan', icon: LayoutGrid }];
        default:
            return [{ title: 'Dashboard', url: '/dashboard', icon: LayoutGrid }];
    }
}
